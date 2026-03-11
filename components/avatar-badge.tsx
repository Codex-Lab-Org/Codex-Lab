import type { Member } from "@/lib/members";
import { getAvatarTone, getInitials } from "@/lib/directory";

type AvatarBadgeProps = {
  member: Member;
  size?: "sm" | "lg";
};

export function AvatarBadge({ member, size = "sm" }: AvatarBadgeProps) {
  const wrapperSize = size === "lg" ? "h-14 w-14 text-sm" : "h-10 w-10 text-[0.68rem]";

  if (member.avatar) {
    return (
      <span
        className={`inline-flex shrink-0 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--panel-strong)] ${wrapperSize}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={member.name} className="h-full w-full object-cover" src={member.avatar} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-gradient-to-br ${getAvatarTone(member.id)} font-mono font-medium uppercase tracking-[0.18em] text-slate-950 shadow-[0_12px_30px_rgba(61,141,255,0.16)] ${wrapperSize}`}
    >
      {getInitials(member.name)}
    </span>
  );
}
