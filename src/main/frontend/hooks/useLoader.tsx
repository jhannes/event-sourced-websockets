import { useEffect, useState } from "react";

type LoadingState<T> =
  | { state: "pending"; data: undefined; error: undefined }
  | { state: "resolved"; data: T; error: undefined }
  | { state: "rejected"; data: undefined; error: Error };

export function useLoader<T>(
  loaderFn: () => Promise<T>
): LoadingState<T> & { reload(): Promise<void> } {
  const [loadingState, setLoadingState] = useState<LoadingState<T>>({
    state: "pending",
    data: undefined,
    error: undefined,
  });
  useEffect(() => {
    reload();
  }, []);

  async function reload() {
    setLoadingState({ state: "pending", data: undefined, error: undefined });
    try {
      const data = await loaderFn();
      setLoadingState({ state: "resolved", data, error: undefined });
    } catch (e) {
      const error = e as Error;
      setLoadingState({ state: "rejected", data: undefined, error });
    }
  }

  return { ...loadingState, reload };
}
