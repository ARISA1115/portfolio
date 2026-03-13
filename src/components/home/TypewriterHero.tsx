'use client';

import Link from 'next/link';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';
import { Typewriter } from 'react-simple-typewriter';
import Image from 'next/image';

export default function TypewriterHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-2 text-blue-400 text-sm">
              <RocketLaunchIcon className="w-4 h-4" />
              Welcome to my portfolio!
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Hi, I&apos;m Arisa
          </h1>

          <p className="text-xl md:text-2xl mb-8 h-[40px]">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              <Typewriter
                words={['Backend Engineer & Security Engineer']}
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
              src="/images/penguin.png"
              alt="Penguin Icon"
              width={250}
              height={250}
              className="h-auto animate-float animate-neon-intensify neon-glow filter"
              priority
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center mt-10 sm:mt-12 mb-4">
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
  );
}
