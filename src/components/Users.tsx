import { UserInterface } from "../Interfaces/userInterface";
import { useState } from "react";
import UsersCard from "./UsersCard";

import useChatContext from "../hooks/useChatContext";
import UserHeader from "./UserHeader";
import ChatifyHeader from "./ChatifyHeader";
import PeopleCard from "./PeopleCard";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useUserContext } from "@/Contexts/UserContext";

const Users = ({
  allUsers,
  handleOpenPopup,
}: {
  allUsers: UserInterface[];
  handleOpenPopup: () => void;
}) => {
  const { AllChats } = useChatContext();

  const { currLoggedUser } = useUserContext();

  const [users, setUsers] = useState<UserInterface[] | null>(null);

  const { activeChatId } = useChatMessages({
    currLoggedUser,
    conversationUsers: users,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const filterUsers = allUsers.filter((user) =>
    user.userName.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
  );

  // console.log("allUsers -> ", allUsers);
  // console.log("AllChats -> ", AllChats);

  return (
    <aside className="w-[30%] h-full border-r-2 border-gray-900 bg-slate-950 ">
      <ChatifyHeader />

      <UserHeader
        handleOpenPopup={handleOpenPopup}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="h-[58%] overflow-y-scroll scrollbar-hide">
        <h1 className="ml-5 mb-6 font-bold text-xl">messages</h1>
        {AllChats.length ? (
          AllChats.map((chat, index) => (
            <UsersCard
              // key={chat._id}
              key={index}
              chatId={chat._id}
              friends={chat.participants}
              lastMessage={chat.lastMessage}
              isGroupChat={chat.isGroupChat}
              activeChatId={activeChatId}
              setUsers={setUsers}
            />
          ))
        ) : (
          <h1>loading</h1>
        )}

        <h1 className="ml-5 my-6 font-bold text-xl">other people</h1>
        {filterUsers.length
          ? filterUsers.map((user) => (
              <PeopleCard key={user._id} people={user} setUsers={setUsers} />
            ))
          : null}
        {!filterUsers.length
          ? allUsers.length
            ? allUsers.map((user) => (
                <PeopleCard key={user._id} people={user} setUsers={setUsers} />
              ))
            : null
          : null}
      </div>
    </aside>
  );
};

export default Users;
