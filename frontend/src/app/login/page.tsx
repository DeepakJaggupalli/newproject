"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, googleLoginUrl } from "@/lib/api";
import { Button } from "@/components/Button";
import { LogoMark } from "@/components/Logo";

const FEATURES = [
  {
    title: "Schedule at scale",
    body: "Batch-send thousands of emails from a CSV or pasted list, staggered exactly how you want.",
  },
  {
    title: "Built-in rate limiting",
    body: "Per-sender delays and hourly caps are enforced automatically — nothing ever fires all at once.",
  },
  {
    title: "Survives restarts",
    body: "Every job is durable. Kill the server mid-run and nothing is lost or sent twice.",
  },
];

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.09A12 12 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.27a12 12 0 0 0 0 10.78l4-3.1Z" />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.44-3.44A11.94 11.94 0 0 0 12 0 12 12 0 0 0 1.27 6.61l4 3.1C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

function LoginCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api
      .me()
      .then(() => router.replace("/dashboard"))
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) return null;

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-glass-gradient shadow-glass border border-white/10 backdrop-blur-md animate-fade-in">
      <div className="mb-8 flex justify-center lg:hidden">
        <LogoMark className="h-14 w-14 text-white" />
      </div>

      <h1 className="text-center text-3xl font-semibold text-white lg:text-left">Welcome back</h1>
      <p className="mt-2 text-center text-sm text-zinc-400 lg:text-left">
        Sign in to schedule and track your batch email sends.
      </p>

      {searchParams.get("error") && (
        <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          Login failed. Please try again.
        </div>
      )}

      <a href={googleLoginUrl()} className="mt-8 block transition-transform hover:scale-[1.02] active:scale-[0.98]">
        <Button className="w-full gap-3 bg-white text-zinc-900 hover:bg-zinc-100 shadow-soft">
          <GoogleIcon />
          Continue with Google
        </Button>
      </a>

      <p className="mt-8 text-center text-xs text-zinc-500 lg:text-left">
        By continuing you agree this is a demo project — emails are sent through a sandboxed test
        inbox, never real recipients.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2 bg-background relative overflow-hidden">
      {/* Background glowing orb */}
      <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-brand-600/20 rounded-full blur-[120px] mix-blend-screen -z-10 animate-pulse-slow"></div>

      <div className="relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex border-r border-white/5 bg-black/20 backdrop-blur-sm z-10">
        
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 border border-brand-500/30 backdrop-blur-md shadow-glass">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-brand-400" aria-hidden="true">
              <path
                d="M3 7.5 12 13l9-5.5M4.5 5h15A1.5 1.5 0 0 1 21 6.5v11A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-11A1.5 1.5 0 0 1 4.5 5Z"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xl font-semibold tracking-tight text-white/90">EmailScheduler</span>
        </div>

        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Batch email delivery,
            <br />
            engineered properly.
          </h2>
          <p className="mt-4 max-w-sm text-sm text-zinc-400 leading-relaxed">
            A scheduler built on durable queues, atomic rate limits, and zero cron jobs — designed
            to survive restarts and never double-send.
          </p>

          <ul className="mt-12 flex flex-col gap-8">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex gap-4 group">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500 shadow-[0_0_10px_rgba(139,92,246,0.8)] group-hover:scale-125 transition-transform" />
                <div>
                  <div className="text-sm font-semibold text-white/90">{f.title}</div>
                  <div className="text-sm text-zinc-400 mt-1">{f.body}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center gap-4 text-xs font-medium text-zinc-500">
          <span className="px-2 py-1 rounded-md bg-white/5 border border-white/5">Redis</span>
          <span className="px-2 py-1 rounded-md bg-white/5 border border-white/5">Postgres</span>
          <span className="px-2 py-1 rounded-md bg-white/5 border border-white/5">Elasticsearch</span>
          <span className="px-2 py-1 rounded-md bg-white/5 border border-white/5">BullMQ</span>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 z-10 relative">
        {/* Right side background orb */}
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[100px] -translate-y-1/2 -z-10"></div>
        <Suspense fallback={null}>
          <LoginCard />
        </Suspense>
      </div>
    </main>
  );
}
