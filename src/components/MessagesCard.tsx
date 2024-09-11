import { MessageInterface } from "@/Interfaces/chatUserface";
import { CurrentUserInterface } from "../Interfaces/userInterface";

interface MessagesCardProps {
  currLoggedUser: CurrentUserInterface | null;
  chat: MessageInterface;
}

const MessagesCard: React.FC<MessagesCardProps> = ({
  currLoggedUser,
  chat,
}) => {
  console.log(currLoggedUser, " - ", chat);
  return (
    <>
      {currLoggedUser?._id !== chat.sender_id ? (
        <div>
          <div className="bg-purple-500 rounded-xl p-5 relative w-[40%] ">
            <p>{chat.message}</p>
            <img
              src={chat.sender_avatar_url}
              alt="img"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>
      ) : (
        <div className="flex w-full justify-end">
          <div className="bg-indigo-500 rounded-xl p-5 relative w-[40%]">
            <p>{chat.message}</p>
            <img
              src={chat.sender_avatar_url}
              alt="img"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MessagesCard;
