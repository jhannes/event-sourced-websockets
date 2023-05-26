import React from "react";

import "./application.css";
import { ConversationList } from "../conversations/conversationList";

export function Application() {
  return (
    <>
      <header>Hello application with layout</header>
      <div id="main">
        <nav>Nav</nav>
        <main>
          <ConversationList />
        </main>
        <aside>Aside</aside>
      </div>
      <footer>Footer</footer>
    </>
  );
}
