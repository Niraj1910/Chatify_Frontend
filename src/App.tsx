import Chat from "./components/Chat";
import { UserContextProvider } from "./Contexts/UserContext";

const App = () => {
  return (
    <main className="bg-slate-900 w-screen h-screen">
      <UserContextProvider>
        <Chat />
      </UserContextProvider>
    </main>
  );
};

export default App;
