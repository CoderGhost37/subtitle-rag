import { getPathwaysBasicInfo } from "@/actions/admin/get-pathways-basic-info";
import { ChatInitial } from "@/components/chat/chat-initial";

export default async function Home() {
  const pathways = await getPathwaysBasicInfo();
  return <ChatInitial pathways={pathways} />;
}
