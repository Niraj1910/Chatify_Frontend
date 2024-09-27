import { UserInterface } from "@/Interfaces/userInterface";

const PeopleCard = ({
  people,
  currLoggedUser,
  setActiveChatId,
  setConversationUsers,
}: {
  people: UserInterface;
  currLoggedUser: UserInterface | null;
  setActiveChatId: (arg: string) => void;
  setConversationUsers: (arg: UserInterface[]) => void | null;
}) => {
  return (
    <div
      key={people._id}
      className="flex px-4 h-20 justify-between items-center"
    >
      <div className="flex items-center relative">
        <div
          key={people._id}
          className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-900 relative"
        >
          <img src={people.avatar.url} alt="img" className="w-full h-full" />
        </div>
      </div>

      <p className="-ml-7 w-80 text-white">{people.userName}</p>

      <button
        onClick={() => {
          if (currLoggedUser) setConversationUsers([currLoggedUser, people]);
          setActiveChatId("");
        }}
        className="w-20 h-14 mr-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:bg-indigo-700 transition rounded-xl"
      >
        message
      </button>
    </div>
  );
};

export default PeopleCard;
