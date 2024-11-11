import { useState } from "react";

import SignUp from "./SignUp";
import SignIn from "./SignIn";

const Authentication = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="absolute z-40 left-1/2 -translate-x-1/2 flex min-h-screen w-[500px] max-sm:w-[400px] max-[400px]:w-[380px] items-center justify-center p-4 text-xl">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isSignUp ? "Create Your Account" : "Welcome Back!"}
        </h2>
        {isSignUp ? (
          <SignUp
            setShowPassword={setShowPassword}
            showPassword={showPassword}
            setIsSignUp={setIsSignUp}
            isSignUp={isSignUp}
          />
        ) : (
          <SignIn
            setShowPassword={setShowPassword}
            showPassword={showPassword}
          />
        )}

        <p className="text-center  text-gray-500">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            className="font-semibold text-indigo-500"
            onClick={toggleForm}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Authentication;
