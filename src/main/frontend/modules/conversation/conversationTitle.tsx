import { ConversationInfoDto } from "../../conversationsApi";
import React, { useState } from "react";
import { useSubmitDelta } from "../../hooks/useSubmitDelta";

export function ConversationTitle({
  conversationId,
  conversation,
  onReload,
}: {
  conversation: ConversationInfoDto;
  onReload: () => Promise<void>;
  conversationId: string;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(conversation.title);
  const { handleSubmit, disabled } = useSubmitDelta({
    delta: () => ({
      delta: "UpdateConversationDelta",
      conversationId,
      info: { title },
    }),
    onComplete() {
      onReload();
    },
  });
  return (
    <form onSubmit={handleSubmit}>
      {editing && <div className={"scrim"}></div>}
      <div className={"conversationTitle" + (editing ? " editing" : "")}>
        <span>
          <input
            autoFocus={true}
            disabled={!editing}
            value={title}
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
