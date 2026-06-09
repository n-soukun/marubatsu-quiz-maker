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
import {
  CalendarIcon,
  Edit2Icon,
  EllipsisVerticalIcon,
  PlayIcon,
  TrashIcon,
} from "lucide-react";
import { NavigationLink, useNavigationRouter } from "@/components/navigation";

import { deleteQuiz } from "./delete-quiz";

import dayjs from "dayjs";
import "dayjs/locale/ja";
dayjs.locale("ja");

export interface QuizCardProps {
  quiz: {
    id: string;
    title: string;
    updatedAt: Date;
    _count: {
      quizSessions: number;
    };
  };
}

export function QuizCard(props: QuizCardProps) {
  const router = useNavigationRouter();

  function handleDelete() {
    deleteQuiz(props.quiz.id);
    router.refresh();
  }

  return (
    <NavigationLink href={`/quizzes/${props.quiz.id}`} passHref>
      <Card size="sm">
        <CardHeader>
          <CardTitle>{props.quiz.title || "タイトルなし"}</CardTitle>
          <CardDescription>
            <div className="flex items-center">
              <span className="flex items-center gap-1">
                <PlayIcon size={16} /> {props.quiz._count.quizSessions} 回
              </span>
              <span className="ml-4 flex items-center gap-1">
                <CalendarIcon size={16} />
                {dayjs(props.quiz.updatedAt).format("YYYY年MM月DD日")}
              </span>
            </div>
          </CardDescription>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <EllipsisVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <NavigationLink
                  href={`/quizzes/${props.quiz.id}/edit`}
                  passHref
                >
                  <DropdownMenuItem>
                    <Edit2Icon />
                    編集
                  </DropdownMenuItem>
                </NavigationLink>
                <DropdownMenuItem variant="destructive" onSelect={handleDelete}>
                  <TrashIcon />
                  削除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
      </Card>
    </NavigationLink>
  );
}
