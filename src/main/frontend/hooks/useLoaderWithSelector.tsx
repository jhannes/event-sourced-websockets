import { Loader, useLoader } from "./useLoader";
import { useMemo } from "react";

export function useLoaderWithSelector<PARENT, CHILD>(
  loaderFn: () => Promise<PARENT>,
  selectFn: (parent: PARENT) => CHILD | undefined
): Loader<CHILD> {
  const internalState = useLoader(loaderFn);
  return useMemo(() => {
    const { data, error, state, reload } = internalState;
    if (state === "pending") {
      return { state, error: undefined, data: undefined, reload };
    }
    if (state === "rejected") {
      return { state, error, data: undefined, reload };
    }
    const child = selectFn(data);
    if (!child) {
      return {
        state: "rejected",
        data: undefined,
        error: new Error("Not found"),
        reload,
      };
    }
    return { state: "resolved", data: child, error: undefined, reload };
  }, [internalState]);
}
