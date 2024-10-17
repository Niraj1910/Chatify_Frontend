import { LastMessageInterface } from "@/Interfaces/chatUserInterface";
import { UserInterface } from "@/Interfaces/userInterface";
import React from "react";

import { extractUserNames } from "@/utils/helpers";
import Avatars from "./Avatars";
import { useUserContext } from "@/Contexts/UserContext";

interface UserCardProps {
  friends: UserInterface[];
  lastMessage: LastMessageInterface | null;
  chatId?: string | null;
  isGroupChat: boolean;
  activeChatId: string;
  setUsers: (arg: UserInterface[]) => void;
}

const UsersCard: React.FC<UserCardProps> = ({
  friends,
  chatId,
  lastMessage,
  isGroupChat,
  activeChatId,
  setUsers,
}) => {
  const { currLoggedUser, setConversationUsers } = useUserContext();

  const displayUserNames = extractUserNames(friends, currLoggedUser);

  return (
    (isGroupChat || lastMessage) && (
      <div
        onClick={() => {
          setUsers(friends);
          setConversationUsers(friends);
        }}
        className={`flex justify-start items-center px-4 h-20 border-b-[1px] border-gray-950 hover:bg-slate-800 cursor-pointer ${
          activeChatId === chatId ? "bg-slate-800" : ""
        } transition-colors duration-200`}
      >
        <>
          <Avatars currLoggedUser={currLoggedUser} persons={friends} />

          <div className={`flex flex-col w-full `}>
            {/* Display usernames, limit based on width */}
            <div className="flex-1">
              <p className="truncate w-full text-wrap text-white">
                {displayUserNames}
              </p>
            </div>

            <div
              className={`text-gray-400 flex items-center justify-between gap-3 ${
                isGroupChat ? "w-full" : "w-full"
              } text-base`}
            >
              <p className=" truncate w-[70%]">
                <span>
                  {lastMessage?.sender?.userName === currLoggedUser?.userName
                    ? "You"
                    : lastMessage?.sender?.userName}
                </span>{" "}
                : &nbsp;
                <span>{lastMessage?.content} </span>
              </p>
              <p className="text-sm w-[15%]">{lastMessage?.createdAt}</p>
            </div>
          </div>
        </>
      </div>
    )
  );
};

export default UsersCard;
