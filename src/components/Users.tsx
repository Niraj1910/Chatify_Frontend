import { Input } from "@/components/ui/input";
import { FaChevronDown, FaPenToSquare } from "react-icons/fa6";

import { IoSearch } from "react-icons/io5";

import { UserInterface } from "../Interfaces/userInterface";
import { useState } from "react";
import UsersCard from "./UsersCard";
import { useUserContext } from "../hooks/useUserContext";

interface UserProps {
  allUsers: UserInterface[];
  handleOpenPopup: () => void;
}

const Users: React.FC<UserProps> = ({ allUsers, handleOpenPopup }) => {
  const { showLogout, setShowLogout, currLoggedUser, setConversationUsers } =
    useUserContext();

  const [searchQuery, setSearchQuery] = useState("");

  const filterUsers = allUsers.filter((user) =>
    user.userName.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
  );

  console.log("allUsers -> ", allUsers);

  return (
    <aside className="w-[30%] h-full border-r-2 border-gray-900 bg-slate-950 ">
      <div className="bg-black border-b-pink-500 border-b-2 h-[13%]">
        <h1 className="text-7xl font-playfair  font-bold bg-gradient-to-r from-pink-600 to-fuchsia-500 bg-clip-text text-transparent leading-tight p-5 ">
          Chatify
        </h1>
      </div>
      {/* current user header */}
      <div className="flex flex-col items-start justify-between px-4 h-[8%] gap-8 my-20">
        <div className="flex justify-between w-full items-center font-bold text-xl">
          {currLoggedUser && (
            <>
              <div
                onClick={() => setShowLogout(!showLogout)}
                className="flex items-center gap-3 cursor-pointer "
              >
                <img
                  src={currLoggedUser.avatar.url}
                  alt="img"
                  className={`w-10 h-10 rounded-full `}
                />

                <span>{currLoggedUser.userName}</span>
                <FaChevronDown />
              </div>
              <FaPenToSquare
                onClick={() => handleOpenPopup()}
                className="cursor-pointer w-6 h-6"
              />
            </>
          )}
        </div>

        <div className="flex items-center w-full gap-5">
          <IoSearch className="absolute w-10 h-7  text-slate-200" />
          <Input
            aria-placeholder="search here"
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0 text-xl text-slate-200 placeholder-slate-300 rounded-full bg-zinc-500 py-5 pl-10"
          />
        </div>
      </div>

      <h1 className="ml-5 mb-6 font-bold text-xl">Messages</h1>

      <div className="h-[51%] overflow-y-scroll scrollbar-hide">
        {filterUsers.length
          ? filterUsers.map((user) => (
              <UsersCard
                key={user._id}
                setConversationUsers={setConversationUsers}
                user={user}
              />
            ))
          : null}
        {!filterUsers.length
          ? allUsers.length
            ? allUsers.map((user) => (
                <UsersCard
                  key={user._id}
                  setConversationUsers={setConversationUsers}
                  user={user}
                />
              ))
            : null
          : null}
      </div>
    </aside>
  );
};

export default Users;
