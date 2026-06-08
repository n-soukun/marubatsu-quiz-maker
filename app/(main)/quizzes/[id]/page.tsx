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
import { PlayIcon, ShareIcon } from "lucide-react";
import { NavigationLink } from "@/components/navigation";

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
      <Card>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          <CardAction>
            <Button variant="outline" disabled>
              <ShareIcon />
              共有
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
      <Card className="mt-4">
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
