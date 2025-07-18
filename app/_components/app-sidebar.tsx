"use client"

import { Folder, MoreHorizontal, Settings, Terminal } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Project, Task } from "@/utils/types"
import api from "@/utils/api"
import Image from "next/image"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AppSidebarProps {
  currentProject: Project | null
  onProjectSelect: (project: Project) => void
  onSettingsOpen: () => void
  projects: Project[]
  tasks: Task[]
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  getTaskCount: (project: Project, tasks: Task[]) => number
  onEditProject: (project: Project) => void
}

export function AppSidebar({ currentProject, onProjectSelect, onSettingsOpen, projects, tasks, setProjects, setTasks, getTaskCount, onEditProject }: AppSidebarProps) {
  const handleDeleteProject = async (project: Project) => {
    try {
      const res = await api.delete(`/projects/${project.id}`);

      if (res.data.project) {
        const newProj = res.data.project;
        setProjects((prev) => prev.filter(p => p.id !== newProj.id));
        setTasks((prev) => prev.filter(t => t.projectId !== newProj.id));
      } else if (res.data.error) {
        throw new Error(res.data.error);
      } else {
        throw new Error(res.data.message);
      }

    } catch (e) {
      console.error("Failed to delete project: ", e);
    }
  }

  return (
    <Sidebar
      className="border-r border-[#e8e5e0]"
      style={{
        backgroundColor: "#f5f4f1",
        color: "#2c2c2c",
      }}
    >
      <SidebarHeader className="p-4 border-b border-[#e8e5e0]">
        {/*<div className="flex items-center gap-2 text-[#2d5016] font-semibold">
          <Terminal className="w-5 h-5" />
          <span className="text-lg">cues</span>
        </div>*/}

        <Link href="/">
          <div className="flex items-center gap-2">
            <Image src="/logos/cues_logo.svg" width={70} height={22} alt="cues logo" />
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#6b5b47] text-xs uppercase tracking-wider mb-3">
            Projects
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {projects.map((project) => (
                <SidebarMenuItem key={project.id}>
                  <div className="flex items-center w-full group">
                    <SidebarMenuButton
                      onClick={() => onProjectSelect(project)}
                      isActive={currentProject?.id === project.id}
                      className={`
                        flex items-center justify-between flex-1 p-3 rounded-md transition-all duration-200
                        hover:bg-[#e8e5e0] hover:text-[#2d5016]
                        ${currentProject?.id === project.id ? "bg-[#2d5016] text-[#faf9f7] shadow-sm" : "text-[#4a4a4a]"}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4" />
                        <span className="font-mono text-sm">{project.name}</span>
                      </div>
                      <span
                        className={`
                        text-xs px-2 py-1 rounded-full
                        ${currentProject?.id === project.id ? "bg-[#faf9f7] text-[#2d5016]" : "bg-[#e8e5e0] text-[#6b5b47]"}
                      `}
                      >
                        {getTaskCount(project, tasks)}
                      </span>
                    </SidebarMenuButton>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1 p-1 h-6 w-6
                            hover:bg-[#e8e5e0] hover:text-[#2d5016]
                            "text-[#6b5b47]"
                          `}
                        >
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start" className="bg-[#f5f4f1] border-[#e8e5e0]">
                        <DropdownMenuItem
                          onClick={() => onEditProject(project)}
                          className="font-mono text-sm hover:bg-[#e8e5e0] hover:text-[#2d5016]"
                        >
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={async () => await handleDeleteProject(project)}
                          className="font-mono text-sm hover:bg-[#e8e5e0] hover:text-[#2d5016]"
                        >
                          Delete Project 
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-[#e8e5e0]">
        <Button
          variant="ghost"
          onClick={onSettingsOpen}
          className="w-full justify-start text-[#6b5b47] hover:text-[#2d5016] hover:bg-[#e8e5e0]"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

