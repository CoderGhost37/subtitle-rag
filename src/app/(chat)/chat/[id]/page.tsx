import { notFound } from "next/navigation";
import { getChat } from "@/actions/chat/get-chat";
import { getChatMessages } from "@/actions/chat/get-chat-messages";
import { ChatInterface } from "@/components/chat/chat-interface";

type Params = Promise<{ id: string }>;

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
