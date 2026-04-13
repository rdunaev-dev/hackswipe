"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import ProjectDetails from "@/components/ProjectDetails";
import { Project } from "@/lib/types";
import { generateCoverSvg } from "@/lib/covers";

export default function BankPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [bankProjects, setBankProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }

    Promise.all([
      fetch("/api/feed").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
    ]).then(([feedData, projects]) => {
      setAllProjects(projects);
      if (feedData.status === "completed") {
        router.replace("/done");
        return;
      }
      const bankIds: string[] = feedData.bankIds ?? [];
      const bp = bankIds
        .map((id: string) => (projects as Project[]).find((p) => p.id === id))
        .filter((p): p is Project => !!p);
      setBankProjects(bp);
      setLoading(false);
    });
  }, [authLoading, isAuthenticated, router]);

  function handleRemove(projectId: string) {
    setBankProjects((prev) => prev.filter((p) => p.id !== projectId));
  }

  function handleProceedToVote() {
    if (bankProjects.length === 0) return;
    const ids = bankProjects.map((p) => p.id).join(",");
    router.push(`/vote?bank=${encodeURIComponent(ids)}`);
  }

  if (loading || authLoading) return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🏦</span>
          <h1 className="text-xl font-bold text-white">Финальный банк</h1>
        </div>
        <p className="text-sm text-slate-500">
          {bankProjects.length > 0
            ? `${bankProjects.length} проект${bankProjects.length === 1 ? "" : bankProjects.length < 5 ? "а" : "ов"} — пересмотри и выбери победителя`
            : "Банк пуст — вернись в ленту и свайпни вправо то, что зацепило"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4">
        <AnimatePresence>
          {bankProjects.map((project, i) => (
            <BankCard
              key={project.id}
              project={project}
              index={i}
              allProjects={allProjects}
              onTap={() => setSelectedProject(project)}
              onRemove={() => handleRemove(project.id)}
            />
          ))}
        </AnimatePresence>

        {bankProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-4xl mb-3 opacity-50">🫙</span>
            <p className="text-slate-500 text-sm">Пока пусто</p>
          </div>
        )}
      </div>

      <div className="px-5 pb-5 safe-bottom space-y-2">
        {bankProjects.length > 0 && (
          <motion.button
            onClick={handleProceedToVote}
            className="w-full py-3.5 rounded-2xl font-bold text-black bg-gradient-to-r from-vault-gold to-yellow-400 active:scale-[0.97] transition-transform"
            whileTap={{ scale: 0.97 }}
          >
            Выбрать победителя
          </motion.button>
        )}
        <button
          onClick={() => router.push("/swipe")}
          className="w-full py-3 rounded-2xl text-sm font-medium text-slate-400 bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors"
        >
          ← Вернуться в ленту
        </button>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetails
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function BankCard({
  project,
  index,
  allProjects,
  onTap,
  onRemove,
}: {
  project: Project;
  index: number;
  allProjects: Project[];
  onTap: () => void;
  onRemove: () => void;
}) {
  const projectIndex = allProjects.findIndex((p) => p.id === project.id);
  const coverSvg = generateCoverSvg(Math.max(0, projectIndex), project.title);
  const coverDataUri = `data:image/svg+xml,${encodeURIComponent(coverSvg)}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -200, height: 0, marginBottom: 0 }}
      transition={{ delay: index * 0.05 }}
      className="mb-3"
    >
      <div
        onClick={onTap}
        className="flex items-center gap-3 p-3 rounded-2xl glass cursor-pointer hover:bg-white/[0.08] active:bg-white/[0.12] transition-colors"
      >
        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
          <img src={coverDataUri} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">{project.title}</h3>
          <p className="text-xs text-slate-500 truncate">{project.oneLiner}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-accent-red hover:bg-accent-red/10 transition-colors"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
}
