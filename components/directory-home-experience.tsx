"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

import { DirectoryHome } from "@/components/directory-home";
import { TerminalLoader } from "@/components/terminal-loader";
import type { BuildProvenance } from "@/lib/build-provenance";
import type { Member } from "@/lib/members";

type DirectoryHomeExperienceProps = {
  buildProvenance: BuildProvenance;
  initialMembers: Member[];
  skipIntro?: boolean;
};

const easing = [0.22, 1, 0.36, 1] as const;

export function DirectoryHomeExperience({
  buildProvenance,
  initialMembers,
  skipIntro = false,
}: DirectoryHomeExperienceProps) {
  const prefersReducedMotion = useReducedMotion();
  const [introComplete, setIntroComplete] = useState(skipIntro || prefersReducedMotion);

  const introLines = useMemo(
    () => [
      {
        text: "pnpm codex-lab:start",
        charDelay: 34,
        className: "text-[#7dd3fc]",
      },
      {
        kind: "output" as const,
        text: `Loaded ${initialMembers.length} onboarding profiles.`,
      },
      {
        kind: "output" as const,
        text: "Mapped shared schools and public social links.",
      },
      {
        text: "open /student-directory",
        charDelay: 24,
      },
      {
        kind: "output" as const,
        prefix: "→",
        text: "Rendering Codex Lab.",
        className: "text-[#fef08a]",
        holdMs: 2000,
      },
    ],
    [initialMembers.length],
  );

  if (prefersReducedMotion || skipIntro) {
    return <DirectoryHome buildProvenance={buildProvenance} initialMembers={initialMembers} />;
  }

  return (
    <AnimatePresence mode="wait">
      {introComplete ? (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.24, ease: easing }}
        >
          <DirectoryHome buildProvenance={buildProvenance} initialMembers={initialMembers} />
        </motion.div>
      ) : (
        <motion.section
          key="loader"
          className="flex min-h-screen items-center px-4 py-8 sm:px-6 lg:px-8"
          exit={{ opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.28, ease: easing }}
        >
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl space-y-4">
              <p className="micro-label text-[var(--muted)]">Codex Lab</p>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold leading-none tracking-[-0.06em] text-[var(--text)] sm:text-5xl">
                  Launching the student directory
                </h1>
                <p className="max-w-lg text-base leading-7 text-[var(--muted)]">
                  Booting the roster, social graph, and provenance panel before the
                  full interface opens.
                </p>
              </div>
              <p className="sr-only">Launching the Codex Lab student directory.</p>
            </div>

            <motion.div
              className="w-full max-w-2xl lg:max-w-xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: easing }}
            >
              <TerminalLoader lines={introLines} onComplete={() => setIntroComplete(true)} />
            </motion.div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
