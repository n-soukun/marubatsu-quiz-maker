import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-2xl font-bold">
        {session ? `Hello, ${session.user?.name}!` : "Not signed in"}
      </h1>
    </main>
  );
}
