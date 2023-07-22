import React, { useState } from "react";
import { ConversationMessageDto } from "../../conversationsApi";
import { useSubmitDelta } from "../../hooks/useSubmitDelta";
import { v4 as uuidv4 } from "uuid";

type ConversationId = { conversationId: string };

export function AddMessageToConversation({ conversationId }: ConversationId) {
  const delta = "AddMessageToConversationDelta";
  const [message, setMessage] = useState<ConversationMessageDto>({
    text: "",
  });
  const { handleSubmit, disabled, error } = useSubmitDelta({
    delta: () => ({ conversationId, delta, messageId: uuidv4(), message }),
    onComplete: () => {
      setMessage({ text: "" });
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
