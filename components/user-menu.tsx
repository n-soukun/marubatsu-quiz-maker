"use client";

import { LogOutIcon, UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { NavigationLink } from "./navigation";
import { useState } from "react";
import { LoadingSpinner } from "./loading-spinner";

export interface UserMenuProps {
  user: {
    name: string;
    image: string;
  };
}

export function UserMenu(props: UserMenuProps) {
  const [logoutLoading, setLogoutLoading] = useState(false);

  function handleLogout() {
    setLogoutLoading(true);
    signOut();
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={props.user.image} />
            <AvatarFallback>
              {props.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <NavigationLink href="/mypage" passHref>
            <DropdownMenuItem>
              <UserIcon />
              マイページ
            </DropdownMenuItem>
          </NavigationLink>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            <LogOutIcon />
            ログアウト
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {logoutLoading && <LoadingSpinner />}
    </>
  );
}
