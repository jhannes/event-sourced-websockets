import React, { useState } from "react";
import { LoadingView } from "../utils/loadingView";
import { ErrorView } from "../utils/errorView";
import { useCurrentConversation } from "./useCurrentConversation";
import { ConversationMessageDto } from "../../../../../target/generated-sources/openapi-typescript";
import { useSubmitDelta } from "../../hooks/useSubmitDelta";
import { v4 as uuidv4 } from "uuid";

function ConversationMessage({ message }: { message: ConversationMessageDto }) {
  return <div>Message: {message.text}</div>;
}

function AddMessageToConversation({
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

export function ConversationView() {
  const { state, error, data, reload } = useCurrentConversation();

  if (state === "rejected") return <ErrorView error={error} />;
  if (state === "pending") return <LoadingView />;

  const {
    id,
    conversation: {
      info: { title, summary },
      messages,
    },
  } = data;

  return (
    <div>
      <h2>Conversation: {title}</h2>
      <div>{summary}</div>
      <div className={"messages"}>
        {Object.keys(messages).map((k) => (
          <ConversationMessage key={k} message={messages[k]} />
        ))}
      </div>
      <AddMessageToConversation conversationId={id} onReload={reload} />
    </div>
  );
}
