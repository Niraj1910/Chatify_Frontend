import { useToast } from "../hooks/use-toast";
import { signUpService } from "@/Services/authServices";
import { handleFormSubmit } from "@/Utils/formUtils";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const response = handleFormSubmit(e);
    // doing a Fetch call
    try {
      const result = await signUpService(response);
      console.log("signUpData result -> ", result);

      if (result) {
        setIsSignUp(!isSignUp);
        toast({
          title: "Successfully Signed up, now please sign in",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong, please try again",
      });
      console.log("Error during sign-up: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        className="w-full py-3 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300"
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignUp;
