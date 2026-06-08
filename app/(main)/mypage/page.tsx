import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { QuizCard } from "./quiz-card";
import { CircleQuestionMarkIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "マイページ - マルバツクイズメーカー",
};

export default async function MyPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const quizzes = await prisma.quiz.findMany({
    where: {
      authorId: session?.user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto">
      <h2 className="mb-4 text-xl font-semibold text-center p-4 bg-white text-sky-600 rounded-b-lg">
        マイページ
      </h2>
      <div className="p-4">
        <h3 className="mb-4 flex items-center px-2 py-1 text-lg font-semibold bg-background rounded-full">
          <div className=" bg-primary w-4 h-4 rounded-full mr-2"></div>
          <span>作成したクイズ</span>
          <div className=" grow"></div>
          <span className=" text-sm text-muted-foreground">
            {quizzes.length} 件
          </span>
        </h3>
        {quizzes.length === 0 ? (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CircleQuestionMarkIcon />
              </EmptyMedia>
              <EmptyTitle>クイズがありません</EmptyTitle>
              <EmptyDescription>
                あなただけのマルバツクイズを作成して、みんなにシェアしましょう！
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
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
