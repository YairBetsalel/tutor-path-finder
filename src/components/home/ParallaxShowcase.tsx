import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, memo } from 'react';
import { Sparkles, Target, Rocket, Brain, LucideIcon } from 'lucide-react';

const showcaseItems = [
  {
    icon: Brain,
    title: 'Adaptive Learning',
    description: 'AI-powered lesson plans that evolve with your progress',
    bgClass: 'bg-electric-blue/10',
    textClass: 'text-electric-blue',
    gradientClass: 'from-electric-blue/10',
  },
  {
    icon: Target,
    title: 'Goal-Oriented',
    description: 'Clear milestones and progress tracking for every student',
    bgClass: 'bg-vivid-aqua/10',
    textClass: 'text-vivid-aqua',
    gradientClass: 'from-vivid-aqua/10',
  },
  {
    icon: Rocket,
    title: 'Fast Results',
    description: 'See improvement within weeks, not months',
    bgClass: 'bg-neon-coral/10',
    textClass: 'text-neon-coral',
    gradientClass: 'from-neon-coral/10',
  },
  {
    icon: Sparkles,
    title: 'Premium Quality',
    description: 'Only the top 5% of tutors make it through our screening',
    bgClass: 'bg-electric-blue/10',
    textClass: 'text-electric-blue',
    gradientClass: 'from-electric-blue/10',
  },
] as const;

interface ShowcaseCardProps {
  item: {
    icon: LucideIcon;
    title: string;
    description: string;
    bgClass: string;
    textClass: string;
    gradientClass: string;
  };
  index: number;
}

const ShowcaseCard = memo(({ item, index }: ShowcaseCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay: index * 0.15 }}
    whileHover={{ y: -10 }}
    className="group relative will-change-transform"
  >
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
      {/* Hover gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${item.gradientClass} to-transparent opacity-0 transition-opacity group-hover:opacity-100`}
      />

      {/* Floating icon */}
      <motion.div
        className={`relative mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl ${item.bgClass}`}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
      >
        <item.icon className={`h-7 w-7 ${item.textClass}`} />
      </motion.div>

      <h3 className="font-display text-lg font-semibold text-foreground">
        {item.title}
      </h3>
      <p className="mt-2 font-body text-sm text-muted-foreground">
        {item.description}
      </p>

      {/* Decorative corner */}
      <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-tl-3xl border-l border-t border-primary/20 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  </motion.div>
));
ShowcaseCard.displayName = "ShowcaseCard";

export const ParallaxShowcase = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <section ref={containerRef} className="relative overflow-hidden py-20 lg:py-32">
      {/* Animated background elements - GPU accelerated */}
      <motion.div
        style={{ y: y1, rotate }}
        className="pointer-events-none absolute -right-20 top-20 h-64 w-64 rounded-full border border-electric-blue/20 will-change-transform"
      />
      <motion.div
        style={{ y: y2, scale }}
        className="pointer-events-none absolute -left-10 bottom-20 h-48 w-48 rounded-full bg-vivid-aqua/5 blur-2xl will-change-transform"
      />
      <motion.div
        style={{ y: y1 }}
        className="pointer-events-none absolute right-1/4 top-1/3 h-px w-32 rotate-45 bg-gradient-to-r from-transparent via-neon-coral/30 to-transparent will-change-transform"
      />

      <div className="container relative mx-auto px-4">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            The TUTORLY Difference
          </h2>
          <p className="mt-4 font-body text-lg text-muted-foreground">
            What sets us apart from traditional tutoring
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {showcaseItems.map((item, index) => (
            <ShowcaseCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
});
ParallaxShowcase.displayName = "ParallaxShowcase";
