import { UserInterface } from "@/Interfaces/userInterface";
import { useWebRTCBase } from "./useWebRTCBase";
import { ChatStateType } from "@/Interfaces/chatUserInterface";
import { socket } from "@/socket";
import { getFriendID } from "@/utils/helpers";
import { useCallback, useEffect } from "react";

export const useWebRTCCaller = (
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
    setLocalVideoIsOn,
    setRemoteVideoIsOn,
    setlocalUserDp,
    setremoteUserDp,
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
      localVideoRef.current.srcObject.getAudioTracks()[0].enabled = true;
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
        avatar_url: currLoggedUser.avatar.url,
        reciever: getFriendID(chatState.participants, currLoggedUser?._id),
        mediaType: { audio, video },
      });
    }

    console.log("audio -> ", audio, "video -> ", video);

    setIsAudioCallOn(audio);
    setIsVideoCallOn(video);
    setCall(1); // Set call state to "calling"
    setLocalVideoIsOn(video);
    setRemoteVideoIsOn(video);
  };

  const handleAcceptCall = useCallback(
    async (data: { answer: RTCSessionDescription; avatar_url: string }) => {
      console.log(`call-accept -> `, data);
      console.log("avatar_url -> ", data);
      setCall(2);

      const { answer, avatar_url } = data;

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

          if (currLoggedUser) setlocalUserDp(currLoggedUser.avatar.url);
          setremoteUserDp(avatar_url);
          setremoteUserDp;
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
    },
    [currLoggedUser]
  );

  useEffect(() => {
    // Handle call acceptance (answer received)
    socket.on(`call-accept:${currLoggedUser?.userName}`, handleAcceptCall);

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
