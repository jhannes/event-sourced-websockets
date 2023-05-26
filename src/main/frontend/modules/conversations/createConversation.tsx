import React, { useState } from "react";
import { ConversationInfoDto } from "../../../../../target/generated-sources/openapi-typescript";
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
          <p>
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
          </p>
          <p>
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
          </p>
          <p>
            <button>Submit</button>
          </p>
        </fieldset>
      </form>
    </div>
  );
}
