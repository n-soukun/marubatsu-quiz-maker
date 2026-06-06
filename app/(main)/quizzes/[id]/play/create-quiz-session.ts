import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function createQuizSession(quizId: string) {
  "use server";

  const authSession = await auth();
  const userId = authSession?.user?.id;

  const session = await prisma.quizSession.create({
    data: {
      quizId,
      userId,
      currentQuestion: 0,
      correctCount: 0,
      completed: false,
    },
  });

  redirect(`/quizzes/${quizId}/play?s=${session.id}`);
}
