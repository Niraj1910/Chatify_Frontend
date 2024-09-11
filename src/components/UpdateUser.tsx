import { Input } from "./ui/input";
import { useRef, useState } from "react";

import { AiOutlineClose } from "react-icons/ai"; // Import the close icon

import { BASEURL, UPDATE } from "../../Constants";
import { toast } from "../hooks/use-toast";
import ProfilePicture from "./ProfilePicture";
import { useUserContext } from "../hooks/useUserContext";

interface UpdateUserInterface {
  handleCloseLogoutPopUp: () => void;
}

const UpdateUser: React.FC<UpdateUserInterface> = ({
  handleCloseLogoutPopUp,
}) => {
  const { currLoggedUser } = useUserContext();

  const [userNameInput, setUserNameInput] = useState(currLoggedUser?.userName);
  const [emailInput, setEmailInput] = useState(currLoggedUser?.email);
  const [imagePreview, setImagePreview] = useState(currLoggedUser?.avatar.url);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOnChangeValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "userName") setUserNameInput(value);
    if (name === "email") setEmailInput(value);
  };

  const canUpdate = () =>
    userNameInput === currLoggedUser?.userName &&
    emailInput === currLoggedUser?.email &&
    imagePreview === `${currLoggedUser?.avatar.url}`;

  const handleUpdate = async () => {
    const formData = new FormData();

    if (fileInputRef.current?.files?.[0]) {
      formData.append("avatar", fileInputRef.current.files[0]); // Append the file to the form data
    }

    formData.append("userName", userNameInput || "");
    formData.append("email", emailInput || "");

    try {
      const response = await fetch(
        `${BASEURL}/api/${UPDATE}/${currLoggedUser?._id}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Could not update the user",
        });
      }

      const result = await response.json();
      console.log("result -> ", result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button
        onClick={handleCloseLogoutPopUp}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
      >
        <AiOutlineClose className="w-6 h-6" />
      </button>
      <ProfilePicture
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        fileInputRef={fileInputRef}
      />

      {/* Styled Labels and Inputs */}
      <div className="w-full space-y-2">
        <label className="block text-lg font-medium text-gray-700">
          Username
        </label>
        <Input
          value={userNameInput}
          name="userName"
          onChange={handleOnChangeValues}
          placeholder="Username"
          className="text-lg rounded-lg outline-none  border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />

        <label className="block text-lg font-medium text-gray-700">Email</label>
        <Input
          value={emailInput}
          name="email"
          onChange={handleOnChangeValues}
          placeholder="Email"
          className="text-lg rounded-lg outline-none border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <button
        onClick={handleUpdate}
        disabled={canUpdate()}
        className={`w-24 text-lg py-3 rounded-lg shadow-md text-white ${
          canUpdate()
            ? "bg-indigo-200"
            : "bg-indigo-600  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300"
        }`}
      >
        Update
      </button>
    </>
  );
};

export default UpdateUser;
