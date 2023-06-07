import React, { useState } from "react";
import { ConversationInfoDto } from "../../conversationsApi";
import { v4 as uuidv4 } from "uuid";
import { useSubmitDelta } from "../../hooks/useSubmitDelta";

export function CreateConversation({ onReload }: { onReload: () => void }) {
  const [info, setInfo] = useState<ConversationInfoDto>({
    title: "",
    summary: "",
  });
  const { handleSubmit, disabled, error } = useSubmitDelta({
    delta: () => ({
      delta: "CreateConversationDelta",
      conversationId: uuidv4(),
      info,
    }),
    onComplete: () => {
      setInfo({ title: "", summary: "" });
      onReload();
    },
  });

  return (
    <div>
      <h2>Create new</h2>

      <form onSubmit={handleSubmit}>
        <fieldset disabled={disabled} style={{ border: "none" }}>
          {error && <div>Error: {error.toString()}</div>}
          <div>
            <label>
              Title:
              <div>
                <input
                  autoFocus={true}
                  value={info.title}
                  onChange={(e) =>
                    setInfo((old) => ({
                      ...old,
                      title: e.target.value,
                    }))
                  }
                />
              </div>
            </label>
          </div>
          <div>
            <label>
              Description:
              <div>
                <textarea
                  value={info.summary}
                  onChange={(e) =>
                    setInfo((old) => ({
                      ...old,
                      summary: e.target.value,
                    }))
                  }
                />
              </div>
            </label>
          </div>
          <p>
            <button disabled={!info.title}>Submit</button>
          </p>
        </fieldset>
      </form>
    </div>
  );
}
