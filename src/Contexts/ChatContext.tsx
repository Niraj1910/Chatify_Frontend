import { useUserContext } from "@/hooks/useUserContext";
import { AllUserChatInterface } from "@/Interfaces/chatUserInterface";
import { BASEURL } from "../../Constants";
import { createContext, ReactNode, useEffect, useState } from "react";
import { timeAgo } from "@/utils/helpers";

interface ChatContextInitial {
  AllChats: AllUserChatInterface[] | [];
  setAllChats: React.Dispatch<
    React.SetStateAction<AllUserChatInterface[] | []>
  >;
}

export const ChatContext = createContext<ChatContextInitial | null>(null);

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [AllChats, setAllChats] = useState<AllUserChatInterface[] | []>([]);

  const { currLoggedUser } = useUserContext();

  useEffect(() => {
    const fetchAlluserChats = async () => {
      if (!currLoggedUser) {
        console.log(`currLoggedUser is still null`);
        return;
      }
      try {
        const response = await fetch(
          `${BASEURL}/api/chat/user/${currLoggedUser._id}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        // data.lastMessage.createdAt = timeAgo(data.lastMessage.createdAt);
        console.log("from fetch data -> ", data);
        const chatsWithTimeAgo = data.map((chat: AllUserChatInterface) => {
          if (chat.lastMessage) {
            return {
              ...chat,
              lastMessage: {
                ...chat.lastMessage,
                createdAt: timeAgo(chat.lastMessage.createdAt),
              },
            };
          }
          return chat; // In case there's no lastMessage
        });
        setAllChats(chatsWithTimeAgo);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAlluserChats();
  }, [currLoggedUser]);

  return (
    <ChatContext.Provider value={{ AllChats, setAllChats }}>
      {children}
    </ChatContext.Provider>
  );
};
