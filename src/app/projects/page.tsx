'use client';

import Image from 'next/image';
import { useState } from 'react';
import { projects } from '../../data/projects';
import type { Project } from '../../types';
import { getTagColor } from '@/utils/getTagColor';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Slideshow from '@/components/ui/Slideshow';
import ModalPortal from '@/components/common/ModalPortal';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const PersonalProjects = projects.filter(p => p.category === 'Personal');
  const HackathonProjects = projects.filter(p => p.category === 'Hackathon');

  return (
    <div className={`relative min-h-screen ${selectedProject ? '' : 'pt-16'} text-white overflow-hidden`}>
      {/* Background overlay for consistency */}
      {/* (overlay removed to keep body/footer background continuous) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
          <p className="text-gray-400 text-lg">
            個人開発やハッカソンで取り組んだプロジェクトをご紹介します
          </p>
        </div>

        <ProjectSection title="Personal Projects" projects={PersonalProjects} onSelect={setSelectedProject} />
        <ProjectSection title="Hackathon Projects" projects={HackathonProjects} onSelect={setSelectedProject} />
      </div>

      {selectedProject && (
        <ModalPortal>
          <div className="fixed inset-0 z-[9999] bg-black/70 p-2 sm:p-4 overflow-y-auto">
            <div className="min-h-full flex items-start sm:items-center justify-center py-4">
              <div className="bg-slate-800/95 border border-slate-600 rounded-lg
                w-full max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] lg:max-w-[1440px] shadow-xl p-4 sm:p-6 lg:p-8">
                <ProjectDetail
                  project={selectedProject}
                  onClose={() => setSelectedProject(null)}
                  getTagColor={getTagColor}
                />
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}

function ProjectSection({
  title,
  projects,
  onSelect
}: {
  title: string;
  projects: Project[];
  onSelect: (project: Project) => void;
}) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-semibold text-white mb-6">{title}</h2>
      {/* Desktop: Horizontal scroll, Mobile/Tablet: Grid layout */}
      <div className="hidden lg:flex lg:overflow-visible lg:space-x-4 lg:pb-4">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={onSelect}
            className="min-w-[240px] max-w-[240px] flex-shrink-0"
          />
        ))}
      </div>

      {/* Mobile and Tablet: Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4 sm:gap-6">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={onSelect}
            className="w-full"
          />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  onSelect,
  className
}: {
  project: Project;
  onSelect: (project: Project) => void;
  className?: string;
}) {
  return (
    <button
      onClick={() => onSelect(project)}
      className={`group flex flex-col rounded-xl overflow-hidden border border-slate-700 hover:border-blue-400 hover:scale-105 transition-transform duration-300 shadow-md ${className}`}
    >
      <div className="relative w-full h-40 sm:h-44 lg:h-48 bg-slate-800 flex-shrink-0">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          className="object-contain p-2"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 240px"
        />
      </div>
      <div className="p-3 sm:p-4 text-white text-sm sm:text-base font-semibold text-left flex-grow flex items-center">
        {project.title}
      </div>
    </button>
  );
}

function ProjectDetail({
  project,
  onClose,
  getTagColor
}: {
  project: Project;
  onClose: () => void;
  getTagColor: (tag: string) => string;
}) {
  return (
    <div className="relative w-full">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 z-50 text-gray-400 hover:text-white bg-slate-700/80 rounded-full p-1 backdrop-blur-sm"
      >
        <XMarkIcon className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <div className="relative w-full lg:w-[50%] h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] rounded overflow-hidden bg-slate-800 flex-shrink-0">
          {project.imageUrls && project.imageUrls.length > 0 ? (
            <Slideshow images={project.imageUrls} />
          ) : (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-contain p-4"
              sizes='(max-width: 1024px) 100vw, 50vw'
              priority
            />
          )}
        </div>

        <div className="flex-1 space-y-5 sm:space-y-6 min-w-0">
          <div className="flex items-center space-x-3 pr-8">
            <h3 className="text-xl sm:text-2xl font-bold break-words">{project.title}</h3>
          </div>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed break-words">{project.description}</p>

          {project.points && (
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-cyan-400 mt-4 mb-3">Points</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm sm:text-base">
                {project.points.map((point, i) => (
                  <li key={i} className="leading-relaxed break-words">{point}</li>
                ))}
              </ul>
            </div>
          )}

          {project.stacks && (
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-cyan-400 mt-4 mb-3">Stacks</h4>
              <div className="text-gray-300 space-y-3 sm:space-y-4 text-xs sm:text-sm">
                {Object.entries(project.stacks).map(([key, value]) => (
                  <div key={key} className="mb-3">
                    <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
                      <span className="w-full sm:w-24 font-medium capitalize text-cyan-300 flex-shrink-0">{key}:</span>
                      <div className="flex flex-wrap gap-2">
                        {value.length > 0 ? (
                          value.map(stack => (
                            <span
                              key={stack}
                              className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getTagColor(stack)}`}
                            >
                              {stack}
                            </span>
                          ))
                        ) : (
                          <span className="px-2 sm:px-3 py-1 text-xs font-medium rounded-full bg-gray-700 text-gray-400">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}