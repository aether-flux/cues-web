"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Copy, Power, RefreshCw } from "lucide-react"
import { Project } from "@/utils/types"
import api from "@/utils/api"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/authStore"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  currentProject: Project | null;
}

export function SettingsModal({ isOpen, onClose, currentProject }: SettingsModalProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [pid, setPid] = useState<number | null>(null)

  const router = useRouter();

  useEffect(() => {
    if (currentProject) {
      setPid(currentProject.id);
    }
  }, [currentProject]);

  const copyId = () => {
    if (pid) {
      navigator.clipboard.writeText(pid.toLocaleString());
      toast.success("Project ID copied successfully!", {
        style: {
          borderRadius: '50px',
          padding: '10px 20px',
          background: '#faf9f7',
          color: '#1a1a1a',
        },
        iconTheme: {
          primary: '#2d5016',
          secondary: '#faf9f7'
        }
      });
    }
  }

  const onLogout = async () => {
    const res = await api.post('/auth/logout');

    useAuthStore.getState().clearAuth();

    toast.success("Logged out successfully!", {
      style: {
        borderRadius: '50px',
        padding: '10px 20px',
        background: '#faf9f7',
        color: '#1a1a1a',
      },
      iconTheme: {
        primary: '#2d5016',
        secondary: '#faf9f7'
      }
    });

    router.push('/');
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#f5f4f1] border-[#e8e5e0] shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-mono text-[#2d5016]">Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project ID */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-mono text-[#2c2c2c] font-medium">Project ID</label>
              {/*<p className="text-xs text-[#6b5b47] font-mono">Use this token to authenticate with the CLI</p>*/}
            </div>

            <div className="flex gap-2">
              <Input value={currentProject ? currentProject.id : "No project selected"} readOnly className={`bg-[#faf9f7] ${!currentProject ? "text-charcoal/50" : "text-charcoal"} border-[#e8e5e0] font-mono text-sm flex-1`} />
              <Button
                variant="outline"
                size="sm"
                disabled={!currentProject}
                onClick={copyId}
                className="bg-[#faf9f7] border-[#e8e5e0] text-[#6b5b47] hover:bg-[#e8e5e0]"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* CLI Usage */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-[#2c2c2c] font-medium">CLI Usage</label>
            <div className="bg-[#2c2c2c] text-[#faf9f7] p-3 rounded-md font-mono text-xs">
              <div className="text-[#cd7f32]"># Install CLI</div>
              <div>npm install -g @cues/cli</div>
              <br />
              <div className="text-[#cd7f32]"># Authenticate</div>
              <div>cues login</div>
              {currentProject && (
              <div>
              <br />
                <div className="text-[#cd7f32]"># Set project as CWP (Current Working Project)</div>
                <div>cues use {pid}</div>
                <br />
                <div className="text-[#cd7f32]"># Create tasks in project</div>
                <div>cues add "Review PR #34" --priority high --due "today 18:00"</div>
              </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-mono text-[#2c2c2c] font-medium">Log out</label>
            <p className="text-xs text-[#6b5b47] font-mono">Log out of <u>Cues</u> from your current account.</p>
          </div>

          <Button onClick={onLogout} className="bg-[#2d5016] hover:bg-[#1f3a0f] text-[#faf9f7] font-mono cursor-pointer">
            <Power className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#e8e5e0]">
          <Button onClick={onClose} className="bg-[#2d5016] hover:bg-[#1f3a0f] text-[#faf9f7] font-mono cursor-pointer">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

