import logo from "/logo.svg";

interface MessagesInterface {
  handleOpenPopup: () => void;
  isSmallScreen: boolean;
}

const InitialChatView: React.FC<MessagesInterface> = ({
  handleOpenPopup,
  isSmallScreen,
}) => {
  return (
    <main
      className={`${
        isSmallScreen
          ? "hidden"
          : "w-[70%] bg-slate-950 h-full p-10 flex flex-col justify-center items-center"
      }`}
    >
      <section>
        <div className="text-lg flex flex-col gap-4">
          <img
            src={logo}
            alt="img"
            className="bg-white rounded-full w-40 h-40 mx-auto"
          />
          <h1 className="text-center text-2xl font-semibold">Your messages</h1>
          <p>Send a message to start a chat.</p>
          <button
            onClick={() => handleOpenPopup()}
            className="mt-4 w-full py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xl hover:bg-indigo-700 transition rounded-xl"
          >
            Send message
          </button>
        </div>
      </section>
    </main>
  );
};

export default InitialChatView;
