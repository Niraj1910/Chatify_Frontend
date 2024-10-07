import {
  AllUserChatInterface,
  ChatInterface,
  MessageInterface,
} from "@/Interfaces/chatUserInterface";
import { socket } from "../socket";
import { useEffect, useRef, useState } from "react";
import { BASEURL } from "../../Constants";
import { UserInterface } from "../Interfaces/userInterface";
import useChatContext from "./useChatContext";

import { formatTheDate } from "@/utils/helpers";
import { useUserContext } from "@/Contexts/UserContext";

export const useChatMessages = ({
  currLoggedUser,
  conversationUsers,
}: {
  currLoggedUser: UserInterface | null;
  conversationUsers: UserInterface[] | null;
}) => {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setmessages] = useState<MessageInterface[] | null>(null);
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
          updatedAt: Date.now().toString(),
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

  const handleCreateChat = async (persons: UserInterface[] | null) => {
    if (!persons) return "";
    try {
      const resp = await fetch(`${BASEURL}/api/chat/new`, {
        body: JSON.stringify(persons),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await resp.json();
      console.log("result -> ", result);

      setAllChats([
        ...AllChats,
        {
          _id: result._id,
          createdAt: result.createdAt,
          isGroupChat: result.isGroupChat,
          lastMessage: null,
          participants: result.participants,
          updatedAt: result.updatedAt,
        },
      ]);
      return result._id;
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  const getChatId = async () => {
    console.log(`conversationUsers from getChatId() -> `, conversationUsers);

    let foundChat = AllChats.find((chat) => {
      return (
        chat.participants.length === conversationUsers?.length &&
        conversationUsers.every((user) =>
          chat.participants.some(
            (participant) => participant.userName === user.userName
          )
        )
      );
    })?._id;

    console.log(`foundChat -> `, foundChat);

    if (!foundChat) foundChat = await handleCreateChat(conversationUsers);

    if (!foundChat) {
      setConversationUsers([]);
      throw new Error("could not get the chatId from handleCreateChat");
    }

    return foundChat;
  };

  useEffect(() => {
    console.log("currLoggedUser -> ", currLoggedUser);

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

      const chatId = await getChatId();

      console.log("chatId -> ", chatId);

      if (chatId)
        try {
          const response = await fetch(`${BASEURL}/api/chat/${chatId}`, {
            credentials: "include",
          });

          if (!response.ok) {
            // delete the chatId from the AllChats array
            setAllChats((prevChat) =>
              prevChat.filter((chat) => chat._id !== chatId)
            );
            throw new Error("Could not fetch the chat messages");
          }

          const data = await response.json();
          const dbMessages: MessageInterface[] = [];
          data?.messages?.map((msg) => {
            dbMessages.push({
              chatID: data._id,
              message: msg.content,
              sender_avatar_url: msg.sender.avatar.url,
              sender_id: msg.sender._id,
              message_id: msg._id,
              updatedAt: formatTheDate(msg.updatedAt),
            });
          });
          setmessages(dbMessages);
          setChatState(data);
          console.log(`chatId in fetchChatMessages -> `, chatId);
          setActiveChatId(chatId);
        } catch (error) {
          console.log(error);
        }
    };
    fetchChatMessages();
  }, [currLoggedUser, conversationUsers, AllChats]);

  useEffect(() => {
    socket.on(`${chatState?._id}`, (msgDetails) => {
      if (!chatState) {
        console.log(`chatState is null`);
        return;
      }

      console.log("msgDetails from redis ", msgDetails);
      console.log(
        `comparion of chat id of state and server ${chatState?._id} === ${msgDetails.chatId}`
      );
      console.log(typeof chatState._id, " ", typeof msgDetails.chatId);

      if (msgDetails.chatId === chatState._id)
        setmessages((prev) => [
          ...(prev || []),
          {
            chatID: msgDetails.chatId,
            message: msgDetails.message,
            sender_avatar_url: msgDetails.sender_avatar_url,
            sender_id: msgDetails.sender._id,
            message_id: null,
            updatedAt: formatTheDate(msgDetails.updatedAt),
          },
        ]);
      setAllChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat._id === msgDetails.chatId) {
            return {
              ...chat,
              lastMessage: {
                content: msgDetails.message,
                createdAt: "1 min",
                _id: "XXXXXX",
                sender: msgDetails.sender,
              },
            };
          }
          return chat;
        });
      });
    });
    return () => {
      socket.off(`${chatState?._id}`);
    };
  }, [chatState]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return {
    handleSendMessage,
    chatContainerRef,
    messageInput,
    setMessageInput,
    messages,
    setmessages,
    chatState,
    setChatState,
    activeChatId,
    setActiveChatId,
  };
};
