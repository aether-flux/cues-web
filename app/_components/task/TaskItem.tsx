import { Project, Task } from "@/utils/types"
import { CheckCircle2, Circle } from "lucide-react";
import React from "react";

type TaskItemProps = {
  task: Task;
  selectedProject: Project;
  getPriorityIcon: (priority: string) => React.ReactElement;
  getPriorityColor: (priority: string) => string;
};

export const TaskItem = ({ task, selectedProject, getPriorityColor, getPriorityIcon }: TaskItemProps) => {
  return (
    <div
      key={task.id}
      className={`bg-parchment-light border rounded-lg p-4 hover:shadow-sm transition-all hover:border-pine/20 group ${
        task.isDone ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <button className="mt-1 text-charcoal/40 hover:text-pine transition-colors">
          {task.isDone ? (
            <CheckCircle2 className="w-5 h-5 text-pine" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className={`font-mono text-sm ${
              task.isDone ? 'line-through text-charcoal/50' : 'text-charcoal'
            }`}>
              {task.title}
            </span>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-mono border ${
                getPriorityColor(task.priority || "")
              }`}>
                {getPriorityIcon(task.priority || "")}
                @{task.priority}
              </span>
              {task.projectId !== selectedProject?.id && (
                <span className="text-xs font-mono text-charcoal/50 bg-charcoal/5 px-2 py-1 rounded border">
                  {task.projectId}
                </span>
              )}
            </div>
          </div>
          <div className="text-xs text-charcoal/40 font-mono">
            {task.createdAt}
          </div>
        </div>
      </div>
    </div>
  )
}
