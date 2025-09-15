import { openai } from "@ai-sdk/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { db } from "@/lib/prisma";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, chatId }: { messages: UIMessage[]; chatId?: string } =
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
    model: openai("gpt-4o"),
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

Please provide accurate and helpful responses based on the context provided. If the context doesn't contain relevant information, acknowledge this and provide what help you can.`;
}
