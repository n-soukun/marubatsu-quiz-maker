import { prisma } from "@/lib/prisma";
import { QuizEditor } from "../../editor";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

type EditQuizProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditQuiz({ params }: EditQuizProps) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!quiz || quiz.authorId !== session.user?.id) {
    redirect("/mypage");
  }

  const defaultValue = {
    title: quiz.title,
    questions: quiz.questions.map((q) => ({
      text: q.text,
      answer: q.answer,
    })),
  };

  async function updateQuiz(data: {
    title: string;
    questions: { text: string; answer: boolean }[];
  }) {
    "use server";

    if (!session?.user?.id) {
      redirect("/login");
    }

    await prisma.quiz.update({
      where: { id },
      data: {
        title: data.title,
        questions: {
          deleteMany: {},
          create: data.questions.map((q, i) => ({
            text: q.text,
            answer: q.answer,
            order: i,
          })),
        },
      },
    });

    redirect("/mypage");
  }

  return (
    <main className="min-h-screen container p-16 mx-auto">
      <h2 className="mb-8 text-3xl font-bold">クイズ編集</h2>
      <QuizEditor defaultValue={defaultValue} saveAction={updateQuiz} />
    </main>
  );
}
