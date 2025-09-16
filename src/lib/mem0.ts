import { createMem0 } from "@mem0/vercel-ai-provider";

export const mem0 = createMem0({
  provider: "openai",
  mem0ApiKey: process.env.MEM0_API_KEY as string,
  apiKey: process.env.OPENAI_API_KEY as string,
});
