import {
  ConversationSnapshotDto,
  DefaultApi,
} from "../../../../../target/generated-sources/openapi-typescript";
import React from "react";
import { useLoader } from "../../hooks/useLoader";
import { CreateConversation } from "./createConversation";
import { Link } from "react-router-dom";
import { LoadingView } from "../utils/loadingView";
import { ErrorView } from "../utils/errorView";

export function ConversationListView() {
  const { state, data, error, reload } = useLoader(() =>
    new DefaultApi().apiConversationsGet()
  );

  if (state === "pending") return <LoadingView />;
  if (state === "rejected") return <ErrorView error={error} />;

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
        <ConversationItem key={c.id} conversation={c} />
      ))}
    </div>
  );
}

function ConversationItem({
  conversation,
}: {
  conversation: ConversationSnapshotDto;
}) {
  return (
    <>
      <div>
        <Link to={conversation.id}>
          Conversation: {conversation.info?.title}
        </Link>
      </div>
    </>
  );
}
