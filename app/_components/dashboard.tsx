"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Command } from "lucide-react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TaskCard } from "./task-card" 
import { Project, Task } from "@/utils/types"
import api from "@/utils/api";
import Image from "next/image"

interface DashboardProps {
  currentProject: Project
  setCurrentProject: (project: Project | null) => void
  onProjectSwitcherOpen: () => void
  onNewTask: () => void
  onEditTask: (task: Task) => void
  onNewProject: () => void
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

export function Dashboard({ currentProject, setCurrentProject, onProjectSwitcherOpen, onNewTask, onEditTask, onNewProject, tasks, setTasks }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onProjectSwitcherOpen()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onProjectSwitcherOpen])

  const projTasks = tasks.filter((t) => currentProject ? (t.projectId === currentProject.id) : true);

  const filteredTasks = projTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false),
  )

  const todoTasks = filteredTasks.filter((task) => task.isDone === false)
  const doneTasks = filteredTasks.filter((task) => task.isDone === true)

  return (
    <SidebarInset>
      <div className="flex flex-col h-screen bg-[#faf9f7]">
        {/* Top Bar */}
        <header className="flex items-center justify-between p-4 border-b border-[#e8e5e0] bg-[#faf9f7]">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-[#6b5b47] hover:text-[#2d5016]" />
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={() => setCurrentProject(null)}>
                <span className="text-[#cd7f32] font-mono text-lg">{"> "}</span>
                <span className="text-[#2d5016] font-mono text-lg font-semibold">cues</span>
                {/*<div className="flex items-center gap-2">
                  <Image src="/logos/cues_logo.svg" width={60} height={18} alt="cues logo" />
                </div>*/}
              </div>
              <span className="text-[#6b5b47] font-mono">/{currentProject?.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b5b47]" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-[#f5f4f1] border-[#e8e5e0] focus:border-[#2d5016] font-mono text-sm"
              />
            </div>

            <Button
              onClick={onProjectSwitcherOpen}
              variant="outline"
              size="sm"
              className="bg-[#f5f4f1] border-[#e8e5e0] text-[#6b5b47] hover:bg-[#e8e5e0] hover:text-[#2d5016] font-mono"
            >
              <Command className="w-4 h-4 mr-1" />
              ⌘K
            </Button>

            <Button onClick={onNewProject} variant="outline" className="bg-[#f5f4f1] border-[#e8e5e0] text-[#6b5b47] hover:bg-[#e8e5e0] hover:text-[#2d5016] font-mono">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>

            <Button disabled={currentProject ? false : true} onClick={onNewTask} className="bg-[#2d5016] hover:bg-[#1f3a0f] text-[#faf9f7] font-mono shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Todo Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#cd7f32]"></div>
                <h2 className="font-mono text-[#2c2c2c] font-semibold">TODO</h2>
                <span className="text-[#6b5b47] text-sm">({todoTasks.length})</span>
              </div>
              <div className="space-y-3">
                {todoTasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} onClick={() => onEditTask(task)} setTasks={setTasks} />
                ))}
              </div>
            </div>

            {/* Done Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#6b5b47]"></div>
                <h2 className="font-mono text-[#2c2c2c] font-semibold">DONE</h2>
                <span className="text-[#6b5b47] text-sm">({doneTasks.length})</span>
              </div>
              <div className="space-y-3">
                {doneTasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} onClick={() => onEditTask(task)} setTasks={setTasks} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarInset>
  )
}

