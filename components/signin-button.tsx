"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { LoadingSpinner } from "./loading-spinner";

export function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  function handleLogin() {
    setIsLoading(true);
    signIn();
  }

  return (
    <>
      <Button
        variant="outline"
        type="submit"
        disabled={isLoading}
        onClick={handleLogin}
      >
        ログイン
      </Button>
      {isLoading ? <LoadingSpinner /> : null}
    </>
  );
}
