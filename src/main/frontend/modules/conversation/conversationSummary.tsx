import { ConversationInfoDto } from "../../../../../target/generated-sources/openapi-typescript";
import React, { useState } from "react";
import { useSubmitDelta } from "../../hooks/useSubmitDelta";

export function ConversationSummary({
  conversationId,
  conversation,
  onReload,
}: {
  conversation: ConversationInfoDto;
  onReload: () => Promise<void>;
  conversationId: string;
}) {
  const [editing, setEditing] = useState(false);
  const [summary, setSummary] = useState(conversation.summary || "");
  const { handleSubmit, disabled } = useSubmitDelta({
    delta: () => ({
      delta: "UpdateConversationDelta",
      conversationId,
      info: { summary } as ConversationInfoDto,
    }),
    onComplete() {
      onReload();
    },
  });
  return (
    <form onSubmit={handleSubmit}>
      {editing && <div className={"scrim"}></div>}
      <div className={"conversationSummary" + (editing ? " editing" : "")}>
        <textarea
          readOnly={!editing}
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
