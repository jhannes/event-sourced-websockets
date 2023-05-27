import React, { useState } from "react";
import { LoadingView } from "../utils/loadingView";
import { ErrorView } from "../utils/errorView";
import { useCurrentConversation } from "./useCurrentConversation";
import {
  ConversationInfoDto,
  ConversationMessageDto,
} from "../../../../../target/generated-sources/openapi-typescript";
import { useSubmitDelta } from "../../hooks/useSubmitDelta";
import { v4 as uuidv4 } from "uuid";

function ConversationMessage({ message }: { message: ConversationMessageDto }) {
  return <div>Message: {message.text}</div>;
}

function AddMessageToConversation({
  conversationId,
  onReload,
}: {
  conversationId: string;
  onReload(): void;
}) {
  const delta = "AddMessageToConversationDelta";
  const [message, setMessage] = useState<ConversationMessageDto>({
    text: "",
  });
  const { handleSubmit, disabled, error } = useSubmitDelta({
    delta: () => ({ conversationId, delta, messageId: uuidv4(), message }),
    onComplete: () => {
      setMessage({ text: "" });
      onReload();
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      {error && <div>{error.toString()}</div>}
      <input
        disabled={disabled}
        autoFocus={true}
        value={message.text}
        onChange={(e) =>
          setMessage((old) => ({ ...old, text: e.target.value }))
        }
      />
      <button disabled={disabled}>Add message</button>
    </form>
  );
}

function ConversationTitle(props: {
  conversation: ConversationInfoDto;
  onReload: () => Promise<void>;
  id: string;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <>
      {editing && <div className={"scrim"}></div>}
      <div className={"conversationTitle" + (editing ? " editing" : "")}>
        <span>
          <input
            autoFocus={true}
            disabled={!editing}
            value={props.conversation.title}
          />
        </span>
        {editing && (
          <>
            <button type={"reset"} onClick={() => setEditing(false)}>
              Cancel
            </button>
            <button type={"submit"} onClick={() => setEditing(false)}>
              Save
            </button>
          </>
        )}
        {!editing && <button onClick={() => setEditing(true)}>🖊</button>}
      </div>
    </>
  );
}

function ConversationSummary(props: {
  conversation: ConversationInfoDto;
  onReload: () => Promise<void>;
  id: string;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <>
      {editing && <div className={"scrim"}></div>}
      <div className={"conversationSummary" + (editing ? " editing" : "")}>
        <textarea
          autoFocus={true}
          readOnly={!editing}
          value={props.conversation.summary}
        />
        <div>
          {editing && (
            <>
              <button type={"reset"} onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button type={"submit"} onClick={() => setEditing(false)}>
                Save
              </button>
            </>
          )}
          {!editing && <button onClick={() => setEditing(true)}>🖊</button>}
        </div>
      </div>
    </>
  );
}

export function ConversationView() {
  const { state, error, data, reload } = useCurrentConversation();

  if (state === "rejected") return <ErrorView error={error} />;
  if (state === "pending") return <LoadingView />;

  const {
    id,
    conversation: { info, messages },
  } = data;

  return (
    <div>
      <ConversationTitle conversation={info} id={id} onReload={reload} />
      <ConversationSummary conversation={info} id={id} onReload={reload} />
      <div className={"messages"}>
        {Object.keys(messages).map((k) => (
          <ConversationMessage key={k} message={messages[k]} />
        ))}
      </div>
      <AddMessageToConversation conversationId={id} onReload={reload} />
    </div>
  );
}
