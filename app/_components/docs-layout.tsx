"use client"

import type React from "react"
import { Terminal, Book, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface DocMeta {
  title: string
  description?: string
  slug: string
  order?: number
}

interface DocsLayoutProps {
  children: React.ReactNode
  currentSlug: string
  docs: DocMeta[]
}

export function DocsLayout({ children, currentSlug, docs }: DocsLayoutProps) {
  return (
    <div className="min-h-screen bg-[#faf9f7] font-mono">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#f5f4f1] border-r border-[#e8e5e0] min-h-screen">
          <div className="p-6 border-b border-[#e8e5e0]">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#2d5016] font-semibold hover:text-[#1f3a0f] transition-colors"
            >
              {/*<Terminal className="w-6 h-6" />
              <span className="text-xl">cues</span>*/}

              <Image src="/logos/cues_logo.svg" width={81} height={25} alt="cues logo" />
            </Link>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Book className="w-5 h-5 text-[#6b5b47]" />
              <h2 className="text-lg font-semibold text-[#2c2c2c]">Documentation</h2>
            </div>

            <nav className="space-y-2">
              {docs.map((doc) => (
                <Link
                  key={doc.slug}
                  href={`/docs${doc.slug === "index" ? "" : `/${doc.slug}`}`}
                  className={`
                    flex items-center justify-between p-3 rounded-md transition-all duration-200 group
                    ${
                      currentSlug === doc.slug
                        ? "bg-[#2d5016] text-[#faf9f7] shadow-sm"
                        : "text-[#4a4a4a] hover:bg-[#e8e5e0] hover:text-[#2d5016]"
                    }
                  `}
                >
                  <span className="text-sm font-medium">{doc.title}</span>
                  <ChevronRight
                    className={`
                    w-4 h-4 transition-transform duration-200
                    ${currentSlug === doc.slug ? "rotate-90" : "group-hover:translate-x-1"}
                  `}
                  />
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}

