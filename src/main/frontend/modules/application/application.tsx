import React from "react";

import "./application.css";

export function Application() {
  return (
    <>
      <header>Hello application with layout</header>
      <div id="main">
        <nav>Nav</nav>
        <main>Main</main>
        <aside>Aside</aside>
      </div>
      <footer>Footer</footer>
    </>
  );
}
