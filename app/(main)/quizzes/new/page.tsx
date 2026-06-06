import { prisma } from "@/lib/prisma";
import { QuizEditor } from "../editor";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function NewQuiz() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  async function createQuiz(data: {
    title: string;
    questions: { text: string; answer: boolean }[];
  }) {
    "use server";

    if (!data.title) {
      throw new Error("タイトルは必須です");
    }

    if (data.questions.length === 0) {
      throw new Error("問題を1つ以上追加してください");
    }

    if (data.questions.some((q) => !q.text)) {
      throw new Error("すべての問題文を入力してください");
    }

    if (!session?.user?.id) {
      redirect("/login");
    }

    const createdQuiz = await prisma.quiz.create({
      data: {
        authorId: session.user.id,
        title: data.title,
        questions: {
          create: data.questions.map((q, i) => ({
            text: q.text,
            answer: q.answer,
            order: i,
          })),
        },
      },
    });

    redirect(`/quizzes/${createdQuiz.id}`);
  }

  return (
    <main className="container p-16 mx-auto">
      <h2 className="mb-8 text-3xl font-bold">クイズ作成</h2>
      <QuizEditor saveAction={createQuiz} />
    </main>
  );
}
