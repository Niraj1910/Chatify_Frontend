import {
  ChatCreationResponse,
  ChatMessagesResponse,
} from "@/Interfaces/chatUserInterface";
import { UserInterface } from "@/Interfaces/userInterface";
import { BASEURL } from "../../Constants";

const createNewChat = async (
  persons: UserInterface[] | null
): Promise<ChatCreationResponse | null> => {
  if (!persons) return null;

  try {
    const resp = await fetch(`${BASEURL}/api/chat/new`, {
      body: JSON.stringify(persons),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return await resp.json();
  } catch (error) {
    console.error("Error creating new chat:", error);
    return null;
  }
};

const fetchChatById = async (
  chatId: string
): Promise<ChatMessagesResponse | null> => {
  try {
    const response = await fetch(`${BASEURL}/api/chat/${chatId}`, {
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to fetch chat messages");

    return await response.json();
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return null;
  }
};

export { createNewChat, fetchChatById };
