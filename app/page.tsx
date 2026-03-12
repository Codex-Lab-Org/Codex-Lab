import { getBuildProvenance } from "@/lib/build-provenance";
import { DirectoryHomeExperience } from "@/components/directory-home-experience";
import { members } from "@/lib/members";

type HomeProps = {
  searchParams: Promise<{
    skipIntro?: string | string[];
  }>;
};

function shouldSkipIntro(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value.includes("1") || value.includes("true");
  }

  return value === "1" || value === "true";
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  return (
    <DirectoryHomeExperience
      initialMembers={members}
      buildProvenance={getBuildProvenance()}
      skipIntro={shouldSkipIntro(params.skipIntro)}
    />
  );
}
