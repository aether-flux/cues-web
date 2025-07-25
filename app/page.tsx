"use client";

import React, { useEffect, useState } from 'react';
import { Github, Terminal, Code, Layers, Star, ArrowRight, CheckCircle, Clock, Zap, Command, Circle, UserPlus, LayoutDashboard, X, Menu } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Footer } from './_components/Footer';
import { Button } from '@/components/ui/button';
import { LoginModal } from './_components/login-modal';
import { SignupModal } from './_components/signup-modal';
import { useRouter } from 'next/navigation';

export default function Home () {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = '$ cues add "Review PR #247" --due "today 18:00" --priority high';

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
    
    // Typing animation
    let index = 0;
    const typing = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typing);
      }
    }, 50);

    return () => clearInterval(typing);
  }, []);

  const features = [
    {
      icon: Terminal,
      title: 'Quick CLI Access',
      description: 'Add, complete, and manage tasks directly from your terminal. No context switching required.',
      command: '$ cues add "Fix auth bug"'
    },
    {
      icon: Layers,
      title: 'Project Overview',
      description: 'Organize tasks by project with intelligent filtering and priority management.',
      command: '$ cues tasks'
    },
    {
      icon: Code,
      title: 'Terminal + Web',
      description: 'Seamless sync between CLI and web interface. Work however feels natural.',
    }
  ];

  return (
    <div className="min-h-screen bg-parchment font-sans">
      {/* Navigation */}
      <nav className="border-b border-pine-100 bg-parchment/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/logos/cues_logo.svg" width={81} height={25} alt="cues logo" />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-charcoal/70 hover:text-charcoal transition-colors">Features</Link>

          <Link href="/docs" className="text-charcoal/70 hover:text-charcoal transition-colors">Documentation</Link>

          <Link href="https://github.com/aetheros/cues" className="flex items-center gap-2 bg-charcoal text-parchment px-4 py-2 rounded-xl hover:scale-105 hover:bg-charcoal/90 transition-all hover:shadow-lg">
            <Github className="w-5 h-5" />
          </Link>

          <Button className="bg-pine text-parchment px-10 py-5 rounded-xl font-semibold hover:bg-pine/90 transition-all hover:shadow-xl hover:scale-105 flex items-center gap-2 cursor-pointer" onClick={() => router.push('/dashboard')}>
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </Button>

          <Button className="bg-[#f5f4f1] text-[#2d5016] border-[#e8e5e0] border-2 px-10 py-5 rounded-xl font-semibold hover:bg-[#f5f4f1]/90 hover:text-[#1f3a0f] transition-all hover:shadow-xl hover:scale-105 flex items-center gap-2 cursor-pointer" onClick={() => setIsLoginOpen(true)}>
            <Terminal className="w-4 h-4" />
            <span className="text-sm font-medium">Log in</span>
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4 bg-parchment/90 backdrop-blur-sm border-t border-pine-100">
          <Link href="#features" className="mt-4 text-charcoal/80 hover:text-charcoal transition-colors text-center" onClick={() => setIsMobileMenuOpen(false)}>
            Features
          </Link>

          <Link href="/docs" className="mt-4 text-charcoal/80 hover:text-charcoal transition-colors text-center" onClick={() => setIsMobileMenuOpen(false)}>
            Documentation
          </Link>

          <Button asChild>
            <Link href="https://github.com/aetheros/cues-backend" className="flex items-center gap-2 bg-charcoal text-parchment px-4 py-2 rounded-xl hover:scale-105 hover:bg-charcoal/90 transition-all hover:shadow-lg" onClick={() => setIsMobileMenuOpen(false)}>
              <Github className="w-5 h-5" />
              GitHub
            </Link>
          </Button>

          <Button className="bg-pine text-parchment w-full py-3 rounded-xl font-semibold hover:bg-pine/90 transition-all hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer" onClick={() => {
            router.push('/dashboard');
            setIsMobileMenuOpen(false);
          }}>
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </Button>

          <Button className="bg-[#f5f4f1] text-[#2d5016] border-[#e8e5e0] border-2 w-full py-3 rounded-xl font-semibold hover:bg-[#f5f4f1]/90 hover:text-[#1f3a0f] transition-all hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer" onClick={() => {
            setIsLoginOpen(true);
            setIsMobileMenuOpen(false);
          }}>
            <Terminal className="w-4 h-4" />
            <span className="text-sm font-medium">Log in</span>
          </Button>
        </div>
      )}

        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center">
            <Badge variant="outline" className="mb-6 px-4 py-1 rounded-full border-pine/30 text-pine bg-pine/5">
              <Command className="w-3 h-3 mr-1" />
              CLI-first productivity
            </Badge>
          </div>
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-4xl md:text-7xl font-bold text-charcoal mb-6 tracking-tight leading-none">
              Productivity at
              <span className="block text-pine">your prompt.</span>
            </h1>
            <p className="text-md md:text-xl text-charcoal/70 max-w-2xl mx-auto mb-12 leading-relaxed">
              A developer-focused task manager that lives where you work. 
              CLI-first design with a beautiful web interface for when you need it.
            </p>
            
            {/* CLI Preview */}
            <div className="max-w-3xl mx-0 md:mx-auto mb-12">
              <div className="bg-charcoal rounded-xl p-6 shadow-2xl border border-charcoal/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-parchment/50 text-sm ml-4 font-mono">Terminal</span>
                </div>
                <div className="font-mono text-left text-sm md:text-lg">
                  <div className="text-brass mb-2">
                    <span className="text-pine">➜</span> <span className="text-parchment">~/project</span>
                  </div>
                  <div className="text-parchment mb-2">
                    {typedText}<span className="animate-pulse">|</span>
                  </div>
                  <div className="flex items-center justify-between text-2xs md:text-sm text-parchment w-full">
                    <div className="flex items-center space-x-2">
                      <span className="text-brass">[14]</span>
                      <span className="text-red-400">[ ]</span>
                      <span>Review PR #247</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Circle fill="#ef5350" strokeWidth="0" />
                      <span className="text-[#6da2de]">11th July, 2025 18:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-pine text-parchment px-8 py-4 rounded-xl font-semibold hover:bg-pine/90 transition-all hover:shadow-xl hover:scale-105 flex items-center gap-2 cursor-pointer" onClick={() => setIsSignupOpen(true)}>
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link href="https://github.com/aether-flux/cues-web" className="flex items-center gap-2 text-charcoal/70 hover:text-charcoal transition-colors">
                <Star className="w-5 h-5" />
                <span>Star on GitHub</span>
              </Link>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-start gap-5 md:gap-15 mb-10 mt-10">
              <div className="flex flex-col items-center justify-center gap-4">
                <span className="text-sm md:text-lg text-charcoal/70 leading-relaxed">On Linux systems</span>
                <div className="bg-charcoal rounded-lg p-3 font-mono text-sm md:text-md text-parchment border-l-8 border-brass">
                  <span className="text-brass">$</span> curl -fsSL https://cues-web.vercel.app/linux/install.sh | bash
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-4">
                <span className="text-sm md:text-lg text-charcoal/70 leading-relaxed">On Windows systems</span>
                <div className="bg-charcoal rounded-lg p-3 font-mono text-sm md:text-md text-parchment border-l-8 border-brass">
                  <span className="text-brass">$</span> curl -L https://cues-web.vercel.app/windows/install.bat -o install.bat && install.bat
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-parchment-light">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-charcoal mb-4">Built for developers</h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
              Every feature designed with your workflow in mind. Fast, efficient, and beautifully simple.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-parchment p-8 rounded-xl shadow-sm border border-pine/10 hover:shadow-lg hover:border-pine/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="bg-pine/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-pine" />
                  </div>
                  <h3 className="text-xl font-semibold text-charcoal mb-3">{feature.title}</h3>
                  <p className="text-charcoal/70 mb-6 leading-relaxed">{feature.description}</p>
                  {feature.command && (
                    <div className="bg-charcoal/5 rounded-lg p-3 font-mono text-sm text-pine border-l-4 border-brass">
                      {feature.command}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-pine text-parchment">
        <div className=" mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">Ready to boost your productivity?</h2>
          <p className="text-xl text-parchment/80 mb-12 max-w-2xl mx-auto">
            Join developers who have made task management effortless with Cues.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="bg-parchment text-pine px-8 py-4 rounded-xl font-semibold hover:bg-parchment/90 transition-all hover:shadow-xl hover:scale-105 flex items-center gap-2" onClick={() => setIsSignupOpen(true)}>
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link 
              href="https://github.com/aether-flux/cues-web" 
              className="flex items-center gap-2 border border-parchment/30 px-6 py-4 rounded-xl hover:bg-parchment/10 transition-all"
            >
              <Github className="w-5 h-5" />
              <span>Star on GitHub</span>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-start gap-5 md:gap-10 mt-12 pt-8 px-8 md:px-0 border-t border-parchment/20">
            <div className="flex flex-col items-center justify-center gap-4">
              <span className="text-sm md:text-lg text-parchment leading-relaxed">On Linux systems</span>
              <div className="bg-charcoal rounded-lg p-3 font-mono text-sm md:text-md text-parchment border-l-8 border-brass">
                <span className="text-brass">$</span> curl -fsSL https://cues-web.vercel.app/linux/install.sh | bash
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
              <span className="text-sm md:text-lg text-parchment leading-relaxed">On Windows systems</span>
              <div className="bg-charcoal rounded-lg p-3 font-mono text-sm md:text-md text-parchment border-l-8 border-brass">
                <span className="text-brass">$</span> curl -L https://cues-web.vercel.app/windows/install.bat -o install.bat && install.bat
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
