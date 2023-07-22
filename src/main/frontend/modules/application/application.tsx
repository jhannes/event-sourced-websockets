import React from "react";

import "./application.css";
import { ConversationRoutes } from "../conversationList/conversationRoutes";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { ChatWebSocketContext } from "../websocket";
import { ApplicationHeader } from "./applicationHeader";

function FrontPage() {
  return <h1>Front Page</h1>;
}

export function Application() {
  return (
    <ChatWebSocketContext>
      <BrowserRouter>
        <ApplicationHeader />
        <div id="main">
          <nav>
            <NavLink to={"/"}>Front page</NavLink>
            <NavLink to={"/conversations"}>Conversations</NavLink>
          </nav>
          <main>
            <Routes>
              <Route path={"/"} element={<FrontPage />} />
              <Route
                path={"/conversations/*"}
                element={<ConversationRoutes />}
              />
              <Route path={"/*"} element={<h1>Not Found</h1>} />
            </Routes>
          </main>
          <aside>Aside</aside>
        </div>
        <footer>Footer</footer>
      </BrowserRouter>
    </ChatWebSocketContext>
  );
}
