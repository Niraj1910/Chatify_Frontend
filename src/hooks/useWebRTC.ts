import { MessageInterface } from "@/Interfaces/chatUserInterface";
import { UserInterface } from "@/Interfaces/userInterface";
import { socket } from "@/socket";
import { closeTheMedia, getFriendID } from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";

type ChatStateType = {
  _id: string;
  participants: string[];
  messages: MessageInterface[];
  isGroupChat: boolean;
  createdAt: string;
  updatedAt: string;
};

// Parent WebRTC logic (shared by both the caller and reciever)
const useWebRTCBase = (
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

  // handle incoming ice-candidates and end-call event
  useEffect(() => {
    socket.on(`ice-candidate:${currLoggedUser?._id}`, async (candidate) => {
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
    });
    socket.on(`call-end:${currLoggedUser?._id}`, () => {
      console.log(`call-end in ${currLoggedUser?.userName}`);

      localStream?.getTracks().forEach((track) => track.stop());

      closeTheMedia(localVideoRef, remoteVideoRef);

      setLocalStream(null);
      setIsAudioCallOn(false);
      setIsVideoCallOn(false);
      setCall(0);
    });
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
  };
};

// caller logic
const useWebRTCCaller = (
  webRTCBase: ReturnType<typeof useWebRTCBase>,
  currLoggedUser: UserInterface | null,
  chatState: ChatStateType | null
) => {
  const {
    peerConnection,
    setIsAudioCallOn,
    setIsVideoCallOn,
    setLocalStream,
    setCall,
    pendingCandidates,
    handleEndCall,
    localVideoRef,
  } = webRTCBase;

  const initiateCall = async (audio: boolean, video: boolean) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio,
      video,
    });
    stream
      .getTracks()
      .forEach((track) => peerConnection.current?.addTrack(track, stream));
    setLocalStream(stream);

    console.log(`checking for audio track -> `, stream.getAudioTracks());

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    } else {
      console.log(
        `could not the set the stream to localVidoe -> `,
        localVideoRef
      );
    }

    const offer = await peerConnection.current?.createOffer();
    if (offer && chatState && currLoggedUser) {
      await peerConnection.current?.setLocalDescription(offer);
      socket.emit(`call-req`, {
        offer,
        sender: currLoggedUser?.userName,
        reciever: getFriendID(chatState.participants, currLoggedUser?._id),
        mediaType: { audio, video },
      });
    }

    console.log("audio -> ", audio, "video -> ", video);

    setIsAudioCallOn(audio);
    setIsVideoCallOn(video);
    setCall(1); // Set call state to "calling"
  };

  useEffect(() => {
    // Handle call acceptance (answer received)
    socket.on(`call-accept:${currLoggedUser?.userName}`, async (answer) => {
      console.log(`call-accept -> `, answer);
      setCall(2);

      try {
        const signalingState = peerConnection.current.signalingState;

        // Check if the connection is in a state to accept the answer
        if (signalingState === "have-local-offer") {
          await peerConnection.current?.setRemoteDescription(
            new RTCSessionDescription(answer)
          );

          // Add any queued ICE candidates after setting the remote description
          if (pendingCandidates.current.length > 0) {
            for (const candidate of pendingCandidates.current) {
              await peerConnection.current.addIceCandidate(candidate);
            }
            pendingCandidates.current = []; // Clear the queue after adding
          }
        } else if (signalingState === "stable") {
          console.warn(
            "Already in stable state, skipping setRemoteDescription."
          );
        } else {
          console.error(
            "PeerConnection not in a valid state to accept answer",
            signalingState
          );
        }
      } catch (error) {
        console.error("Error setting remote description", error);
      }
    });

    // Handle call rejection
    socket.on(`call-reject:${currLoggedUser?.userName}`, (message) => {
      console.log("inside call-reject event -> ", message);
      if (message === false) handleEndCall();
    });

    return () => {
      socket.off(`call-accept:${currLoggedUser?.userName}`);
      socket.off(`call-reject:${currLoggedUser?.userName}`);
    };
  }, [chatState]);

  return {
    initiateCall,
  };
};

// reciever logic
const useWebRTCReciever = (
  webRTCBase: ReturnType<typeof useWebRTCBase>,
  currLoggedUser: UserInterface | null
) => {
  const {
    peerConnection,
    setIsAudioCallOn,
    setIsVideoCallOn,
    setLocalStream,
    setCall,
    localVideoRef,
  } = webRTCBase;
  const [callNotification, setCallNotification] = useState<{
    status: boolean;
    sender: string;
    offer: RTCSessionDescriptionInit | null;
    mediaType: { audio: boolean; video: boolean };
  }>({
    status: false,
    sender: "",
    offer: null,
    mediaType: { audio: false, video: false },
  });

  useEffect(() => {
    if (!currLoggedUser) return;

    socket.on(`call-req:${currLoggedUser?._id}`, (message) => {
      console.log(`call-req from ${currLoggedUser.userName} -> `, message);
      setCallNotification({
        status: true,
        sender: message.sender,
        offer: message.offer,
        mediaType: message.mediaType,
      });
    });

    return () => {
      socket.off(`call-req:${currLoggedUser?._id}`);
    };
  }, [currLoggedUser]);

  const acceptCall = async () => {
    const { offer, sender, mediaType } = callNotification;
    if (!offer) return;

    setCall(2);

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: mediaType.audio,
      video: mediaType.video,
    });
    stream
      .getTracks()
      .forEach((track) => peerConnection.current.addTrack(track, stream));
    setLocalStream(stream);

    console.log(`checking for audio track -> `, stream.getAudioTracks());

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    } else {
      console.log(
        `could not the set the stream to localVidoe -> `,
        localVideoRef
      );
    }

    await peerConnection.current?.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    const answer = await peerConnection.current?.createAnswer();
    await peerConnection.current?.setLocalDescription(answer);

    socket.emit("call-accept", { answer, sender });

    console.log("audio -> ", mediaType.audio, "video -> ", mediaType.video);

    setIsAudioCallOn(mediaType.audio);
    setIsVideoCallOn(mediaType.video);
    // setCall(2); // Call is active
    setCallNotification({
      // remove the call notification
      status: false,
      sender: "",
      offer: null,
      mediaType: { audio: false, video: false },
    });
  };

  const rejectCall = () => {
    socket.emit(`call-reject`, {
      sender: callNotification.sender,
      status: false,
    });
    setCallNotification({
      status: false,
      sender: "",
      offer: null,
      mediaType: { audio: false, video: false },
    });
  };

  return {
    callNotification,
    acceptCall,
    rejectCall,
  };
};

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
