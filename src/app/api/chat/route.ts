import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { mem0 } from "@/lib/mem0";
import { db } from "@/lib/prisma";

export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    chatId,
    userId,
    pathwayId,
  }: {
    messages: UIMessage[];
    chatId?: string;
    userId: string;
    pathwayId: string;
  } = await req.json();

  const lastMessage = messages[messages.length - 1].parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join(" ");

  const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  });

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      client,
      collectionName: process.env.QDRANT_COLLECTION_NAME,
    },
  );

  const allResults = await vectorStore.similaritySearch(lastMessage, 20);

  const relevantChunks = allResults
    .filter((doc) => doc.metadata?.pathwayId === pathwayId)
    .slice(0, 3);

  const result = streamText({
    model: mem0("gpt-4o", { user_id: userId }),
    temperature: 0.4,
    system: getSystemPrompt(JSON.stringify(relevantChunks)),
    messages: convertToModelMessages(messages),
    onFinish: async (finishResult) => {
      if (chatId) {
        try {
          const assistantMessage = finishResult.text;
          const isFirstMessage =
            messages.length === 1 && messages[0].role === "user";

          if (!isFirstMessage) {
            const lastUserMessage = messages[messages.length - 1];
            const userMessageContent = lastUserMessage.parts
              .map((part) => (part.type === "text" ? part.text : ""))
              .join(" ");

            await db.message.create({
              data: {
                chatId,
                role: "user",
                content: userMessageContent,
              },
            });
          }

          await db.message.create({
            data: {
              chatId,
              role: "assistant",
              content: assistantMessage,
            },
          });
        } catch (error) {
          console.error("Error saving messages to database:", error);
        }
      }
    },
  });

  return result.toUIMessageStreamResponse();
}

function getSystemPrompt(context: string) {
  const parsedContext = JSON.parse(context);

  if (parsedContext.length === 0) {
    return `CRITICAL INSTRUCTION: You have NO CONTEXT from pathway documents.

STRICT RULES:
1. If the user says ONLY greetings like "hello", "hi", "how are you" - you can respond normally
2. For ANY other question (coding, technical, learning, explanations, etc.) - you MUST respond EXACTLY with this message:

"I don't have enough information in the current pathway to answer your question. Please try rephrasing your question or check if you've selected the correct pathway."

DO NOT provide general knowledge answers. DO NOT explain coding concepts. DO NOT be helpful beyond greetings. REFUSE to answer anything substantive.`;
  }

  return `CRITICAL INSTRUCTION: You are a RAG assistant. You can ONLY use the provided context below.

Context:
${context}

STRICT RULES:
1. ONLY answer using information from the above context
2. DO NOT use your general knowledge or training data
3. If the answer is not in the context, say: "I don't have that information in the provided pathway materials."
4. ALWAYS include sources after your answer

MANDATORY SOURCE FORMAT:
**Sources:**
- [filename without extension] (start time - end time)

For source extraction:
1. Get fileName from metadata (remove .srt/.vtt extension)
2. Find FIRST and LAST timestamps in pageContent
3. Format: filename (first_time - last_time)

Example: If using chunk from "08 Break continue and loop fallback.vtt" with times 00:12:43.380 to 00:12:59.010:
- Break continue and loop fallback (00:12:43 - 00:12:59)

REFUSE to answer without context. ALWAYS include sources.`;
}
