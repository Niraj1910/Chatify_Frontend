import { UserInterface } from "@/Interfaces/userInterface";
import { extractUserNames } from "@/utils/helpers";
import { useState } from "react";
import { MdClose, MdKeyboardArrowRight } from "react-icons/md";
import Avatars from "./Avatars";
import { useUserContext } from "@/Contexts/UserContext";
import AudioVideoCall from "./AudioVideoCall";

interface MessageNavbarProps {
  conversationUsers: UserInterface[];
  isGroupChat: boolean | undefined;
}

const MessageNavbar: React.FC<MessageNavbarProps> = ({
  conversationUsers,
  isGroupChat,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { currLoggedUser, setConversationUsers } = useUserContext();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const displayUserNames = extractUserNames(conversationUsers, currLoggedUser);

  return (
    <>
      <nav className="flex justify-between items-center pb-8 h-20 border-gray-400 border-b-[1px]">
        <Avatars currLoggedUser={currLoggedUser} persons={conversationUsers} />

        {/* Display usernames, limit based on width */}
        <div className="flex-1">
          <p className="flex items-center truncate w-96 text-white">
            {displayUserNames}{" "}
            {isGroupChat && (
              <MdKeyboardArrowRight
                onClick={toggleSidebar}
                className="w-10 h-8 cursor-pointer"
              />
            )}
          </p>
        </div>

        <AudioVideoCall />
      </nav>

      {/* Sliding Sidebar */}
      {isGroupChat && (
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-slate-800 shadow-lg z-50 transition-transform transform ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Sidebar Header with Close Button */}
          <div className="flex justify-between items-center p-4 border-b border-gray-400">
            <h3 className="text-lg text-white font-semibold">
              Group Chat Users
            </h3>
            <MdClose
              onClick={toggleSidebar}
              className="w-7 h-7 cursor-pointer text-white"
            />
          </div>

          {/* List of Conversation Users */}
          <div className="">
            {conversationUsers.map((user) => (
              <div
                onClick={() => {
                  if (currLoggedUser) {
                    setConversationUsers([currLoggedUser, user]);
                    setIsSidebarOpen(!isSidebarOpen);
                  }
                }}
                key={user._id}
                className={`${
                  user._id === currLoggedUser?._id ? "pointer-events-none" : ""
                } flex items-center gap-3 mb-4 hover:bg-zinc-900 w-full px-4 py-2 cursor-pointer`}
              >
                <img
                  src={user.avatar.url}
                  alt="img"
                  className={`w-10 h-10 rounded-full`}
                />
                <p className="text-white">
                  {user._id === currLoggedUser?._id ? "You" : user.userName}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MessageNavbar;
