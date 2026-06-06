import { auth } from "@/auth";
import { Header } from "@/components/header";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const user = session?.user
    ? {
        name: session.user.name || "",
        image: session.user.image || "",
      }
    : undefined;

  return (
    <>
      <Header user={user} />
      {children}
    </>
  );
}
