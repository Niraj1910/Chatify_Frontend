import { useState } from "react";

import SignUp from "./SignUp";
import SignIn from "./SignIn";
import logo from "/logo.svg";

const Authentication = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="w-full min-h-full">
      <div className=" bg-slate-800 h-32 flex justify-center pl-4 items-center gap-1">
        <img src={logo} alt="img" className="bg-white rounded-full w-20 h-20" />
        <h1 className="text-5xl font-bold text-white">Chatify</h1>
      </div>

      <div className="relative mt-32 z-40 left-1/2 -translate-x-1/2  flex  w-[500px] max-sm:w-[400px] max-[400px]:w-[380px] items-center justify-center p-4 text-xl">
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
    </div>
  );
};

export default Authentication;
