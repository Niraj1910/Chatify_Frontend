import {
  CurrentUserInterface,
  UserContextType,
  UserInterface,
} from "../Interfaces/userInterface";
import { createContext, ReactNode, useContext, useState } from "react";

const userContext = createContext<UserContextType | null>(null);

interface UserContextProviderProps {
  children: ReactNode;
}

const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [isAuth, setIsAuth] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const [currLoggedUser, setCurrLoggedUser] =
    useState<CurrentUserInterface | null>(null);
  const [conversationUsers, setConversationUsers] = useState<
    UserInterface[] | null
  >(null);

  return (
    <userContext.Provider
      value={{
        isAuth,
        setIsAuth,
        showLogout,
        setShowLogout,
        currLoggedUser,
        setCurrLoggedUser,
        conversationUsers,
        setConversationUsers,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

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

export { userContext, UserContextProvider, useUserContext };
