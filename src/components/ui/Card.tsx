import { type HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement>;

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
