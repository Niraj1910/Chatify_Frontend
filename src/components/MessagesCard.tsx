import { MessageInterface } from "@/Interfaces/chatUserInterface";
import { UserInterface } from "../Interfaces/userInterface";

interface MessagesCardProps {
  currLoggedUser: UserInterface | null;
  chat: MessageInterface;
  date: string;
  time: string;
}

const MessagesCard: React.FC<MessagesCardProps> = ({
  currLoggedUser,
  chat,
  date,
  time,
}) => {
  // console.log(currLoggedUser, " - ", chat);
  return (
    <>
      {date.length ? (
        <p className="text-center w-48 rounded-xl relative mx-auto bg-gray-700 py-2">
          {date}
        </p>
      ) : null}
      {currLoggedUser?._id !== chat.sender_id ? (
        <div className="flex gap-3 w-full justify-start items-end">
          <img
            src={chat.sender_avatar_url}
            alt="img"
            className="w-10 h-10 rounded-full"
          />
          <div className="bg-purple-500 rounded-xl px-3 py-1 text-lg relative max-w-[80%] ">
            <p>{chat.message}</p>
            <p className="text-[14px] text-start mt-2">{time}</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 w-full justify-end items-end">
          <div className="bg-indigo-500 rounded-xl px-3 py-1 text-lg relative max-w-[80%]">
            <p>{chat.message}</p>
            <p className="text-[14px] text-end mt-2">{time}</p>
          </div>
          <img
            src={chat.sender_avatar_url}
            alt="img"
            className="w-10 h-10 rounded-full"
          />
        </div>
      )}
    </>
  );
};

export default MessagesCard;
