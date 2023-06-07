import { useParams } from "react-router";
import { useContext } from "react";
import { ConversationsContext } from "../websocket";

export function useCurrentConversation() {
  const { id } = useParams();
  const { conversationList } = useContext(ConversationsContext);
  if ("pending" in conversationList) {
    return conversationList;
  }
  const conversation = conversationList.find((c) => c.id === id);
  return conversation && id ? { id, conversation } : { pending: true };
}
