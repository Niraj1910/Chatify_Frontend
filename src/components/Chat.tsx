import { useEffect, useState } from "react";

import Messages from "./Messages";
import Users from "./Users";

import ChatUserSelectionPopup from "./ChatUserSelectionPopup";

import { useUserContext } from "@/Contexts/UserContext";
import { socket } from "@/socket";
import useChatContext from "../hooks/useChatContext";
import { UserInterface } from "../Interfaces/userInterface";

interface ChatPropsInterface {
  allusers: UserInterface[];
}

const Chat: React.FC<ChatPropsInterface> = ({ allusers }) => {
  // const [allusers, setAllUsers] = useState<UserInterface[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1024);
  const [showUsersForSmallDevices, setshowUsersForSmallDevices] =
    useState(false);
  const { isAuth, showLogout, currLoggedUser } = useUserContext();
  const { setAllChats } = useChatContext();

  // Handle opening and closing the pop-up
  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);

    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    socket.emit("join", currLoggedUser?._id);

    socket.on("online-users", (onlineUsers) => {
      console.log("onlineUsers -> ", onlineUsers);

      function activeUsers(participants: UserInterface[]) {
        return participants.map((user) => ({
          ...user,
          isOnline: onlineUsers.hasOwnProperty(user._id),
        }));
      }

      setAllChats((prevChats) =>
        prevChats.map((chat) => ({
          ...chat,
          participants: activeUsers(chat.participants),
        }))
      );
    });

    return () => {
      socket.off("join");
      socket.off("online-users");
    };
  }, [currLoggedUser]);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <section>
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
          <Users
            allUsers={allusers}
            handleOpenPopup={handleOpenPopup}
            isSmallScreen={isSmallScreen}
            showUsersForSmallDevices={showUsersForSmallDevices}
            setshowUsersForSmallDevices={setshowUsersForSmallDevices}
          />

          {/* display all messages */}
          <Messages
            handleOpenPopup={handleOpenPopup}
            isSmallScreen={isSmallScreen}
            showUsersForSmallDevices={showUsersForSmallDevices}
            setshowUsersForSmallDevices={setshowUsersForSmallDevices}
          />
        </div>
      )}
    </section>
  );
};

export default Chat;
