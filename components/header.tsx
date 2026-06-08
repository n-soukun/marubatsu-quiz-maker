import { PlusIcon } from "lucide-react";
import { SignInButton } from "./signin-button";
import { Button } from "./ui/button";
import { UserMenu } from "./user-menu";
import Link from "next/link";
import Image from "next/image";

export interface HeaderProps {
  user?: {
    name: string;
    image: string;
  };
}

export function Header(props: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-sky-500 text-white">
      <Link href="/" passHref>
        <Image src="/logo.png" alt="ロゴ" width={200} height={32} />
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
