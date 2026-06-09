import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, PlayIcon, Share2Icon } from "lucide-react";
import { NavigationLink } from "@/components/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import dayjs from "dayjs";
import "dayjs/locale/ja";
dayjs.locale("ja");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const quiz = await prisma.quiz.findUnique({
    where: {
      id,
    },
  });

  const title =
    (quiz ? quiz.title : "クイズが見つかりませんでした") +
    " - マルバツクイズメーカー";

  return {
    title,
  };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const quiz = await prisma.quiz.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
    },
  });

  const playCount = await prisma.quizSession.count({
    where: {
      quizId: id,
    },
  });

  const scores = await prisma.score.findMany({
    where: {
      quizId: id,
    },
    orderBy: {
      score: "desc",
    },
    include: {
      user: true,
    },
    take: 10,
  });

  if (!quiz) {
    redirect("/");
  }

  return (
    <main className="p-4 mx-auto">
      <Card size="sm">
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          <CardDescription>
            <div className="flex items-center">
              <span className="flex items-center gap-1">
                <PlayIcon size={16} /> {playCount} 回
              </span>
              <span className="ml-4 flex items-center gap-1">
                <CalendarIcon size={16} />
                {dayjs(quiz.updatedAt).format("YYYY年MM月DD日")}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Avatar size="sm">
                <AvatarImage src={quiz.author.image ?? ""} />
                <AvatarFallback>
                  {quiz.author.name
                    ? quiz.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "U"}
                </AvatarFallback>
              </Avatar>
              {quiz.author?.name || "ユーザー"}
            </div>
          </CardDescription>
          <CardAction>
            <Button variant="outline" size="icon-sm" disabled>
              <Share2Icon />
            </Button>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <NavigationLink href={`/quizzes/${id}/play`} className="w-full">
            <Button className="w-full" type="submit">
              <PlayIcon />
              クイズをプレイ
            </Button>
          </NavigationLink>
        </CardFooter>
      </Card>
      <Card className="mt-4" size="sm">
        <CardHeader>
          <CardTitle>スコアランキング</CardTitle>
          <CardDescription>
            ログインしてクイズをプレイすると、スコアがランキングに表示されます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scores.length === 0 ? (
            <p>まだプレイされたスコアがありません。</p>
          ) : (
            <ol className="space-y-2">
              {scores.map((score, index) => (
                <li
                  key={score.id}
                  className="flex items-center justify-between p-4 bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{index + 1}</span>
                    <span>{score.user?.name || "匿名ユーザー"}</span>
                  </div>
                  <span className="font-bold">{score.score} 点</span>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
