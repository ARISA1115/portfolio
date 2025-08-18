'use client'
import Link from 'next/link'
import {
  RocketLaunchIcon,
  CodeBracketIcon,
  CloudIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline'
import { Typewriter } from 'react-simple-typewriter'
import Image from 'next/image'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    const cards = document.querySelectorAll('.skill-card')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>{
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.3 }
    )
    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  },[])
  return (
    <div className="min-h-screen pt-16 relative">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            {/* === Welcome Badge === */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-2 text-blue-400 text-sm">
                <RocketLaunchIcon className="w-4 h-4" />
                Welcome to my portfolio!
              </div>
            </div>

            {/* === Main Title === */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Hi, I&apos;m Arisa
            </h1>

            {/* === Typing Animated Subtitle === */}
            <p className="text-xl md:text-2xl mb-8 h-[40px]">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                <Typewriter
                  words={['Security Engineer & Backend Engineer']}
                  loop={true}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1500}
                />
              </span>
            </p>

            <div className="flex justify-center mt-2 mb-4">
              <Image
                src="/images/astronaut.png"
                alt="Astronaut Icon"
                width={250}
                height={250}
                className="h-auto animate-float animate-neon-intensify neon-glow filter"
                priority
              />
            </div>

            {/* === Call To Action Buttons === */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4 mb-4">
              <Link
                href="/projects"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                View My Projects
              </Link>
              <Link
                href="/profile"
                className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                About Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SKILLS SECTION ================= */}
      <section className="pt-12 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* === Frontend Skill Card === */}
          <Link href="/profile#skills">
            <div className="skill-card group bg-slate-900/60 border border-slate-700 rounded-xl p-8 text-center hover:border-cyan-400 hover:shadow-xl transition duration-300">
              {/* Icon container with hover background change */}
              <div className="w-14 h-14 mb-5 mx-auto flex items-center justify-center rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition">
                <CodeBracketIcon className="w-8 h-8 text-cyan-400" />
              </div>
              {/* Skill title */}
              <h3 className="text-lg font-semibold text-white tracking-wide mb-2">
                Frontend
              </h3>
              {/* Skill list */}
              <p className="text-gray-400 text-sm tracking-wide">
                React | Next.js | TypeScript
              </p>
            </div>
          </Link>

            {/* === Backend Skill Card === */}
          <Link href="/profile#skills">
            <div className="skill-card group bg-slate-900/60 border border-slate-700 rounded-xl p-8 text-center hover:border-blue-400 hover:shadow-xl transition duration-300">
              <div className="w-14 h-14 mb-5 mx-auto flex items-center justify-center rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition">
                <CommandLineIcon className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white tracking-wide mb-2">
                Backend
              </h3>
              <p className="text-gray-400 text-sm tracking-wide">
                Python | Go | MySQL
              </p>
            </div>
          </Link>

            {/* === DevOps Skill Card === */}
          <Link href="/profile#skills">
            <div className="skill-card group bg-slate-900/60 border border-slate-700 rounded-xl p-8 text-center hover:border-indigo-400 hover:shadow-xl transition duration-300">
              <div className="w-14 h-14 mb-5 mx-auto flex items-center justify-center rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition">
                <CloudIcon className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-white tracking-wide mb-2">
                DevOps & Cloud
              </h3>
              <p className="text-gray-400 text-sm tracking-wide">
                AWS | Terraform | GitHub Actions | Docker
              </p>
            </div>
          </Link>
          </div>
        </div>
      </section>
    </div>
  )
}