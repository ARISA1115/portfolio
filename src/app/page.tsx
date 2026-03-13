import TypewriterHero from '@/components/home/TypewriterHero';
import SkillSection from '@/components/home/SkillSection';

export default function Home() {
  return (
    <div className="min-h-screen pt-16 relative">
      <TypewriterHero />
      <SkillSection />
    </div>
  );
}
