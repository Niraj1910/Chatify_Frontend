import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { IoIosSend } from "react-icons/io";
import InitialChatView from "./InitialChatView";
import { useUserContext } from "@/Contexts/UserContext";
import MessageNavbar from "./MessageNavbar";
import MessagesCard from "./MessagesCard";
import { useChatMessages } from "@/hooks/useChatMessages";

const Messages = ({ handleOpenPopup }: { handleOpenPopup: () => void }) => {
  const { currLoggedUser, conversationUsers } = useUserContext();

  const {
    chatContainerRef,
    chatState,
    messages,
    messageInput,
    setMessageInput,
    handleSendMessage,
  } = useChatMessages({ currLoggedUser, conversationUsers });

  console.log("conversationUsers -> ", conversationUsers);
  // console.log("messages => ", messages);
  console.log(`chatState -> `, chatState);

  return (
    <>
      {!conversationUsers || !conversationUsers.length ? (
        <InitialChatView handleOpenPopup={handleOpenPopup} />
      ) : (
        <main className="w-[70%] bg-slate-950 h-full flex flex-col justify-between">
          <MessageNavbar
            conversationUsers={conversationUsers}
            isGroupChat={chatState?.isGroupChat}
          />
          {messages?.length ? (
            <div
              ref={chatContainerRef}
              className="flex flex-col justify-start p-10 h-full gap-10 overflow-y-scroll my-7 scrollbar-hide"
            >
              {messages.map((item, index) => (
                <MessagesCard
                  chat={item}
                  currLoggedUser={currLoggedUser}
                  key={index}
                  date={
                    index === 0
                      ? item.updatedAt.slice(0, item.updatedAt.length - 5)
                      : messages[index - 1].updatedAt.slice(
                          0,
                          item.updatedAt.length - 5
                        ) === item.updatedAt.slice(0, item.updatedAt.length - 5)
                      ? ""
                      : item.updatedAt.slice(0, item.updatedAt.length - 5)
                  }
                  time={item.updatedAt.slice(item.updatedAt.length - 5)}
                />
              ))}
            </div>
          ) : null}
          <div className="flex p-10 pt-1 gap-6 ">
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
