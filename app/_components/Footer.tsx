import { Github } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="bg-charcoal text-parchment py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Image src="/logos/cues_logo_dark.svg" width={58} height={18} alt="cues logo" />
          </div>
          <div className="flex items-center gap-6 text-parchment/60">
            <Link href="#" className="hover:text-parchment transition-colors">Documentation</Link>
            <Link href="https://github.com/aether-flux/cues" className="hover:text-parchment transition-colors">
              <Github className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-parchment/10 text-center text-parchment/40 text-sm">
          © 2025 Cues. Built for developers, by developers.
        </div>
      </div>
    </footer>
  )
}
