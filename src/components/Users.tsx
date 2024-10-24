import { UserInterface } from "../Interfaces/userInterface";
import { useEffect, useState } from "react";
import UsersCard from "./UsersCard";

import useChatContext from "../hooks/useChatContext";
import UserHeader from "./UserHeader";
import ChatifyHeader from "./ChatifyHeader";
import PeopleCard from "./PeopleCard";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useUserContext } from "@/Contexts/UserContext";
import { socket } from "@/socket";

const Users = ({
  allUsers,
  handleOpenPopup,
  isSmallScreen,
  showUsersForSmallDevices,
  setshowUsersForSmallDevices,
}: {
  allUsers: UserInterface[];
  handleOpenPopup: () => void;
  isSmallScreen: boolean;
  showUsersForSmallDevices: boolean;
  setshowUsersForSmallDevices: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { AllChats } = useChatContext();

  const { currLoggedUser } = useUserContext();

  const [users, setUsers] = useState<UserInterface[] | null>(null);

  const { activeChatId, handleNewMessages } = useChatMessages({
    currLoggedUser,
    conversationUsers: users,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const filterUsers = allUsers.filter((user) =>
    user.userName.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
  );

  // console.log("allUsers -> ", allUsers);
  // console.log("AllChats -> ", AllChats);

  useEffect(() => {
    AllChats.forEach((chat) => {
      socket.on(`${chat._id}`, handleNewMessages);
    });

    console.log("AllChats -> ", AllChats);
    return () => {
      AllChats.forEach((chat) => {
        socket.off(`${chat._id}`, handleNewMessages);
      });
    };
  }, [AllChats]);

  return (
    <aside
      className={`${
        isSmallScreen
          ? !showUsersForSmallDevices
            ? "w-full"
            : "hidden"
          : "w-[30%] "
      }  h-full border-r-2 border-gray-900 bg-slate-950`}
    >
      <ChatifyHeader />

      <UserHeader
        handleOpenPopup={handleOpenPopup}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="h-[60%] overflow-y-scroll scrollbar-hide">
        {AllChats.length && AllChats[0].lastMessage ? (
          <h1 className="ml-5 mb-6 font-bold text-xl">messages</h1>
        ) : null}
        {AllChats.length
          ? AllChats.map((chat, index) => (
              <UsersCard
                // key={chat._id}
                key={index}
                chatId={chat._id}
                friends={chat.participants}
                lastMessage={chat.lastMessage}
                isGroupChat={chat.isGroupChat}
                activeChatId={activeChatId}
                setUsers={setUsers}
                setshowUsersForSmallDevices={setshowUsersForSmallDevices}
              />
            ))
          : null}

        <h1 className="ml-5 my-6 font-bold text-xl">
          {AllChats.length ? "other people" : "start messaging"}
        </h1>
        {filterUsers.length
          ? filterUsers.map((user) => (
              <PeopleCard
                setshowUsersForSmallDevices={setshowUsersForSmallDevices}
                key={user._id}
                people={user}
                setUsers={setUsers}
              />
            ))
          : null}
        {!filterUsers.length
          ? allUsers.length
            ? allUsers.map((user) => (
                <PeopleCard
                  setshowUsersForSmallDevices={setshowUsersForSmallDevices}
                  key={user._id}
                  people={user}
                  setUsers={setUsers}
                />
              ))
            : null
          : null}
      </div>
    </aside>
  );
};

export default Users;
