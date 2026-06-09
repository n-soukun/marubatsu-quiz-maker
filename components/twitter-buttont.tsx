"use client";

import { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TwitterButtonProps = {
  text?: string;
  url?: string;
  hashtags?: string[];
  via?: string;
  related?: string[];
  in_reply_to?: string;
} & ComponentProps<typeof Button>;

export function TwitterButton(props: TwitterButtonProps) {
  const {
    text,
    url,
    hashtags,
    via,
    related,
    in_reply_to,
    className,
    ...buttonProps
  } = props;

  function handleClick() {
    const twitterUrl = new URL("https://twitter.com/intent/tweet");
    if (text) {
      twitterUrl.searchParams.set("text", text);
    }
    if (url) {
      twitterUrl.searchParams.set("url", url);
    }
    if (hashtags) {
      twitterUrl.searchParams.set("hashtags", hashtags.join(","));
    }
    if (via) {
      twitterUrl.searchParams.set("via", via);
    }
    if (related) {
      twitterUrl.searchParams.set("related", related.join(","));
    }
    if (in_reply_to) {
      twitterUrl.searchParams.set("in_reply_to", in_reply_to);
    }
    window.open(twitterUrl.toString(), "_blank", "noopener");
  }

  return (
    <Button
      className={cn(
        "bg-black border-black/60 hover:bg-black/80 text-white",
        className,
      )}
      onClick={handleClick}
      {...buttonProps}
    >
      Xでシェア
    </Button>
  );
}
