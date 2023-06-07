import React from "react";
import { LoadingView } from "../utils/loadingView";
import { ErrorView } from "../utils/errorView";
import { useCurrentConversation } from "./useCurrentConversation";
import { ConversationMessageSnapshotDto } from "../../conversationsApi";
import {
  AddMessageToConversation,
  ConversationSummary,
  ConversationTitle,
} from "./";
import { useDateFormat } from "../../hooks/useDateFormat";

function ConversationMessage({
  message,
}: {
  message: ConversationMessageSnapshotDto;
}) {
  const { formatted, asDate, asTime } = useDateFormat(message.createdAt);
  return (
    <div style={{ display: "flex", gap: "0.3em", alignItems: "flex-start" }}>
      <span style={{ minWidth: "12ch" }} title={`${asDate} ${asTime}`}>
        {formatted}
      </span>
      <span style={{ flex: 1, maxWidth: "80ch" }}>{message.text}</span>
    </div>
  );
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
        {Object.keys(messages)
          .sort((a, b) =>
            messages[a].createdAt
              .toString()
              .localeCompare(messages[b].createdAt.toString())
          )
          .map((k) => (
            <ConversationMessage key={k} message={messages[k]} />
          ))}
      </div>
      <AddMessageToConversation conversationId={id} onReload={reload} />
    </div>
  );
}
