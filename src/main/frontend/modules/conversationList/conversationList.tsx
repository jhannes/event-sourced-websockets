import { ConversationSnapshotDto } from "../../conversationsApi";
import React, { useContext } from "react";
import { CreateConversation } from "./createConversation";
import { Link } from "react-router-dom";
import { LoadingView } from "../utils/loadingView";
import { ConversationsContext } from "../websocket";

export function ConversationListView() {
  const { conversationList } = useContext(ConversationsContext);
  if ("pending" in conversationList) {
    return <LoadingView />;
  }

  return (
    <>
      <ConversationList conversations={conversationList} />
      <CreateConversation onReload={() => {}} />
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
