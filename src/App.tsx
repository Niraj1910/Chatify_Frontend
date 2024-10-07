import { useEffect, useState } from "react";
import Chat from "./components/Chat";
import { UserInterface } from "./Interfaces/userInterface";
import { decodeTokenAPI, fetchAllUsers } from "./Services/usersAPI";

import Authentication from "./components/Authentication";
import LogoutPopUp from "./components/LogoutPopUp";
import { ChatContextProvider } from "./Contexts/ChatContext";
import { useUserContext } from "./Contexts/UserContext";

const App = () => {
  const [allusers, setAllUsers] = useState<UserInterface[]>([]);

  const { isAuth, setIsAuth, showLogout, setCurrLoggedUser } = useUserContext();

  const loadAllUsers = async (skipUser: UserInterface) => {
    try {
      const response = await fetchAllUsers();

      if (!response.ok) setIsAuth(false);
      else {
        const data = await response.json();

        setAllUsers(() => {
          return data.filter(
            (user: { [key: string]: string }) => user._id !== skipUser._id
          );
        });
        setIsAuth(true);
      }
    } catch (error) {
      console.log("error -> ", error);
    }
  };

  const fetchDecodedUserToken = async () => {
    try {
      const data = await decodeTokenAPI();

      setCurrLoggedUser({
        _id: data._id,
        avatar: { url: data.avatar.url, public_id: data.avatar.public_id },
        email: data.email,
        userName: data.userName,
        isOnline: true,
      });
      setIsAuth(true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(`first sideEffect from App.tsx`);

    const firstFetchCall = async () => {
      const skipUser = await fetchDecodedUserToken();
      loadAllUsers(skipUser);
    };
    firstFetchCall();
  }, [isAuth]);

  return (
    <main className="bg-slate-900 w-screen h-screen">
      {!isAuth && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <Authentication />
        </div>
      )}

      {showLogout && <LogoutPopUp />}

      {isAuth && (
        <ChatContextProvider>
          <Chat allusers={allusers} />
        </ChatContextProvider>
      )}
    </main>
  );
};

export default App;
