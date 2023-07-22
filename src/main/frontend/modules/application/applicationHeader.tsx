import React, { useContext } from "react";
import { ConversationsContext } from "../websocket";
import { useDateFormat } from "../../hooks/useDateFormat";

function ConnectionStateView() {
  const {
    connectionState: { connected, disconnectedSince, reconnectAttempts },
  } = useContext(ConversationsContext);
  const { formatted: date } = useDateFormat(disconnectedSince);
  if (connected) {
    return <div>Connected</div>;
  } else {
    return (
      <div>
        Disconnected
        {disconnectedSince && ` since ${date}`}
        {reconnectAttempts && ` (${reconnectAttempts} reconnect attempts)`}
      </div>
    );
  }
}

export function ApplicationHeader() {
  return (
    <header>
      <div>Hello application with layout</div>
      <div style={{ flex: 1 }}></div>
      <ConnectionStateView />
    </header>
  );
}
