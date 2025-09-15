"use client";

import type { UIMessage } from "ai";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "./ui/conversation";
import { Loader } from "./ui/loader";
import { Message, MessageAvatar, MessageContent } from "./ui/message";
import { Response } from "./ui/response";

interface ChatMessagesProps {
  messages: UIMessage[];
  status: "error" | "submitted" | "streaming" | "ready";
  regenerate: ({ messageId }: { messageId: string }) => void;
}

export function ChatMessages({
  messages,
  status,
  regenerate,
}: ChatMessagesProps) {
  const _copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Conversation className="relative h-[calc(100svh-12rem)]">
      <ConversationContent className="max-w-5xl mx-auto">
        {messages.map((message) => (
          <Message
            from={message.role}
            key={message.id}
            className="flex items-start"
          >
            <MessageContent>
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <Response key={`${message.id}-${i}`}>
                        {part.text}
                      </Response>
                    );
                  default:
                    return null;
                }
              })}
            </MessageContent>
            <MessageAvatar role={message.role} />
          </Message>
        ))}
        {status === "submitted" && <Loader />}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
