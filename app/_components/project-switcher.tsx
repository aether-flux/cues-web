"use client"

import { useState, useEffect } from "react"
import { Search, Folder } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Project } from "@/utils/types"
import api from "@/utils/api"

interface ProjectSwitcherProps {
  isOpen: boolean
  onClose: () => void
  currentProject: Project | null
  onProjectSelect: (project: Project) => void
  projects: Project[]
}

export function ProjectSwitcher({ isOpen, onClose, currentProject, onProjectSelect, projects }: ProjectSwitcherProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("")
      setSelectedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, filteredProjects.length - 1))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
          break
        case "Enter":
          e.preventDefault()
          if (filteredProjects[selectedIndex]) {
            onProjectSelect(filteredProjects[selectedIndex])
            onClose()
          }
          break
        case "Escape":
          onClose()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, selectedIndex, filteredProjects, onProjectSelect, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-[#f5f4f1] border-[#e8e5e0] shadow-xl" aria-describedby={undefined}>
        <div className="p-4 border-b border-[#e8e5e0]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b5b47]" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#faf9f7] border-[#e8e5e0] focus:border-[#2d5016] font-mono"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-64 overflow-auto">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`
                flex items-center gap-3 p-3 cursor-pointer transition-colors duration-150
                ${index === selectedIndex ? "bg-[#2d5016] text-[#faf9f7]" : "hover:bg-[#e8e5e0]"}
                ${project.id === currentProject?.id ? "border-r-2 border-[#cd7f32]" : ""}
              `}
              onClick={() => {
                onProjectSelect(project)
                onClose()
              }}
            >
              <Folder className="w-4 h-4 flex-shrink-0" />
              <DialogTitle className="flex-1 min-w-0">
                <div className="font-mono text-sm font-medium">{project.name}</div>
              </DialogTitle>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-[#e8e5e0] text-xs text-[#6b5b47] font-mono">
          ↑↓ navigate • ↵ select • esc close
        </div>
      </DialogContent>
    </Dialog>
  )
}

