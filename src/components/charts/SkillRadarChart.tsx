'use client';

import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  TooltipItem
} from 'chart.js';

// Register required chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface Skill {
  name: string;
  level: number;
}

interface Props {
  title: string;     // Chart title, e.g., "Frontend"
  skills: Skill[];   // Array of skill objects with name and level
  color: string;     // Hex color code for category
}

export default function SkillRadarChart({ title, skills, color }: Props) {
  const data = {
    labels: skills.map(skill => skill.name),
    datasets: [
      {
        label: `${title} Skills`,
        data: skills.map(skill => skill.level),
        backgroundColor: `${color}33`,         // Transparent fill (hex + 20% opacity)
        borderColor: color,
        borderWidth: 2,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: color
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          display: false,
          stepSize: 20
        },
        pointLabels: {
          color: '#cbd5e1', // gray-300
          font: {
            size: 14
          }
        },
        grid: {
          color: '#334155' // slate-700
        }
      }
    },
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: TooltipItem<'radar'>) => {
            return `${context.label}: ${context.parsed.r}%`;
          }
        }
      },
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white text-center mb-4">{title}</h3>
      <div className="h-64">
        <Radar data={data} options={options} />
      </div>
    </div>
  );
}