import React from "react";

import "./application.css";
import { ConversationView } from "../conversations/conversationView";

export function Application() {
  return (
    <>
      <header>Hello application with layout</header>
      <div id="main">
        <nav>Nav</nav>
        <main>
          <ConversationView />
        </main>
        <aside>Aside</aside>
      </div>
      <footer>Footer</footer>
    </>
  );
}
