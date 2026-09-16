"use client";

import {
  ArrowUp,
  BriefcaseBusiness,
  Headphones,
  KanbanSquare,
  UsersRound,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  clampComposerHeight,
  composerOverflows,
} from "@/features/ai-workspace/composer-autogrow";

const STARTERS = [
  {
    label: "Implementation plan",
    Icon: BriefcaseBusiness,
    prompt:
      "I need to create an implementation plan. Ask me about our team structure, management approach, current workflow, and end goal before recommending products.",
  },
  {
    label: "Project management",
    Icon: KanbanSquare,
    prompt: "Help me evaluate project management software.",
  },
  {
    label: "Customer support",
    Icon: Headphones,
    prompt: "Help me evaluate customer support software.",
  },
  { label: "CRM", Icon: UsersRound, prompt: "Help me evaluate CRM software." },
];

const STEPS = [
  ["01", "Share your need", "Goals, team and workflow."],
  ["02", "Review the shortlist", "Relevant products, explained."],
  ["03", "Choose with confidence", "Compare and plan the rollout."],
];

const useMeasureEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function WelcomeState({
  onPrompt,
  disabled = false,
}: {
  onPrompt: (message: string) => void;
  disabled?: boolean;
}) {
  const [draft, setDraft] = useState("");
  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  const measureComposer = useCallback(() => {
    const node = composerRef.current;
    if (!node) return;
    node.style.height = "auto";
    const contentHeight = node.scrollHeight;
    node.style.height = `${clampComposerHeight(contentHeight)}px`;
    node.style.overflowY = composerOverflows(contentHeight) ? "auto" : "hidden";
  }, []);

  useMeasureEffect(measureComposer, [draft]);

  useEffect(() => {
    window.addEventListener("resize", measureComposer);
    return () => window.removeEventListener("resize", measureComposer);
  }, [measureComposer]);

  const submit = (message = draft) => {
    const value = message.trim();
    if (!value || disabled) return;
    setDraft("");
    onPrompt(value);
  };

  return (
    <div className="relative flex min-h-full w-full items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
      <div
        aria-hidden
        className="blueprint pointer-events-none absolute inset-0 opacity-45 [mask-image:radial-gradient(72%_70%_at_50%_40%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-36 left-1/2 size-[32rem] -translate-x-1/2 rounded-full bg-cobalt/10 blur-3xl"
      />
      <div
        data-testid="welcome-content"
        className="relative w-full max-w-[760px] min-w-0 text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-cobalt/20 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur">
          <span
            className="pulse-dot size-1.5 rounded-full bg-cobalt"
            aria-hidden
          />
          <span className="label !text-[0.65rem] !text-cobalt-deep">
            Software procurement
          </span>
        </span>
        <h2 className="display mx-auto mt-5 max-w-[17ch] text-[clamp(2.15rem,5vw,3.35rem)] leading-[0.98] text-ink">
          What are you looking to make happen?
        </h2>
        <p className="mx-auto mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-soft">
          Describe what your team needs. You will get a tailored shortlist, an
          easy comparison, and a practical rollout plan.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="relative mt-7 rounded-[1.25rem] border border-cobalt/25 bg-white/85 p-2 text-left shadow-[0_20px_50px_-28px_rgba(45,99,255,0.55)] backdrop-blur transition focus-within:border-cobalt/60 focus-within:shadow-[0_24px_60px_-28px_rgba(45,99,255,0.65)]"
        >
          <textarea
            ref={composerRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                submit();
              }
            }}
            disabled={disabled}
            placeholder="Describe your goal, team, workflow, or the software you want to improve..."
            rows={1}
            className="block min-h-[56px] w-full resize-none overflow-y-hidden bg-transparent px-4 py-4 pr-14 text-[0.9375rem] leading-6 text-ink outline-none placeholder:text-ink-soft/75 disabled:cursor-wait"
          />
          <button
            type="submit"
            disabled={!draft.trim() || disabled}
            aria-label="Start evaluation"
            className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-xl bg-cobalt text-white shadow-[0_8px_16px_-10px_rgba(45,99,255,0.9)] transition hover:-translate-y-0.5 hover:bg-cobalt-deep disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowUp size={18} aria-hidden />
          </button>
        </form>

        <div
          className="mt-4 flex flex-wrap justify-center gap-2"
          aria-label="Suggested starting points"
        >
          {STARTERS.map(({ label, Icon, prompt }) => (
            <button
              key={label}
              type="button"
              disabled={disabled}
              onClick={() => onPrompt(prompt)}
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-white/75 px-3 py-2 text-[0.8125rem] font-medium text-ink-soft shadow-sm transition hover:-translate-y-0.5 hover:border-cobalt/45 hover:bg-cobalt-soft hover:text-cobalt-deep disabled:cursor-wait disabled:opacity-50"
            >
              <Icon size={15} className="text-cobalt" aria-hidden />
              {label}
            </button>
          ))}
        </div>

        <ol className="mx-auto mt-10 grid max-w-[680px] gap-3 text-left sm:grid-cols-3">
          {STEPS.map(([n, title, body], index) => (
            <li
              key={n}
              className="relative rounded-2xl border border-border/70 bg-white/60 p-3.5 backdrop-blur-sm"
            >
              {index < STEPS.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute left-[calc(100%+0.2rem)] top-1/2 hidden h-px w-3 bg-cobalt/30 sm:block"
                />
              ) : null}
              <span className="font-mono text-[0.65rem] tracking-[0.16em] text-cobalt">
                {n}
              </span>
              <p className="mt-1 text-[0.85rem] font-medium text-ink">
                {title}
              </p>
              <p className="mt-0.5 text-[0.75rem] leading-5 text-ink-soft">
                {body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
