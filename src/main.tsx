import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initializePWA } from "./lib/pwa";
import AppErrorBoundary from "./components/AppErrorBoundary";
import "./style/main.css";

initializePWA();

const root = document.getElementById("root");

if (!root) {
  throw new Error("NEXUS could not find the root element.");
}

createRoot(root).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);
