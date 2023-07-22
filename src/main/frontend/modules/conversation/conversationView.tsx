import React from "react";
import { LoadingView } from "../utils/loadingView";
import { useCurrentConversation } from "./useCurrentConversation";
import {
  AddMessageToConversation,
  ConversationMessages,
  ConversationSummary,
  ConversationTitle,
} from "./";
import { Conversation } from "../websocket";

export function ConversationView() {
  const conversation = useCurrentConversation();

  if ("pending" in conversation) return <LoadingView />;
  if ("notFound" in conversation) return <div>Error: Not Found</div>;

  const { id, snapshot } = conversation;

  return (
    <div>
      <ShowConversation id={id} snapshot={snapshot} />
      <AddMessageToConversation conversationId={id} />
    </div>
  );
}

function ShowConversation({ id, snapshot: { info, messages } }: Conversation) {
  return (
    <>
      <ConversationTitle conversation={info} conversationId={id} />
      <ConversationSummary conversation={info} conversationId={id} />
      <ConversationMessages messages={messages} />
    </>
  );
}
