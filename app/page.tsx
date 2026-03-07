import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoggedInInfo from "@/components/LoggedInInfo";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  // user is guaranteed, so email may still be null/undefined in the type;
  // coerce to empty string to satisfy LoggedInInfo.
  return <LoggedInInfo email={session.user.email ?? ""} />;
}
