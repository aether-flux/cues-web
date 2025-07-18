"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Terminal, Eye, EyeOff } from "lucide-react"
import api from "@/utils/api"
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [usernameOrEmail, setUsernameOrEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter();

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      let res;

      if (usernameOrEmail.includes("@")) {
        res = await api.post('/auth/login', {
          email: usernameOrEmail,
          password: password,
        });
      } else {
        res = await api.post('/auth/login', {
          username: usernameOrEmail,
          password: password,
        });
      }

      const { accessToken } = res.data;

      if (accessToken) {
        const userRes = await api.get('/auth/user', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { user } = userRes.data;

        if (user) {
          useAuthStore.getState().setAuth(accessToken, user);
          toast.success("Logged in successfully!", {
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

          router.push('/dashboard');
        }
      }
      
      setIsLoading(false)
      onClose()
    } catch (e) {
      console.error("Failed to log in: ", e);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && usernameOrEmail && password) {
      handleLogin()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#f5f4f1] border-[#e8e5e0] shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-mono text-[#2d5016] flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            Enter System
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Username/Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-[#6b5b47]">Username or Email {">"}</label>
            <Input
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="developer@example.com"
              className="bg-[#faf9f7] border-[#e8e5e0] focus:border-[#2d5016] font-mono"
              autoFocus
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-[#6b5b47]">Password {">"}</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                className="bg-[#faf9f7] border-[#e8e5e0] focus:border-[#2d5016] font-mono pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-[#6b5b47]" />
                ) : (
                  <Eye className="h-4 w-4 text-[#6b5b47]" />
                )}
              </Button>
            </div>
          </div>

          {/* CLI Command Preview */}
          <div className="bg-[#2c2c2c] text-[#faf9f7] p-3 rounded-md font-mono text-xs">
            <div className="text-[#cd7f32]"># CLI equivalent</div>
            <div className="text-[#e8e5e0]">cues login</div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#e8e5e0]">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-[#faf9f7] border-[#e8e5e0] text-[#6b5b47] hover:bg-[#e8e5e0] font-mono"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogin}
            disabled={!usernameOrEmail || !password || isLoading}
            className="bg-[#2d5016] hover:bg-[#1f3a0f] text-[#faf9f7] font-mono disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Enter"}
          </Button>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-[#6b5b47] font-mono">Press Enter to authenticate • ESC to cancel</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

