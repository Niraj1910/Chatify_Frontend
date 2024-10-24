import { useToast } from "../hooks/use-toast";

import { useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import defaultProfile from "/defaultProfile.jpg";

import ProfilePicture from "./ProfilePicture";
import { BASEURL, SIGN_UP } from "../../Constants";

interface SignUpProps {
  showPassword: boolean;
  setShowPassword: (arg: boolean) => void;
  isSignUp: boolean;
  setIsSignUp: (arg: boolean) => void;
}

const SignUp = ({
  showPassword,
  setShowPassword,
  isSignUp,
  setIsSignUp,
}: SignUpProps) => {
  const [validateUsername, setValidateUsername] = useState("");
  const [imagePreview, setImagePreview] = useState(defaultProfile);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(!isLoading);
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    // check if the file is selected
    if (!fileInputRef.current?.files?.[0]) {
      const response = await fetch(defaultProfile);
      const blob = await response.blob();
      const defaultFile = new File([blob], "defaultProfile.jpg", {
        type: blob.type,
      });

      formData.append("avatar", defaultFile);
    }

    formData.forEach((val, key) => console.log(key, " ", val));
    // doing a Fetch call
    try {
      const response = await fetch(`${BASEURL}/api/${SIGN_UP}`, {
        body: formData,
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const { message } = await response.json();
        toast({
          variant: "destructive",
          title: message,
        });
      } else {
        setIsSignUp(!isSignUp);
        toast({
          title: "Successfully signed up",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Network error",
      });
      console.log("Error during sign-up: ", error);
    }
    setIsLoading(!isLoading);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ProfilePicture
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        fileInputRef={fileInputRef}
      />
      <input
        type="text"
        name="userName"
        onChange={(e) => setValidateUsername(e.target.value)}
        placeholder="Username"
        className="w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {validateUsername.split(" ").length > 1 && (
        <p className="text-red-500 border-b-[1px] border-red-500 text-lg">
          username should not have any space
        </p>
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          className="w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div
          className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <FaEyeSlash className="text-gray-600" />
          ) : (
            <FaEye className="text-gray-600" />
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 ${
          isLoading && "bg-indigo-700"
        }focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300`}
      >
        {isLoading ? "signing up ..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignUp;
