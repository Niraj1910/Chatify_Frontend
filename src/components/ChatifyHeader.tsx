import logo from "/logo.svg";

const ChatifyHeader = () => {
  return (
    <div className="bg-slate-800 h-[13%] flex justify-start pl-4 items-center gap-1">
      <img src={logo} alt="img" className="bg-white rounded-full w-20 h-20" />
      <h1 className="text-5xl font-bold ">Chatify</h1>
    </div>
  );
};

export default ChatifyHeader;
