import { useEffect, useState } from "react";
import Authentication from "./Authentication";
import Messages from "./Messages";
import Users from "./Users";

import LogoutPopUp from "./LogoutPopUp";
import { decodeTokenAPI, fetchAllUsers } from "../Services/usersAPI";
import ChatUserSelectionPopup from "./ChatUserSelectionPopup";
import {
  CurrentUserInterface,
  UserInterface,
} from "@/Interfaces/userInterface";
import { useUserContext } from "../hooks/useUserContext";
import { socket } from "@/socket";

const Chat = () => {
  const [allusers, setAllUsers] = useState<UserInterface[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedChatUsers, setSelectedChatUsers] = useState<UserInterface[]>(
    []
  );

  const { isAuth, setIsAuth, showLogout, currLoggedUser, setCurrLoggedUser } =
    useUserContext();

  // Handle opening and closing the pop-up
  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  // // Handle user selection
  // const handleSelectUsers = (selectedUsers: UserInterface[]) => {
  //   setSelectedChatUsers(selectedUsers);
  //   handleClosePopup();
  //   console.log("Selected Users for Chat:", selectedUsers);
  // };

  const loadAllUsers = async (skipUser: CurrentUserInterface) => {
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

      setCurrLoggedUser(data);
      setIsAuth(true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const firstFetchCall = async () => {
      const skipUser = await fetchDecodedUserToken();
      loadAllUsers(skipUser);
    };
    firstFetchCall();
  }, [isAuth]);

  useEffect(() => {
    socket.connect();
    if (currLoggedUser?.userName) {
      console.log("Joining with username:", currLoggedUser.userName);
      socket.emit("join", currLoggedUser._id);
    }

    socket.on("online-users", (onlineUsers) => {
      console.log("onlineUsers -> ", onlineUsers);

      setAllUsers((prevAllUsers) =>
        prevAllUsers.map((user) => ({
          ...user,
          isOnline: onlineUsers.hasOwnProperty(user._id),
        }))
      );
    });

    return () => {
      socket.disconnect();
      socket.off("join");
    };
  }, [currLoggedUser]);

  return (
    <section>
      {!isAuth && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <Authentication />
        </div>
      )}

      {showLogout && <LogoutPopUp />}
      {/* Render the popup */}
      {isPopupOpen && (
        <ChatUserSelectionPopup
          users={allusers}
          onClose={handleClosePopup}
          // onSelectUsers={handleSelectUsers}
        />
      )}

      {allusers.length && (
        <div
          className={`absolute w-screen h-screen flex text-white ${
            (!isAuth || showLogout) && "blur-sm pointer-events-none"
          }`}
        >
          {/* display all users */}
          <Users allUsers={allusers} handleOpenPopup={handleOpenPopup} />

          {/* display all messages */}
          <Messages handleOpenPopup={handleOpenPopup} />
        </div>
      )}
    </section>
  );
};

export default Chat;
