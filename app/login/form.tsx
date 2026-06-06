"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  function handleLogin() {
    signIn("discord", { redirectTo: callbackUrl });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ログイン</CardTitle>
        <CardDescription>
          ログインすると、クイズの作成やスコアの記録ができるようになります！
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          className="w-full bg-[#5865F2] text-white hover:bg-[#5865F2]/90 hover:text-white"
          onClick={handleLogin}
        >
          Discordでログイン
        </Button>
      </CardContent>
    </Card>
  );
}
