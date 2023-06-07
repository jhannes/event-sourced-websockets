import React from "react";
import { LoadingView } from "../utils/loadingView";
import { useCurrentConversation } from "./useCurrentConversation";
import {
  AddMessageToConversation,
  ConversationMessages,
  ConversationSummary,
  ConversationTitle,
} from "./";

export function ConversationView() {
  return (
    <div>
      <ShowConversation />
      <AddMessageToConversation />
    </div>
  );
}

function ShowConversation() {
  const conversation = useCurrentConversation();

  if ("pending" in conversation) return <LoadingView />;

  const {
    id,
    conversation: { info, messages },
  } = conversation;
  return (
    <>
      <ConversationTitle conversation={info} conversationId={id} />
      <ConversationSummary conversation={info} conversationId={id} />
      <ConversationMessages messages={messages} />
    </>
  );
}
