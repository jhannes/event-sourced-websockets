import React from "react";
import { Route, Routes } from "react-router-dom";
import { ConversationListView } from "./conversationList";
import { ConversationView } from "./conversationView";

export function ConversationRoutes() {
  return (
    <Routes>
      <Route path={"/"} element={<ConversationListView />} />
      <Route path={"/:id"} element={<ConversationView />} />
    </Routes>
  );
}
