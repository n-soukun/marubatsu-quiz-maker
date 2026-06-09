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

import { LoadingSpinner } from "@/components/loading-spinner";

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

interface QuestionData {
  id: string;
  text: string;
  answer: boolean;
}

export function QuizEditor({ defaultValue, saveAction }: QuizEditorProps) {
  const [title, setTitle] = useState(defaultValue?.title || "");
  const [questions, setQuestions] = useState<QuestionData[]>(
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
  const [isSaving, setIsSaving] = useState(false);

  function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value;
    setTitle(newTitle);
    validateTitle(newTitle);
  }

  function handleChangeQuestion(index: number, text: string, answer: boolean) {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], text, answer };
    setQuestions(newQuestions);
    validateQuestions(newQuestions);
  }

  function handleDeleteQuestion(index: number) {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    validateQuestions(newQuestions);
  }

  function handleReorderQuestion(from: number, to: number) {
    setQuestions((questions) => {
      const newQuestions = [...questions];
      const [moved] = newQuestions.splice(from, 1);
      newQuestions.splice(to, 0, moved);
      return newQuestions;
    });
  }

  function validateTitle(title: string) {
    if (!title.trim()) {
      setErrors((errors) => ({
        ...errors,
        title: "タイトルは必須です",
      }));
      return false;
    }
    setErrors((errors) => ({
      ...errors,
      title: undefined,
    }));
    return true;
  }

  function validateQuestions(questions: QuestionData[]) {
    let valid = true;
    let newQuestionError: string = "";

    if (questions.length === 0) {
      newQuestionError = "問題は1問以上必要です";
      valid = false;
    } else if (questions.some((q) => !q.text.trim())) {
      newQuestionError = "すべての問題文を入力してください";
      valid = false;
    }
    setErrors((prev) => ({ ...prev, questions: newQuestionError }));
    return valid;
  }

  function validate() {
    const isTitleValid = validateTitle(title);
    const areQuestionsValid = validateQuestions(questions);
    return isTitleValid && areQuestionsValid;
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
    setIsSaving(true);
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
          area-invalid={String(!!errors?.title)}
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
      {isSaving && <LoadingSpinner />}
    </div>
  );
}
