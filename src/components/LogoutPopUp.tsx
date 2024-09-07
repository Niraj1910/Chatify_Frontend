import { useUserContext } from "../Contexts/UserContext";
import { BASEURL, SIGN_OUT } from "../../Constants";
import UpdateUser from "./UpdateUser";

const LogoutPopUp = () => {
  const { showLogout, setShowLogout, setIsAuth, setCurrLoggedUser } =
    useUserContext();

  const handleLogoutUser = () => {
    fetch(`${BASEURL}/api/${SIGN_OUT}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        handleCloseLogoutPopUp();
        setIsAuth(false);
        setCurrLoggedUser(null);
      })
      .catch((err) => console.log(err));
  };

  const handleCloseLogoutPopUp = () => setShowLogout(!showLogout);

  return (
    <div className="absolute z-40 left-1/2 -translate-x-1/2 flex min-h-screen w-[500px] items-center justify-center p-4 text-xl ">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl relative">
        {" "}
        {/* Relative positioning for container */}
        {/* Cross Icon to Close Popup */}
        <UpdateUser handleCloseLogoutPopUp={handleCloseLogoutPopUp} />
        <h2 className="text-2xl font-bold text-center text-gray-800 -pt-4">
          Do you want to logout?
        </h2>
        <div className="flex justify-center items-center gap-4 ">
          <button
            onClick={handleLogoutUser}
            className="w-32 py-3 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300"
          >
            Yes
          </button>
          <button
            onClick={handleCloseLogoutPopUp}
            className="w-32 py-3 text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPopUp;
