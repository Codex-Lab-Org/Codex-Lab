import type { Member } from "@/lib/members";

export type GraphEdge = {
  sourceId: string;
  targetId: string;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getSharedPlatformCount(left: Member, right: Member) {
  return Object.entries(left.links).reduce((count, [platform, value]) => {
    if (!value || !right.links[platform as keyof Member["links"]]) {
      return count;
    }

    return count + 1;
  }, 0);
}

function getPairScore(left: Member, right: Member) {
  const sharedUniversity =
    left.university &&
    right.university &&
    normalize(left.university) === normalize(right.university);

  return getSharedPlatformCount(left, right) + (sharedUniversity ? 2 : 0);
}

export function buildGraphEdges(members: Member[]) {
  const sortedMembers = [...members].sort((left, right) =>
    left.name.localeCompare(right.name),
  );
  const candidatesByMember = new Map<
    string,
    Array<{ otherId: string; otherName: string; score: number }>
  >();

  for (const member of sortedMembers) {
    candidatesByMember.set(member.id, []);
  }

  for (let index = 0; index < sortedMembers.length; index += 1) {
    for (let offset = index + 1; offset < sortedMembers.length; offset += 1) {
      const left = sortedMembers[index];
      const right = sortedMembers[offset];
      const score = getPairScore(left, right);

      if (score === 0) {
        continue;
      }

      candidatesByMember.get(left.id)?.push({
        otherId: right.id,
        otherName: right.name,
        score,
      });
      candidatesByMember.get(right.id)?.push({
        otherId: left.id,
        otherName: left.name,
        score,
      });
    }
  }

  const seenEdges = new Set<string>();
  const edges: GraphEdge[] = [];

  for (const member of sortedMembers) {
    const topMatches =
      candidatesByMember
        .get(member.id)
        ?.sort((left, right) => {
          if (right.score !== left.score) {
            return right.score - left.score;
          }

          return left.otherName.localeCompare(right.otherName);
        })
        .slice(0, 2) ?? [];

    for (const match of topMatches) {
      const sourceId = member.id < match.otherId ? member.id : match.otherId;
      const targetId = member.id < match.otherId ? match.otherId : member.id;
      const edgeId = `${sourceId}:${targetId}`;

      if (seenEdges.has(edgeId)) {
        continue;
      }

      seenEdges.add(edgeId);
      edges.push({ sourceId, targetId });
    }
  }

  if (edges.length === 0) {
    for (let index = 0; index < sortedMembers.length - 1; index += 1) {
      edges.push({
        sourceId: sortedMembers[index].id,
        targetId: sortedMembers[index + 1].id,
      });
    }
  }

  return edges;
}

export function getConnectedMemberIds(memberId: string | null, members: Member[]) {
  if (!memberId) {
    return new Set<string>();
  }

  const edges = buildGraphEdges(members);
  const connectedIds = new Set<string>([memberId]);

  for (const edge of edges) {
    if (edge.sourceId === memberId) {
      connectedIds.add(edge.targetId);
    }

    if (edge.targetId === memberId) {
      connectedIds.add(edge.sourceId);
    }
  }

  return connectedIds;
}

export function formatWebsiteLabel(website?: string) {
  if (!website) {
    return "";
  }

  try {
    const normalizedWebsite = website.startsWith("http") ? website : `https://${website}`;
    const { host, pathname } = new URL(normalizedWebsite);
    const trimmedHost = host.replace(/^www\./, "");
    const trimmedPath = pathname === "/" ? "" : pathname.replace(/\/$/, "");

    return `${trimmedHost}${trimmedPath}`;
  } catch {
    return website.replace(/^https?:\/\//, "").replace(/^www\./, "");
  }
}

export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getAvatarTone(memberId: string) {
  const tones = [
    "from-[#AFE2F8] via-[#6DCBF4] to-[#3D8DFF]",
    "from-[#C89BFF] via-[#B06DFF] to-[#751ED9]",
    "from-[#CEF4C6] via-[#AAEAA1] to-[#49C779]",
    "from-[#F9A0A1] via-[#F67576] to-[#F45047]",
    "from-[#FDD8B9] via-[#FBB882] to-[#F87915]",
  ];
  const seed = memberId.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0);

  return tones[seed % tones.length];
}
