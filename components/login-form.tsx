import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "@/auth";

export interface LoginFormProps extends React.ComponentProps<"div"> {
  callbackUrl?: string;
}

export function LoginForm({
  className,
  callbackUrl,
  ...props
}: LoginFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
          <CardDescription>
            ログインすると、クイズの作成やスコアの記録ができるようになります！
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server";
              await signIn("discord", { redirectTo: callbackUrl || "/" });
            }}
          >
            <Button
              variant="outline"
              type="submit"
              className="w-full bg-[#5865F2] text-white hover:bg-[#5865F2]/90 hover:text-white"
            >
              Discordでログイン
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
