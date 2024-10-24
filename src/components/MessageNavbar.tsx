import { UserInterface } from "@/Interfaces/userInterface";
import { extractUserNames } from "@/utils/helpers";
import { useState } from "react";
import { MdClose, MdKeyboardArrowRight } from "react-icons/md";
import Avatars from "./Avatars";
import { useUserContext } from "@/Contexts/UserContext";
import CallActions from "./CallActions";
import { FaAnglesLeft } from "react-icons/fa6";

interface MessageNavbarProps {
  conversationUsers: UserInterface[];
  isGroupChat: boolean | undefined;
  isSmallScreen: boolean;
  showUsersForSmallDevices: boolean;
  setshowUsersForSmallDevices: React.Dispatch<React.SetStateAction<boolean>>;
}

const MessageNavbar: React.FC<MessageNavbarProps> = ({
  conversationUsers,
  isGroupChat,
  isSmallScreen,
  showUsersForSmallDevices,
  setshowUsersForSmallDevices,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { currLoggedUser, setConversationUsers } = useUserContext();
  const [isCallOn, setisCallOn] = useState(0);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const displayUserNames = extractUserNames(conversationUsers, currLoggedUser);

  const handleShowUsersForSmallDevices = () =>
    setshowUsersForSmallDevices(false);

  return (
    <>
      <nav
        className={`${
          showUsersForSmallDevices
            ? "bg-slate-800 flex justify-between items-center px-10 py-[60px] h-20"
            : ""
        }  `}
      >
        {isSmallScreen && (
          <FaAnglesLeft
            onClick={handleShowUsersForSmallDevices}
            className="w-6 h-6 text-white mr-3 cursor-pointer max-md:"
          />
        )}
        {showUsersForSmallDevices && (
          <Avatars
            currLoggedUser={currLoggedUser}
            persons={conversationUsers}
          />
        )}

        {/* Display usernames, limit based on width */}
        {showUsersForSmallDevices && (
          <div className="flex-1">
            <p
              onClick={() => isGroupChat && toggleSidebar()}
              className={`flex items-center truncate w-96 max-md:w-6 max-sm:w-28 text-wrap text-white ${
                isGroupChat && "cursor-pointer"
              }`}
            >
              {displayUserNames}{" "}
              {isGroupChat && (
                <MdKeyboardArrowRight className="w-10 h-8 max-sm:w-6 max-sm:h-4" />
              )}
            </p>
          </div>
        )}
        {isGroupChat ? (
          isCallOn !== 0 && (
            <CallActions
              showUsersForSmallDevices={showUsersForSmallDevices}
              setisCallOn={setisCallOn}
            />
          )
        ) : (
          <CallActions
            showUsersForSmallDevices={showUsersForSmallDevices}
            setisCallOn={setisCallOn}
          />
        )}
      </nav>

      {/* Sliding Sidebar */}
      {isGroupChat && (
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-slate-700 shadow-lg z-50 transition-transform transform ${
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
                } flex items-center gap-3 mb-4 hover:bg-slate-900 w-full px-4 py-2 cursor-pointer`}
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
