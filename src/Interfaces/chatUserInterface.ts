import { UserInterface } from "./userInterface";

export type MessageInterface = {
  chatID: string;
  message: string;
  sender_avatar_url: string;
  sender_id: string;
  updatedAt: string;
  message_id: string | null;
};

export type ChatInterface = {
  _id: string;
  participants: UserInterface[];
  messages: MessageInterface[];
  isGroupChat: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ChatStateType = {
  _id: string;
  participants: string[];
  messages: MessageInterface[];
  isGroupChat: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ChatCreationResponse = {
  _id: string;
  createdAt: string;
  isGroupChat: boolean;
  participants: UserInterface[];
  updatedAt: string;
};

export type ChatMessagesResponse = {
  _id: string;
  participants: string[];
  messages: {
    _id: string;
    content: string;
    sender: { _id: string; avatar: { url: string } };
    updatedAt: string;
  }[];
  isGroupChat: boolean;
  createdAt: string;
  updatedAt: string;
};
// type User = {
//   avatar: { url: string; public_id: string };
//   userName: string;
//   _id: string;
// };

export type LastMessageInterface = {
  content: string;
  createdAt: string;
  _id: string;
  sender: UserInterface;
};

export type AllUserChatInterface = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  isGroupChat: boolean;
  lastMessage: LastMessageInterface | null;
  participants: UserInterface[];
};
