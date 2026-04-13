"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface ProjectStat {
  projectId: string;
  title: string;
  finalVotes: number;
  honorableMentions: number;
  timesInBank: number;
  timesShown: number;
  timesSwipedRight: number;
  bankRate: number;
}

interface StatsData {
  totalVoters: number;
  projects: ProjectStat[];
}

export default function AdminPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  async function fetchStats() {
    try {
      const res = await fetch("/api/stats");
      if (res.status === 403) {
        setForbidden(true);
        setLoading(false);
        return;
      }
      if (res.status === 401) {
        router.replace("/");
        return;
      }
      const data = await res.json();
      setStats(data);
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }
    fetchStats();
    const interval = setInterval(fetchStats, 10_000);
    return () => clearInterval(interval);
  }, [authLoading, isAuthenticated, router]);

  if (forbidden) {
    return (
      <div className="min-h-screen bg-card-dark flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl mb-4 block">🔒</span>
          <p className="text-slate-400">Доступ запрещён</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card-dark p-4 sm:p-8 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">HackSwipe Admin</h1>
            <p className="text-sm text-slate-500 mt-1">
              Результаты голосования в реальном времени
            </p>
          </div>
          <button
            onClick={fetchStats}
            className="px-4 py-2 rounded-xl text-sm glass text-slate-300 hover:text-white transition-colors"
          >
            Обновить
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-dice-cyan border-t-transparent animate-spin" />
          </div>
        )}

        {stats && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <SummaryCard label="Проголосовало" value={stats.totalVoters} />
              <SummaryCard label="Проектов" value={stats.projects.length} />
              <SummaryCard label="Лидер (голосов)" value={stats.projects[0]?.finalVotes ?? 0} />
              <SummaryCard
                label="Средний bank rate"
                value={`${Math.round(
                  stats.projects.reduce((a, p) => a + p.bankRate, 0) /
                    Math.max(1, stats.projects.length),
                )}%`}
              />
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <h2 className="text-sm font-semibold text-white">Рейтинг проектов</h2>
              </div>
              <div className="divide-y divide-white/5">
                {stats.projects.map((p, i) => (
                  <motion.div
                    key={p.projectId}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.03] transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <span
                      className={`text-sm font-mono w-8 text-center ${
                        i === 0 ? "text-vault-gold font-bold" :
                        i === 1 ? "text-slate-300" :
                        i === 2 ? "text-amber-700" :
                        "text-slate-600"
                      }`}
                    >
                      #{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate">{p.title}</h3>
                      <span className="text-xs text-slate-600 font-mono">{p.projectId}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs shrink-0">
                      <StatPill label="Голосов" value={p.finalVotes} accent />
                      <StatPill label="Mentions" value={p.honorableMentions} />
                      <StatPill label="В банке" value={p.timesInBank} />
                      <StatPill label="Bank rate" value={`${p.bankRate}%`} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass rounded-xl p-4">
      <span className="text-xs text-slate-500 block mb-1">{label}</span>
      <span className="text-2xl font-bold text-white font-mono">{value}</span>
    </div>
  );
}

function StatPill({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="text-center hidden sm:block">
      <span className={`block font-mono font-bold ${accent ? "text-vault-gold" : "text-slate-300"}`}>
        {value}
      </span>
      <span className="block text-slate-600 text-[10px]">{label}</span>
    </div>
  );
}
