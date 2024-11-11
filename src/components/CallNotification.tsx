import { useEffect, useRef } from "react";
import { IoIosCall } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import chatifyRingtone from "../assets/chatify_ringtone.mp3";

interface CallNotificationProps {
  callNotification: {
    status: boolean;
    sender: string;
    offer: RTCSessionDescriptionInit | null;
    mediaType: {
      audio: boolean;
      video: boolean;
    };
  };
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
}

const CallNotification: React.FC<CallNotificationProps> = ({
  callNotification,
  acceptCall,
  rejectCall,
}) => {
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);

  const handleAcceptCall = async () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
    await acceptCall();
  };

  const handleRejectCall = async () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
    rejectCall();
  };
  useEffect(() => {
    // Play ringtone when call notification is active
    if (callNotification.status && ringtoneRef.current) {
      ringtoneRef.current.play();
    }
  }, [callNotification]);

  return (
    <>
      {callNotification.status && (
        <div className="absolute left-1/4 -translate-x-1/2 transform  top-10 w-96 max-sm:left-1/2 flex justify-between items-center p-4 rounded-full bg-white shadow-lg text-black z-50 max-sm:animate-none animate-shake">
          {/* Ringtone */}
          <audio ref={ringtoneRef} src={chatifyRingtone} loop autoPlay />
          <p>{callNotification.sender} is calling...</p>
          <div className="flex gap-4 ">
            <button
              onClick={handleAcceptCall}
              className="p-2 rounded-full bg-green-500 text-white cursor-pointer"
            >
              <IoIosCall />
            </button>
            <button
              onClick={handleRejectCall}
              className="p-2 rounded-full cursor-pointer bg-red-500 text-white "
            >
              <MdCallEnd />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CallNotification;
