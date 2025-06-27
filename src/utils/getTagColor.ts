export const getTagColor = (tag: string): string => {
  const colors: Record<string, string> = {
    // Frontend
    HTML: 'bg-orange-500/20 text-orange-300',
    CSS: 'bg-fuchsia-500/20 text-white-300',
    JavaScript: 'bg-yellow-300/20 text-yellow-400',
    TypeScript: 'bg-blue-400/20 text-blue-300',
    React: 'bg-sky-500/20 text-white-300',
    'Next.js': 'bg-gray-600/20 text-gray-400',
    Vite: 'bg-yellow-300/20 text-sky-400', 
    'Tailwind CSS': 'bg-sky-400/20 text-sky-300',

    // Backend
    Python: 'bg-blue-600/20 text-blue-400',
    FastAPI: 'bg-emerald-500/20 text-white-300',
    Django: 'bg-green-800/20 text-teal-700',
    Flask: 'bg-indigo-400/20 text-slate-400',
    Go: 'bg-cyan-500/20 text-white-300',
    Echo: 'bg-indigo-500/20 text-indigo-300',
    Gin: 'bg-blue-900/20 text-blue-700',

    // DevOps & Cloud
    Docker: 'bg-blue-500/20 text-blue-300',
    'GitHub Actions': 'bg-gray-400/20 text-rose-300',
    Git: 'bg-indigo-400/20 text-red-300',
    Terraform: 'bg-violet-600/20 text-white-400',
    AWS: 'bg-gray-600/20 text-amber-300',
    AmazonQCLI: 'bg-gray-500/20 text-violet-300',
    CloudFormation: 'bg-pink-500/20 text-white-300',
    GCP: 'bg-red-600/20 text-red-400',

    // DB & Platform
    MySQL: 'bg-blue-500/20 text-teal-300',
    PostgreSQL: 'bg-slate-500/20 text-violet-500',
    Vercel: 'bg-neutral-600/20 text-neutral-400',
    VirtualBox: 'bg-cyan-700/20 text-cyan-500',

    // Others
    Security: 'bg-rose-600/20 text-rose-500',
    Network: 'bg-teal-700/20 text-teal-500',
    Datadog: 'bg-violet-500/20 text-violet-300',
  };

  return colors[tag] || 'bg-gray-500/20 text-gray-300';
};