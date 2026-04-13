"use client";

import { useState, useMemo } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Project } from "@/lib/types";
import { generateCoverSvg } from "@/lib/covers";
import { getProjects } from "@/lib/store";

const SWIPE_THRESHOLD = 100;

interface SwipeCardProps {
  project: Project;
  onSwipe: (direction: "left" | "right") => void;
  onDetails: () => void;
}

export default function SwipeCard({ project, onSwipe, onDetails }: SwipeCardProps) {
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-30, 30]);
  const bankOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const skipOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

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

  function handleDragEnd(_: unknown, info: PanInfo) {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(offset) > SWIPE_THRESHOLD || Math.abs(velocity) > 500) {
      const dir = offset > 0 ? "right" : "left";
      setExitDirection(dir);
      onSwipe(dir);
    }
  }

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-4 touch-none select-none"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        x: exitDirection === "right" ? 400 : exitDirection === "left" ? -400 : 0,
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.3 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="relative w-full max-w-[380px] rounded-3xl overflow-hidden bg-card-surface border border-card-border shadow-2xl">
        {/* Cover */}
        <div className="relative h-44 overflow-hidden">
          <img src={coverDataUri} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card-surface via-card-surface/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="px-5 pb-5 -mt-8 relative z-10">
          {project.epicId && (
            <span className="inline-block text-[10px] font-mono text-cyan-400/70 bg-cyan-400/10 px-2 py-0.5 rounded-md mb-2">
              {project.epicId}
            </span>
          )}
          <h2 className="text-xl font-bold text-white mb-2 leading-tight">{project.title}</h2>
          <p className="text-sm text-slate-300 mb-3 leading-relaxed line-clamp-3">{project.oneLiner}</p>

          {project.authors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-slate-600 text-xs">&#x1f464;</span>
              <span className="text-xs text-slate-500 truncate">
                {project.authors.join(", ")}
              </span>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDetails();
            }}
            className="w-full py-2 rounded-xl text-sm font-medium text-slate-400 bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors"
          >
            Подробнее
          </button>
        </div>

        {/* Swipe overlays */}
        <motion.div
          className="absolute inset-0 rounded-3xl border-4 border-accent-green flex items-center justify-center bg-accent-green/5 pointer-events-none"
          style={{ opacity: bankOpacity }}
        >
          <div className="bg-accent-green/20 backdrop-blur-sm rounded-2xl px-6 py-3 rotate-[-15deg]">
            <span className="text-accent-green font-bold text-2xl tracking-wide">В БАНК</span>
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-3xl border-4 border-accent-red flex items-center justify-center bg-accent-red/5 pointer-events-none"
          style={{ opacity: skipOpacity }}
        >
          <div className="bg-accent-red/20 backdrop-blur-sm rounded-2xl px-6 py-3 rotate-[15deg]">
            <span className="text-accent-red font-bold text-2xl tracking-wide">ПРОПУСК</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
