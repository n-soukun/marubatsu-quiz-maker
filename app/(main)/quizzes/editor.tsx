"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import {
  QuestionInputCard,
  QuestionInputCardProps,
} from "./question-input-card";
import { Button } from "@/components/ui/button";
import { PlusIcon, SaveIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export interface QuizEditorProps {
  defaultValue?: {
    title: string;
    questions: { text: string; answer: boolean }[];
  };
  saveAction: (data: {
    title: string;
    questions: { text: string; answer: boolean }[];
  }) => void;
}

export function QuizEditor({ defaultValue, saveAction }: QuizEditorProps) {
  const [title, setTitle] = useState(defaultValue?.title || "");
  const [questions, setQuestions] = useState<
    Omit<
      QuestionInputCardProps,
      "index" | "onChange" | "onDelete" | "onReorder" | "isLast"
    >[]
  >(
    defaultValue?.questions.map((q) => ({
      id: crypto.randomUUID(),
      text: q.text,
      answer: q.answer,
    })) || [{ id: crypto.randomUUID(), text: "", answer: true }],
  );
  const [errors, setErrors] = useState<{
    title?: string;
    questions?: string;
  }>();

  function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    validate();
  }

  function handleChangeQuestion(index: number, text: string, answer: boolean) {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], text, answer };
    setQuestions(newQuestions);
    validate();
  }

  function handleDeleteQuestion(index: number) {
    setQuestions((questions) => questions.filter((_, i) => i !== index));
    validate();
  }

  function handleReorderQuestion(from: number, to: number) {
    setQuestions((questions) => {
      const newQuestions = [...questions];
      const [moved] = newQuestions.splice(from, 1);
      newQuestions.splice(to, 0, moved);
      return newQuestions;
    });
  }

  function validate() {
    let valid = true;
    const newErrors: { title?: string; questions?: string } = {};
    if (!title.trim()) {
      newErrors.title = "タイトルは必須です";
      valid = false;
    }
    if (questions.length === 0) {
      newErrors.questions = "問題は1問以上必要です";
      valid = false;
    } else if (questions.some((q) => !q.text.trim())) {
      newErrors.questions = "すべての問題文を入力してください";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  }

  function addQuestion() {
    setQuestions((questions) => [
      ...questions,
      { id: crypto.randomUUID(), text: "", answer: true },
    ]);
  }

  function handleSave() {
    if (!validate()) {
      return;
    }
    saveAction({
      title,
      questions: questions.map(({ text, answer }) => ({ text, answer })),
    });
  }

  return (
    <div className="p-4">
      <Field className="mb-6" data-invalid={!!errors?.title}>
        <FieldLabel htmlFor="quiz-title">タイトル</FieldLabel>
        <Input
          area-invalid={!!errors?.title}
          id="quiz-title"
          type="text"
          placeholder="新しいクイズ"
          value={title}
          onChange={handleChangeTitle}
        />
        {errors?.title && <FieldError>{errors.title}</FieldError>}
      </Field>
      <DragDropProvider
        onDragEnd={(event) => {
          setQuestions((questions) => move(questions, event));
        }}
      >
        <div className="flex flex-col gap-4">
          {questions.map((question, index) => (
            <QuestionInputCard
              key={question.id}
              id={question.id}
              index={index}
              text={question.text}
              answer={question.answer}
              isLast={index === questions.length - 1}
              onChange={(text, answer) => {
                handleChangeQuestion(index, text, answer);
              }}
              onDelete={() => {
                handleDeleteQuestion(index);
              }}
              onReorder={(from, to) => {
                handleReorderQuestion(from, to);
              }}
            />
          ))}
        </div>
      </DragDropProvider>
      {errors?.questions && (
        <FieldError className="mt-4">{errors.questions}</FieldError>
      )}
      <div className="flex justify-center">
        <Button className="mt-4" onClick={addQuestion}>
          <PlusIcon />
          問題を追加
        </Button>
      </div>
      <div className="h-24"></div>
      <div className=" fixed left-1/2 bottom-0 -translate-x-1/2 max-w-lg w-full p-4 bg-background flex justify-end shadow-lg rounded-t-lg">
        <Button className="w-full" onClick={handleSave}>
          <SaveIcon />
          保存
        </Button>
      </div>
    </div>
  );
}
