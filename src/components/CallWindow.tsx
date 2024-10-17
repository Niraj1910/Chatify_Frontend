import { MessageInterface } from "@/Interfaces/chatUserInterface";
import { UserInterface } from "@/Interfaces/userInterface";
import { useCallback, useState } from "react";
import { LuExpand, LuShrink } from "react-icons/lu";
import CallControls from "./CallControls";
import { getVideoAndDPInfo } from "@/utils/helpers";

interface CallWindowProps {
  remoteVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  localVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  isAudioCallOn: boolean;
  handleAudioCall: () => Promise<void>;
  isVideoCallOn: boolean;
  handleVideoCall: () => Promise<void>;
  handleEndCall: () => void;
  currLoggedUser: UserInterface | null;
  chatState: {
    _id: string;
    participants: string[];
    messages: MessageInterface[];
    isGroupChat: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
  conversationUsers: UserInterface[] | null;
  localStream: MediaStream | null;
}

const CallWindow: React.FC<CallWindowProps> = ({
  remoteVideoRef,
  localVideoRef,
  isAudioCallOn,
  isVideoCallOn,
  handleAudioCall,
  handleEndCall,
  handleVideoCall,
  currLoggedUser,
  chatState,
  conversationUsers,
  localStream,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [videoSize, setVideoSize] = useState({
    width: "100%",
    height: "100%",
  });

  const toggleVideoSize = () => {
    if (isMinimized) {
      setVideoSize({ width: "100%", height: "100%" });
    } else {
      setVideoSize({ width: "30%", height: "60%" });
    }
    setIsMinimized(!isMinimized);
  };

  const getVideoAndDP = useCallback(
    () =>
      getVideoAndDPInfo(
        remoteVideoRef,
        localVideoRef,
        conversationUsers,
        currLoggedUser,
        chatState
      ),
    [remoteVideoRef, localVideoRef, localStream]
  );

  const { remoteVideo, localVideo, remoteUserDP, localUserDP } =
    getVideoAndDP();

  return (
    <div
      className={`absolute  flex justify-center items-center bg-blue-500 ${
        videoSize.width === "100%"
          ? "m-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          : "top-0 right-0"
      }  z-30`}
      style={{ width: videoSize.width, height: videoSize.height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute w-full h-full bg-gray-900 rounded-lg shadow-lg z-50">
        {/* Hover effect for shrink/expand button */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
            <button
              onClick={toggleVideoSize}
              className="text-white text-3xl p-2"
            >
              {isMinimized ? <LuExpand /> : <LuShrink />}
            </button>
          </div>
        )}

        {/* Remote Video: Full size */}
        <div
          className={`bg-slate-600 ${
            !remoteVideo ? "w-full h-full flex justify-center items-center" : ""
          }`}
        >
          {!remoteVideo && conversationUsers && (
            <img
              src={remoteUserDP}
              alt="img"
              className="w-20 h-20 rounded-full"
            />
          )}

          <video
            ref={remoteVideoRef}
            id="remoteVideo"
            autoPlay
            muted={false}
            playsInline
            className={`${
              remoteVideo
                ? "absolute inset-0 object-cover w-full h-full"
                : "hidden"
            } `}
          />
        </div>

        {/* Local Video: Positioned top-right */}
        <div className="absolute bg-slate-800 top-0 right-0 w-[35%] h-1/3 z-50">
          <div
            className={`relative w-full h-full ${
              localVideo ? "" : "flex justify-center items-center"
            }`}
          >
            {/* Show avatar when there's no local video */}
            {!localVideo && (
              <img
                src={localUserDP}
                alt="img"
                className="w-14 h-14 rounded-full object-contain"
              />
            )}

            {/* Local video stream */}
            <video
              ref={localVideoRef}
              id="localAudio"
              autoPlay
              muted={true}
              playsInline
              className={`${
                localVideo ? "w-full h-full object-cover rounded-lg" : "hidden"
              }`}
            />
          </div>

          {/* Call Controls for Local Video */}
          <CallControls
            handleAudioCall={handleAudioCall}
            handleEndCall={handleEndCall}
            handleVideoCall={handleVideoCall}
            isAudioCallOn={isAudioCallOn}
            isVideoCallOn={isVideoCallOn}
          />
        </div>
      </div>
    </div>
  );
};

export default CallWindow;
