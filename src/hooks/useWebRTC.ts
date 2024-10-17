import { ChatStateType } from "@/Interfaces/chatUserInterface";
import { UserInterface } from "@/Interfaces/userInterface";
import { useWebRTCBase } from "./useWebRTCBase";
import { useWebRTCCaller } from "./useWebRTCCaller";
import { useWebRTCReciever } from "./useWebRTCReciever";

export const useWebRTC = (
  currLoggedUser: UserInterface | null,
  chatState: ChatStateType | null,
  localVideoRef: React.MutableRefObject<HTMLVideoElement | null>,
  remoteVideoRef: React.MutableRefObject<HTMLVideoElement | null>
) => {
  const webRTCBase = useWebRTCBase(
    currLoggedUser,
    chatState,
    localVideoRef,
    remoteVideoRef
  );
  const caller = useWebRTCCaller(webRTCBase, currLoggedUser, chatState);
  const reciver = useWebRTCReciever(webRTCBase, currLoggedUser);

  return {
    ...webRTCBase,
    ...caller,
    ...reciver,
  };
};
