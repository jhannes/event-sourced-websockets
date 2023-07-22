import { FormEvent, useState } from "react";

export function useSubmit({
  onSubmit,
  onComplete,
}: {
  onSubmit: () => Promise<void>;
  onComplete?: () => void;
}) {
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState<Error>();

  async function handleSubmit(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    setDisabled(true);
    setError(undefined);
    try {
      await onSubmit();
      onComplete && onComplete();
    } catch (e) {
      setError(e as Error);
    } finally {
      setDisabled(false);
    }
  }

  return { handleSubmit, disabled, error };
}
