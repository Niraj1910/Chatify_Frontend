import { FaChevronDown, FaPenToSquare } from "react-icons/fa6";
import { useUserContext } from "../hooks/useUserContext";
import { IoSearch } from "react-icons/io5";
import { Input } from "./ui/input";

const UserHeader = ({
  handleOpenPopup,
  searchQuery,
  setSearchQuery,
}: {
  handleOpenPopup: () => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { currLoggedUser, setShowLogout, showLogout } = useUserContext();

  return (
    <div className="flex flex-col items-start justify-between px-4 h-[8%] gap-8 my-20">
      <div className="flex justify-between w-full items-center font-bold text-xl">
        {currLoggedUser && (
          <>
            <div
              onClick={() => setShowLogout(!showLogout)}
              className="flex items-center gap-3 cursor-pointer "
            >
              <img
                src={currLoggedUser.avatar.url}
                alt="img"
                className={`w-14 h-14 rounded-full `}
              />

              <span>{currLoggedUser.userName}</span>
              <FaChevronDown />
            </div>
            <FaPenToSquare
              onClick={() => handleOpenPopup()}
              className="cursor-pointer w-6 h-6"
            />
          </>
        )}
      </div>

      <div className="flex items-center w-full gap-5">
        <IoSearch className="absolute w-10 h-7  text-slate-200" />
        <Input
          aria-placeholder="search here"
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0 text-xl text-slate-200 placeholder-slate-300 rounded-full bg-zinc-500 py-5 pl-10"
        />
      </div>
    </div>
  );
};

export default UserHeader;
