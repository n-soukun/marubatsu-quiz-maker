"use client";

import { Suspense } from "react";
import LoginForm from "./form";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Suspense
            fallback={
              <div className="flex h-48 w-full items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
