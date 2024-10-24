import { UserInterface } from "@/Interfaces/userInterface";
import { useWebRTCBase } from "./useWebRTCBase";
import { useEffect, useState } from "react";
import { socket } from "@/socket";

export const useWebRTCReciever = (
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
    setLocalVideoIsOn,
    setRemoteVideoIsOn,
    setlocalUserDp,
    setremoteUserDp,
  } = webRTCBase;
  const [callNotification, setCallNotification] = useState<{
    status: boolean;
    sender: string;
    offer: RTCSessionDescriptionInit | null;
    mediaType: { audio: boolean; video: boolean };
    avatar_url: string;
  }>({
    status: false,
    sender: "",
    offer: null,
    mediaType: { audio: false, video: false },
    avatar_url: "",
  });

  useEffect(() => {
    if (!currLoggedUser) return;

    socket.on(`call-req:${currLoggedUser?._id}`, (message) => {
      console.log(`call-req from ${currLoggedUser.userName} -> `, message);
      setCallNotification({
        status: true,
        sender: message.sender,
        avatar_url: message.avatar_url,
        offer: message.offer,
        mediaType: message.mediaType,
      });
    });

    return () => {
      socket.off(`call-req:${currLoggedUser?._id}`);
    };
  }, [currLoggedUser]);

  const acceptCall = async () => {
    const { offer, sender, avatar_url, mediaType } = callNotification;
    if (!offer) return;

    console.log("callNotification -> ", callNotification);

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

    socket.emit("call-accept", {
      answer,
      sender,
      avatar_url: currLoggedUser?.avatar.url,
    });

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
      avatar_url: "",
    });
    if (currLoggedUser) setlocalUserDp(currLoggedUser?.avatar.url);
    setremoteUserDp(avatar_url);
    setLocalVideoIsOn(mediaType.video);
    setRemoteVideoIsOn(mediaType.video);
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
      avatar_url: "",
    });
  };

  return {
    callNotification,
    acceptCall,
    rejectCall,
  };
};
