import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, memo, useMemo } from 'react';

const stats = [
  { value: '500+', label: 'Students Tutored', color: 'text-electric-blue' },
  { value: '98%', label: 'Pass Rate', color: 'text-vivid-aqua' },
  { value: '50+', label: 'Expert Tutors', color: 'text-neon-coral' },
  { value: '4.9★', label: 'Average Rating', color: 'text-electric-blue' },
] as const;

const StatCard = memo(({ stat, index }: { stat: typeof stats[number]; index: number }) => (
  <motion.div
    className="flex flex-shrink-0 items-center gap-4 rounded-2xl border border-border/50 bg-card/50 px-8 py-6 backdrop-blur-sm will-change-transform"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay: (index % 4) * 0.1 }}
    whileHover={{ scale: 1.05 }}
  >
    <span className={`font-display text-4xl font-bold ${stat.color}`}>
      {stat.value}
    </span>
    <span className="font-body text-sm text-muted-foreground">
      {stat.label}
    </span>
  </motion.div>
));
StatCard.displayName = "StatCard";

export const FloatingStats = memo(() => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  
  // Memoize repeated stats array
  const repeatedStats = useMemo(() => [...stats, ...stats, ...stats], []);

  return (
    <div ref={ref} className="relative overflow-hidden py-16">
      <motion.div
        style={{ x }}
        className="flex gap-8 whitespace-nowrap will-change-transform"
      >
        {repeatedStats.map((stat, index) => (
          <StatCard key={index} stat={stat} index={index} />
        ))}
      </motion.div>
    </div>
  );
});
