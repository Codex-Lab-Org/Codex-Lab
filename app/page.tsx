import { getBuildProvenance } from "@/lib/build-provenance";
import { DirectoryHomeExperience } from "@/components/directory-home-experience";
import { members } from "@/lib/members";

export default function Home() {
  return (
    <DirectoryHomeExperience
      initialMembers={members}
      buildProvenance={getBuildProvenance()}
    />
  );
}
