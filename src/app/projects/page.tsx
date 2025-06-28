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
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 overflow-y-auto">
            <div className="bg-slate-800/95 border border-slate-600 rounded-lg
              w-full max-w-[1440px] shadow-xl p-8 max-h-[calc(100vh-4rem)]">
              <ProjectDetail
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
                getTagColor={getTagColor}
              />
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
      <div className="flex overflow-visible space-x-4 pb-4">
        {projects.map(project => (
          <button
            key={project.id}
            onClick={() => onSelect(project)}
            className="group min-w-[240px] max-w-[240px] flex-shrink-0 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-400 hover:scale-105 transition-transform duration-300 shadow-md"
          >
            <div className="relative w-full h-48">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
                sizes="240px"
              />
            </div>
            <div className="p-4 text-white text-base font-semibold text-left">
              {project.title}
            </div>
          </button>
        ))}
      </div>
    </section>
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
    <div className="relative w-full max-w-[1440px] shadow-xl p-8 max-h-[calc(100vh-4rem)]">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 sm:-top-4 sm:-right-4 z-50 text-gray-400 hover:text-white"
      >
        <XMarkIcon className="w-8 h-8 sm:w-10 sm:h-10" />
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative w-full lg:w-[50%] h-[400px] rounded overflow-hidden">
          {project.imageUrls && project.imageUrls.length > 0 ? (
            <Slideshow images={project.imageUrls} />
          ) : (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-contain rounded"
              sizes='(max-width: 1024px) 100vw, 50vw'
              priority
            />
          )}
        </div>

        <div className="flex-4 space-y-6">
          <div className="flex items-center space-x-3">
            <h3 className="text-2xl font-bold">{project.title}</h3>
            {/* {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <CodeBracketIcon className="w-5 h-5" />
              </a>
            )} */}
          </div>

          <p className="text-gray-300">{project.description}</p>

          {project.points && (
            <div>
              <h4 className="text-lg font-semibold text-cyan-400 mt-4">Points</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {project.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {project.stacks && (
            <div>
              <h4 className="text-lg font-semibold text-cyan-400 mt-4">Stacks</h4>
              <div className="text-gray-300 space-y-2 text-sm">
                {Object.entries(project.stacks).map(([key, value]) => (
                  <div key={key} className="flex items-start space-x-2">
                    <span className="w-20 font-medium capitalize">{key}:</span>
                    <div className="flex flex-wrap gap-2">
                      {value.length > 0 ? (
                        value.map(stack => (
                          <span
                            key={stack}
                            className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getTagColor(stack)}`}
                          >
                            {stack}
                          </span>
                        ))
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-700 text-gray-400">None</span>
                      )}
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