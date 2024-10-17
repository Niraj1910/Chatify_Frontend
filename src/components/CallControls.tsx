import React from "react";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { IoVideocamOffOutline, IoVideocamOutline } from "react-icons/io5";
import { MdCallEnd } from "react-icons/md";

interface CallControlsProps {
  isAudioCallOn: boolean;
  isVideoCallOn: boolean;
  handleAudioCall: () => Promise<void>;
  handleVideoCall: () => Promise<void>;
  handleEndCall: () => void;
}

const CallControls: React.FC<CallControlsProps> = ({
  handleAudioCall,
  handleEndCall,
  handleVideoCall,
  isAudioCallOn,
  isVideoCallOn,
}) => {
  return (
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 z-50">
      {/* Mute/Unmute Audio */}
      {isAudioCallOn ? (
        <AiOutlineAudioMuted
          onClick={handleAudioCall}
          className="w-10 h-7 cursor-pointer text-red-500"
          title="Mute Audio"
        />
      ) : (
        <AiOutlineAudio
          className="w-10 h-7 text-green-500 cursor-pointer"
          onClick={handleAudioCall}
        />
      )}

      {/* Toggle Video */}
      {isVideoCallOn ? (
        <IoVideocamOffOutline
          onClick={handleVideoCall}
          className="w-10 h-7 cursor-pointer text-red-500"
          title="Turn Off Video"
        />
      ) : (
        <IoVideocamOutline
          className="w-10 h-7 text-green-500 cursor-pointer"
          onClick={handleVideoCall}
        />
      )}

      {/* End Call */}
      <button
        className="p-2 rounded-full cursor-pointer bg-red-500 text-white"
        onClick={handleEndCall}
      >
        <MdCallEnd />
      </button>
    </div>
  );
};

export default CallControls;
