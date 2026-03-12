"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type TerminalLine = {
  text: string;
  kind?: "typing" | "output";
  className?: string;
  charDelay?: number;
  holdMs?: number;
  prefix?: string;
};

type TerminalLoaderProps = {
  className?: string;
  completeHoldMs?: number;
  lines: TerminalLine[];
  onComplete?: () => void;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type LineProps = TerminalLine & {
  active: boolean;
  onComplete: () => void;
};

function TypingLine({
  active,
  charDelay = 28,
  className,
  holdMs = 160,
  onComplete,
  prefix = "$",
  text,
}: LineProps) {
  const prefersReducedMotion = useReducedMotion();
  const [displayedText, setDisplayedText] = useState(() =>
    prefersReducedMotion ? text : "",
  );
  const completedRef = useRef(false);

  useEffect(() => {
    if (!active || completedRef.current) {
      return;
    }

    if (prefersReducedMotion) {
      completedRef.current = true;
      const timeoutId = window.setTimeout(onComplete, 0);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }

    let currentIndex = 0;
    let finishTimeout: number | null = null;
    const typingInterval = window.setInterval(() => {
      currentIndex += 1;
      setDisplayedText(text.slice(0, currentIndex));

      if (currentIndex >= text.length) {
        window.clearInterval(typingInterval);
        completedRef.current = true;
        finishTimeout = window.setTimeout(onComplete, holdMs);
      }
    }, charDelay);

    return () => {
      window.clearInterval(typingInterval);
      if (finishTimeout !== null) {
        window.clearTimeout(finishTimeout);
      }
    };
  }, [active, charDelay, holdMs, onComplete, prefersReducedMotion, text]);

  const isFinished = displayedText.length === text.length;

  return (
    <div className={cn("flex items-start gap-3 text-white", className)}>
      <span className="select-none text-[#7dd3fc]">{prefix}</span>
      <span className="min-w-0 break-words">
        {displayedText}
        {active && !isFinished ? <span className="terminal-cursor ml-0.5" /> : null}
      </span>
    </div>
  );
}

function OutputLine({
  active,
  className,
  holdMs = 140,
  onComplete,
  prefix = "✔",
  text,
}: LineProps) {
  const prefersReducedMotion = useReducedMotion();
  const completedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!active || !prefersReducedMotion || completedRef.current) {
      return;
    }

    completedRef.current = true;
    onComplete();
  }, [active, onComplete, prefersReducedMotion]);

  return (
    <motion.div
      className={cn("flex items-start gap-3 text-[#dff6dc]", className)}
      initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.22 }}
      onAnimationComplete={() => {
        if (!active || completedRef.current || prefersReducedMotion) {
          return;
        }

        completedRef.current = true;
        timeoutRef.current = window.setTimeout(onComplete, holdMs);
      }}
    >
      <span className="select-none text-[#86efac]">{prefix}</span>
      <span className="min-w-0 break-words">{text}</span>
    </motion.div>
  );
}

export function TerminalLoader({
  className,
  completeHoldMs = 280,
  lines,
  onComplete,
}: TerminalLoaderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    if (activeIndex < lines.length || completedRef.current) {
      return;
    }

    completedRef.current = true;
    const timeoutId = window.setTimeout(() => {
      onComplete?.();
    }, completeHoldMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeIndex, completeHoldMs, lines.length, onComplete]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "terminal-font w-full overflow-hidden rounded-[28px] border border-white/8 bg-[#0d1118] text-sm shadow-[0_32px_120px_rgba(13,17,24,0.44)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/8 bg-white/4 px-5 py-4">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-white/40">codex-lab@directory</span>
      </div>

      <pre className="overflow-x-auto px-5 py-5 text-sm leading-7 sm:px-6 sm:py-6">
        <code className="grid gap-1">
          {lines.map((line, index) => {
            if (index > activeIndex) {
              return null;
            }

            const handleComplete = () => {
              setActiveIndex((current) => (current === index ? current + 1 : current));
            };

            if (line.kind === "output") {
              return (
                <OutputLine
                  key={`${index}-${line.text}`}
                  active={index === activeIndex}
                  onComplete={handleComplete}
                  {...line}
                />
              );
            }

            return (
              <TypingLine
                key={`${index}-${line.text}`}
                active={index === activeIndex}
                onComplete={handleComplete}
                {...line}
              />
            );
          })}
        </code>
      </pre>
    </div>
  );
}
