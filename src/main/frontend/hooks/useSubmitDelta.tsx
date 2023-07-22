import { DeltaDto } from "../conversationsApi";
import { useSubmit } from "./useSubmit";
import { v4 as uuidv4 } from "uuid";
import { useContext } from "react";
import { ConversationsContext } from "../modules/websocket";

export function useSubmitDelta({
  delta,
  onComplete,
}: {
  onComplete?: () => void;
  delta: () => DeltaDto;
}) {
  const { sendMessage } = useContext(ConversationsContext);
  return useSubmit({
    onSubmit: async () => {
      sendMessage({ clientTime: new Date(), delta: delta(), id: uuidv4() });
    },
    onComplete,
  });
}
