import { UserInterface } from "../Interfaces/userInterface";
import { useState } from "react";
import UsersCard from "./UsersCard";
import { useUserContext } from "../hooks/useUserContext";
import useChatContext from "../hooks/useChatContext";
import UserHeader from "./UserHeader";
import ChatifyHeader from "./ChatifyHeader";
import PeopleCard from "./PeopleCard";

const Users = ({
  allUsers,
  handleOpenPopup,
}: {
  allUsers: UserInterface[];
  handleOpenPopup: () => void;
}) => {
  const { currLoggedUser, setConversationUsers } = useUserContext();
  const { AllChats } = useChatContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeChatId, setActiveChatId] = useState("");

  const filterUsers = allUsers.filter((user) =>
    user.userName.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
  );

  console.log("allUsers -> ", allUsers);
  console.log("AllChats -> ", AllChats);

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
              activeChatId={activeChatId}
              setActiveChatId={setActiveChatId}
              setConversationUsers={setConversationUsers}
              friends={chat.participants}
              lastMessage={chat.lastMessage}
              isGroupChat={chat.isGroupChat}
            />
          ))
        ) : (
          <h1>loading</h1>
        )}

        <h1 className="ml-5 my-6 font-bold text-xl">other people</h1>
        {filterUsers.length
          ? filterUsers.map((user) => (
              <PeopleCard
                key={user._id}
                currLoggedUser={currLoggedUser}
                people={user}
                setActiveChatId={setActiveChatId}
                setConversationUsers={setConversationUsers}
              />
            ))
          : null}
        {!filterUsers.length
          ? allUsers.length
            ? allUsers.map((user) => (
                <PeopleCard
                  key={user._id}
                  currLoggedUser={currLoggedUser}
                  people={user}
                  setActiveChatId={setActiveChatId}
                  setConversationUsers={setConversationUsers}
                />
              ))
            : null
          : null}
      </div>
    </aside>
  );
};

export default Users;
