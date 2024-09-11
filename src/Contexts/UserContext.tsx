import {
  CurrentUserInterface,
  UserContextType,
  UserInterface,
} from "../Interfaces/userInterface";
import { createContext, ReactNode, useState } from "react";

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

export { userContext, UserContextProvider };
