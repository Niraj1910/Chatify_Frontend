import { userContext } from "../Contexts/UserContext";
import { useContext } from "react";

const useUserContext = () => {
  const context = useContext(userContext);

  if (!context) {
    throw new Error("Somethin went wrong in the userContext.tsx please check.");
  }
  return {
    isAuth: context.isAuth,
    setIsAuth: context.setIsAuth,
    showLogout: context.showLogout,
    setShowLogout: context.setShowLogout,
    currLoggedUser: context.currLoggedUser,
    setCurrLoggedUser: context.setCurrLoggedUser,
    conversationUsers: context.conversationUsers,
    setConversationUsers: context.setConversationUsers,
  };
};

export { useUserContext };
