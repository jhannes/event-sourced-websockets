import React, { ReactElement, useEffect, useMemo, useState } from "react";
import {
  ChangeTrackedDto,
  ConversationSnapshotDto,
  EventFromServerDto,
  MessageFromServerDto,
} from "../../conversationsApi";

export type ConversationListObservable =
  | { pending: true }
  | ConversationSnapshotDto[];

export const ConversationsContext = React.createContext<{
  conversationList: ConversationListObservable;
}>({
  conversationList: { pending: true },
});

function newChangeTracked(event: EventFromServerDto): ChangeTrackedDto {
  return {
    updatedAt: event.clientTime,
    createdAt: event.clientTime,
  };
}

function applyDeltaToSnapshot(
  event: EventFromServerDto,
  snapshotDto: ConversationSnapshotDto
): ConversationSnapshotDto {
  const { delta } = event;
  switch (delta.delta) {
    case "CreateConversationDelta":
      return {
        ...newChangeTracked(event),
        id: delta.conversationId,
        info: delta.info,
        messages: {},
      };
    case "AddMessageToConversationDelta":
      return {
        ...snapshotDto,
        messages: {
          ...snapshotDto.messages,
          [delta.messageId]: { ...newChangeTracked(event), ...delta.message },
        },
      };
    case "UpdateConversationDelta":
      return {
        ...snapshotDto,
        info: {
          ...snapshotDto.info,
          ...delta.info,
        },
        updatedAt: event.clientTime,
      };
    default:
      delta satisfies never;
      throw new Error("Should never happen");
  }
}

export function ChatWebSocketContext({ children }: { children: ReactElement }) {
  const [webSocket, setWebSocket] = useState<WebSocket>();
  const [conversations, setConversations] =
    useState<Record<string, ConversationSnapshotDto>>();
  const conversationList: ConversationListObservable = useMemo(() => {
    return conversations === undefined
      ? { pending: true }
      : Object.values(conversations);
  }, [conversations]);

  function applyDelta(event: EventFromServerDto) {
    const {
      delta: { conversationId },
    } = event;
    setConversations((old) =>
      old
        ? {
            ...old,
            [conversationId]: applyDeltaToSnapshot(event, old[conversationId]),
          }
        : undefined
    );
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/ws");
    console.log("Connecting websocket");
    ws.onmessage = ({ data }) => {
      const messageFromServer = JSON.parse(data) as MessageFromServerDto;
      if ("conversations" in messageFromServer) {
        setConversations(
          Object.fromEntries(
            messageFromServer.conversations.map((c) => [c.id, c])
          )
        );
      } else {
        applyDelta(messageFromServer);
      }
    };
    setWebSocket(ws);
  }, []);

  useEffect(() => {
    console.log({ conversations });
  }, [conversations]);

  return (
    <ConversationsContext.Provider value={{ conversationList }}>
      {children}
    </ConversationsContext.Provider>
  );
}
