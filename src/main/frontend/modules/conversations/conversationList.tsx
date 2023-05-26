import React from "react";
import {
  ConversationSnapshotDto,
  DefaultApi,
} from "../../../../../target/generated-sources/openapi-typescript";
import { useLoader } from "../../hooks/useLoader";

function Conversation({
  conversation,
}: {
  conversation: ConversationSnapshotDto;
}) {
  return <div>Conversation: {conversation.info?.title}</div>;
}

export function ConversationList() {
  const { state, data, error } = useLoader(() =>
    new DefaultApi().apiConversationsGet()
  );

  if (state === "pending") {
    return <div>Loading...</div>;
  }
  if (state === "rejected") {
    return <div>Error: {error.toString()}</div>;
  }

  return (
    <div>
      <h2>Conversations</h2>
      {data.map((c) => (
        <Conversation key={c.id} conversation={c} />
      ))}
    </div>
  );
}
