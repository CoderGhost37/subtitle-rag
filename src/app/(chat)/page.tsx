import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getPathwaysBasicInfo } from "@/actions/admin/get-pathways-basic-info";
import { ChatInitial } from "@/components/chat/chat-initial";

export default async function Home() {
  const [user, pathways] = await Promise.all([
    currentUser(),
    getPathwaysBasicInfo(),
  ]);
  if (!user) {
    redirect("/login");
  }
  return <ChatInitial pathways={pathways} userId={user.id} />;
}
