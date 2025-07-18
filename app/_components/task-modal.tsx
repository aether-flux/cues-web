"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Project, Task } from "@/utils/types"
import api from "@/utils/api"


interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  tasks: Task[]
  currentProject: Project | null
}

export function TaskModal({ isOpen, onClose, task, setTasks, tasks, currentProject }: TaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "NA">("Medium")
  const [status, setStatus] = useState<boolean>(false)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || "")
      setPriority(task.priority || "NA")
      setStatus(task.isDone)
    } else {
      setTitle("")
      setDescription("")
      setPriority("Medium")
      setStatus(false)
    }
  }, [task, isOpen])

  const handleSave = async () => {
    try {
      const res = await api.post(`/tasks/new`, {
        title,
        description,
        priority: priority === "NA" ? null : priority,
        isDone: status,
        projectId: currentProject?.id
      });

      if (res.data.task) {
        const newTask = res.data.task;
        setTasks([...tasks, newTask]);
        onClose();
      } else if (res.data.error) {
        throw new Error(res.data.error);
      } else {
        throw new Error(res.data.message);
      }
    } catch(e) {
      console.error("Failed to create task: ", e);
    }
  }

  const handleEdit = async (task: Task) => {
    try {
      const res = await api.put(`/tasks/${task.id}`, {
        title,
        description,
        priority: priority === "NA" ? null : priority,
        isDone: status,
      });

      if (res.data.task) {
        const updatedTask = res.data.task;
        setTasks((prev) => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
        onClose();
      } else if (res.data.error) {
        throw new Error(res.data.error);
      } else {
        throw new Error(res.data.message);
      }
    } catch(e) {
      console.error("Failed to edit task: ", e);
    }
  }

  const handleDelete = async (task: Task | null) => {
    try {
      if (task) {
        const res = await api.delete(`/tasks/${task.id}`);

        if (res.data.task) {
          const delTask = res.data.task;
          setTasks((prev) => prev.filter(t => t.id !== delTask.id));
          onClose();
        } else if (res.data.error) {
          throw new Error(res.data.error);
        } else {
          throw new Error(res.data.message);
        }
      }
    } catch(e) {
      console.error("Failed to delete task: ", e);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-[#f5f4f1] border-[#e8e5e0] shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-mono text-[#2d5016]">{task ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-[#6b5b47]">Task title {">"}</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="bg-[#faf9f7] border-[#e8e5e0] focus:border-[#2d5016] font-mono"
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-[#6b5b47]">Description {">"}</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description..."
              rows={3}
              className="bg-[#faf9f7] border-[#e8e5e0] focus:border-[#2d5016] font-mono resize-none"
            />
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-mono text-[#6b5b47]">Priority {">"}</label>
              <Select value={priority} onValueChange={(value: "NA" | "Low" | "Medium" | "High") => setPriority(value)}>
                <SelectTrigger className="bg-[#faf9f7] border-[#e8e5e0] focus:border-[#2d5016] font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#f5f4f1] border-[#e8e5e0]">
                  <SelectItem value="NA" className="font-mono">
                    @NA
                  </SelectItem>
                  <SelectItem value="Low" className="font-mono">
                    @low
                  </SelectItem>
                  <SelectItem value="Medium" className="font-mono">
                    @medium
                  </SelectItem>
                  <SelectItem value="High" className="font-mono">
                    @high
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-mono text-[#6b5b47]">Status {">"}</label>
              <Select value={status === false ? "todo" : "done"} onValueChange={(value: "todo" | "done") => setStatus(value === "todo" ? false : true)}>
                <SelectTrigger className="bg-[#faf9f7] border-[#e8e5e0] focus:border-[#2d5016] font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#f5f4f1] border-[#e8e5e0]">
                  <SelectItem value="todo" className="font-mono">
                    [ ] todo
                  </SelectItem>
                  <SelectItem value="done" className="font-mono">
                    [✓] done
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            className="bg-red-500 hover:bg-red-600 text-white font-mono cursor-pointer"
            onClick={async () => handleDelete(task || null)}
          >
            Delete
          </Button>
          <div className="flex justify-end gap-3 border-t border-[#e8e5e0]">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-[#faf9f7] border-[#e8e5e0] text-[#6b5b47] hover:bg-[#e8e5e0] font-mono"
            >
              Cancel
            </Button>
            { task ? (
              <Button onClick={async () => await handleEdit(task)} className="bg-[#2d5016] hover:bg-[#1f3a0f] text-[#faf9f7] font-mono cursor-pointer">
                Update Task
              </Button>
            ) : (
              <Button onClick={async () => await handleSave()} className="bg-[#2d5016] hover:bg-[#1f3a0f] text-[#faf9f7] font-mono cursor-pointer">
                Create Task
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

