"use client"

import { useState } from "react"
import { Terminal, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { JSX } from "react/jsx-runtime"

interface MDXContentProps {
  content: string
}

function CodeBlock({ children, language = "text" }: { children: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-6">
      <div className="flex items-center justify-between bg-[#2c2c2c] text-[#faf9f7] px-4 py-2 rounded-t-md">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#cd7f32]" />
          <span className="text-sm text-[#e8e5e0]">{language}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#e8e5e0] hover:text-[#faf9f7] hover:bg-[#3a3a3a]"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      <pre className="bg-[#2c2c2c] text-[#faf9f7] p-4 rounded-b-md overflow-x-auto font-mono text-sm">
        <code>{children}</code>
      </pre>
    </div>
  )
}

function parseMarkdown(content: string): JSX.Element {
  const lines = content.split("\n")
  const elements: JSX.Element[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Skip frontmatter
    if (line.trim() === "---") {
      i++
      while (i < lines.length && lines[i].trim() !== "---") {
        i++
      }
      i++
      continue
    }

    // Headers
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-3xl font-mono font-bold text-[#2c2c2c] mb-6 mt-8 first:mt-0">
          {line.substring(2)}
        </h1>,
      )
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={i}
          className="text-2xl font-mono font-semibold text-[#2c2c2c] mb-4 mt-8 pb-2 border-b border-[#e8e5e0]"
        >
          {line.substring(3)}
        </h2>,
      )
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-xl font-mono font-semibold text-[#2c2c2c] mb-3 mt-6">
          {line.substring(4)}
        </h3>,
      )
    } else if (line.startsWith("#### ")) {
      elements.push(
        <h4 key={i} className="text-lg font-mono font-medium text-[#2c2c2c] mb-2 mt-4">
          {line.substring(5)}
        </h4>,
      )
    }
    // Code blocks
    else if (line.startsWith("```")) {
      const language = line.substring(3).trim() || "text"
      const codeLines: string[] = []
      i++

      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }

      elements.push(
        <CodeBlock key={i} language={language}>
          {codeLines.join("\n")}
        </CodeBlock>,
      )
    }
    // Blockquotes
    else if (line.startsWith("> ")) {
      const quoteLines: string[] = []
      let j = i

      while (j < lines.length && (lines[j].startsWith("> ") || lines[j].trim() === "")) {
        if (lines[j].startsWith("> ")) {
          quoteLines.push(lines[j].substring(2))
        } else if (lines[j].trim() === "") {
          quoteLines.push("")
        }
        j++
      }

      elements.push(
        <blockquote key={i} className="border-l-4 border-[#cd7f32] bg-[#f5f4f1] p-4 my-4 italic">
          <div className="text-[#6b5b47] font-mono">
            {quoteLines.map((quoteLine, idx) => (
              <p key={idx} className="mb-2 last:mb-0">
                {parseInlineMarkdown(quoteLine)}
              </p>
            ))}
          </div>
        </blockquote>,
      )

      i = j - 1
    }
    // Lists
    else if (line.startsWith("- ") || line.startsWith("* ")) {
      const listItems: string[] = []
      let j = i

      while (j < lines.length && (lines[j].startsWith("- ") || lines[j].startsWith("* ") || lines[j].trim() === "")) {
        if (lines[j].startsWith("- ") || lines[j].startsWith("* ")) {
          listItems.push(lines[j].substring(2))
        }
        j++
      }

      elements.push(
        <ul key={i} className="list-none space-y-2 mb-4 ml-4">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-[#4a4a4a] font-mono flex items-start">
              <span className="text-[#cd7f32] mr-2 mt-1">•</span>
              <span>{parseInlineMarkdown(item)}</span>
            </li>
          ))}
        </ul>,
      )

      i = j - 1
    }
    // Numbered lists
    else if (/^\d+\. /.test(line)) {
      const listItems: string[] = []
      let j = i

      while (j < lines.length && (/^\d+\. /.test(lines[j]) || lines[j].trim() === "")) {
        if (/^\d+\. /.test(lines[j])) {
          listItems.push(lines[j].replace(/^\d+\. /, ""))
        }
        j++
      }

      elements.push(
        <ol key={i} className="list-decimal list-inside space-y-2 mb-4 ml-4 font-mono">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-[#4a4a4a]">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ol>,
      )

      i = j - 1
    }
    // Tables
    else if (line.includes("|") && line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const tableRows: string[][] = []
      let j = i

      while (j < lines.length && lines[j].includes("|") && lines[j].trim().startsWith("|")) {
        if (!lines[j].includes("---")) {
          // Skip separator row
          const cells = lines[j]
            .split("|")
            .slice(1, -1)
            .map((cell) => cell.trim())
          tableRows.push(cells)
        }
        j++
      }

      if (tableRows.length > 0) {
        elements.push(
          <div key={i} className="overflow-x-auto my-6">
            <table className="w-full border-collapse border border-[#e8e5e0] font-mono text-sm">
              <thead className="bg-[#f5f4f1]">
                <tr>
                  {tableRows[0].map((cell, idx) => (
                    <th key={idx} className="border border-[#e8e5e0] px-4 py-2 text-left font-semibold text-[#2c2c2c]">
                      {parseInlineMarkdown(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.slice(1).map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="border border-[#e8e5e0] px-4 py-2 text-[#4a4a4a]">
                        {parseInlineMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        )
      }

      i = j - 1
    }
    // Horizontal rule
    else if (line.trim() === "---" || line.trim() === "***") {
      elements.push(<hr key={i} className="border-0 border-t border-[#e8e5e0] my-8" />)
    }
    // Regular paragraphs
    else if (line.trim() !== "") {
      // Collect consecutive non-empty lines for paragraph
      const paragraphLines: string[] = [line]
      let j = i + 1

      while (
        j < lines.length &&
        lines[j].trim() !== "" &&
        !lines[j].startsWith("#") &&
        !lines[j].startsWith("```") &&
        !lines[j].startsWith("- ") &&
        !lines[j].startsWith("* ") &&
        !/^\d+\. /.test(lines[j]) &&
        !lines[j].startsWith("> ") &&
        !lines[j].includes("|")
      ) {
        paragraphLines.push(lines[j])
        j++
      }

      elements.push(
        <p key={i} className="text-[#4a4a4a] font-mono leading-relaxed mb-4">
          {parseInlineMarkdown(paragraphLines.join(" "))}
        </p>,
      )

      i = j - 1
    }

    i++
  }

  return <div className="prose prose-lg max-w-none">{elements}</div>
}

function parseInlineMarkdown(text: string): JSX.Element {
  const parts: (string | JSX.Element)[] = []
  let currentText = text
  let keyCounter = 0

  // Bold text
  currentText = currentText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
    const key = `bold-${keyCounter++}`
    parts.push(
      <strong key={key} className="font-bold">
        {content}
      </strong>,
    )
    return `__PLACEHOLDER_${parts.length - 1}__`
  })

  // Italic text
  currentText = currentText.replace(/\*(.*?)\*/g, (match, content) => {
    const key = `italic-${keyCounter++}`
    parts.push(
      <em key={key} className="italic">
        {content}
      </em>,
    )
    return `__PLACEHOLDER_${parts.length - 1}__`
  })

  // Inline code
  currentText = currentText.replace(/`([^`]+)`/g, (match, content) => {
    const key = `code-${keyCounter++}`
    parts.push(
      <code key={key} className="bg-[#e8e5e0] text-[#2d5016] px-2 py-1 rounded font-mono text-sm">
        {content}
      </code>,
    )
    return `__PLACEHOLDER_${parts.length - 1}__`
  })

  // Links
  currentText = currentText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, href) => {
    const key = `link-${keyCounter++}`
    parts.push(
      <a
        key={key}
        href={href}
        className="text-[#2d5016] hover:text-[#1f3a0f] underline font-mono transition-colors"
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {text}
      </a>,
    )
    return `__PLACEHOLDER_${parts.length - 1}__`
  })

  // Split by placeholders and reconstruct
  const finalParts = currentText.split(/(__PLACEHOLDER_\d+__)/g).map((part, index) => {
    const match = part.match(/__PLACEHOLDER_(\d+)__/)
    if (match) {
      return parts[Number.parseInt(match[1])]
    }
    return part
  })

  return <>{finalParts}</>
}

export function MDXContent({ content }: MDXContentProps) {
  return parseMarkdown(content)
}

