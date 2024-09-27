import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "./components/ui/toaster.tsx";
import { UserContextProvider } from "./Contexts/UserContext.tsx";
import { ChatContextProvider } from "./Contexts/ChatContext.tsx";
// import { Toaster } from "@/components/ui/toaster";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserContextProvider>
      <ChatContextProvider>
        <App />
      </ChatContextProvider>
      <Toaster />
    </UserContextProvider>
  </StrictMode>
);
