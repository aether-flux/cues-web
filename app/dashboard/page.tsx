"use client"

import { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "../_components/app-sidebar"
import { Dashboard } from "../_components/dashboard"
import { ProjectSwitcher } from "../_components/project-switcher"
import { TaskModal } from "../_components/task-modal"
import { SettingsModal } from "../_components/settings-modal"
import { Project, Task } from "@/utils/types"
import api from "@/utils/api"
import { ProjectModal } from "../_components/project-modal"
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { AuthLoader } from "../_components/AuthLoader"

export default function Page() {
  const [isProjectSwitcherOpen, setIsProjectSwitcherOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const user = useAuthStore((s) => s.user);
  const isLoaded = useAuthStore((s) => s.isLoaded)
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      toast.error("Log In to access your dashboard.", {
        style: {
          borderRadius: '50px',
          padding: '10px 20px',
          background: '#faf9f7',
          color: '#1a1a1a',
        },
      });

      router.push('/');
    }
  }, [user]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        // if (res.data.error) {
        //   toast.error("Log In to access your dashboard.", {
        //     style: {
        //       borderRadius: '50px',
        //       padding: '10px 20px',
        //       background: '#faf9f7',
        //       color: '#1a1a1a',
        //     },
        //   });
        //
        //   router.push('/');
        // }

        setTasks(res.data.tasks || []);
      } catch (e) {
        console.error("Failed to fetch tasks: ", e);
      }
    }

    fetchTasks();
  }, [user])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data.projects || []);
      } catch (e) {
        console.error("Error fetching projects: ", e);
      }
    }

    fetchProjects();
  }, [user]);

  // if (!isLoaded || (isLoaded && !user)) {
  //   return (
  //     <p>Loading...</p>
  //   );
  // }

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const handleNewTask = () => {
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }

  const getTaskCount = (project: Project, tasks: Task[]) => {
    let projTasks = tasks.filter(t => t.projectId === project.id);
    return projTasks.length;
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] font-mono">
      <SidebarProvider defaultOpen={true}>
        <AppSidebar
          currentProject={currentProject}
          onProjectSelect={setCurrentProject}
          onSettingsOpen={() => setIsSettingsOpen(true)}
          projects={projects}
          tasks={tasks}
          setProjects={setProjects}
          setTasks={setTasks}
          getTaskCount={getTaskCount}
          onEditProject={handleEditProject}
        />
        <Dashboard
          currentProject={currentProject}
          setCurrentProject={setCurrentProject}
          onProjectSwitcherOpen={() => setIsProjectSwitcherOpen(true)}
          onNewTask={handleNewTask}
          onEditTask={handleEditTask}
          onNewProject={handleNewProject}
          tasks={tasks}
          setTasks={setTasks}
        />
      </SidebarProvider>

      <ProjectSwitcher
        isOpen={isProjectSwitcherOpen}
        onClose={() => setIsProjectSwitcherOpen(false)}
        currentProject={currentProject}
        onProjectSelect={setCurrentProject}
        projects={projects}
      />

      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} task={editingTask} setTasks={setTasks} tasks={tasks} currentProject={currentProject} />

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} currentProject={currentProject} />

      <ProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} project={editingProject} projects={projects} setProjects={setProjects} />
    </div>
  )
}

