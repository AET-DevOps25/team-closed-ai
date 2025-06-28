import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import { ThemeProvider } from "./context/ThemeContext.tsx";

const root = document.getElementById("root")!;

createRoot(root).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="closedai-ui-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
);
