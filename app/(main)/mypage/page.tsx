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
  });

  return (
    <main className="container p-16 mx-auto">
      <h2 className="mb-8 text-3xl font-bold">マイページ</h2>
      <h3 className="mb-4 text-xl font-semibold">作成したクイズ</h3>
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
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </main>
  );
}
