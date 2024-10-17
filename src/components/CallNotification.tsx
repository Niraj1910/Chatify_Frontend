import { IoIosCall } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";

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
  return (
    <>
      {callNotification.status && (
        <div className="absolute left-1/2 transform -translate-x-1/2 top-10 w-96 flex justify-between items-center p-4 rounded-full bg-white shadow-lg text-black z-50">
          <p>{callNotification.sender} is calling...</p>
          <div className="flex gap-4">
            <button
              onClick={() => acceptCall()}
              className="p-2 rounded-full bg-green-500 text-white cursor-pointer"
            >
              <IoIosCall />
            </button>
            <button
              onClick={() => rejectCall()}
              className="p-2 rounded-full cursor-pointer bg-red-500 text-white"
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
