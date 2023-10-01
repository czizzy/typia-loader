import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import typia from "typia";

const rootElement = document.getElementById("root");

// New as of React18
const root = createRoot(rootElement!);
typia.assert<string>(1);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
