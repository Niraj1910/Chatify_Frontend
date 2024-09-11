import { UserInterface } from "@/Interfaces/userInterface";
import { useState } from "react";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { IoVideocamOutline, IoVideocamOffOutline } from "react-icons/io5";

interface MessageNavbarProps {
  conversationUsers: UserInterface[];
}

const MessageNavbar: React.FC<MessageNavbarProps> = ({ conversationUsers }) => {
  const [isAudioCallOn, setIsAudioCallOn] = useState(false);
  const [isVideoCallOn, setIsVideoCallOn] = useState(false);
  const handleAudioCall = () => {
    setIsAudioCallOn(!isAudioCallOn);
  };
  const handleVideoCall = () => {
    setIsVideoCallOn(!isVideoCallOn);
  };
  return (
    <nav className="flex justify-between items-center pb-8 h-20 border-gray-400 border-b-[1px]">
      <div className="flex items-start">
        <img
          src={conversationUsers[0].avatar.url}
          alt="img"
          className="w-16 h-16 rounded-full"
        />
        <p
          className={`texthidden ${
            conversationUsers[0].isOnline === true && "bg-lime-400"
          } h-4 w-4 rounded-full relative top-12 right-3`}
        >
          &nbsp; &nbsp;
        </p>
        <div>
          <h1 className="text-xl font-semibold">
            {conversationUsers[0].userName}
          </h1>
          {conversationUsers[0].isOnline && (
            <p className="text-lg">Active now</p>
          )}
        </div>
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
