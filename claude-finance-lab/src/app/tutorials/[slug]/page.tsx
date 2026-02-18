"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { getTutorialBySlug } from "@/data/tutorials"
import { TutorialViewer } from "@/components/tutorial/TutorialViewer"

export default function TutorialPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const tutorial = getTutorialBySlug(slug)

  if (!tutorial) {
    notFound()
  }

  return <TutorialViewer tutorial={tutorial} />
}
