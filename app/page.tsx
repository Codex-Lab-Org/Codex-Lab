import { DirectoryHome } from "@/components/directory-home";
import { members } from "@/lib/members";

export default function Home() {
  return <DirectoryHome initialMembers={members} />;
}
