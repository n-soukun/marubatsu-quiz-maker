"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { LoadingSpinner } from "./loading-spinner";
import { UserCircleIcon } from "lucide-react";

export function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  function handleLogin() {
    setIsLoading(true);
    signIn();
  }

  return (
    <>
      <button
        className=" flex items-center border-2 border-white rounded-full px-2 py-1 text-sm font-medium text-white cursor-pointer hover:bg-white hover:text-primary transition-colors disabled:opacity-50 disabled:pointer-events-none"
        type="submit"
        disabled={isLoading}
        onClick={handleLogin}
      >
        <UserCircleIcon />
        <span className="mx-2">ログイン</span>
      </button>
      {isLoading ? <LoadingSpinner /> : null}
    </>
  );
}
