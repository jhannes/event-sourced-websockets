import { DefaultApi } from "../../../../../target/generated-sources/openapi-typescript";
import { useParams } from "react-router";
import { useLoaderWithSelector } from "../../hooks/useLoaderWithSelector";

export function useCurrentConversation() {
  const { id } = useParams();
  return useLoaderWithSelector(
    () => new DefaultApi().apiConversationsGet(),
    (conversations) => conversations.find((c) => c.id === id)
  );
}
