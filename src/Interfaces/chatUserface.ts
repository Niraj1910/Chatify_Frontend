import { UserInterface } from "./userInterface";

export type MessageInterface = {
  message: string;
  sender_avatar_url: string;
  sender_id: string;
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
