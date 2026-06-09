import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { prisma } from "@/lib/prisma";
import { RepeatIcon, ShareIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { NavigationLink } from "@/components/navigation";

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

export default async function QuizResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    s?: string;
  }>;
}) {
  const { s: sessionId } = await searchParams;
  const { id: quizId } = await params;

  const session = await prisma.quizSession.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      quiz: true,
    },
  });

  if (!session || session.quizId !== quizId) {
    redirect("/quizzes/" + quizId);
  }

  const authSession = await auth();
  if (session.userId && session.userId !== authSession?.user?.id) {
    redirect("/quizzes/" + quizId);
  }

  let message: string;
  let bgColor: string;
  let bgLightColor: string;
  if (session.correctCount === session.currentQuestion) {
    message = "パーフェクト！";
    bgColor = "bg-linear-to-r from-purple-500 to-purple-700";
    bgLightColor = "bg-purple-100";
  } else if (session.correctCount >= session.currentQuestion * 0.75) {
    message = "素晴らしい！";
    bgColor = "bg-linear-to-r from-lime-500 to-lime-700";
    bgLightColor = "bg-lime-100";
  } else if (session.correctCount >= session.currentQuestion * 0.5) {
    message = "いい感じですね！";
    bgColor = "bg-linear-to-r from-orange-500 to-orange-700";
    bgLightColor = "bg-orange-100";
  } else {
    message = "のびしろがありますね！";
    bgColor = "bg-linear-to-r from-blue-500 to-blue-700";
    bgLightColor = "bg-blue-100";
  }

  return (
    <main className="p-8">
      <h2 className="mb-8 text-xl font-bold">{session.quiz.title}</h2>
      <Card>
        <div
          className={`-mt-8 text-center text-2xl font-bold text-white ${bgColor} px-4 py-8`}
        >
          {message}
        </div>
        <CardContent>
          <Field className="w-full mb-4">
            <FieldLabel htmlFor="progress-upload">
              <span>
                {session.correctCount} / {session.currentQuestion} 問正解
              </span>
              <span className="ml-auto">
                {Math.round(
                  (session.correctCount / session.currentQuestion) * 100,
                )}
                %
              </span>
            </FieldLabel>
            <Progress
              indicatorClassName={bgColor}
              className={`h-4 ${bgLightColor}`}
              value={(session.correctCount / session.currentQuestion) * 100}
            />
          </Field>
        </CardContent>
        <CardFooter className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <Button disabled>
            <ShareIcon />
            結果をシェア
          </Button>
          <NavigationLink href={`/quizzes/${quizId}/play`} className="w-full">
            <Button type="submit" variant="outline" className="w-full">
              <RepeatIcon />
              もう一度プレイ
            </Button>
          </NavigationLink>
        </CardFooter>
      </Card>
      <div className="mt-8 text-center">
        <NavigationLink href="/" passHref>
          <Button>トップへ戻る</Button>
        </NavigationLink>
      </div>
    </main>
  );
}
