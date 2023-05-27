import React from "react";
import { LoadingView } from "../utils/loadingView";
import { ErrorView } from "../utils/errorView";
import { useCurrentConversation } from "./useCurrentConversation";
import { ConversationMessageDto } from "../../../../../target/generated-sources/openapi-typescript";

function ConversationMessage({ message }: { message: ConversationMessageDto }) {
  return <div>Message: {message.text}</div>;
}

function AddMessageToConversation() {
  return (
    <form>
      <input />
    </form>
  );
}

export function ConversationView() {
  const { state, error, data } = useCurrentConversation();

  if (state === "pending") return <LoadingView />;
  if (state === "rejected") return <ErrorView error={error} />;

  const {
    info: { title, summary },
    messages,
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
      <AddMessageToConversation />
    </div>
  );
}
