import { DefaultApi } from "../../conversationsApi";
import { useParams } from "react-router";
import { useLoaderWithSelector } from "../../hooks/useLoaderWithSelector";

export function useCurrentConversation() {
  const { id } = useParams();
  return useLoaderWithSelector(
    () => new DefaultApi().apiConversationsGet(),
    (conversations) => {
      const conversation = conversations.find((c) => c.id === id);
      return id && conversation ? { id, conversation } : undefined;
    }
  );
}
