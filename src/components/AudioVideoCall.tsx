import { useUserContext } from "@/Contexts/UserContext";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useRef, useState } from "react";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { IoVideocamOffOutline, IoVideocamOutline } from "react-icons/io5";

const AudioVideoCall = () => {
  const { currLoggedUser, conversationUsers } = useUserContext();
  const { chatState } = useChatMessages({
    currLoggedUser,
    conversationUsers,
  });
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const tempRef = useRef<HTMLAudioElement | null>(null);

  const [show, setShow] = useState(false);

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
  } = useWebRTC(currLoggedUser, chatState, localVideoRef, remoteVideoRef);

  return (
    <>
      {/* <div className="absolute w-96 h-96 bg-slate-500">
        <audio
          onClick={async () => {
            if (show) {
              if (tempRef.current && tempRef.current.srcObject) {
                const stream = tempRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
                tempRef.current.srcObject = null;
              }
            } else {
              try {
                const newStream = await navigator.mediaDevices.getUserMedia({
                  audio: true,
                  video: false,
                });

                console.log("Audio stream:", newStream);
                console.log("Audio tracks:", newStream.getAudioTracks());

                if (newStream.getAudioTracks().length > 0) {
                  console.log("Audio track available");
                } else {
                  console.log("No audio track found");
                }

                if (tempRef.current) {
                  tempRef.current.srcObject = newStream;
                  tempRef.current.muted = false;
                  tempRef.current.volume = 1.0;

                  await tempRef.current.play(); // Manually trigger play
                  console.log("Playing audio...");
                }
              } catch (error) {
                console.error("Error accessing media devices:", error);
              }
            }
            setShow(!show);
          }}
          ref={tempRef}
          autoPlay
          playsInline
          controls
          className="w-full h-full"
        />
      </div> */}

      {/* Incoming Call Notification */}
      {callNotification.status && (
        <div className="absolute left-1/2 transform -translate-x-1/2 top-10 w-96 flex justify-between items-center p-4 rounded-full bg-white shadow-lg text-black z-50">
          <p>{callNotification.sender} is calling...</p>
          <div className="flex gap-4">
            <button
              // disabled={localVideoRef.current ? false : true}
              onClick={() => acceptCall()}
              className="p-2 rounded-full bg-green-500 text-white"
            >
              Accept
            </button>
            <button
              onClick={() => rejectCall()}
              className="p-2 rounded-full bg-red-500 text-white"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Call Controls: Audio & Video Toggle */}
      <div className="flex gap-5 my-4">
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

      {/* Ongoing Call UI */}
      {call !== 0 && (
        <div className="absolute right-[348px] bg-gray-900 w-96 h-96 rounded-lg overflow-hidden shadow-lg z-40 mx-auto my-6">
          {/* Local Video */}
          <video
            ref={localVideoRef}
            id="localVideo"
            autoPlay
            muted={false}
            playsInline
            className="absolute inset-0 object-cover w-full h-full"
          />

          {/* Call Action Buttons */}
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-5">
            {/* Mute/Unmute Button */}
            {isAudioCallOn ? (
              <AiOutlineAudioMuted
                onClick={handleAudioCall}
                className="w-10 h-7 cursor-pointer text-red-500"
                title="Unmute"
              />
            ) : (
              <AiOutlineAudio
                onClick={handleAudioCall}
                className="w-10 h-7 cursor-pointer text-green-500"
                title="Mute"
              />
            )}

            {/* Video On/Off Button */}
            {isVideoCallOn ? (
              <IoVideocamOffOutline
                onClick={handleVideoCall}
                className="w-10 h-7 cursor-pointer text-red-500"
                title="Turn Off Video"
              />
            ) : (
              <IoVideocamOutline
                onClick={handleVideoCall}
                className="w-10 h-7 cursor-pointer text-green-500"
                title="Turn On Video"
              />
            )}

            {/* End Call Button */}
            <button
              disabled={call === 1}
              onClick={handleEndCall}
              className={`w-28 p-3 rounded-full text-center transition-colors ${
                call === 1 ? "bg-gray-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {call === 1 ? "Calling..." : "End Call"}
            </button>
          </div>
        </div>
      )}

      {/* Remote Video Display */}
      {call !== 0 && (
        <div className="bg-gray-900 w-[50%] h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 rounded-lg overflow-hidden shadow-lg">
          <video
            ref={remoteVideoRef}
            id="remoteVideo"
            muted={false}
            controls={false}
            autoPlay
            playsInline
            className="absolute inset-0 object-cover w-full h-full"
          />
        </div>
      )}
    </>
  );
};

export default AudioVideoCall;
