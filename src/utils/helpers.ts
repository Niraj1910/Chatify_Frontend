import {
  AllUserChatInterface,
  ChatStateType,
  MessageInterface,
} from "@/Interfaces/chatUserInterface";
import { UserInterface } from "@/Interfaces/userInterface";
import { createNewChat } from "@/Services/chatMessagesAPI";

const extractUserNames = (
  conversationUsers: UserInterface[],
  currLoggedUser: UserInterface | null
) => {
  const getDisplayedUserNames = (
    friends: UserInterface[],
    maxNames: number
  ) => {
    const namesToShow = friends?.slice(0, maxNames)?.map((friend) => {
      if (friend.userName === currLoggedUser?.userName) return "You";
      return friend.userName;
    });
    const remainingCount = friends?.length - maxNames;
    return remainingCount > 0
      ? [...namesToShow, `+${remainingCount}`]
      : namesToShow;
  };

  // Limit of usernames to show based on width (adjust as needed)
  let userNames = "";
  // if (conversationUsers && conversationUsers.length)
  userNames =
    conversationUsers?.length === 2
      ? conversationUsers[0]?.userName === currLoggedUser?.userName
        ? conversationUsers[1]?.userName
        : conversationUsers[0]?.userName
      : getDisplayedUserNames(conversationUsers, 3)?.join(" , ");

  return userNames;
};

const timeAgo = (isoDateString: string) => {
  const now = new Date().getTime(); // Get current time in milliseconds
  const past = new Date(isoDateString).getTime(); // Convert ISO date string to milliseconds

  const diffInMs = now - past; // Difference in milliseconds
  const diffInSeconds = Math.floor(diffInMs / 1000); // Convert to seconds
  const diffInMinutes = Math.floor(diffInSeconds / 60); // Convert to minutes
  const diffInHours = Math.floor(diffInMinutes / 60); // Convert to hours
  const diffInDays = Math.floor(diffInHours / 24); // Convert to days

  if (diffInSeconds < 60) {
    return `${diffInSeconds} sec`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hr`;
  } else {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""}`;
  }
};

const formatTheDate = (dateString: string) => {
  // console.log(`formatTheDate -> `, dateString);

  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0"); // Get day
  const month = date.toLocaleString("default", { month: "long" }); // Get short month name
  const year = String(date.getFullYear()).slice(-4); // Get last two digits of year

  const hours = String(date.getHours()).padStart(2, "0"); // Get hours
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Get minutes
  const finalDate = `${day} ${month} ${year} ${hours}:${minutes}`;
  // console.log("finalDate -> ", finalDate);
  return finalDate;
};

const getFriendID = (arr: string[] | undefined, friend: string | undefined) => {
  if (!arr || !friend) return "";
  return (arr[0] === friend ? arr[1] : arr[0]).toString();
};

const closeTheMedia = (
  localVideoRef: React.MutableRefObject<HTMLVideoElement | null>,
  remoteVideoRef: React.MutableRefObject<HTMLVideoElement | null>
) => {
  if (localVideoRef.current && localVideoRef.current.srcObject) {
    const stream = localVideoRef.current.srcObject as MediaStream;
    stream.getTracks().forEach((track) => track.stop());
    localVideoRef.current.srcObject = null;
  }
  if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
    const stream = remoteVideoRef.current.srcObject as MediaStream;
    stream.getTracks().forEach((track) => track.stop());
    remoteVideoRef.current.srcObject = null;
  }
};

const videoTracks = (
  video: React.MutableRefObject<HTMLVideoElement | null>
) => {
  if (video.current && video.current.srcObject) {
    const stream = video.current.srcObject as MediaStream;
    return stream.getVideoTracks().length > 0;
  }
  return false;
};

const getVideoAndDPInfo = (
  remoteVideoRef: React.MutableRefObject<HTMLVideoElement | null>,
  localVideoRef: React.MutableRefObject<HTMLVideoElement | null>,
  conversationUsers: UserInterface[] | null,
  currLoggedUser: UserInterface | null,
  chatState: ChatStateType | null
) => {
  const data = {
    remoteVideo: videoTracks(remoteVideoRef),
    localVideo: videoTracks(localVideoRef),
    remoteUserDP: "",
    localUserDP: "",
  };

  const remoteUserID = getFriendID(
    chatState?.participants,
    currLoggedUser?._id
  );

  if (conversationUsers) {
    if (conversationUsers[0]._id === remoteUserID) {
      data.remoteUserDP = conversationUsers[0].avatar.url;
      data.localUserDP = conversationUsers[1].avatar.url;
    } else {
      data.localUserDP = conversationUsers[0].avatar.url;
      data.remoteUserDP = conversationUsers[1].avatar.url;
    }
  }

  return data;
};

const getChatDate = (
  chat: MessageInterface,
  index: number,
  messages: MessageInterface[]
) => {
  return index === 0
    ? chat.updatedAt.slice(0, chat.updatedAt.length - 5)
    : messages[index - 1].updatedAt.slice(0, chat.updatedAt.length - 5) ===
      chat.updatedAt.slice(0, chat.updatedAt.length - 5)
    ? ""
    : chat.updatedAt.slice(0, chat.updatedAt.length - 5);
};

const getChatId = async (
  AllChats: [] | AllUserChatInterface[],
  conversationUsers: UserInterface[] | null,
  setConversationUsers: (
    value: React.SetStateAction<UserInterface[] | null>
  ) => void,
  setAllChats: (
    value: React.SetStateAction<[] | AllUserChatInterface[]>
  ) => void
) => {
  const foundChat = AllChats.find(
    (chat) =>
      chat.participants.length === conversationUsers?.length &&
      conversationUsers.every((user) =>
        chat.participants.some(
          (participant) => participant.userName === user.userName
        )
      )
  )?._id;

  if (foundChat) return foundChat;

  const newChat = await createNewChat(conversationUsers);
  if (!newChat) {
    setConversationUsers([]);
    throw new Error("Could not get the chatId from handleCreateChat");
  }

  setAllChats((prev) => [
    ...prev,
    {
      _id: newChat._id,
      createdAt: newChat.createdAt,
      isGroupChat: newChat.isGroupChat,
      lastMessage: null,
      participants: newChat.participants,
      updatedAt: newChat.updatedAt,
    },
  ]);
  return newChat._id;
};

const updateAllChats = (
  msgDetails: {
    chatId: string;
    message: string;
    sender_avatar_url: string;
    sender: { _id: string };
    updatedAt: string;
  },
  setAllChats: (
    value: React.SetStateAction<[] | AllUserChatInterface[]>
  ) => void
) => {
  setAllChats((prevChats) => {
    const updatedChats = prevChats.map((chat) => {
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
    }) as AllUserChatInterface[];

    const updatedChat = updatedChats.find(
      (chat) => chat._id === msgDetails.chatId
    );
    if (!updatedChat) return updatedChats;

    const remainingChats = updatedChats.filter(
      (chat) => chat._id !== msgDetails.chatId
    );

    return [updatedChat, ...remainingChats];
  });
};

export {
  getVideoAndDPInfo,
  timeAgo,
  extractUserNames,
  formatTheDate,
  getFriendID,
  closeTheMedia,
  getChatDate,
  getChatId,
  updateAllChats,
};
