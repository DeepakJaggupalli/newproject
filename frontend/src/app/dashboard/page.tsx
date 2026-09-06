"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { EmailRecord, User } from "@/types";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { EmailsTable } from "@/components/EmailsTable";
import { ComposeModal } from "@/components/ComposeModal";
import { StatCard } from "@/components/StatCard";
import { CheckCircleIcon, ClockIcon, MailIcon, PlusIcon, XCircleIcon } from "@/components/icons";

type Tab = "scheduled" | "sent";

function SlackStatusToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const slackStatus = searchParams.get("slack");
    if (slackStatus === "connected") toast.success("Slack connected");
    if (slackStatus === "error") toast.error("Failed to connect Slack");
  }, [searchParams]);

  return null;
}

function DashboardContent() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [tab, setTab] = useState<Tab>("scheduled");
  const [scheduled, setScheduled] = useState<EmailRecord[]>([]);
  const [sent, setSent] = useState<EmailRecord[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);

  useEffect(() => {
    api
      .me()
      .then(setUser)
      .catch(() => router.replace("/login"))
      .finally(() => setLoadingUser(false));
  }, [router]);

  const loadEmails = useCallback(async () => {
    setLoadingEmails(true);
    try {
      const [scheduledEmails, sentEmails] = await Promise.all([api.scheduledEmails(), api.sentEmails()]);
      setScheduled(scheduledEmails);
      setSent(sentEmails);
    } catch {
      toast.error("Failed to load emails");
    } finally {
      setLoadingEmails(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadEmails();
  }, [user, loadEmails]);

  const stats = useMemo(() => {
    const sentCount = sent.filter((e) => e.status === "sent").length;
    const failedCount = sent.filter((e) => e.status === "failed").length;
    return {
      scheduled: scheduled.length,
      sent: sentCount,
      failed: failedCount,
      total: scheduled.length + sent.length,
    };
  }, [scheduled, sent]);

  if (loadingUser || !user) return null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glowing orb */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-brand-600/10 rounded-full blur-[120px] mix-blend-screen -z-10 animate-pulse-slow"></div>

      <Suspense fallback={null}>
        <SlackStatusToast />
      </Suspense>

      <Header user={user} onLoggedOut={() => router.replace("/login")} />

      <main className="mx-auto max-w-6xl px-6 py-10 z-10 relative">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Overview</h1>
            <p className="mt-2 text-sm text-zinc-400">Track everything moving through your send queue.</p>
          </div>
          <Button onClick={() => setComposeOpen(true)} className="gap-2 bg-brand-600 hover:bg-brand-500 text-white border-0 shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all hover:scale-105 active:scale-95">
            <PlusIcon />
            Compose new email
          </Button>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total emails" value={stats.total} icon={<MailIcon />} accent="brand" />
          <StatCard label="Scheduled" value={stats.scheduled} icon={<ClockIcon />} accent="amber" />
          <StatCard label="Sent" value={stats.sent} icon={<CheckCircleIcon />} accent="emerald" />
          <StatCard label="Failed" value={stats.failed} icon={<XCircleIcon />} accent="red" />
        </div>

        <div className="mb-6 flex gap-1 rounded-xl bg-zinc-900/50 p-1.5 w-fit border border-white/5 backdrop-blur-md">
          {(["scheduled", "sent"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-5 py-2 text-sm font-medium capitalize transition-all duration-200 ${
                tab === t ? "bg-zinc-800 text-white shadow-sm ring-1 ring-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {t} emails
            </button>
          ))}
        </div>

        {tab === "scheduled" ? (
          <EmailsTable emails={scheduled} isLoading={loadingEmails} variant="scheduled" />
        ) : (
          <EmailsTable emails={sent} isLoading={loadingEmails} variant="sent" />
        )}
      </main>

      <ComposeModal isOpen={composeOpen} onClose={() => setComposeOpen(false)} onScheduled={loadEmails} />
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
