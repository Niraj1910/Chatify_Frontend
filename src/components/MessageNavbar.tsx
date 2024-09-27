import { useUserContext } from "@/hooks/useUserContext";
import { UserInterface } from "@/Interfaces/userInterface";
import { extractUserNames } from "@/utils/helpers";
import { useState } from "react";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { IoVideocamOutline, IoVideocamOffOutline } from "react-icons/io5";
import Avatars from "./Avatars";

interface MessageNavbarProps {
  conversationUsers: UserInterface[];
}

const MessageNavbar: React.FC<MessageNavbarProps> = ({ conversationUsers }) => {
  const [isAudioCallOn, setIsAudioCallOn] = useState(false);
  const [isVideoCallOn, setIsVideoCallOn] = useState(false);

  const { currLoggedUser } = useUserContext();

  const handleAudioCall = () => {
    setIsAudioCallOn(!isAudioCallOn);
  };
  const handleVideoCall = () => {
    setIsVideoCallOn(!isVideoCallOn);
  };

  const displayUserNames = extractUserNames(conversationUsers, currLoggedUser);

  return (
    <nav className="flex justify-between items-center pb-8 h-20 border-gray-400 border-b-[1px]">
      <Avatars currLoggedUser={currLoggedUser} persons={conversationUsers} />
      {/* Display usernames, limit based on width */}
      <div className="flex-1">
        <p className="truncate w-80 text-white">{displayUserNames}</p>
      </div>

      <div className="flex gap-5">
        {/* Audio and Video Call Icons */}
        {isAudioCallOn ? (
          <AiOutlineAudioMuted
            onClick={handleAudioCall}
            className="w-10 h-7 cursor-pointer"
          />
        ) : (
          <AiOutlineAudio
            onClick={handleAudioCall}
            className="w-10 h-7 cursor-pointer"
          />
        )}

        {isVideoCallOn ? (
          <IoVideocamOffOutline
            onClick={handleVideoCall}
            className="w-10 h-7 cursor-pointer"
          />
        ) : (
          <IoVideocamOutline
            onClick={handleVideoCall}
            className="w-10 h-7 cursor-pointer"
          />
        )}
      </div>
    </nav>
  );
};

export default MessageNavbar;
