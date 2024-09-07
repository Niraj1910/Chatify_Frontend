import { useEffect, useState } from "react";
import Authentication from "./Authentication";
import Messages from "./Messages";
import Users from "./Users";
import { useUserContext } from "../Contexts/UserContext";
import LogoutPopUp from "./LogoutPopUp";
import { decodeTokenAPI, fetchAllUsers } from "../Services/usersAPI";
import ChatUserSelectionPopup from "./ChatUserSelectionPopup";
import { UserInterface } from "@/Interfaces/userInterface";
const demoUsers = [
  { id: 1, userName: "JohnDoe" },
  { id: 2, userName: "JaneSmith" },
  { id: 3, userName: "MikeJohnson" },
  { id: 4, userName: "EmilyDavis" },
  { id: 5, userName: "DavidWilson" },
  { id: 6, userName: "SophiaMoore" },
  { id: 7, userName: "ChrisBrown" },
  { id: 8, userName: "OliviaTaylor" },
  { id: 9, userName: "JamesAnderson" },
  { id: 10, userName: "LindaMartinez" },
];

const Chat = () => {
  const [allusers, setAllUsers] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedChatUsers, setSelectedChatUsers] = useState<UserInterface[]>(
    []
  );

  const { isAuth, setIsAuth, showLogout, currLoggedUser, setCurrLoggedUser } =
    useUserContext();

  // Handle opening and closing the pop-up
  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  // // Handle user selection
  // const handleSelectUsers = (selectedUsers: UserInterface[]) => {
  //   setSelectedChatUsers(selectedUsers);
  //   handleClosePopup();
  //   console.log("Selected Users for Chat:", selectedUsers);
  // };

  const loadAllUsers = async () => {
    try {
      const response = await fetchAllUsers();

      console.log(response);

      if (!response.ok) setIsAuth(false);
      else {
        const data = await response.json();

        setAllUsers(data);
        setIsAuth(true);
      }
    } catch (error) {
      console.log("error -> ", error);
    }
  };

  const fetchDecodedUserToken = async () => {
    try {
      const data = await decodeTokenAPI();

      console.log("data -> ", data);

      setCurrLoggedUser(data);
      setIsAuth(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDecodedUserToken();
    loadAllUsers();
  }, [isAuth]);

  return (
    <section>
      {!isAuth && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <Authentication />
        </div>
      )}

      {showLogout && <LogoutPopUp />}
      {/* Render the popup */}
      {isPopupOpen && (
        <ChatUserSelectionPopup
          users={allusers.filter(
            (user: UserInterface) => user._id !== currLoggedUser?._id
          )}
          onClose={handleClosePopup}
          // onSelectUsers={handleSelectUsers}
        />
      )}

      <div
        className={`absolute w-screen h-screen flex text-white ${
          (!isAuth || showLogout) && "blur-sm pointer-events-none"
        }`}
      >
        {/* display all users */}
        <Users allUsers={allusers} handleOpenPopup={handleOpenPopup} />

        {/* display all messages */}
        <Messages handleOpenPopup={handleOpenPopup} />
      </div>
    </section>
  );
};

export default Chat;
