import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ParseRequest {
  candidateId: string;
  filePath: string;
}

function extractText(text: string): string {
  return text
    .replace(/[^\w\s.,@()/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function parseResume(text: string) {
  const cleanText = extractText(text);

  const skillKeywords = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'rust', 'go', 'ruby', 'php',
    'react', 'vue', 'angular', 'node', 'express', 'django', 'flask', 'spring', 'dot net',
    'sql', 'mongodb', 'postgresql', 'mysql', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
    'git', 'jenkins', 'ci cd', 'devops', 'linux', 'windows', 'machine learning', 'data science',
    'html', 'css', 'sass', 'tailwind', 'bootstrap', 'rest api', 'graphql', 'api',
  ];

  const educationKeywords = ['bachelor', 'master', 'phd', 'diploma', 'degree', 'college', 'university', 'b.s', 'm.s'];

  const skills = skillKeywords.filter(skill => cleanText.includes(skill));
  const education = educationKeywords.filter(edu => cleanText.includes(edu));

  const experienceMatch = cleanText.match(/(?:experience|exp).*?(\d+)\s*(?:years?|yrs?)/i);
  const experienceYears = experienceMatch ? parseInt(experienceMatch[1]) : 0;

  const emailMatch = text.match(/([a-z0-9._-]+@[a-z0-9.-]+)/i);
  const email = emailMatch ? emailMatch[1] : '';

  const phoneMatch = text.match(/(\+?1?\s*)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  return {
    skills,
    education,
    experienceYears: Math.min(experienceYears, 50),
    email,
    phone,
    rawText: cleanText.substring(0, 5000),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { candidateId, filePath }: ParseRequest = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const storageUrl = `${supabaseUrl}/storage/v1/object/public/${filePath}`;
    const response = await fetch(storageUrl, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`);
    }

    const text = await response.text();
    const parsed = parseResume(text);

    const skillsScore = Math.min((parsed.skills.length / 5) * 100, 100);
    const experienceScore = Math.min((parsed.experienceYears / 10) * 100, 100);
    const educationScore = parsed.education.length > 0 ? 100 : 30;
    const keywordScore = Math.min((parsed.skills.length * 10), 100);

    const overallScore = (
      (skillsScore * 0.3) +
      (experienceScore * 0.3) +
      (educationScore * 0.2) +
      (keywordScore * 0.2)
    ) / 100 * 100;

    const updateUrl = new URL('rest/v1/resume_scores', supabaseUrl);
    const insertResponse = await fetch(updateUrl.toString(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        resume_id: crypto.randomUUID(),
        candidate_id: candidateId,
        raw_text: parsed.rawText,
        skills: parsed.skills,
        experience_years: parsed.experienceYears,
        education: parsed.education,
        keywords_matched: parsed.skills.length,
        skills_score: skillsScore,
        experience_score: experienceScore,
        education_score: educationScore,
        keyword_score: keywordScore,
        overall_score: overallScore,
      }),
    });

    if (!insertResponse.ok) {
      console.error('Insert error:', await insertResponse.text());
    }

    const updateCandidateUrl = new URL(`rest/v1/candidates?id=eq.${candidateId}`, supabaseUrl);
    await fetch(updateCandidateUrl.toString(), {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        overall_score: overallScore,
        status: 'completed',
      }),
    });

    return new Response(
      JSON.stringify({
        success: true,
        score: overallScore,
        parsed,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Parse error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
