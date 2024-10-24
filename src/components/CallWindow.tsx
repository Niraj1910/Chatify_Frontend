import { useState } from "react";
import { LuExpand, LuShrink } from "react-icons/lu";
import CallControls from "./CallControls";

interface CallWindowProps {
  remoteVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  localVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  isAudioCallOn: boolean;
  handleAudioCall: () => Promise<void>;
  isVideoCallOn: boolean;
  handleVideoCall: () => Promise<void>;
  handleEndCall: () => void;
  localUserD: string;
  localVideoIsOn: boolean;
  remoteUserDp: string;
  remoteVideoIsOn: boolean;
}

const CallWindow: React.FC<CallWindowProps> = ({
  remoteVideoRef,
  localVideoRef,
  isAudioCallOn,
  isVideoCallOn,
  handleAudioCall,
  handleEndCall,
  handleVideoCall,
  localUserD,
  localVideoIsOn,
  remoteUserDp,
  remoteVideoIsOn,
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
      setVideoSize({
        width: window.innerWidth < 1024 ? "65%" : "30%",
        height: "60%",
      });
    }
    setIsMinimized(!isMinimized);
  };

  return (
    <div
      className={`absolute  flex justify-center items-center ${
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
            !remoteVideoIsOn
              ? "w-full h-full flex justify-center items-center"
              : ""
          }`}
        >
          {!remoteVideoIsOn && (
            <img
              src={remoteUserDp}
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
              remoteVideoIsOn
                ? "absolute inset-0 object-cover w-full h-full"
                : "hidden"
            } `}
          />
        </div>

        {/* Local Video: Positioned top-right */}
        <div className="absolute bg-slate-800 top-0 right-0 w-[35%] max-md:w-[50%] h-1/3 z-50">
          <div
            className={`relative w-full h-full ${
              localVideoIsOn ? "" : "flex justify-center items-center"
            }`}
          >
            {/* Show avatar when there's no local video */}
            {!localVideoIsOn && (
              <img
                src={localUserD}
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
                localVideoIsOn
                  ? "w-full h-full object-cover rounded-lg"
                  : "hidden"
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
