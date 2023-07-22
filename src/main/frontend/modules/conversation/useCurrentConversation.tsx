import { useParams } from "react-router";
import { useContext } from "react";
import { ConversationObservable, ConversationsContext } from "../websocket";

export function useCurrentConversation(): ConversationObservable {
  const { id } = useParams();
  const { conversationList } = useContext(ConversationsContext);
  if ("pending" in conversationList) {
    return conversationList;
  }
  const snapshot = conversationList.find((c) => c.id === id);
  return snapshot && id ? { id, snapshot } : { notFound: true };
}
