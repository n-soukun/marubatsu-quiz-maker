import { PlayIcon, CircleQuestionMarkIcon, PlusIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "ホーム - マルバツクイズメーカー",
};

export default async function Home() {
  const quizzes = await prisma.quiz.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
    },
    take: 6,
  });
  return (
    <main className="container p-16 mx-auto">
      <h2 className="mb-8 text-3xl font-bold">新着クイズ</h2>
      {quizzes.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CircleQuestionMarkIcon />
            </EmptyMedia>
            <EmptyTitle>クイズがありません</EmptyTitle>
            <EmptyDescription>
              最初のクイズを作成してみましょう。一番乗りだ！
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/quizzes/new" passHref>
              <Button>
                <PlusIcon />
                クイズ作成
              </Button>
            </Link>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz, i) => (
            <Card key={quiz.id}>
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2">
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
              </CardHeader>
              <CardFooter className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                <Link href={`/quizzes/${quiz.id}/play`} className="w-full">
                  <Button className="w-full" type="submit">
                    <PlayIcon />
                    プレイ
                  </Button>
                </Link>
                <Link href={`/quizzes/${quiz.id}`} className="w-full">
                  <Button className="w-full" variant="secondary">
                    詳細を見る
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
