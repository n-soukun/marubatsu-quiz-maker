import { PlusIcon } from "lucide-react";
import { SignInButton } from "./signin-button";
import { Button } from "./ui/button";
import { UserMenu } from "./user-menu";
import Link from "next/link";

export interface HeaderProps {
  user?: {
    name: string;
    image: string;
  };
}

export function Header(props: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b px-4 py-2">
      <Link href="/" passHref>
        <h1 className="text-2xl font-bold">⭕️❌️クイズメーカー</h1>
      </Link>
      {props.user ? (
        <div className="flex items-center gap-4">
          <Link href="/quizzes/new" passHref>
            <Button variant="outline">
              <PlusIcon />
              クイズ作成
            </Button>
          </Link>
          <UserMenu user={props.user} />
        </div>
      ) : (
        <SignInButton />
      )}
    </header>
  );
}
