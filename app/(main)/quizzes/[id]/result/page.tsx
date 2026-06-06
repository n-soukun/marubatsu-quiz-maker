import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { prisma } from "@/lib/prisma";
import { RepeatIcon, ShareIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

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
  let textColor: string;
  if (session.correctCount === session.currentQuestion) {
    message = "パーフェクト！";
    bgColor = "bg-purple-500";
    bgLightColor = "bg-purple-100";
    textColor = "text-purple-600";
  } else if (session.correctCount >= session.currentQuestion * 0.75) {
    message = "素晴らしい！";
    bgColor = "bg-green-500";
    bgLightColor = "bg-green-100";
    textColor = "text-green-600";
  } else if (session.correctCount >= session.currentQuestion * 0.5) {
    message = "いい感じですね！";
    bgColor = "bg-yellow-500";
    bgLightColor = "bg-yellow-100";
    textColor = "text-yellow-600";
  } else {
    message = "のびしろがありますね！";
    bgColor = "bg-blue-500";
    bgLightColor = "bg-blue-100";
    textColor = "text-blue-600";
  }

  return (
    <main className="container p-16 mx-auto">
      <h2 className="mb-8 text-3xl font-bold">{session.quiz.title}</h2>
      <Card>
        <CardHeader>
          <CardTitle>リザルト</CardTitle>
          <CardContent>
            <p
              className={`my-4 text-center text-xl font-bold ${textColor} ${bgLightColor} p-4`}
            >
              {message}
            </p>
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
            <Link href={`/quizzes/${quizId}/play`} className="w-full">
              <Button type="submit" variant="secondary" className="w-full">
                <RepeatIcon />
                もう一度プレイ
              </Button>
            </Link>
          </CardFooter>
        </CardHeader>
      </Card>
      <div className="mt-8 text-center">
        <Link href="/" passHref>
          <Button variant="link">トップへ戻る</Button>
        </Link>
      </div>
    </main>
  );
}
