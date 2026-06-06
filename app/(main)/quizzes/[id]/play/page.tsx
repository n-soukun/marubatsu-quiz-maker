import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PlayQuizCard } from "./play-quiz-card";
import { createQuizSession } from "./create-quiz-session";

export default async function QuizPlayPage({
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

  if (!sessionId) {
    await createQuizSession(quizId);
    return null;
  }

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

  if (session.completed) {
    redirect(`/quizzes/${quizId}/result?s=${sessionId}`);
  }

  const currentQuestion = await prisma.question.findFirst({
    where: {
      quizId,
      order: session.currentQuestion,
    },
  });

  const questionCount = await prisma.question.count({
    where: {
      quizId,
    },
  });

  return (
    <main className="min-h-screen container p-16 mx-auto">
      <h2 className="mb-8 text-3xl font-bold">{session.quiz.title}</h2>
      <PlayQuizCard
        currentQuestion={session.currentQuestion}
        questionCount={questionCount}
        questionText={currentQuestion?.text || ""}
        sessionId={session.id}
      />
    </main>
  );
}
