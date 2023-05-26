import React from "react";
import {
  ConversationSnapshotDto,
  DefaultApi,
} from "../../../../../target/generated-sources/openapi-typescript";
import { useLoader } from "../../hooks/useLoader";
import { CreateConversation } from "./createConversation";

function Conversation({
  conversation,
}: {
  conversation: ConversationSnapshotDto;
}) {
  return <div>Conversation: {conversation.info?.title}</div>;
}

export function ConversationView() {
  const { state, data, error, reload } = useLoader(() =>
    new DefaultApi().apiConversationsGet()
  );

  if (state === "pending") {
    return <div>Loading...</div>;
  }
  if (state === "rejected") {
    return <div>Error: {error.toString()}</div>;
  }

  return (
    <>
      <ConversationList conversations={data} />
      <CreateConversation onReload={reload} />
    </>
  );
}

export function ConversationList({
  conversations,
}: {
  conversations: ConversationSnapshotDto[];
}) {
  return (
    <div>
      <h2>Conversations</h2>
      {conversations.map((c) => (
        <Conversation key={c.id} conversation={c} />
      ))}
    </div>
  );
}
