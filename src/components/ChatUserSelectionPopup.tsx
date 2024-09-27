import { useUserContext } from "../hooks/useUserContext";
import { UserInterface } from "@/Interfaces/userInterface";

import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Input } from "./ui/input";

interface ChatUserSelectionProps {
  users: UserInterface[];
  onClose: () => void;
  // onSelectUsers: (arg: UserInterface[]) => void;
}

const ChatUserSelectionPopup: React.FC<ChatUserSelectionProps> = ({
  users,
  onClose,
  // onSelectUsers,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<UserInterface[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { setConversationUsers, currLoggedUser } = useUserContext();

  // Handle user selection
  const handleUserSelection = (selectedUser: UserInterface) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(selectedUser)
        ? prevSelected.filter((user) => user !== selectedUser)
        : [...prevSelected, selectedUser]
    );
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBtn = () => {
    if (!selectedUsers.length || !currLoggedUser) return;

    setConversationUsers([...selectedUsers, currLoggedUser]);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-slate-950 border-gray-400 border-2 text-white w-full max-w-md rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select Users</h2>
          <button
            onClick={onClose}
            className="text-lg hover:text-xl"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div
          className={` flex flex-col rounded-md p-3 text-lg  ${
            selectedUsers.length && "gap-4 border-gray-500 border-2"
          } mb-8`}
        >
          <div className="flex flex-wrap gap-4">
            {selectedUsers.length
              ? selectedUsers.map((user) => (
                  <p
                    key={user._id}
                    className="flex bg-zinc-800 gap-2 items-center p-2 pr-4 rounded-full"
                  >
                    <img
                      src={user.avatar.url}
                      alt="img"
                      className={`w-10 h-10 rounded-full `}
                    />
                    <span>{user.userName}</span>
                    <button
                      onClick={() => handleUserSelection(user)}
                      className="text-gray-600 hover:text-gray-800 rounded-full bg-white w-7"
                    >
                      ✕
                    </button>
                  </p>
                ))
              : null}
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
        <div className="max-h-60 overflow-y-auto scrollbar-hide">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex hover:bg-zinc-900 justify-between items-center px-4 h-20 duration-200"
              >
                <div className="flex  items-center gap-3">
                  <img
                    src={user.avatar.url}
                    alt="img"
                    className={`w-10 h-10 rounded-full `}
                  />

                  <p className="flex flex-col">
                    <span className="text-lg">{user.userName}</span>
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user)}
                  onChange={() => handleUserSelection(user)}
                  className="mr-2 w-5 h-5 cursor-pointer"
                  aria-label={`Select ${user.userName}`}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No users found.</p>
          )}
        </div>

        <button
          disabled={selectedUsers.length ? false : true}
          onClick={handleBtn}
          className="w-full mt-4 py-2 text-lg text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300"
        >
          Start Chat
        </button>
      </div>
    </div>
  );
};

export default ChatUserSelectionPopup;
