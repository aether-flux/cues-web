import { X } from "lucide-react";
import React, { useState } from "react"
import DatePicker from "react-datepicker";
import api from "@/utils/api";

import 'react-datepicker/dist/react-datepicker.css';
import { Project } from "@/utils/types";

type TaskAddProps = {
  setShowTaskModal: (value: boolean) => void;
  selectedProject: Project;
}

export const TaskAddModal = ({ setShowTaskModal, selectedProject }: TaskAddProps) => {
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDesc, setTaskDesc] = useState<string>("");
  const [taskPriority, setTaskPriority] = useState<"Low" | "Medium" | "High" | "">("");
  // const [dueDatePart, setDueDatePart] = useState<string>(() => new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
  // const [dueTimePart, setDueTimePart] = useState<string>(() => {
  //   const now = new Date(Date.now() + 30 * 60 * 1000);
  //   return now.toISOString().slice(11, 16); // HH:mm
  // });
  const [dueDate, setDueDate] = useState<Date | null>(() => new Date(Date.now() + 30 * 60 * 1000));

  const handleCreateTask = async () => {
    if (taskTitle.trim()) {
      const due = dueDate?.toISOString();

      const addTaskRes = await api.post('/tasks/new', {
        title: taskTitle,
        description: taskDesc,
        priority: taskPriority === "" ? null : taskPriority,
        due: due,
        projectId: selectedProject?.id,
      });

      const res = addTaskRes.data;
      if (!res.task) {
        throw Error(`Error while creating task: ${res.error || res.message}`);
      }

      setTaskTitle('');
      setTaskDesc('');
      setTaskPriority('');
      // setDueDatePart(new Date().toISOString().slice(0, 10))
      // setDueTimePart(new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(11, 16));
      setDueDate(new Date(Date.now() + 30*60*1000));
      setShowTaskModal(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-parchment rounded-xl shadow-2xl border border-pine/10 w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-charcoal">New Task</h3>
            <button
              onClick={() => setShowTaskModal(false)}
              className="text-charcoal/40 hover:text-charcoal transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2 font-mono">
                Task title {`>`}
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Enter task description..."
                className="w-full px-3 py-2 border border-pine/20 rounded-lg bg-parchment focus:outline-none focus:ring-2 focus:ring-pine/20 focus:border-pine font-mono"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2 font-mono">
                Description --desc
              </label>
              <textarea
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Additional description..."
                className="w-full px-3 py-2 border border-pine/20 rounded-lg bg-parchment focus:outline-none focus:ring-2 focus:ring-pine/20 focus:border-pine font-mono resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2 font-mono">
                Priority --priority
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as 'Low' | 'Medium' | 'High' | '')}
                className="w-full px-3 py-2 border border-pine/20 rounded-lg bg-parchment focus:outline-none focus:ring-2 focus:ring-pine/20 focus:border-pine font-mono"
              >
                <option value="">No priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2 font-mono">
                Due Date & Time
              </label>
              <DatePicker
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd h:mm aa"
                className="w-full px-3 py-2 border border-pine/20 rounded-lg bg-parchment focus:outline-none focus:ring-2 focus:ring-pine/20 focus:border-pine font-mono"
                placeholderText="Select due date & time"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCreateTask}
              className="flex-1 bg-pine text-parchment px-4 py-2 rounded-lg hover:bg-pine/90 transition-colors font-medium"
            >
              Create Task
            </button>
            <button
              onClick={() => setShowTaskModal(false)}
              className="px-4 py-2 text-charcoal/60 hover:text-charcoal transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
