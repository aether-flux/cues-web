"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus, Eye, EyeOff, Check, X } from "lucide-react"
import api from "@/utils/api"
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const passwordsMatch = password && confirmPassword && password === confirmPassword
  const passwordsDontMatch = confirmPassword && password !== confirmPassword

  const isFormValid = username && email && isValidEmail(email) && password && passwordsMatch

  const handleSignup = async () => {
    if (!isFormValid) return;

    try {
      setIsLoading(true)
      const res = await api.post('/auth/signup', {
        username, email, password
      });

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
          toast.success("Account created! Logged in successfully!", {
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
      console.error("Failed to sign up: ", e);
    }
  }

  const generateUserId = (username: string) => {
    return username
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#f5f4f1] border-[#e8e5e0] shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-mono text-[#2d5016] flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Initialize User
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-[#6b5b47]">Username {">"}</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="developer"
              className="bg-[#faf9f7] border-[#e8e5e0] focus:border-[#2d5016] font-mono"
              autoFocus
            />
            {username && <div className="text-xs text-[#6b5b47] font-mono">ID: {generateUserId(username)}</div>}
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-[#6b5b47]">Email {">"}</label>
            <div className="relative">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="bg-[#faf9f7] border-[#e8e5e0] focus:border-[#2d5016] font-mono pr-8"
              />
              {email && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  {isValidEmail(email) ? (
                    <Check className="h-4 w-4 text-[#2d5016]" />
                  ) : (
                    <X className="h-4 w-4 text-[#cd7f32]" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-[#6b5b47]">Password {">"}</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-[#6b5b47]">Confirm Password {">"}</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`
                  bg-[#faf9f7] border-[#e8e5e0] focus:border-[#2d5016] font-mono pr-10
                  ${passwordsDontMatch ? "border-[#cd7f32] focus:border-[#cd7f32]" : ""}
                  ${passwordsMatch ? "border-[#2d5016]" : ""}
                `}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                {confirmPassword && (
                  <>
                    {passwordsMatch ? (
                      <Check className="h-4 w-4 text-[#2d5016]" />
                    ) : (
                      <X className="h-4 w-4 text-[#cd7f32]" />
                    )}
                  </>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-[#6b5b47]" />
                  ) : (
                    <Eye className="h-4 w-4 text-[#6b5b47]" />
                  )}
                </Button>
              </div>
            </div>
            {passwordsDontMatch && <p className="text-xs text-[#cd7f32] font-mono">Passwords do not match</p>}
          </div>

          {/* CLI Command Preview */}
          {username && (
            <div className="bg-[#2c2c2c] text-[#faf9f7] p-3 rounded-md font-mono text-xs">
              <div className="text-[#cd7f32]"># CLI setup after signup</div>
              <div className="text-[#e8e5e0]">cues init --user {generateUserId(username)}</div>
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
          <Button
            onClick={handleSignup}
            disabled={!isFormValid || isLoading}
            className="bg-[#2d5016] hover:bg-[#1f3a0f] text-[#faf9f7] font-mono disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Initialize"}
          </Button>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-[#6b5b47] font-mono">All fields required • ESC to cancel</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

