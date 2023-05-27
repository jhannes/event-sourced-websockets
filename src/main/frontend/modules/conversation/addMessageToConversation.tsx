import React, { useState } from "react";
import { ConversationMessageDto } from "../../../../../target/generated-sources/openapi-typescript";
import { useSubmitDelta } from "../../hooks/useSubmitDelta";
import { v4 as uuidv4 } from "uuid";

export function AddMessageToConversation({
  conversationId,
  onReload,
}: {
  conversationId: string;
  onReload(): void;
}) {
  const delta = "AddMessageToConversationDelta";
  const [message, setMessage] = useState<ConversationMessageDto>({
    text: "",
  });
  const { handleSubmit, disabled, error } = useSubmitDelta({
    delta: () => ({ conversationId, delta, messageId: uuidv4(), message }),
    onComplete: () => {
      setMessage({ text: "" });
      onReload();
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      {error && <div>{error.toString()}</div>}
      <input
        disabled={disabled}
        autoFocus={true}
        value={message.text}
        onChange={(e) =>
          setMessage((old) => ({ ...old, text: e.target.value }))
        }
      />
      <button disabled={disabled}>Add message</button>
    </form>
  );
}
