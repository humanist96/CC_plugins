"use client"

import { HeroSection } from "@/components/landing/HeroSection"
import { PluginCards } from "@/components/landing/PluginCards"
import { LearningPath } from "@/components/landing/LearningPath"
import { StatsBar } from "@/components/landing/StatsBar"

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <PluginCards />
      <LearningPath />
    </>
  )
}
