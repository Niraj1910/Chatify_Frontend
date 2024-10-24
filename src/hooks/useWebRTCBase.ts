import { ChatStateType } from "@/Interfaces/chatUserInterface";
import { UserInterface } from "@/Interfaces/userInterface";
import { socket } from "@/socket";
import { closeTheMedia, getFriendID } from "@/utils/helpers";
import { useCallback, useEffect, useRef, useState } from "react";

export const useWebRTCBase = (
  currLoggedUser: UserInterface | null,
  chatState: ChatStateType | null,
  localVideoRef: React.MutableRefObject<HTMLVideoElement | null>,
  remoteVideoRef: React.MutableRefObject<HTMLVideoElement | null>
) => {
  const [isAudioCallOn, setIsAudioCallOn] = useState<boolean>(false);
  const [isVideoCallOn, setIsVideoCallOn] = useState<boolean>(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [call, setCall] = useState<number>(0); // 0: no call, 1: calling, 2: in call
  const peerConnection = useRef<RTCPeerConnection>(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org",
        },
      ],
    })
  );
  const pendingCandidates = useRef<RTCIceCandidate[]>([]);

  // states for local and remote user dp
  const [remoteVideoIsOn, setRemoteVideoIsOn] = useState(false);
  const [remoteUserDp, setremoteUserDp] = useState("");
  const [localVideoIsOn, setLocalVideoIsOn] = useState(false);
  const [localUserDp, setlocalUserDp] = useState("");

  // set up the ice-candidate exchange
  useEffect(() => {
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate && chatState) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          to: getFriendID(chatState.participants, currLoggedUser?._id),
        });
      }
    };

    peerConnection.current.oniceconnectionstatechange = () => {
      console.log(
        "ICE Connection State:",
        peerConnection.current.iceConnectionState
      );
      if (peerConnection.current.iceConnectionState === "connected")
        console.log(`peer ${currLoggedUser?.userName} is connected`);
    };

    return () => {
      peerConnection.current.onicecandidate = null;
      peerConnection.current.oniceconnectionstatechange = null;
    };
  }, [chatState]);

  const handleIncomingIceCandidate = useCallback(
    async (candidate: RTCIceCandidate) => {
      if (candidate) {
        try {
          if (peerConnection.current.remoteDescription)
            await peerConnection.current.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          else pendingCandidates.current.push(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error(`error adding ice candidate`, error);
        }
      }
    },
    [currLoggedUser]
  );

  const handleCutCall = useCallback(() => {
    console.log(`call-end in ${currLoggedUser?.userName}`);

    localStream?.getTracks().forEach((track) => track.stop());

    closeTheMedia(localVideoRef, remoteVideoRef);

    setLocalStream(null);
    setIsAudioCallOn(false);
    setIsVideoCallOn(false);
    setCall(0);
  }, [localStream, localVideoRef, remoteVideoRef, currLoggedUser]);

  // handle incoming ice-candidates and end-call event
  useEffect(() => {
    socket.on(
      `ice-candidate:${currLoggedUser?._id}`,
      handleIncomingIceCandidate
    );
    socket.on(`call-end:${currLoggedUser?._id}`, handleCutCall);
    return () => {
      socket.off(`ice-candidate:${currLoggedUser?._id}`);
      socket.off(`call-end:${currLoggedUser?._id}`);
    };
  }, [currLoggedUser]);

  // handle incoming tracks from peer
  useEffect(() => {
    peerConnection.current.ontrack = async (event) => {
      const [remoteStream] = event.streams;
      if (remoteVideoRef.current) {
        (remoteVideoRef.current.srcObject = remoteStream),
          console.log(
            `remoteStream from ${currLoggedUser?.userName} -> `,
            remoteStream
          );

        // Check if the audio track is present
        if (remoteStream.getAudioTracks().length > 0) {
          console.log("Remote audio track received.");
        } else {
          console.log("No remote audio track.");
        }
      } else
        console.log(
          `could not the set the stream to remoteVideo -> `,
          remoteVideoRef
        );
    };

    return () => {
      if (peerConnection.current) peerConnection.current.ontrack = null;
    };
  }, [chatState, remoteVideoRef]);

  const handleEndCall = () => {
    localStream?.getTracks().forEach((track) => track.stop());

    closeTheMedia(localVideoRef, remoteVideoRef);

    setLocalStream(null);
    setIsAudioCallOn(false);
    setIsVideoCallOn(false);
    setCall(0);

    socket.emit(
      "call-end",
      getFriendID(chatState?.participants, currLoggedUser?._id)
    );
  };

  const handleAudioCall = async (): Promise<void> => {
    setIsAudioCallOn(!isAudioCallOn);

    if (!isAudioCallOn)
      localStream?.getAudioTracks().forEach((track) => (track.enabled = true));
    else
      localStream?.getAudioTracks().forEach((track) => (track.enabled = false));

    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
  };

  const handleVideoCall = async (): Promise<void> => {
    setIsVideoCallOn(!isVideoCallOn);

    if (!isVideoCallOn)
      localStream?.getVideoTracks().forEach((track) => (track.enabled = true));
    else
      localStream?.getVideoTracks().forEach((track) => (track.enabled = false));

    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
  };

  return {
    handleAudioCall,
    handleVideoCall,
    handleEndCall,
    peerConnection,
    pendingCandidates,
    call,
    setCall,
    localStream,
    setLocalStream,
    isVideoCallOn,
    setIsAudioCallOn,
    isAudioCallOn,
    setIsVideoCallOn,
    localVideoRef,
    remoteVideoRef,
    localUserDp,
    setlocalUserDp,
    localVideoIsOn,
    setLocalVideoIsOn,
    remoteUserDp,
    setremoteUserDp,
    remoteVideoIsOn,
    setRemoteVideoIsOn,
  };
};
