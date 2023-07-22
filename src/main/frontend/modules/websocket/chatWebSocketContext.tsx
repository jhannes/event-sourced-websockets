import React, { ReactElement, useMemo, useState } from "react";
import {
  ChangeTrackedDto,
  CommandToServerDto,
  ConversationSnapshotDto,
  EventFromServerDto,
  MessageFromServerDto,
} from "../../conversationsApi";
import { ConnectionState, useWebSocket } from "../hooks/useWebSocket";

export type ConversationListObservable =
  | { pending: true }
  | ConversationSnapshotDto[];

export type Conversation = { id: string; snapshot: ConversationSnapshotDto };

export type ConversationObservable =
  | { pending: true }
  | { notFound: true }
  | Conversation;

export const ConversationsContext = React.createContext<{
  conversationList: ConversationListObservable;
  sendMessage(message: CommandToServerDto): void;
  connectionState: ConnectionState;
}>({
  conversationList: { pending: true },
  sendMessage: () => {},
  connectionState: { connected: false },
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
  const { connectionState, sendMessage } = useWebSocket(handleMessage, "/ws");

  function handleMessage(message: MessageFromServerDto) {
    if ("conversations" in message) {
      setConversations(
        Object.fromEntries(message.conversations.map((c) => [c.id, c]))
      );
    } else {
      applyDelta(message);
    }
  }

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

  return (
    <ConversationsContext.Provider
      value={{ conversationList, sendMessage, connectionState }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}
