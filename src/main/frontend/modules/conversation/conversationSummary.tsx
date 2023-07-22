import { ConversationInfoDto } from "../../conversationsApi";
import React, { useEffect, useState } from "react";
import { useSubmitDelta } from "../../hooks/useSubmitDelta";

export function ConversationSummary({
  conversationId,
  conversation,
}: {
  conversation: ConversationInfoDto;
  conversationId: string;
}) {
  const [editing, setEditing] = useState(false);
  const [summary, setSummary] = useState("");
  useEffect(
    () => setSummary(conversation.summary || ""),
    [conversation.summary]
  );
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
