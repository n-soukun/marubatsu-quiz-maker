import {
  PlayIcon,
  CircleQuestionMarkIcon,
  PlusIcon,
  CalendarIcon,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
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
import { NavigationLink } from "@/components/navigation";

import dayjs from "dayjs";
import "dayjs/locale/ja";
dayjs.locale("ja");

export const metadata = {
  title: "マルバツクイズメーカー",
};

export default async function Home() {
  const quizzes = await prisma.quiz.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
      _count: {
        select: {
          quizSessions: true,
        },
      },
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
            <NavigationLink href="/quizzes/new" passHref>
              <Button>
                <PlusIcon />
                クイズ作成
              </Button>
            </NavigationLink>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid w-full grid-cols-1 gap-4">
          {quizzes.map((quiz) => (
            <NavigationLink
              key={quiz.id}
              href={`/quizzes/${quiz.id}`}
              className="w-full"
            >
              <Card size="sm">
                <CardHeader>
                  <CardTitle>{quiz.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center">
                      <span className="flex items-center gap-1">
                        <PlayIcon size={16} /> {quiz._count.quizSessions} 回
                      </span>
                      <span className="ml-4 flex items-center gap-1">
                        <CalendarIcon size={16} />
                        {dayjs(quiz.updatedAt).format("YYYY年MM月DD日")}
                      </span>
                    </div>
                    <div className=" mt-2 flex items-center gap-2">
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
              </Card>
            </NavigationLink>
          ))}
        </div>
      )}
    </main>
  );
}
