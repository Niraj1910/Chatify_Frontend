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
  const [selectedChatUsers, setSelectedChatUsers] = useState<UserInterface[]>(
    []
  );

  const { isAuth, showLogout, currLoggedUser } = useUserContext();
  const { setAllChats } = useChatContext();

  // Handle opening and closing the pop-up
  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  // // Handle user selection
  // const handleSelectUsers = (selectedUsers: UserInterface[]) => {
  //   setSelectedChatUsers(selectedUsers);
  //   handleClosePopup();
  //   console.log("Selected Users for Chat:", selectedUsers);
  // };

  useEffect(() => {
    console.log(`currLoggedUser dependency sideEffect from Chat.tsx`);

    if (currLoggedUser?.userName) {
      console.log("Joining with username:", currLoggedUser.userName);
      socket.emit("join", currLoggedUser._id);
    }

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
    console.log(`empty dependency sideEffect from Chat.tsx`);

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
          <Users allUsers={allusers} handleOpenPopup={handleOpenPopup} />

          {/* display all messages */}
          <Messages handleOpenPopup={handleOpenPopup} />
        </div>
      )}
    </section>
  );
};

export default Chat;
