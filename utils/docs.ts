import fs from "fs"
import path from "path"
import matter from "gray-matter"

const docsDirectory = path.join(process.cwd(), "docs")

export interface DocMeta {
  title: string
  description: string
  slug: string
  order: number
}

export interface Doc extends DocMeta {
  content: string
}

export function getDocBySlug(slug: string): Doc | null {
  try {
    // Ensure this only runs on the server
    if (typeof window !== "undefined") {
      return null
    }

    const realSlug = slug === "index" ? "index" : slug
    const fullPath = path.join(docsDirectory, `${realSlug}.md`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug: realSlug,
      title: data.title || "Untitled",
      description: data.description,
      order: data.order || 0,
      content,
    }
  } catch (error) {
    console.error("Error reading doc:", error)
    return null
  }
}

export function getAllDocs(): DocMeta[] {
  try {
    // Ensure this only runs on the server
    if (typeof window !== "undefined") {
      return []
    }

    if (!fs.existsSync(docsDirectory)) {
      return []
    }

    const fileNames = fs.readdirSync(docsDirectory)
    const docs = fileNames
      .filter((name) => name.endsWith(".md"))
      .map((name) => {
        const slug = name.replace(/\.md$/, "")
        const doc = getDocBySlug(slug)
        return doc
          ? {
              title: doc.title,
              description: doc.description,
              slug: doc.slug,
              order: doc.order || 0,
            } as DocMeta
          : null
      })
      .filter((doc): doc is DocMeta => doc !== null)
      .sort((a, b) => a.order - b.order)

    return docs
  } catch (error) {
    console.error("Error reading docs directory:", error)
    return []
  }
}

