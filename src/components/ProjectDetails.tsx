"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Project } from "@/lib/types";
import { generateCoverSvg } from "@/lib/covers";
import { getProjects } from "@/lib/store";

interface ProjectDetailsProps {
  project: Project;
  onClose: () => void;
  onBank?: () => void;
  showBankButton?: boolean;
}

export default function ProjectDetails({ project, onClose, onBank, showBankButton }: ProjectDetailsProps) {
  const projectIndex = useMemo(() => {
    const all = getProjects();
    return all.findIndex((p) => p.id === project.id);
  }, [project.id]);

  const coverSvg = useMemo(
    () => generateCoverSvg(Math.max(0, projectIndex), project.title),
    [projectIndex, project.title],
  );

  const coverDataUri = useMemo(
    () => `data:image/svg+xml,${encodeURIComponent(coverSvg)}`,
    [coverSvg],
  );

  return (
    <motion.div
      className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-lg max-h-[90dvh] bg-card-surface rounded-t-3xl sm:rounded-3xl overflow-y-auto no-scrollbar border border-card-border"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-52 overflow-hidden">
          <img src={coverDataUri} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card-surface via-card-surface/50 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-white text-lg"
          >
            ×
          </button>
        </div>

        <div className="px-6 pb-8 -mt-10 relative z-10">
          {project.epicId && (
            <span className="inline-block text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-md mb-2">
              {project.epicId}
            </span>
          )}
          <h2 className="text-2xl font-bold text-white mb-1">{project.title}</h2>
          <p className="text-sm text-slate-400 mb-5">{project.oneLiner}</p>

          <div className="space-y-3 mb-6">
            <DetailBlock icon="👥" label="Для кого" values={project.forWhom} />
            <DetailBlock icon="🎯" label="Кого затронет" values={project.whoAffected} />
            <DetailBlock icon="⚡" label="Что улучшит" values={project.whatImproves} />
          </div>

          <div className="text-sm text-slate-300 leading-relaxed mb-6">
            {project.fullDescription}
          </div>

          {project.authors.length > 0 && (
            <div className="mb-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Команда
              </span>
              <div className="flex flex-wrap gap-2">
                {project.authors.map((a) => (
                  <span
                    key={a}
                    className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/5"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {project.demoUrl && (
              <LinkPill href={project.demoUrl} label="Демо" />
            )}
            {project.repoUrl && (
              <LinkPill href={project.repoUrl} label="Репозиторий" />
            )}
            {project.youtrackUrl && (
              <LinkPill href={project.youtrackUrl} label="YouTrack" />
            )}
          </div>

          {showBankButton && onBank && (
            <button
              onClick={onBank}
              className="w-full py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-accent-green to-emerald-400 active:scale-[0.98] transition-transform"
            >
              Добавить в Финальный банк
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailBlock({ icon, label, values }: { icon: string; label: string; values: string[] }) {
  return (
    <div className="flex items-start gap-2.5 bg-white/[0.03] rounded-xl px-3 py-2.5">
      <span className="text-base mt-0.5">{icon}</span>
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
        <p className="text-sm text-slate-300">{values.join(" · ")}</p>
      </div>
    </div>
  );
}

function LinkPill({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs px-3 py-1.5 rounded-full glass text-cyan-400 hover:text-cyan-300 transition-colors"
    >
      {label} ↗
    </a>
  );
}
