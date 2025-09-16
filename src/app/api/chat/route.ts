import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { mem0 } from "@/lib/mem0";
import { db } from "@/lib/prisma";

export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    chatId,
    userId,
  }: { messages: UIMessage[]; chatId?: string; userId: string } =
    await req.json();

  const lastMessage = messages[messages.length - 1].parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join(" ");

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: process.env.QDRANT_URL,
      collectionName: process.env.QDRANT_COLLECTION_NAME,
    },
  );

  const vectorSearcher = vectorStore.asRetriever({
    k: 3,
  });

  const relevantChunks = await vectorSearcher.invoke(lastMessage);

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
  return `You are a helpful assistant. Use the following context to answer the user's question:

Context:
${context}

Please provide accurate and helpful responses based on the context provided. Also list down the sources used to answer the question in the format:
- Source name (start time - end time)

When listing sources, only show the clean source name without any serial numbers, file extensions, or prefixes.

DO NOT answer outside the given context. If something is not in the context, politely say you don't have that info.
`;
}
