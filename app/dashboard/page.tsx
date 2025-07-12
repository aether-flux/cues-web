"use client";

import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Plus, 
  Search, 
  Settings, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  Zap,
  Command,
  X,
  ChevronDown,
  User,
  Key,
  Palette,
  Github
} from 'lucide-react';
import api from "@/utils/api";
import axios from 'axios';
import { Project, Task } from '@/utils/types';
import { Sidebar } from '../_components/layout/sidebar';
import { TaskItem } from '../_components/task/TaskItem';
import { TaskAddModal } from '../_components/task/TaskAddModal';

function Dashboard() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'settings'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectSwitcher, setShowProjectSwitcher] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [darkMode, setDarkMode] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [taskRes, projRes] = await Promise.all([
          api.get('/tasks'),
          api.get('/projects')
        ]);

        setProjects(projRes.data.projects);
        setTasks(taskRes.data.tasks);
      } catch (err) {
        console.error("Fetch error: ", err);
      }
    }

    fetchData();
  }, []);

  const filteredTasks = selectedProject
    ? tasks.filter(t => t.projectId === selectedProject.id)
    : tasks;

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Handle CTRL+K search menu
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowProjectSwitcher(true);
      }
      if (e.key === 'Escape') {
        setShowProjectSwitcher(false);
        setShowTaskModal(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'Medium': return <Clock className="w-4 h-4 text-brass" />;
      case 'Low': return <Zap className="w-4 h-4 text-pine/60" />;
      default: return <Circle className="w-4 h-4 text-charcoal/40" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-500 bg-red-50 border-red-200';
      case 'Medium': return 'text-brass bg-brass/10 border-brass/20';
      case 'Low': return 'text-pine/60 bg-pine/5 border-pine/10';
      default: return 'text-charcoal/40 bg-charcoal/5 border-charcoal/10';
    }
  };

  const getTaskCount = (project: Project, tasks: Task[]) => {
    let projTasks = tasks.filter(t => t.projectId === project.id);
    return projTasks.length;
  }

  if (currentView === 'settings') {
    return (
      <div className="min-h-screen bg-parchment font-sans">
        {/* Top Bar */}
        <header className="border-b border-pine/10 bg-parchment/80 backdrop-blur-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center gap-2 text-charcoal hover:text-pine transition-colors"
              >
                <Terminal className="w-5 h-5" />
                <span className="font-mono text-lg">cues</span>
              </button>
              <span className="text-charcoal/40 font-mono">{`>`}</span>
              <span className="text-charcoal/60 font-mono">settings</span>
            </div>
          </div>
        </header>

        {/* Settings Content */}
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-parchment-light rounded-xl border border-pine/10 p-8">
            <h1 className="text-2xl font-semibold text-charcoal mb-8">Settings</h1>
            
            <div className="space-y-8">
              {/* Theme Settings */}
              <div>
                <h3 className="text-lg font-medium text-charcoal mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-parchment rounded-lg border border-pine/10">
                    <div>
                      <div className="font-medium text-charcoal">Dark Mode</div>
                      <div className="text-sm text-charcoal/60">Switch to dark vintage theme</div>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        darkMode ? 'bg-pine' : 'bg-charcoal/20'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-parchment transition-transform ${
                          darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* CLI Settings */}
              <div>
                <h3 className="text-lg font-medium text-charcoal mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  CLI Access
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-parchment rounded-lg border border-pine/10">
                    <div className="font-medium text-charcoal mb-2">API Token</div>
                    <div className="font-mono text-sm text-charcoal/60 bg-charcoal/5 p-3 rounded border mb-4">
                      cues_••••••••••••••••••••••••••••••••
                    </div>
                    <button className="bg-pine text-parchment px-4 py-2 rounded-lg hover:bg-pine/90 transition-colors text-sm font-medium">
                      Generate New Token
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Settings */}
              <div>
                <h3 className="text-lg font-medium text-charcoal mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-parchment rounded-lg border border-pine/10">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Name</label>
                        <input
                          type="text"
                          defaultValue="Alex Developer"
                          className="w-full px-3 py-2 border border-pine/20 rounded-lg bg-parchment focus:outline-none focus:ring-2 focus:ring-pine/20 focus:border-pine"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue="alex@example.com"
                          className="w-full px-3 py-2 border border-pine/20 rounded-lg bg-parchment focus:outline-none focus:ring-2 focus:ring-pine/20 focus:border-pine"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-pine/10">
              <button className="bg-pine text-parchment px-6 py-2 rounded-lg hover:bg-pine/90 transition-colors font-medium">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment font-sans">
      {/* Top Bar */}
      <header className="border-b border-pine/10 bg-parchment/80 backdrop-blur-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-pine" />
              <span className="font-mono text-lg text-charcoal">cues</span>
            </div>
            <span className="text-charcoal/40 font-mono">{`>`}</span>
            <button
              onClick={() => setShowProjectSwitcher(true)}
              className="flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors font-mono"
            >
              {projects.find(p => p.id === selectedProject?.id)?.name || 'All Projects'}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowProjectSwitcher(true)}
              className="flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors text-sm"
            >
              <Command className="w-4 h-4" />
              <span className="font-mono">K</span>
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className="text-charcoal/60 hover:text-charcoal transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar projects={projects} tasks={tasks} selectedProject={selectedProject} setSelectedProject={setSelectedProject} getTaskCount={getTaskCount} setShowTaskModal={setShowTaskModal} />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-charcoal mb-2">
                {projects.find(p => p.id === selectedProject?.id)?.name || 'All Projects'}
              </h1>
              <p className="text-charcoal/60 font-mono text-sm">
                {filteredTasks.length} tasks • {filteredTasks.filter(t => !t.isDone).length} pending
              </p>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskItem task={task} selectedProject={selectedProject} getPriorityIcon={getPriorityIcon} getPriorityColor={getPriorityColor} key={task.id} />
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <Terminal className="w-12 h-12 text-charcoal/20 mx-auto mb-4" />
                <p className="text-charcoal/60 font-mono">No tasks found</p>
                <p className="text-sm text-charcoal/40 mt-2">
                  Use <span className="font-mono bg-charcoal/5 px-2 py-1 rounded">cues add "task name"</span> or click the New Task button
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Project Switcher Modal */}
      {showProjectSwitcher && (
        <div className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-50 flex items-start justify-center pt-32">
          <div className="bg-parchment rounded-xl shadow-2xl border border-pine/10 w-full max-w-md mx-4">
            <div className="p-4 border-b border-pine/10">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-charcoal/40" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-charcoal font-mono"
                  autoFocus
                />
                <button
                  onClick={() => setShowProjectSwitcher(false)}
                  className="text-charcoal/40 hover:text-charcoal transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <button
                onClick={() => {
                  setSelectedProject(null);
                  setShowProjectSwitcher(false);
                  setSearchQuery('');
                }}
                className="w-full text-left px-4 py-3 hover:bg-parchment-light transition-colors flex items-center justify-between border-b border-pine/5 last:border-b-0"
              >
                <span className="font-mono text-charcoal">All Projects</span>
                <span className="text-xs text-charcoal/40 font-mono">{tasks.length}</span>
              </button>
              {filteredProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setSelectedProject(project);
                    setShowProjectSwitcher(false);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-parchment-light transition-colors flex items-center justify-between border-b border-pine/5 last:border-b-0"
                >
                  <span className="font-mono text-charcoal">{project.name}</span>
                  <span className="text-xs text-charcoal/40 font-mono">{getTaskCount(project, tasks)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <TaskAddModal setShowTaskModal={setShowTaskModal} selectedProject={selectedProject} />
      )}
    </div>
  );
}

export default Dashboard;
