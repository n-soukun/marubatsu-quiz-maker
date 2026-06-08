"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function submitAnswer(sessionId: string, answer: boolean) {
  const session = await prisma.quizSession.findUnique({
    where: {
      id: sessionId,
    },
  });
  if (!session) {
    throw new Error("セッションが見つかりません");
  }

  const authSession = await auth();
  if (session.userId && session.userId !== authSession?.user?.id) {
    throw new Error("不正なセッションです");
  }

  const question = await prisma.question.findFirst({
    where: {
      quizId: session.quizId,
      order: session.currentQuestion,
    },
  });

  if (!question) {
    throw new Error("問題が見つかりません");
  }

  const newScore = session.correctCount + (question.answer === answer ? 1 : 0);
  const isCorrect = question.answer === answer;
  const correctAnswer = question.answer;

  const completed =
    session.currentQuestion + 1 >=
    (await prisma.question.count({
      where: {
        quizId: session.quizId,
      },
    }));

  await prisma.quizSession.update({
    where: {
      id: sessionId,
    },
    data: {
      currentQuestion: session.currentQuestion + 1,
      correctCount: newScore,
      completed,
    },
  });

  if (completed && session.userId) {
    const hightestScore = await prisma.score.findUnique({
      where: {
        userId_quizId: {
          userId: session.userId,
          quizId: session.quizId,
        },
      },
      select: {
        score: true,
      },
    });
    await prisma.score.upsert({
      where: {
        userId_quizId: {
          userId: session.userId,
          quizId: session.quizId,
        },
      },
      create: {
        userId: session.userId,
        quizId: session.quizId,
        score: newScore,
      },
      update: {
        score: Math.max(hightestScore?.score || 0, newScore),
      },
    });
  }

  return {
    isCorrect,
    completed,
    correctAnswer,
  };
}
