import { UserInterface } from "@/Interfaces/userInterface";
import { BASEURL } from "../../Constants";
import { useState } from "react";
import { useUserContext } from "@/Contexts/UserContext";

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

  const { setConversationUsers } = useUserContext();

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
    setConversationUsers(selectedUsers);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select Users</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div
          className={`border-2 flex flex-col rounded-md p-1 text-lg ${
            selectedUsers.length && "gap-4"
          } mb-8`}
        >
          <div className="flex flex-wrap gap-4">
            {selectedUsers.length
              ? selectedUsers.map((user) => (
                  <p
                    key={user._id}
                    className="flex bg-cyan-500 gap-2 items-center p-2 pr-4 rounded-full"
                  >
                    <img
                      src={`${BASEURL}${user?.avatar}`}
                      alt="img"
                      className={`w-10 h-10 rounded-full `}
                    />
                    <span>{user.userName}</span>
                    <button
                      onClick={() => handleUserSelection(user)}
                      className="text-gray-600 hover:text-gray-800 rounded-full bg-white w-5"
                    >
                      ✕
                    </button>
                  </p>
                ))
              : null}
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="w-full  px-4 py-2 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search users"
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center px-4 h-20 border-b-[1px]   duration-200"
              >
                <div className="flex  items-center gap-3">
                  <img
                    src={`${BASEURL}${user?.avatar}`}
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
                  className="mr-2 cursor-pointer"
                  aria-label={`Select ${user.userName}`}
                />
              </div>
              //   <div key={user.id} className="flex items-center mb-2 text-black">
              //     <input
              //       type="checkbox"
              //       checked={selectedUsers.includes(user.id)}
              //       onChange={() => handleUserSelection(user.id)}
              //       className="mr-2"
              //       aria-label={`Select ${user.userName}`}
              //     />
              //     <span>{user.userName}</span>
              //   </div>
            ))
          ) : (
            <p className="text-gray-500">No users found.</p>
          )}
        </div>
        <button
          onClick={handleBtn}
          className="mt-4 w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Start Chat
        </button>
      </div>
    </div>
  );
};

export default ChatUserSelectionPopup;
