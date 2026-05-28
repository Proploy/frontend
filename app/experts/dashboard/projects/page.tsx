'use client'

import Link from 'next/link'
import { Briefcase, ExternalLink } from 'lucide-react'
import { ProjectDocumentViewer } from '@/components/experts/ProjectDocumentViewer'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  DashboardFailureState,
  DashboardLoading,
  DashboardShell,
  useExpertDashboardData,
} from '@/components/experts/dashboard/ExpertDashboardFrame'
import { useExpertDashboard } from '@/hooks/use-expert-dashboard'
import type { ExpertProjectResponse } from '@/hooks/types/expert-contracts'

export default function ExpertDashboardProjectsPage() {
  const state = useExpertDashboardData()

  if (state.isPending) return <DashboardLoading />
  if (!state.user || state.dashboardError || !state.dashboard) return <DashboardFailureState state={state} />

  const expert = state.dashboard.expert
  const projects = expert.projects
  const attachedFiles = projects.filter((project) => project.fileStorageKey).length

  return (
    <DashboardShell expert={expert}>
      <div className="flex-1 min-w-0">
        <div className="max-w-[1144px] mx-auto px-[32px] py-[32px] flex flex-col gap-[32px]">
          <div className="flex flex-wrap items-start justify-between gap-[16px]">
            <div className="flex flex-col gap-[4px]">
              <h1 className="font-semibold text-[24px] leading-[32px] text-[#181d27]">Projects</h1>
              <p className="font-normal text-[16px] leading-[24px] text-[#535862]">
                Portfolio projects and attached files returned by the expert dashboard endpoint.
              </p>
            </div>
            <Link
              href="/become-expert"
              className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] flex items-center gap-[6px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
            >
              Edit projects
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px]">
            <SummaryTile label="Projects" value={String(projects.length)} />
            <SummaryTile label="Attached files" value={String(attachedFiles)} />
            <SummaryTile label="Project links" value={String(projects.filter((project) => project.link).length)} />
          </div>

          <section className={`bg-white border border-[#e9eaeb] rounded-[12px] p-[24px] flex flex-col gap-[20px] ${CARD_SHADOW}`}>
            <div className="flex flex-wrap items-start justify-between gap-[16px]">
              <div className="flex flex-col gap-[4px]">
                <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">Project details</p>
                <p className="font-normal text-[14px] leading-[20px] text-[#535862]">Details are sourced from service-apis, not frontend fallback data.</p>
              </div>
              <Briefcase size={20} className="text-[#717680]" />
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 gap-[16px]">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] p-[20px] text-[14px] leading-[20px] text-[#717680]">
                No projects returned by service-apis.
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardShell>
  )
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className={`bg-white border border-[#e9eaeb] rounded-[12px] p-[20px] flex flex-col gap-[8px] ${CARD_SHADOW}`}>
      <p className="font-medium text-[14px] leading-[20px] text-[#414651]">{label}</p>
      <p className="font-semibold text-[30px] leading-[38px] text-[#181d27]">{value}</p>
    </div>
  )
}

function ProjectCard({ project }: { project: ExpertProjectResponse }) {
  const { getProjectFileDownloadUrl } = useExpertDashboard()

  return (
    <article className="rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] p-[18px]">
      <div className="flex flex-wrap items-start justify-between gap-[16px]">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[16px] leading-[24px] text-[#181d27]">{project.title}</p>
          <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">{project.summary}</p>
        </div>
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[10px] py-[7px] text-[13px] font-semibold leading-[18px] text-[#414651]"
          >
            <ExternalLink size={14} />
            View link
          </a>
        ) : null}
      </div>

      {project.outcomes ? (
        <div className="mt-[14px] rounded-[8px] border border-[#e9eaeb] bg-white p-[12px]">
          <p className="text-[12px] font-semibold uppercase leading-[18px] text-[#717680]">Outcomes</p>
          <p className="mt-[4px] text-[14px] leading-[20px] text-[#414651]">{project.outcomes}</p>
        </div>
      ) : null}

      <ProjectDocumentViewer project={project} getDownloadUrl={getProjectFileDownloadUrl} />
    </article>
  )
}
