import React from 'react';
import Slideshow from '@/components/ui/Slideshow';
import { Project } from '../types';
import Image from 'next/image';

type Props = {
  project: Project;
};

export const ProjectDetailCard: React.FC<Props> = ({ project }) => {
  return (
    <div className="bg-[#1c1f2a] text-white rounded-lg p-6 shadow-lg max-w-4xl mx-auto">
      <div className="mb-10">
        {project.imageUrls && project.imageUrls.length > 0 ? (
          <div className="lg:w-[50%] h-[400px] relative mx-auto mb-10">
            <Slideshow images={project.imageUrls} />
          </div>
        ) : (
          <div className="lg:w-[50%] h-[400px] relative mx-auto">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        )}
      </div>
      <h2 className="text-2xl font-bold mb-2 mt-6">{project.title}</h2>
      <p className="text-gray-300 mb-4">{project.description}</p>

      <h3 className="text-xl font-semibold text-cyan-400 mb-1">Stacks</h3>
      <div className="space-y-1 text-sm text-gray-200">
        <div>
          <strong className="text-gray-300">frontend:</strong>{' '}
          {project.stacks.frontend.join(' | ')}
        </div>
        <div>
          <strong className="text-gray-300">backend:</strong>{' '}
          {project.stacks.backend.join(' | ')}
        </div>
        <div>
          <strong className="text-gray-300">infra:</strong>{' '}
          {project.stacks.infra.join(' | ')}
        </div>
      </div>

      {project.githubUrl && (
        <div className="mt-4">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline"
          >
            GitHub
          </a>
        </div>
      )}
    </div>
  );
};