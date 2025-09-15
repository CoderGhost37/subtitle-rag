import { notFound } from "next/navigation";
import { getChat } from "@/actions/chat/get-chat";
import { getChatMessages } from "@/actions/chat/get-chat-messages";
import { ChatInterface } from "@/components/chat/chat-interface";

type Params = Promise<{ id: string }>;

export const generateMetadata = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const { success, chat } = await getChat(id);

  if (!success || !chat) {
    return {
      title: "Chat Not Found",
      description: "The requested chat does not exist.",
    };
  }

  return {
    title: chat.title,
    description: `Chat ID: ${chat.id}${
      chat.pathway ? ` | Pathway: ${chat.pathway.title}` : ""
    }`,
  };
};

export default async function ChatPage({ params }: { params: Params }) {
  const { id } = await params;

  const [{ messages }, { success, chat }] = await Promise.all([
    getChatMessages(id),
    getChat(id),
  ]);

  if (!success || !chat) {
    notFound();
  }

  return (
    <ChatInterface
      chatId={id}
      initialMessages={messages}
      chatPathway={chat.pathway}
    />
  );
}
