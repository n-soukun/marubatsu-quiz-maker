"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function deleteQuiz(quizId: string) {
  const session = await auth();

  if (!session) {
    throw new Error("ログインが必要です");
  }

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
  });

  if (!quiz) {
    throw new Error("クイズが見つかりません");
  }

  if (quiz.authorId !== session.user?.id) {
    throw new Error("クイズの削除権限がありません");
  }

  await prisma.quiz.delete({
    where: {
      id: quizId,
    },
  });
}
