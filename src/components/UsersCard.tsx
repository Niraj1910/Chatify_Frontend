import { UserInterface } from "@/Interfaces/userInterface";
import React from "react";

interface UserCardProps {
  setConversationUsers: (arg: UserInterface[]) => void;
  user: UserInterface;
}

const UsersCard: React.FC<UserCardProps> = ({ setConversationUsers, user }) => {
  return (
    <div
      onClick={() => setConversationUsers([user])}
      className="flex justify-between items-center px-4 h-20 border-b-[1px] border-gray-950 cursor-pointer hover:bg-zinc-900 transition-colors duration-200 "
    >
      <div className="flex  items-center -gap-1">
        <img
          src={user?.avatar.url}
          alt="img"
          className={`w-14 h-14 rounded-full `}
        />

        <p
          className={`texthidden ${
            user.isOnline === true && "bg-lime-400"
          } h-4 w-4 rounded-full relative top-7 right-5`}
        >
          &nbsp; &nbsp;
        </p>

        <p className="flex flex-col">
          <span className="text-lg">{user.userName}</span>
          {/* <span className="text-gray-200">{user?.lastMsg}</span> */}
        </p>
      </div>
      {/* <p>{user?.lastSeen}</p> */}
    </div>
  );
};

export default UsersCard;
