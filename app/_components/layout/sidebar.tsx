import { Project, Task } from "@/utils/types";
import { Plus } from "lucide-react";

type SidebarProps = {
  projects: Project[];
  tasks: Task[];
  selectedProject: Project;
  setShowTaskModal: (value: boolean) => void;
  setSelectedProject: (project: Project) => void;
  getTaskCount: (project: Project, tasks: Task[]) => number;
};

export const Sidebar = ({ projects, setShowTaskModal, selectedProject, setSelectedProject, tasks, getTaskCount }: SidebarProps) => {
  return (
    <aside className="w-64 border-r border-pine/10 bg-parchment-light min-h-screen">
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={() => setShowTaskModal(true)}
            className="w-full bg-pine text-parchment px-4 py-3 rounded-lg hover:bg-pine/90 transition-all hover:shadow-lg flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

        <div>
          <h3 className="text-sm font-medium text-charcoal/60 uppercase tracking-wide mb-3 font-mono">
            Projects
          </h3>
          <div className="space-y-1">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between group ${
                  selectedProject?.id === project.id
                    ? 'bg-pine/10 text-pine border border-pine/20'
                    : 'text-charcoal/70 hover:bg-parchment hover:text-charcoal'
                }`}
              >
                <span className="font-mono text-sm">{project.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-mono ${
                  selectedProject?.id === project.id
                    ? 'bg-pine/20 text-pine'
                    : 'bg-charcoal/10 text-charcoal/50 group-hover:bg-charcoal/20'
                }`}>
                  {getTaskCount(project, tasks)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
