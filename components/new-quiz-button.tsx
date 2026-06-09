"use client";

import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigationRouter } from "@/components/navigation";

export function NewQuizButton() {
  const router = useNavigationRouter();
  return (
    <button
      className={cn(
        " flex items-center rounded-md bg-orange-600 text-white border-b-2 border-orange-800 px-3 py-1 text-sm font-medium transition-colors",
        "hover:bg-orange-500 hover:border-orange-700",
        "disabled:opacity-50 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2",
        " active:border-b-0  active:mt-0.5 active:bg-orange-600",
      )}
      type="submit"
      onClick={() => {
        router.push("/quizzes/new");
      }}
    >
      <PlusIcon />
      <span className="mx-2">クイズ作成</span>
    </button>
  );
}
