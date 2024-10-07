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

  // let clickedChatId = "";

  // const handleBtn = (conversationUsers: UserInterface[]) => {
  //   clickedChatId = activeChatId;
  // };

  // const { activeChatId } = useChatMessages({
  //   currLoggedUser,
  //   conversationUsers: friends,
  // });

  const displayUserNames = extractUserNames(friends, currLoggedUser);

  // const isClicked = () => {
  //   if (chatId && setActiveChatId) setActiveChatId(chatId);
  // };

  // console.log("activeChatId ->", activeChatId, " ", "chatId -> ", chatId);

  return (
    (isGroupChat || lastMessage) && (
      <div
        // onClick={() => isClicked()}
        // onClick={() => setConversationUsers(friends)}
        // onClick={() => handleBtn(friends)}
        onClick={() => {
          setUsers(friends);
          setConversationUsers(friends);
        }}
        className={`flex justify-start items-center px-4 h-20 border-b-[1px] border-gray-950 hover:bg-zinc-900 cursor-pointer ${
          activeChatId === chatId ? "bg-zinc-900" : ""
        } transition-colors duration-200`}
      >
        <>
          <Avatars currLoggedUser={currLoggedUser} persons={friends} />

          <div className={`flex flex-col w-full `}>
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
