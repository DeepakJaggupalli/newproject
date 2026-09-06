"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { User } from "@/types";
import { api, slackConnectUrl } from "@/lib/api";
import { Button } from "./Button";
import { Logo } from "./Logo";

interface HeaderProps {
  user: User;
  onLoggedOut: () => void;
}

export function Header({ user, onLoggedOut }: HeaderProps) {
  const handleLogout = async () => {
    try {
      await api.logout();
      onLoggedOut();
    } catch {
      toast.error("Failed to log out");
    }
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-y-2 border-b border-white/5 bg-background/60 px-6 py-4 backdrop-blur-xl supports-[backdrop-filter]:sticky supports-[backdrop-filter]:top-0 supports-[backdrop-filter]:z-20">
      <div className="flex shrink-0 items-center gap-2 text-white">
        <Logo />
      </div>

      <div className="flex min-w-0 flex-wrap items-center justify-end gap-5">
        {user.slackConnected ? (
          <span className="flex shrink-0 items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.8)] animate-pulse" />
            Slack connected
          </span>
        ) : (
          <a href={slackConnectUrl()} className="shrink-0">
            <Button variant="secondary" type="button">
              Connect Slack
            </Button>
          </a>
        )}

        <div className="hidden h-7 w-px shrink-0 bg-white/10 sm:block" />

        <div className="flex min-w-0 items-center gap-3">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={36}
              height={36}
              className="shrink-0 rounded-full ring-2 ring-white/10"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white shadow-glass border border-white/10">
              {user.name.charAt(0)}
            </div>
          )}
          <div className="hidden min-w-0 text-sm leading-tight sm:block">
            <div className="truncate font-medium text-white/90">{user.name}</div>
            <div className="truncate text-zinc-500">{user.email}</div>
          </div>
        </div>

        <Button variant="ghost" className="shrink-0 text-zinc-400 hover:text-white" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
