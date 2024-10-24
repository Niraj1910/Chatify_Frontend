import { useUserContext } from "@/Contexts/UserContext";

import { UserInterface } from "@/Interfaces/userInterface";

const PeopleCard = ({
  people,
  setUsers,
  setshowUsersForSmallDevices,
}: {
  people: UserInterface;
  setUsers: (arg: UserInterface[]) => void;
  setshowUsersForSmallDevices: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { currLoggedUser, setConversationUsers } = useUserContext();

  return (
    <div
      onClick={() => setshowUsersForSmallDevices(true)}
      key={people._id}
      className="flex px-4 h-20 justify-between items-center"
    >
      <div className="flex gap-4 items-center">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-900 relative">
          <img src={people.avatar.url} alt="img" className="w-full h-full" />
        </div>
        <p className=" text-white">{people.userName}</p>
      </div>

      <button
        onClick={() => {
          if (currLoggedUser) {
            setUsers([currLoggedUser, people]);
            setConversationUsers([currLoggedUser, people]);
          }
        }}
        className="w-20 h-14 mr-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:bg-indigo-700 transition rounded-xl"
      >
        message
      </button>
    </div>
  );
};

export default PeopleCard;
