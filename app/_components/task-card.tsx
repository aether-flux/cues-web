"use client"

import { Task } from "@/utils/types"
import { useState } from "react"
import api from "@/utils/api"


interface TaskCardProps {
  task: Task
  index: number
  onClick: () => void
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

export function TaskCard({ task, index, onClick, setTasks }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "#cd3232"
      case "Medium":
        return "#cd7f32"
      case "Low":
        return "#2d5016"
      default:
        return "#6b5b47"
    }
  }

  const getStatusSymbol = (isDone: boolean) => {
    switch (isDone) {
      case false:
        return "[ ]"
      case true:
        return "[✓]"
      default:
        return "[ ]"
    }
  }

  const parseDueDate = (d: string): { date: string, time: string } => {
    const dateObj = new Date(d);

    const date = dateObj.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const time = dateObj.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return { date, time };
  };

  const handleMarkTaskToggle = async (isDone: boolean, id: number) => {
    try {
      const res = await api.put(`/tasks/${id}`, { isDone: !isDone });

      if (res.data.task) {
        const updatedTask = res.data.task;
        setTasks((prev) => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
      } else if (res.data.error) {
        throw new Error(res.data.error);
      } else {
        throw new Error(res.data.message);
      }

    } catch (e) {
      console.error("Failed to edit task: ", e);
    }
  };

  return (
    <div
      className={`
        group cursor-pointer p-4 rounded-lg border transition-all duration-200 ease-out
        bg-[#f5f4f1] border-[#e8e5e0] hover:border-[#2d5016] hover:shadow-sm
        transform hover:-translate-y-0.5
        ${task.isDone === true ? "opacity-75" : ""}
      `}
      style={{
        animationDelay: `${index * 50}ms`,
        animation: "fadeInUp 0.3s ease-out forwards",
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      {task.due && (
        <div className="text-xs text-charcoal/50 flex items-center gap-2 mb-4">
          <span>{parseDueDate(task.due).date}</span>
          <span>-</span>
          <span>{parseDueDate(task.due).time}</span>
        </div>
      )}

      <div className="flex items-start gap-3">
        <span
          className={`font-mono text-sm mt-0.5 transition-colors duration-200 text-[#6b5b47] hover:text-[#b8860b] font-bold`}
          onClick={async (e) => {
            e.stopPropagation();
            await handleMarkTaskToggle(task.isDone, task.id);
          }}
        >
          {getStatusSymbol(task.isDone)}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3
              className={`
              font-mono text-sm font-medium transition-colors duration-200
              ${task.isDone === true ? "line-through text-[#6b5b47]" : "text-[#2c2c2c]"}
              ${isHovered ? "text-[#2d5016]" : ""}
            `}
            >
              {task.title}
            </h3>

            <span
              className="text-xs px-2 py-1 rounded-full font-mono transition-all duration-200"
              style={{
                backgroundColor: isHovered ? getPriorityColor(task.priority || "") : "#e8e5e0",
                color: isHovered ? "#faf9f7" : getPriorityColor(task.priority || ""),
              }}
            >
              @{task.priority || "NA"}
            </span>
          </div>

          <p className="text-xs text-[#6b5b47] font-mono leading-relaxed">{task.description}</p>
        </div>
      </div>
    </div>
  )
}

