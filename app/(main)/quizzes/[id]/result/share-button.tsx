"use client";

import { ClipboardIcon, Share2Icon } from "lucide-react";

import {
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Dialog,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TwitterButton } from "@/components/twitter-buttont";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export interface ShareButtonProps {
  title: string;
  url: string;
  score: number;
}

export function ShareButton(props: ShareButtonProps) {
  const shareText = `${props.title}の結果は、${props.score}点でした！ ${props.url}`;

  function handleCopyText() {
    navigator.clipboard.writeText(shareText);
    toast.success("テキストをコピーしました！");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Share2Icon />
          結果をシェア
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>共有</DialogTitle>
          <DialogDescription>SNSで共有しましょう！</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              コピーするテキスト
            </Label>
            <Input id="link" defaultValue={shareText} readOnly />
          </div>
          <Button size="icon-sm" onClick={handleCopyText}>
            <ClipboardIcon />
          </Button>
        </div>
        <TwitterButton text={shareText} hashtags={["マルバツクイズメーカー"]} />
      </DialogContent>
    </Dialog>
  );
}
