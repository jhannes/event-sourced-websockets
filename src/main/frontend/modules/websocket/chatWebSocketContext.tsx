import { ReactElement, useEffect, useState } from "react";
import {
  ChangeTrackedDto,
  ConversationSnapshotDto,
  EventFromServerDto,
  MessageFromServerDto,
} from "../../conversationsApi";

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
        ...delta.info,
        updatedAt: event.clientTime,
      };
  }
}

export function ChatWebSocketContext({ children }: { children: ReactElement }) {
  const [webSocket, setWebSocket] = useState<WebSocket>();
  const [conversations, setConversations] = useState<
    Record<string, ConversationSnapshotDto>
  >({});

  function applyDelta(event: EventFromServerDto) {
    const {
      delta: { conversationId },
    } = event;
    setConversations((old) => ({
      ...old,
      [conversationId]: applyDeltaToSnapshot(event, old[conversationId]),
    }));
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

  return children;
}
