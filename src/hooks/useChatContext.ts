import { ChatContext } from "../Contexts/ChatContext";
import { useContext } from "react";

const useChatContext = () => {
  const context = useContext(ChatContext);

  if (!context)
    throw new Error(
      "Somethin went wrong in the useChatContext.tsx please check."
    );

  return { AllChats: context?.AllChats, setAllChats: context?.setAllChats };
};

export default useChatContext;
