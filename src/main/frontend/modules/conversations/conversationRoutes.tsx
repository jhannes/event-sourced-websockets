import React from "react";
import { Route, Routes } from "react-router-dom";
import { ConversationListView } from "./conversationList";
import { ConversationView } from "./conversationView";

import "./conversations.css";

export function ConversationRoutes() {
  return (
    <div className={"conversations"}>
      <Routes>
        <Route path={"/"} element={<ConversationListView />} />
        <Route path={"/:id"} element={<ConversationView />} />
      </Routes>
    </div>
  );
}
