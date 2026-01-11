import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, memo } from 'react';

export const ParallaxBackground = memo(() => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '70%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 0.3, 0.1]);

  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30" />

      {/* Parallax geometric shapes */}
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-electric-blue/10 blur-3xl"
      />
      <motion.div
        style={{ y: y2, opacity }}
        className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-vivid-aqua/10 blur-3xl"
      />
      <motion.div
        style={{ y: y3, opacity }}
        className="absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-neon-coral/10 blur-3xl"
      />

      {/* Floating grid pattern */}
      <motion.div
        style={{ y: y2 }}
        className="absolute inset-0 opacity-[0.02]"
      >
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>

      {/* Animated diagonal lines */}
      <motion.div
        style={{ y: y1 }}
        className="absolute right-10 top-1/4 h-px w-64 rotate-45 bg-gradient-to-r from-transparent via-electric-blue/20 to-transparent"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute left-20 top-2/3 h-px w-48 -rotate-45 bg-gradient-to-r from-transparent via-neon-coral/20 to-transparent"
      />
    </div>
  );
});
ParallaxBackground.displayName = "ParallaxBackground";
