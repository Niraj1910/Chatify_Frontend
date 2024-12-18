import { useToast } from "../hooks/use-toast";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BASEURL, SIGN_IN } from "../../Constants";
import { useUserContext } from "@/Contexts/UserContext";
import { useState } from "react";

interface SignInProps {
  showPassword: boolean;
  setShowPassword: (arg: boolean) => void;
}

const SignIn = ({ showPassword, setShowPassword }: SignInProps) => {
  const { toast } = useToast();

  const { setIsAuth } = useUserContext();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(!isLoading);
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const signinData: { [key: string]: string } = {};
    formData.forEach((val, key) => (signinData[key] = val.toString()));
    try {
      const result = await fetch(`${BASEURL}/api/${SIGN_IN}`, {
        body: JSON.stringify(signinData),
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!result.ok) {
        const { message } = await result.json();
        toast({
          variant: "destructive",
          title: message,
        });
        setIsAuth(false);
      } else {
        toast({
          title: "Successfully signed in",
        });
        setIsAuth(true);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Network error",
      });
      setIsAuth(false);
      console.log("Error during sign-up: ", error);
    }
    setIsLoading(!isLoading);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="userName"
        placeholder="Guts"
        className="w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="relative">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="12345"
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
        {isLoading ? "signing in ..." : "Sign In"}
      </button>
    </form>
  );
};

export default SignIn;
