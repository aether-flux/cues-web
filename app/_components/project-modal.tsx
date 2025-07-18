"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Folder } from "lucide-react"
import { Project } from "@/utils/types"
import api from "@/utils/api"

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project?: Project | null
  projects: Project[]
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
}

export function ProjectModal({ isOpen, onClose, project, projects, setProjects }: ProjectModalProps) {
  const [name, setName] = useState("")

  useEffect(() => {
    if (project) {
      setName(project.name)
    } else {
      setName("")
    }
  }, [project, isOpen])

  const handleSave = async () => {
    try {
      const res = await api.post('/projects/new', { name });

      if (res.data.project) {
        const newProj = res.data.project;
        console.log("New project created! Project: ", newProj);
        setProjects([...projects, newProj]);
        onClose();
      }
    } catch (e) {
      console.error("Failed to create project: ", e);
    }
  };

  const handleEdit = async (project: Project) => {
    try {
      const res = await api.put(`/projects/${project.id}`, { name });

      if (res.data.project) {
        const newProj = res.data.project;
        console.log("New project created! Project: ", newProj);
        setProjects((prev) => prev.map(p => p.id === newProj.id ? newProj : p));
        onClose();
      }
    } catch (e) {
      console.error("Failed to edit project: ", e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-[#f5f4f1] border-[#e8e5e0] shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-mono text-[#2d5016] flex items-center gap-2">
            <Folder className="w-5 h-5" />
            {project ? "Edit Project" : "New Project"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-[#6b5b47]">Project name {">"}</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name..."
              className="bg-[#faf9f7] border-[#e8e5e0] focus:border-[#2d5016] font-mono"
            />
            {name && project && <div className="text-xs text-[#6b5b47] font-mono">ID: {project?.id}</div>}
          </div>

          {/* CLI Preview */}
          {name && project && (
            <div className="space-y-2">
              <label className="text-sm font-mono text-[#6b5b47]">CLI Usage Preview</label>
              <div className="bg-[#2c2c2c] text-[#faf9f7] p-3 rounded-md font-mono text-xs">
                <div className="text-[#cd7f32]"># Switch to project</div>
                <div>cues project switch {project?.id}</div>
                <br />
                <div className="text-[#cd7f32]"># Create task in project</div>
                <div>cues task create "Task name" --project {project?.id}</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#e8e5e0]">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-[#faf9f7] border-[#e8e5e0] text-[#6b5b47] hover:bg-[#e8e5e0] font-mono"
          >
            Cancel
          </Button>

          {project ? (
            <Button
              onClick={async () => await handleEdit(project)}
              disabled={!name.trim()}
              className="bg-[#2d5016] hover:bg-[#1f3a0f] text-[#faf9f7] font-mono disabled:opacity-50"
            >
              Update
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={!name.trim()}
              className="bg-[#2d5016] hover:bg-[#1f3a0f] text-[#faf9f7] font-mono disabled:opacity-50"
            >
              Create
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

