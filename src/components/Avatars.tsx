import { UserInterface } from "@/Interfaces/userInterface";

const Avatars = ({
  persons,
  currLoggedUser,
  setConversationUsers,
}: {
  persons: UserInterface[];
  currLoggedUser: UserInterface | null;
  setConversationUsers?: (arg: UserInterface[]) => void;
}) => {
  const remainingPersons = persons.length - 3;
  persons = persons.filter((person, index) => {
    if (index < 3) return person;
  });

  return (
    <div
      onClick={() => {
        if (setConversationUsers) setConversationUsers(persons);
      }}
      className="flex items-center relative"
    >
      {persons?.map((person, index) =>
        persons?.length > 2 ? (
          <div
            key={person._id}
            className={`w-14 h-14 rounded-full overflow-hidden border-2 border-gray-900 relative `}
            style={{
              zIndex: persons?.length - index,
              marginLeft: index === 0 ? "0" : "-20%", // Show 30% overlap
            }}
          >
            <img
              src={person?.avatar?.url}
              alt="img"
              className="w-full h-full"
            />
          </div>
        ) : currLoggedUser?.userName !== person?.userName ? (
          <div
            key={person._id}
            className={`w-14 h-14 rounded-full overflow-hidden relative mr-4 ${
              person?.isOnline
                ? "border-[3px] border-green-500"
                : "border-2 border-gray-900"
            }`}
          >
            <img
              src={person?.avatar?.url}
              alt="img"
              className="w-full h-full"
            />
          </div>
        ) : null
      )}
      {remainingPersons > 0 && (
        <span className="absolute right-10">+{remainingPersons}</span>
      )}
    </div>
  );
};

export default Avatars;
