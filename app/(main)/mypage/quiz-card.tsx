"use client";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon, PlayIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { deleteQuiz } from "./delete-quiz";

export interface QuizCardProps {
  quiz: {
    id: string;
    title: string;
    updatedAt: Date;
  };
}

export function QuizCard(props: QuizCardProps) {
  const router = useRouter();

  function handleDelete() {
    deleteQuiz(props.quiz.id);
    router.refresh();
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{props.quiz.title || "タイトルなし"}</CardTitle>
        <CardDescription>
          最終更新日: {props.quiz.updatedAt.toLocaleDateString()}
        </CardDescription>
        <CardAction>
          <Link href={`/quizzes/${props.quiz.id}`} passHref className="mr-2">
            <Button size="icon">
              <PlayIcon />
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <EllipsisVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link href={`/quizzes/${props.quiz.id}/edit`} passHref>
                <DropdownMenuItem>編集</DropdownMenuItem>
              </Link>
              <DropdownMenuItem variant="destructive" onSelect={handleDelete}>
                削除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
