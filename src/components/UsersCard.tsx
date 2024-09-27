import { useUserContext } from "@/hooks/useUserContext";
import { LastMessageInterface } from "@/Interfaces/chatUserInterface";
import { UserInterface } from "@/Interfaces/userInterface";
import React from "react";

import { extractUserNames } from "@/utils/helpers";
import Avatars from "./Avatars";

interface UserCardProps {
  setConversationUsers: (arg: UserInterface[]) => void;
  friends: UserInterface[];
  lastMessage: LastMessageInterface | null;
  chatId?: string | null;
  setActiveChatId?: (arg: string) => void;
  activeChatId?: string;
  isGroupChat: boolean;
}

const UsersCard: React.FC<UserCardProps> = ({
  setConversationUsers,
  friends,
  lastMessage,
  chatId,
  setActiveChatId,
  activeChatId,
  isGroupChat,
}) => {
  const { currLoggedUser } = useUserContext();

  const displayUserNames = extractUserNames(friends, currLoggedUser);

  const isClicked = () => {
    if (chatId && setActiveChatId) setActiveChatId(chatId);
  };

  return (
    (isGroupChat || lastMessage) && (
      <div
        onClick={() => isClicked()}
        className={`flex justify-start items-center px-4 h-20 border-b-[1px] border-gray-950 hover:bg-zinc-900 cursor-pointer ${
          activeChatId === chatId ? "bg-zinc-900" : ""
        } transition-colors duration-200`}
      >
        <>
          <Avatars
            currLoggedUser={currLoggedUser}
            persons={friends}
            setConversationUsers={setConversationUsers}
          />

          <div
            onClick={() => setConversationUsers(friends)}
            className={`flex flex-col w-full `}
          >
            {/* Display usernames, limit based on width */}
            <div className="flex-1">
              <p className="truncate w-80 text-white">{displayUserNames}</p>
            </div>

            {/* Last message */}

            <div
              className={`text-gray-400 flex items-center justify-between gap-3 ${
                isGroupChat ? "w-[70%]" : "w-full"
              } text-base`}
            >
              <p className=" truncate w-[100%]">
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
