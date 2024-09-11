import { SetStateAction } from "react";

export type UserInterface = {
  avatar: { url: string; public_id: string };
  userName: string;
  email: string;
  _id: string;
  isOnline: boolean;
};
export type CurrentUserInterface = {
  _id: string;
  avatar: { url: string; public_id: string };
  userName: string;
  email: string;
  iat: number;
  exp: number;
};

export type UserContextType = {
  isAuth: boolean;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  showLogout: boolean;
  setShowLogout: React.Dispatch<React.SetStateAction<boolean>>;
  currLoggedUser: CurrentUserInterface | null;
  setCurrLoggedUser: React.Dispatch<
    React.SetStateAction<CurrentUserInterface | null>
  >;
  conversationUsers: UserInterface[] | null;
  setConversationUsers: React.Dispatch<SetStateAction<UserInterface[] | null>>;
};
