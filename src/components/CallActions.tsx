import { useUserContext } from "@/Contexts/UserContext";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useEffect, useRef } from "react";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { IoVideocamOffOutline, IoVideocamOutline } from "react-icons/io5";
import CallNotification from "./CallNotification";
import CallWindow from "./CallWindow";

const CallActions = ({
  setisCallOn,
  showUsersForSmallDevices,
}: {
  setisCallOn: React.Dispatch<React.SetStateAction<number>>;
  showUsersForSmallDevices: boolean;
}) => {
  const { currLoggedUser, conversationUsers } = useUserContext();

  const { chatState } = useChatMessages({
    currLoggedUser,
    conversationUsers,
  });
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const {
    callNotification,
    acceptCall,
    rejectCall,
    isAudioCallOn,
    handleAudioCall,
    call,
    setCall,
    initiateCall,
    isVideoCallOn,
    handleVideoCall,
    handleEndCall,
    localUserDp,
    localVideoIsOn,
    remoteUserDp,
    remoteVideoIsOn,
  } = useWebRTC(currLoggedUser, chatState, localVideoRef, remoteVideoRef);

  useEffect(() => {
    setisCallOn(call);
  }, [call]);

  return (
    <>
      {/* Incoming Call Notification */}
      <CallNotification
        acceptCall={acceptCall}
        callNotification={callNotification}
        rejectCall={rejectCall}
      />

      {/* Call Controls: Audio & Video Toggle */}
      {showUsersForSmallDevices && (
        <div className="flex gap-5 my-4 max-sm:gap-1">
          {/* Audio Call Toggle */}
          {isAudioCallOn ? (
            <AiOutlineAudioMuted
              onClick={handleAudioCall}
              className="w-10 h-7 cursor-pointer text-red-500"
              title="Mute Audio"
            />
          ) : (
            <AiOutlineAudio
              onClick={() => {
                if (!call) {
                  setCall(1);
                  initiateCall(true, false);
                }
                handleAudioCall();
              }}
              className="w-10 h-7 cursor-pointer text-green-500"
              title="Start Audio Call"
            />
          )}

          {/* Video Call Toggle */}
          {isVideoCallOn ? (
            <IoVideocamOffOutline
              onClick={handleVideoCall}
              className="w-10 h-7 cursor-pointer text-red-500"
              title="Turn Off Video"
            />
          ) : (
            <IoVideocamOutline
              onClick={() => {
                if (!call) {
                  setCall(1);
                  initiateCall(true, true);
                }
                handleVideoCall();
              }}
              className="w-10 h-7 cursor-pointer text-green-500"
              title="Start Video Call"
            />
          )}
        </div>
      )}

      {call !== 0 && (
        <CallWindow
          localUserD={localUserDp}
          localVideoIsOn={localVideoIsOn}
          remoteUserDp={remoteUserDp}
          remoteVideoIsOn={remoteVideoIsOn}
          handleAudioCall={handleAudioCall}
          handleEndCall={handleEndCall}
          handleVideoCall={handleVideoCall}
          isAudioCallOn={isAudioCallOn}
          isVideoCallOn={isVideoCallOn}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
        />
      )}
    </>
  );
};

export default CallActions;
