"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleIcon, XIcon } from "lucide-react";

import { submitAnswer } from "./submit-answer";

export interface PlayQuizCardProps {
  currentQuestion: number;
  questionCount: number;
  questionText: string;
  sessionId: string;
}

export function PlayQuizCard(props: PlayQuizCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completed, setCompleted] = useState(false);

  const router = useRouter();

  async function handleAnswer(answer: boolean) {
    if (showAnswer) {
      return;
    }
    const { isCorrect, completed } = await submitAnswer(
      props.sessionId,
      answer,
    );
    setIsCorrect(isCorrect);
    setCompleted(completed);
    setShowAnswer(true);
  }

  async function handleNext() {
    router.refresh();
    setShowAnswer(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          問題 {props.currentQuestion + 1} / {props.questionCount}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-lg">{props.questionText}</p>
        {showAnswer && (
          <div className="flex items-center gap-2 text-xl">
            {isCorrect ? (
              <>
                <CircleIcon className="text-green-500" />
                正解
              </>
            ) : (
              <>
                <XIcon className="text-red-500" />
                不正解
              </>
            )}
          </div>
        )}
      </CardContent>
      {showAnswer ? (
        <CardFooter className="w-full">
          {completed ? (
            <Button className="w-full" onClick={handleNext}>
              結果を表示
            </Button>
          ) : (
            <Button className="w-full" onClick={handleNext}>
              次の問題へ
            </Button>
          )}
        </CardFooter>
      ) : (
        <CardFooter className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <Button
            variant="outline"
            className="w-full bg-green-500 hover:bg-green-400 text-white hover:text-white"
            onClick={() => handleAnswer(true)}
          >
            <CircleIcon />
            マル
          </Button>
          <Button
            variant="outline"
            className="w-full bg-red-500 hover:bg-red-400 text-white hover:text-white"
            onClick={() => handleAnswer(false)}
          >
            <XIcon />
            バツ
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
