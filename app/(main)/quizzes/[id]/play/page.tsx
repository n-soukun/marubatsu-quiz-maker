import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PlayQuizCard } from "./play-quiz-card";
import { createQuizSession } from "./create-quiz-session";

export async function generateMetadata({
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
      quiz: {
        include: {
          _count: {
            select: {
              questions: true,
            },
          },
        },
      },
    },
  });

  let title;

  if (session && session.quizId === quizId) {
    title = `(${session.currentQuestion + 1}/${session.quiz._count.questions}) ${session.quiz.title} - マルバツクイズメーカー`;
  } else {
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
    });
    title =
      (quiz ? quiz.title : "クイズが見つかりませんでした") +
      " - マルバツクイズメーカー";
  }

  return {
    title,
  };
}

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
    <main className="p-8">
      <h2 className="mb-8 text-xl font-bold">{session.quiz.title}</h2>
      <PlayQuizCard
        currentQuestion={session.currentQuestion}
        questionCount={questionCount}
        questionText={currentQuestion?.text || ""}
        sessionId={session.id}
      />
    </main>
  );
}
