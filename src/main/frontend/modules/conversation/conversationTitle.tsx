import { ConversationInfoDto } from "../../conversationsApi";
import React, {
  KeyboardEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSubmitDelta } from "../../hooks/useSubmitDelta";

export function ConversationTitle({
  conversationId,
  conversation,
}: {
  conversation: ConversationInfoDto;
  conversationId: string;
}) {
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const { handleSubmit, disabled } = useSubmitDelta({
    delta: () => ({
      delta: "UpdateConversationDelta",
      conversationId,
      info: { title },
    }),
    onComplete() {
      setEditing(false);
    },
  });
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  useEffect(() => setTitle(conversation.title), [conversation.title]);
  function handleKeyUp(e: KeyboardEvent) {
    if (e.key === "Escape") {
      setEditing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {editing && <div className={"scrim"}></div>}
      <div className={"conversationTitle" + (editing ? " editing" : "")}>
        <span>
          <input
            tabIndex={-1}
            ref={inputRef}
            disabled={!editing}
            value={title}
            onKeyUp={handleKeyUp}
            onChange={(e) => setTitle(e.target.value)}
          />
        </span>
        {editing && (
          <>
            <button type={"reset"} onClick={() => setEditing(false)}>
              Cancel
            </button>
            <button
              type={"submit"}
              disabled={disabled || title === conversation.title}
            >
              Save
            </button>
          </>
        )}
        {!editing && <button onClick={() => setEditing(true)}>🖊</button>}
      </div>
    </form>
  );
}
