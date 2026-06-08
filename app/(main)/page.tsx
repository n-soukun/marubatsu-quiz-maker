import {
  PlayIcon,
  CircleQuestionMarkIcon,
  PlusIcon,
  InfoIcon,
} from "lucide-react";
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
    <main className="px-4 py-8">
      <h3 className="mb-4 flex items-center px-2 py-1 text-lg font-semibold bg-background rounded-full">
        <div className=" bg-primary w-4 h-4 rounded-full mr-2"></div>
        <span>新着クイズ</span>
      </h3>
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
        <div className="grid w-full grid-cols-1 gap-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} size="sm">
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
              <CardFooter className=" flex gap-4">
                <Link href={`/quizzes/${quiz.id}/play`} className=" flex-1">
                  <Button className="w-full" type="submit">
                    <PlayIcon />
                    プレイ
                  </Button>
                </Link>
                <Link href={`/quizzes/${quiz.id}`}>
                  <Button className=" shrink-0" variant="secondary" size="icon">
                    <InfoIcon />
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
