import Vapi from '@vapi-ai/web';

const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
console.log("VAPI SDK Initializing with token starting with:", token ? token.substring(0, 4) : "MISSING");

export const vapi = new Vapi(token!);