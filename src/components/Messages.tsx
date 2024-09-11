import { Button } from "./ui/button";
import { Input } from "./ui/input";
import catLogo from "/cat.jpg";

import { IoIosSend } from "react-icons/io";
import { useEffect, useRef, useState } from "react";

import InitialChatView from "./InitialChatView";
import { socket } from "../socket";
import { useUserContext } from "../hooks/useUserContext";
import MessageNavbar from "./MessageNavbar";

import MessagesCard from "./MessagesCard";
import { BASEURL } from "../../Constants";
import { ChatInterface, MessageInterface } from "../Interfaces/chatUserface";

interface MessagesProps {
  handleOpenPopup: () => void;
}

const Messages: React.FC<MessagesProps> = ({ handleOpenPopup }) => {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setmessages] = useState<MessageInterface[] | null>(null);
  const [chatState, setChatState] = useState<ChatInterface | null>(null);

  const { currLoggedUser, conversationUsers } = useUserContext();

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = () => {
    if (currLoggedUser && conversationUsers)
      socket.emit(
        "chat-msg",
        {
          chatId: chatState?._id,
          chat_users: [currLoggedUser._id, conversationUsers[0]._id],
          message: messageInput,
          sender_id: currLoggedUser._id,
          sender_avatar_url: currLoggedUser.avatar.url,
        },
        (response: { success: boolean; message_id: string }) => {
          if (response.success) {
          }
        }
      );

    setMessageInput("");
  };

  useEffect(() => {
    socket.on("chat-msg", (msgDetails) => {
      console.log("Received message: ", msgDetails);

      setmessages((prev) => [
        ...(prev || []),
        {
          message: msgDetails.message,
          sender_avatar_url: msgDetails.sender_avatar_url,
          sender_id: msgDetails.sender_id,
          message_id: null,
        },
      ]);
    });
    return () => {
      socket.off("chat-msg");
    };
  }, []);

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!currLoggedUser || !conversationUsers) return;
      setmessages([]);
      setChatState(null);
      try {
        const response = await fetch(
          `${BASEURL}/api/chat/${currLoggedUser._id}/${conversationUsers[0]._id}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Could not fetch the chat messages");
        }

        const data = await response.json();
        const dbMessages: MessageInterface[] = [];
        data.messages.map((msg) => {
          dbMessages.push({
            message: msg.content,
            sender_avatar_url: msg.sender.avatar.url,
            sender_id: msg.sender._id,
            message_id: msg._id,
          });
        });
        setmessages(dbMessages);
        setChatState(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchChatMessages();
  }, [currLoggedUser, conversationUsers]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  console.log("conversationUsers -> ", conversationUsers);
  console.log("messages => ", messages);

  return (
    <>
      {!conversationUsers || !conversationUsers.length ? (
        <InitialChatView handleOpenPopup={handleOpenPopup} />
      ) : (
        <main className="w-[70%] bg-slate-950 h-full p-10 flex flex-col justify-between">
          <MessageNavbar conversationUsers={conversationUsers} />
          {messages?.length ? (
            <div
              ref={chatContainerRef}
              className="flex flex-col justify-start  h-full gap-10 overflow-y-scroll my-7 scrollbar-hide"
            >
              {messages.map((item, index) => (
                <MessagesCard
                  chat={item}
                  currLoggedUser={currLoggedUser}
                  key={index}
                />
              ))}
            </div>
          ) : null}
          <div className="flex gap-6 h-14">
            <Input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
              className="ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0 text-xl text-slate-200 placeholder-slate-300 rounded-lg bg-zinc-500 py-5 px-5 h-full"
            />
            <Button
              onClick={handleSendMessage}
              className="rounded-lg text-white bg-pink-500 hover:bg-pink-800 text-lg h-full w-20"
            >
              <IoIosSend className="w-10 h-10" />
            </Button>
          </div>
        </main>
      )}
    </>
  );
};

export default Messages;
