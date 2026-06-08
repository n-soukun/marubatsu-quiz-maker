import { PlusIcon } from "lucide-react";
import { SignInButton } from "./signin-button";
import { Button } from "./ui/button";
import { UserMenu } from "./user-menu";
import Image from "next/image";
import { NavigationLink } from "./navigation";

export interface HeaderProps {
  user?: {
    name: string;
    image: string;
  };
}

export function Header(props: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-sky-500 text-white">
      <NavigationLink href="/" passHref>
        <Image src="/logo.png" alt="ロゴ" width={200} height={32} />
      </NavigationLink>
      {props.user ? (
        <div className="flex items-center gap-4">
          <NavigationLink href="/quizzes/new" passHref>
            <Button variant="outline">
              <PlusIcon />
              クイズ作成
            </Button>
          </NavigationLink>
          <UserMenu user={props.user} />
        </div>
      ) : (
        <SignInButton />
      )}
    </header>
  );
}
