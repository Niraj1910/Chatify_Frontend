import { Button } from "./ui/button";
import { Input } from "./ui/input";
import catLogo from "/cat.jpg";

import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { IoVideocamOutline, IoVideocamOffOutline } from "react-icons/io5";

import { IoIosSend } from "react-icons/io";
import { useState } from "react";
import { useUserContext } from "@/Contexts/UserContext";
import InitialChatView from "./InitialChatView";

const messages = [
  {
    message: "ehfnca;wkdcmnaefdc",
  },
  {
    message:
      "ehfnca;wkdcmnaefdc oaywdgbcalwknj97248ygaoducvk sJKLWYRgfuocVHKSN<",
  },
  {
    message:
      "ehfnca;wkdcmnaefdc oaywdgbcalwknj97248ygaoducvk sJKLWYRgfuocVHKSN< 90786987207uehdnxbajochfwavch bsAKJBJBJBKc ashn",
  },
  {
    message: "ehfnca;wkdcmnaefdc o",
  },
  {
    message: "ehfnca;wkdcmnaefdc",
  },
  {
    message:
      "ehfnca;wkdcmnaefdc oaywdgbcalwknj97248ygaoducvk sJKLWYRgfuocVHKSN<",
  },
  {
    message:
      "ehfnca;wkdcmnaefdc oaywdgbcalwknj97248ygaoducvk sJKLWYRgfuocVHKSN< 90786987207uehdnxbajochfwavch bsAKJBJBJBKc ashn",
  },
  {
    message: "ehfnca;wkdcmnaefdc o",
  },
];

interface MessagesInterface {
  handleOpenPopup: () => void;
}

const Messages: React.FC<MessagesInterface> = ({ handleOpenPopup }) => {
  const [isAudioCallOn, setIsAudioCallOn] = useState(false);
  const [isVideoCallOn, setIsVideoCallOn] = useState(false);
  const { conversationUsers } = useUserContext();

  const handleAudioCall = () => {
    setIsAudioCallOn(!isAudioCallOn);
  };
  const handleVideoCall = () => {
    setIsVideoCallOn(!isVideoCallOn);
  };

  console.log("conversationUsers -> ", conversationUsers);

  return (
    <>
      {!conversationUsers || !conversationUsers.length ? (
        <InitialChatView handleOpenPopup={handleOpenPopup} />
      ) : (
        <main className="w-[70%] bg-slate-950 h-full p-10 flex flex-col justify-between">
          <nav className="flex justify-between items-center pb-8 h-20 border-gray-400 border-b-[1px]">
            <div className="flex gap-4 items-center">
              <img src={catLogo} alt="img" className="w-16 h-16 rounded-full" />
              <div>
                <h1>John Doe</h1>
                <p>Active now</p>
              </div>
            </div>

            <div className="flex gap-5">
              {/* Audio and Video Call Icons */}
              {isAudioCallOn ? (
                <AiOutlineAudioMuted
                  onClick={handleAudioCall}
                  className="w-10 h-7 cursor-pointer"
                />
              ) : (
                <AiOutlineAudio
                  onClick={handleAudioCall}
                  className="w-10 h-7 cursor-pointer"
                />
              )}

              {isVideoCallOn ? (
                <IoVideocamOffOutline
                  onClick={handleVideoCall}
                  className="w-10 h-7 cursor-pointer"
                />
              ) : (
                <IoVideocamOutline
                  onClick={handleVideoCall}
                  className="w-10 h-7 cursor-pointer"
                />
              )}
            </div>
          </nav>
          <div className="flex flex-col gap-10 overflow-y-scroll my-7 scrollbar-hide">
            {messages.map((text, index) =>
              index % 2 === 0 ? (
                <div key={index}>
                  <div className="bg-purple-500 rounded-xl p-5 relative w-[40%] ">
                    <p>{text.message}</p>
                    <img
                      src={catLogo}
                      alt="img"
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                </div>
              ) : (
                <div key={index} className="flex w-full justify-end">
                  <div className="bg-indigo-500 rounded-xl p-5 relative w-[40%]">
                    <p>{text.message}</p>
                    <img
                      src={catLogo}
                      alt="img"
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                </div>
              )
            )}
          </div>
          <div className="flex gap-6 h-14">
            <Input
              type="text"
              placeholder="Type your message..."
              className="ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0 text-xl text-slate-200 placeholder-slate-300 rounded-lg bg-zinc-500 py-5 px-5 h-full"
            />
            <Button className="rounded-lg text-white bg-pink-500 hover:bg-pink-800 text-lg h-full w-20">
              <IoIosSend className="w-10 h-10" />
            </Button>
          </div>
        </main>
      )}
    </>
  );
};

export default Messages;
