"use client";

import { Clock, CalendarDays, Trophy, BarChart3 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { formatDuration, formatCurrency } from "@/lib/utils";
import { isThisWeek, isThisMonth } from "date-fns";
import Link from "next/link";

interface ChipCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accentVar: string;
  extra?: React.ReactNode;
  variant?: "default" | "horizontal";
  className?: string;
}

function ChipCard({
  label,
  value,
  icon,
  accentVar,
  extra,
  variant = "default",
  className = "",
}: ChipCardProps) {
  const bg = `color-mix(in srgb, ${accentVar} 12%, var(--color-surface))`;
  const iconBg = `color-mix(in srgb, ${accentVar} 20%, var(--color-surface))`;

  if (variant === "horizontal") {
    return (
      <div
        className={`flex items-center gap-4 rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.01] ${className}`}
        style={{ background: bg }}
      >
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)]"
          style={{ background: iconBg, color: accentVar }}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink-soft)]">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--color-ink)] leading-tight truncate">
            {value}
          </p>
        </div>
      </div>
    );
  }

  if (extra) {
    return (
      <div
        className={`flex flex-col gap-2 rounded-[var(--radius-lg)] p-4 shadow-[var(--shadow-soft)] ${className}`}
        style={{ background: bg }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)]"
            style={{ background: iconBg, color: accentVar }}
          >
            {icon}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">
            {label}
          </p>
        </div>
        <div>
          <p className="text-lg font-bold tabular-nums text-[var(--color-ink)] leading-tight truncate">
            {value}
          </p>
          <div className="mt-1 border-t border-[color-mix(in_srgb,black_5%,transparent)] pt-1">
            {extra}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col gap-3 rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-soft)] ${className}`}
      style={{ background: bg }}
    >
      <div
        className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)]"
        style={{ background: iconBg, color: accentVar }}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-soft)]">
          {label}
        </p>
        <p className="mt-1 text-xl font-semibold tabular-nums text-[var(--color-ink)] leading-tight truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function SummaryGrid() {
  const projects = useAppStore((state) => state.projects);
  const sessions = useAppStore((state) => state.sessions);

  // Stats calculations
  const totalSeconds = sessions.reduce((sum, s) => sum + s.duration, 0);
  const avgSeconds =
    sessions.length > 0 ? Math.floor(totalSeconds / sessions.length) : 0;

  const projectDurations = projects
    .map((p) => ({
      name: p.name,
      duration: sessions
        .filter((s) => s.projectId === p.id)
        .reduce((sum, s) => sum + s.duration, 0),
    }))
    .sort((a, b) => b.duration - a.duration);

  const topProject =
    projectDurations[0]?.duration > 0 ? projectDurations[0].name : "—";

  const getMoney = (filterFn: (date: Date) => boolean) => {
    const filtered = sessions.filter((s) => filterFn(new Date(s.startTime)));
    const usd = filtered.reduce((sum, s) => {
      const p = projects.find((proj) => proj.id === s.projectId);
      return p?.currency === "USD" ? sum + s.earnings : sum;
    }, 0);
    const ars = filtered.reduce((sum, s) => {
      const p = projects.find((proj) => proj.id === s.projectId);
      return p?.currency === "ARS" ? sum + s.earnings : sum;
    }, 0);
    const seconds = filtered.reduce((sum, s) => sum + s.duration, 0);
    return { usd, ars, seconds };
  };

  const week = getMoney((d) => isThisWeek(d, { weekStartsOn: 1 }));
  const month = getMoney((d) => isThisMonth(d));

  const MoneyBreakdown = ({ usd, ars }: { usd: number; ars: number }) => (
    <div className="flex flex-col gap-0.5 text-[10px] font-medium text-[var(--color-ink-soft)]">
      <div className="flex justify-between">
        <span>USD</span>
        <span className="tabular-nums">{formatCurrency(usd, "USD")}</span>
      </div>
      <div className="flex justify-between">
        <span>ARS</span>
        <span className="tabular-nums">{formatCurrency(ars, "ARS")}</span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      {/* Left side: Highlights (3/4) */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        {/* 1. Project Dock - macOS Style */}
        <div className="rounded-2xl shadow-[var(--shadow-soft)] hover:shadow-md transition-shadow duration-300">
          <div
            className="flex items-center gap-4 rounded-2xl p-5 transition-all duration-300"
            style={{
              background:
                "color-mix(in srgb, var(--color-ink) 5%, var(--color-surface))",
            }}
          >
            <div className="flex flex-col gap-0.5 min-w-[80px]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">
                Projects
              </span>
              <span className="text-xs font-semibold text-[var(--color-ink)]">
                {projects.length} Active
              </span>
            </div>
            <div className="h-8 w-px bg-[var(--color-ink-softest)] mx-2" />
            <div className="flex -space-x-2 overflow-visible">
              {projects.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  title={p.name}
                  className="group relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--color-surface)] shadow-sm transition-all hover:z-10 hover:scale-110 hover:-translate-y-1 cursor-pointer"
                  style={{
                    background: `color-mix(in srgb, ${i % 2 === 0 ? "var(--color-grape)" : "var(--color-sky)"} 15%, var(--color-surface))`,
                    color:
                      i % 2 === 0 ? "var(--color-grape)" : "var(--color-sky)",
                  }}
                >
                  <span className="text-sm font-bold">{p.name.charAt(0)}</span>
                </Link>
              ))}
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-[var(--color-ink-softest)] text-[var(--color-ink-soft)] hover:bg-[var(--color-ink-softest)] transition-colors cursor-pointer">
                <span className="text-lg">+</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Bottom Row - Partitioned Metrics */}
        <div className="grid grid-cols-2 shadow-[var(--shadow-soft)] rounded-r-2xl overflow-hidden">
          {[
            {
              label: "Top Project",
              value: topProject,
              icon: <Trophy size={18} />,
              accentVar: "var(--color-grape)",
            },
            {
              label: "Avg Session",
              value: formatDuration(avgSeconds),
              icon: <BarChart3 size={18} />,
              accentVar: "var(--color-tangerine)",
            },
          ].map((card, i) => (
            <ChipCard
              key={i}
              {...card}
              className={i === 0 ? "!rounded-r-none border-r border-[color-mix(in_srgb,black_6%,transparent)]" : "!rounded-none"}
            />
          ))}
        </div>
      </div>

      {/* Right side: Stacked mini chips (1/4) */}
      <div className="flex flex-col gap-3 lg:mt-[-48px]">
        {[
          {
            label: "This Week",
            value: formatDuration(week.seconds),
            icon: <CalendarDays size={16} />,
            accentVar: "var(--color-lime)",
            extra: <MoneyBreakdown usd={week.usd} ars={week.ars} />,
          },
          {
            label: "This Month",
            value: formatDuration(month.seconds),
            icon: <Clock size={16} />,
            accentVar: "var(--color-sky)",
            extra: <MoneyBreakdown usd={month.usd} ars={month.ars} />,
          },
        ].map((card, i) => (
          <div
            key={i}
            className="rounded-2xl shadow-[var(--shadow-soft)] hover:shadow-md transition-shadow duration-300"
          >
            <ChipCard
              {...card}
              className="transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
