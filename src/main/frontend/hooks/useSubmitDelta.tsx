import { DefaultApi, DeltaDto } from "../conversationsApi";
import { useSubmit } from "./useSubmit";
import { v4 as uuidv4 } from "uuid";

export function useSubmitDelta({
  delta,
  onComplete,
}: {
  onComplete: () => void;
  delta: () => DeltaDto;
}) {
  return useSubmit({
    onSubmit: () =>
      new DefaultApi().apiCommandsPost({
        commandToServerDto: {
          clientTime: new Date(),
          id: uuidv4(),
          delta: delta(),
        },
      }),
    onComplete,
  });
}
