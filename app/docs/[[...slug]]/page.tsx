import { getAllDocs, getDocBySlug } from "@/utils/docs"
import { DocsLayout } from "@/app/_components/docs-layout"
import { MDXContent } from "@/app/_components/mdx-content"
import { notFound } from "next/navigation"
// import type { PageProps } from "next"

// interface DocsPageProps {
//   params: {
//     slug?: string[]
//   }
// }

export default async function DocsPage({ params }: { params: { slug?: string[] } }) {
  const slug = params.slug?.join("/") || "index"
  const doc = getDocBySlug(slug)

  if (!doc) {
    notFound()
  }

  const allDocs = getAllDocs()

  return (
    <DocsLayout currentSlug={slug} docs={allDocs}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-mono font-bold text-[#2c2c2c] mb-4">{doc.title}</h1>
          {doc.description && <p className="text-lg text-[#6b5b47] font-mono leading-relaxed">{doc.description}</p>}
        </div>
        <MDXContent content={doc.content} />
      </div>
    </DocsLayout>
  )
}

export async function generateStaticParams() {
  const docs = getAllDocs()
  return docs.map((doc) => ({
    slug: doc.slug === "index" ? [] : doc.slug.split("/"),
  }))
}

