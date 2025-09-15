"use client";

import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "./ui/prompt-input";

interface ChatInputProps {
  input: string;
  handleInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  disabled: boolean;
}

export function ChatInput({
  input,
  handleInputChange,
  onSubmit,
  disabled,
}: ChatInputProps) {
  return (
    <div className="mt-4 max-w-4xl mx-auto px-4">
      <PromptInput
        onSubmit={onSubmit}
        className="relative border-border bg-card"
      >
        <PromptInputTextarea
          onChange={(e) => handleInputChange(e.target.value)}
          value={input}
        />
        <PromptInputToolbar>
          <PromptInputSubmit
            className="absolute right-1 bottom-1"
            disabled={disabled || !input.trim()}
            status={"ready"}
          />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}
