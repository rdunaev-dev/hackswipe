import { NextResponse } from "next/server";
import { getAllProjects, seedFromJson } from "@/lib/db";
import projectsSeed from "@/data/projects.json";
import { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  let projects = await getAllProjects();
  if (projects.length === 0) {
    await seedFromJson(projectsSeed as Project[]);
    projects = await getAllProjects();
  }
  return NextResponse.json(projects);
}
