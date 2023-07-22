import { ConversationInfoDto } from "../../conversationsApi";
import React, {
  MutableRefObject,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSubmitDelta } from "../../hooks/useSubmitDelta";

export function ConversationSummary({
  conversationId,
  conversation,
}: {
  conversation: ConversationInfoDto;
  conversationId: string;
}) {
  const textAreaRef = useRef() as MutableRefObject<HTMLTextAreaElement>;
  const [editing, setEditing] = useState(false);
  const [summary, setSummary] = useState("");
  useEffect(() => {
    if (editing) {
      setSummary(conversation.summary || "");
      textAreaRef.current.focus();
    }
  }, [editing]);
  const { handleSubmit, disabled } = useSubmitDelta({
    delta: () => ({
      delta: "UpdateConversationDelta",
      conversationId,
      info: { summary } as ConversationInfoDto,
    }),
    onComplete() {
      setEditing(false);
    },
  });

  function handleKeyUp(e: KeyboardEvent) {
    if (e.key === "Escape") {
      setEditing(false);
    }
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit} onReset={() => console.log("Cancel")}>
      {editing && <div className={"scrim"}></div>}
      <div className={"conversationSummary" + (editing ? " editing" : "")}>
        <textarea
          tabIndex={-1}
          onKeyUp={handleKeyUp}
          readOnly={!editing}
          ref={textAreaRef}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <div>
          {editing && (
            <>
              <button type={"reset"} onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button
                type={"submit"}
                disabled={disabled || summary === conversation.summary}
              >
                Save
              </button>
            </>
          )}
          {!editing && <button onClick={() => setEditing(true)}>🖊</button>}
        </div>
      </div>
    </form>
  );
}
