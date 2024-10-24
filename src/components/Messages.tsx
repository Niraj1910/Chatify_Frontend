import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { IoIosSend } from "react-icons/io";
import InitialChatView from "./InitialChatView";
import { useUserContext } from "@/Contexts/UserContext";
import MessageNavbar from "./MessageNavbar";
import MessagesCard from "./MessagesCard";
import { useChatMessages } from "@/hooks/useChatMessages";
import { getChatDate } from "@/utils/helpers";
import { useState } from "react";
import { RiRefreshLine } from "react-icons/ri";

const Messages = ({
  handleOpenPopup,
  isSmallScreen,
  showUsersForSmallDevices,
  setshowUsersForSmallDevices,
}: {
  handleOpenPopup: () => void;
  isSmallScreen: boolean;
  showUsersForSmallDevices: boolean;
  setshowUsersForSmallDevices: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { currLoggedUser, conversationUsers } = useUserContext();

  const {
    chatContainerRef,
    chatState,
    messages,
    messageInput,
    setMessageInput,
    handleSendMessage,
    isLoading,
  } = useChatMessages({ currLoggedUser, conversationUsers });

  console.log("conversationUsers -> ", conversationUsers);
  console.log("messages => ", messages);
  console.log(`chatState -> `, chatState);

  return (
    <>
      {!conversationUsers || !conversationUsers.length ? (
        <InitialChatView
          handleOpenPopup={handleOpenPopup}
          isSmallScreen={isSmallScreen}
        />
      ) : (
        <main
          className={`${
            isSmallScreen
              ? !showUsersForSmallDevices
                ? "w-[0%]"
                : "w-full"
              : "w-[70%]"
          }  bg-slate-950 h-full flex flex-col justify-between`}
        >
          <MessageNavbar
            conversationUsers={conversationUsers}
            showUsersForSmallDevices={showUsersForSmallDevices}
            setshowUsersForSmallDevices={setshowUsersForSmallDevices}
            isGroupChat={chatState?.isGroupChat}
            isSmallScreen={isSmallScreen}
          />

          {/* loading messages */}
          {isLoading ? (
            <div className="flex justify-center items-center h-screen w-full">
              <RiRefreshLine className="text-6xl text-blue-500 animate-spin" />
            </div>
          ) : null}

          {/* {messages?.length ? ( */}
          {showUsersForSmallDevices && messages?.length ? (
            <div
              ref={chatContainerRef}
              className={`flex flex-col justify-start h-full gap-10 overflow-y-scroll mb-7 mt-1 scrollbar-hide ${
                isSmallScreen ? "px-1" : "px-10"
              }`}
            >
              {messages.map((item, index) => (
                <MessagesCard
                  chat={item}
                  currLoggedUser={currLoggedUser}
                  key={index}
                  date={getChatDate(item, index, messages)}
                  time={item.updatedAt.slice(item.updatedAt.length - 5)}
                />
              ))}
            </div>
          ) : null}
          {!showUsersForSmallDevices ? null : (
            <div
              className={`flex px-10 pt-1 pb-6 gap-6 ${
                isSmallScreen && "px-2"
              }`}
            >
              <Input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className={`ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0 text-xl text-slate-200 placeholder-slate-300 rounded-lg bg-zinc-500 py-5 px-5 h-full ${
                  isSmallScreen && "py-1"
                }`}
              />
              <Button
                onClick={handleSendMessage}
                className="rounded-lg text-white bg-pink-500 hover:bg-pink-800 text-lg h-full w-20"
              >
                <IoIosSend className="w-10 h-10" />
              </Button>
            </div>
          )}
        </main>
      )}
    </>
  );
};

export default Messages;
