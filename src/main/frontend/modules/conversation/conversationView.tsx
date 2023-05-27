import React from "react";
import { LoadingView } from "../utils/loadingView";
import { ErrorView } from "../utils/errorView";
import { useCurrentConversation } from "./useCurrentConversation";
import { ConversationMessageDto } from "../../../../../target/generated-sources/openapi-typescript";
import { ConversationSummary } from "./conversationSummary";
import { ConversationTitle } from "./conversationTitle";
import { AddMessageToConversation } from "./addMessageToConversation";

function ConversationMessage({ message }: { message: ConversationMessageDto }) {
  return <div>Message: {message.text}</div>;
}

export function ConversationView() {
  const { state, error, data, reload } = useCurrentConversation();

  if (state === "rejected") return <ErrorView error={error} />;
  if (state === "pending") return <LoadingView />;

  const {
    id,
    conversation: { info, messages },
  } = data;

  return (
    <div>
      <ConversationTitle
        conversation={info}
        conversationId={id}
        onReload={reload}
      />
      <ConversationSummary
        conversation={info}
        conversationId={id}
        onReload={reload}
      />
      <div className={"messages"}>
        {Object.keys(messages).map((k) => (
          <ConversationMessage key={k} message={messages[k]} />
        ))}
      </div>
      <AddMessageToConversation conversationId={id} onReload={reload} />
    </div>
  );
}
