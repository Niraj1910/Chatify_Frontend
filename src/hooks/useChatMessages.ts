import {
  AllUserChatInterface,
  MessageInterface,
} from "@/Interfaces/chatUserInterface";
import { socket } from "../socket";
import { useCallback, useEffect, useRef, useState } from "react";
import { UserInterface } from "../Interfaces/userInterface";
import useChatContext from "./useChatContext";

import { formatTheDate, getChatId, updateAllChats } from "@/utils/helpers";
import { useUserContext } from "@/Contexts/UserContext";
import { fetchChatById } from "@/Services/chatMessagesAPI";

export const useChatMessages = ({
  currLoggedUser,
  conversationUsers,
}: {
  currLoggedUser: UserInterface | null;
  conversationUsers: UserInterface[] | null;
}) => {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setmessages] = useState<MessageInterface[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatState, setChatState] = useState<{
    _id: string;
    participants: string[];
    messages: MessageInterface[];
    isGroupChat: boolean;
    createdAt: string;
    updatedAt: string;
  } | null>(null);
  const [activeChatId, setActiveChatId] = useState("");

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const { setConversationUsers } = useUserContext();
  const { AllChats, setAllChats } = useChatContext();

  const handleSendMessage = () => {
    if (currLoggedUser && conversationUsers && messageInput.trim().length)
      socket.emit(
        "chat-message",
        {
          chatId: chatState?._id,
          message: messageInput,
          sender: currLoggedUser,
          sender_avatar_url: currLoggedUser.avatar.url,
          updatedAt: Date.now(),
        },
        (response: { success: boolean; message_id: string | null }) => {
          // if (response.success) {
          //   setMes;
          // }
          console.log("response from handleSendMessage -> ", response);
        }
      );

    setMessageInput("");
  };

  const fetchChatMessages = async () => {
    if (!conversationUsers?.length) return;
    console.log(
      "conversationUsers from fetchChatMessages -> ",
      conversationUsers
    );
    console.log("AllChats from fetchChatMessages -> ", AllChats);
    setmessages([]);
    setChatState(null);
    setActiveChatId("");
    setIsLoading(true);

    const chatId = await getChatId(
      AllChats,
      conversationUsers,
      setConversationUsers,
      setAllChats
    );

    console.log("chatId -> ", chatId);

    if (!chatId) return;

    const data = await fetchChatById(chatId);
    if (!data) {
      setAllChats((prev) => prev.filter((chat) => chat._id !== chatId));
      return;
    }

    const dbMessages = data.messages.map((msg) => ({
      chatID: data._id,
      message: msg.content,
      sender_avatar_url: msg.sender.avatar.url,
      sender_id: msg.sender._id,
      message_id: msg._id,
      updatedAt: formatTheDate(msg.updatedAt),
    }));
    setmessages(dbMessages);
    setChatState({
      _id: data._id,
      createdAt: data.createdAt,
      isGroupChat: data.isGroupChat,
      messages: dbMessages,
      participants: data.participants,
      updatedAt: data.updatedAt,
    });
    console.log(`chatId in fetchChatMessages -> `, chatId);
    setActiveChatId(chatId);
    setIsLoading(false);
  };

  useEffect(() => {
    console.log("currLoggedUser -> ", currLoggedUser);

    fetchChatMessages();
  }, [currLoggedUser, conversationUsers]);

  const handleNewMessages = useCallback(
    (msgDetails: {
      chatId: string;
      message: string;
      sender_avatar_url: string;
      sender: { _id: string };
      updatedAt: string;
    }) => {
      updateAllChats(msgDetails, setAllChats);

      if (!chatState?._id) {
        console.log(`chatState is null`);
        return;
      }
      console.log("msgDetails from redis ", msgDetails);
      console.log(
        `comparion of chat id of state and server ${chatState?._id} === ${msgDetails.chatId}`
      );
      console.log(typeof chatState._id, " ", typeof msgDetails.chatId);

      if (String(msgDetails.chatId).trim() === String(chatState._id).trim()) {
        console.log("IDs match, updating messages");
        setmessages((prevMessages) => {
          console.log("Previous messages: ", prevMessages);
          const newMessage = {
            chatID: msgDetails.chatId,
            message: msgDetails.message,
            sender_avatar_url: msgDetails.sender_avatar_url,
            sender_id: msgDetails.sender._id,
            message_id: null,
            updatedAt: formatTheDate(msgDetails.updatedAt),
          };
          console.log("New message: ", newMessage);

          return [...(prevMessages || []), newMessage];
        });
      }
    },
    [chatState?._id, setAllChats]
  );

  useEffect(() => {
    if (!chatState?._id) {
      console.log(`chatState is null`);
      return;
    }

    const channel = chatState._id;
    socket.on(channel, handleNewMessages);
    return () => {
      socket.off(channel);
    };
  }, [chatState?._id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return {
    handleSendMessage,
    handleNewMessages,
    chatContainerRef,
    messageInput,
    setMessageInput,
    messages,
    setmessages,
    chatState,
    setChatState,
    activeChatId,
    setActiveChatId,
    isLoading,
  };
};
