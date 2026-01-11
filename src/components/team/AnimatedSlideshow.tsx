import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, memo, useCallback } from 'react';

const slides = [
  {
    title: 'Expert Educators',
    description: 'Learn from professionals with real-world experience',
    gradient: 'from-electric-blue/20 to-vivid-aqua/20',
  },
  {
    title: 'Personalized Learning',
    description: 'Tailored guidance for your unique academic journey',
    gradient: 'from-vivid-aqua/20 to-neon-coral/20',
  },
  {
    title: 'Proven Results',
    description: 'Join thousands of students who achieved their goals',
    gradient: 'from-neon-coral/20 to-electric-blue/20',
  },
] as const;

export const AnimatedSlideshow = memo(() => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm">
      {/* Progress indicators */}
      <div className="absolute left-0 right-0 top-0 flex gap-1 p-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className="h-1 flex-1 overflow-hidden rounded-full bg-muted"
          >
            <motion.div
              className="h-full bg-primary"
              initial={{ width: '0%' }}
              animate={{
                width: index === currentSlide ? '100%' : index < currentSlide ? '100%' : '0%',
              }}
              transition={{
                duration: index === currentSlide ? 4 : 0.3,
                ease: 'linear',
              }}
            />
          </div>
        ))}
      </div>

      {/* Slide content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Background gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} opacity-50`}
          />
          
          <div className="relative z-10">
            <motion.h3
              className="font-display text-2xl font-semibold text-foreground"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              {slides[currentSlide].title}
            </motion.h3>
            <motion.p
              className="mt-3 font-body text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {slides[currentSlide].description}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="mt-6 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-6 bg-primary'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
});
AnimatedSlideshow.displayName = "AnimatedSlideshow";
