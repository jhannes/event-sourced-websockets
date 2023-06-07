import { ConversationMessageSnapshotDto } from "../../../../../target/generated-sources/openapi-typescript";
import React from "react";
import { useDateFormat } from "../../hooks/useDateFormat";

export function ConversationMessages({
  messages,
}: {
  messages: Record<string, ConversationMessageSnapshotDto>;
}) {
  return (
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
  );
}

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
