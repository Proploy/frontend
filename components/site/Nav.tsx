'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useExpertApplication } from "@/features/experts/use-expert-application";
import type { ExpertMe } from "@/features/experts/types";
import { setAuthIntent } from "@/lib/utils/auth-intent-client";

// Curated from the legacy global Navbar. The legacy version had two mega-menus
// (Explore Products / Explore Experts) plus an "About Us" dropdown; those are
// flattened here into four real top-level destinations. Category and expert
// filtering still live on /products and /experts themselves.
const LINKS = [
  { href: "/products", label: "Products" },
  { href: "/experts", label: "Experts" },
  { href: "/for-businesses", label: "For business" },
  { href: "/for-experts", label: "For experts" },
];

export function Nav() {
  const { user, signOut } = useAuth();
  const { getApplication } = useExpertApplication();
  const [expertState, setExpertState] = useState<{ userId: string; expert: ExpertMe | null } | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const userId = user?.id;

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setScrolled(h.scrollTop > 12);
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? h.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Expert application state drives the CTA, same as the legacy Navbar.
  useEffect(() => {
    if (!userId) return;
    const currentUserId = userId;
    let cancelled = false;
    async function loadExpertStatus() {
      const result = await getApplication();
      if (cancelled) return;
      setExpertState({ userId: currentUserId, expert: result.ok ? result.data : null });
    }
    void loadExpertStatus();
    return () => {
      cancelled = true;
    };
  }, [getApplication, userId]);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (!profileRef.current?.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const expert = expertState && expertState.userId === userId ? expertState.expert : null;
  const status = expert?.status;
  const showDashboard = status === "approved";
  const showPending = status === "submitted";
  const showComplete = status === "draft" || status === "changes_requested";

  const ctaLabel = showDashboard
    ? "Expert Dashboard"
    : showPending
    ? "Application Pending"
    : showComplete
    ? "Complete Application"
    : "Find an Expert";

  const ctaHref = showDashboard
    ? "/experts/dashboard"
    : showComplete
    ? "/become-expert"
    : showPending
    ? "#"
    : "/experts";

  const handleCtaClick = (e: React.MouseEvent) => {
    if (showPending) {
      e.preventDefault();
      return;
    }
    if (!user && ctaHref === "/become-expert") {
      e.preventDefault();
      setAuthIntent("/become-expert");
      window.location.href = "/sign-in?redirect=/become-expert";
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-all duration-500 ${
          scrolled ? "bg-paper/85 backdrop-blur-xl border-b border-border" : "border-b border-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-[1240px] items-center gap-8 px-6 lg:px-10"
        >
          <Link href="/" aria-label="Proploy home" className="flex shrink-0 items-center">
            <Logo />
          </Link>

          <ul className="ml-2 hidden items-center gap-7 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="relative text-[0.875rem] text-ink-soft transition-colors hover:text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-cobalt after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-3">
            {user ? (
              <div ref={profileRef} className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  className="grid h-8 w-8 place-items-center rounded-full bg-ink text-[0.7rem] font-medium text-paper transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {(user.email ?? "?").charAt(0).toUpperCase()}
                </button>
                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+10px)] w-56 overflow-hidden rounded-xl border border-border bg-white p-1.5 shadow-[0_24px_48px_-16px_rgba(10,13,18,0.18)]"
                  >
                    <p className="truncate px-2.5 py-2 text-[0.75rem] text-ink-soft">{user.email}</p>
                    <Link
                      href="/settings"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.85rem] text-ink transition-colors hover:bg-cobalt-soft/50"
                    >
                      <Settings className="h-4 w-4 text-ink-soft" />
                      Settings
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={async () => {
                        await signOut();
                        setProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[0.85rem] text-ink transition-colors hover:bg-cobalt-soft/50"
                    >
                      <LogOut className="h-4 w-4 text-ink-soft" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="hidden text-[0.875rem] text-ink-soft transition-colors hover:text-ink sm:block"
              >
                Log in
              </Link>
            )}

            <Link
              href={ctaHref}
              onClick={handleCtaClick}
              aria-disabled={showPending}
              className={`group relative hidden h-9 items-center gap-2 overflow-hidden rounded-full bg-ink px-4 text-[0.8125rem] font-medium text-paper transition-transform duration-300 sm:inline-flex ${
                showPending ? "cursor-default opacity-60" : "hover:-translate-y-0.5"
              }`}
            >
              <span className="relative z-10">{ctaLabel}</span>
              {!showPending && (
                <span className="absolute inset-0 -translate-x-full bg-cobalt transition-transform duration-500 group-hover:translate-x-0" />
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-ink transition-colors hover:border-cobalt hover:text-cobalt md:hidden"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="border-t border-border bg-paper/95 backdrop-blur-xl md:hidden">
            <ul className="mx-auto flex max-w-[1240px] flex-col px-6 py-3">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-2.5 text-[0.9375rem] text-ink-soft transition-colors hover:text-cobalt"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
                {user ? (
                  <>
                    <Link href="/settings" onClick={() => setMenuOpen(false)} className="py-1.5 text-[0.9375rem] text-ink-soft">
                      Settings
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        await signOut();
                        setMenuOpen(false);
                      }}
                      className="py-1.5 text-left text-[0.9375rem] text-ink-soft"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="py-1.5 text-[0.9375rem] text-ink-soft">
                    Log in
                  </Link>
                )}
                <Link
                  href={ctaHref}
                  onClick={(e) => {
                    handleCtaClick(e);
                    if (!showPending) setMenuOpen(false);
                  }}
                  className="mt-1 inline-flex h-10 items-center justify-center rounded-full bg-ink px-4 text-[0.875rem] font-medium text-paper"
                >
                  {ctaLabel}
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div
        aria-hidden
        className="h-px origin-left bg-cobalt"
        style={{ transform: `scaleX(${progress})` }}
      />
    </header>
  );
}

// Real Proploy lockup (mark + wordmark). Replaces the prototype's placeholder
// SVG; the adjacent "Proploy" text is dropped since the lockup includes it.
export function Logo({ className = "h-7" }: { className?: string }) {
  return (
    <Image
      src="/proploy-logo.png"
      alt="Proploy"
      width={456}
      height={128}
      priority
      className={`${className} w-auto`}
    />
  );
}
