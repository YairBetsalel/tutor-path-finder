import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, memo } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "The tutoring I received completely transformed my understanding of calculus. I went from struggling to scoring Excellence!",
    name: "Sarah Chen",
    role: "NCEA Level 3 Student",
    gradient: 'from-electric-blue/20 via-vivid-aqua/10 to-transparent',
  },
  {
    quote: "My tutor helped me develop critical thinking skills that were invaluable for my IB exams. Highly recommend!",
    name: "James Wilson",
    role: "IB Diploma Graduate",
    gradient: 'from-vivid-aqua/20 via-neon-coral/10 to-transparent',
  },
  {
    quote: "The personalized approach made all the difference. I felt truly understood and supported throughout my learning journey.",
    name: "Emily Rodriguez",
    role: "Cambridge A-Level Student",
    gradient: 'from-neon-coral/20 via-electric-blue/10 to-transparent',
  },
  {
    quote: "Thanks to the structured preparation, I secured my place in medical school. Forever grateful!",
    name: "Michael Patel",
    role: "Medical Student",
    gradient: 'from-electric-blue/20 via-neon-coral/10 to-transparent',
  },
] as const;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
};

export const TestimonialsCarousel = memo(() => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
      
      <div className="container relative mx-auto px-4">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Student Success Stories
          </h2>
          <p className="mt-4 font-body text-muted-foreground">
            Hear from students who achieved their academic goals
          </p>
        </motion.div>

        <div className="relative mx-auto mt-16 max-w-4xl">
          {/* Quote icon */}
          <motion.div
            className="absolute -left-4 -top-4 text-primary/20"
            animate={{ rotate: [0, 5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <Quote className="h-16 w-16" />
          </motion.div>

          {/* Carousel container */}
          <div className="relative min-h-[280px] overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="absolute inset-0 p-8 md:p-12"
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonials[current].gradient}`} />
                
                <div className="relative flex h-full flex-col justify-between">
                  <p className="font-body text-lg leading-relaxed text-foreground md:text-xl">
                    "{testimonials[current].quote}"
                  </p>
                  
                  <div className="mt-8 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 font-display text-lg font-semibold text-primary">
                      {testimonials[current].name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-display font-semibold text-foreground">
                        {testimonials[current].name}
                      </p>
                      <p className="font-body text-sm text-muted-foreground">
                        {testimonials[current].role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <motion.button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setDirection(index > current ? 1 : -1);
                    setCurrent(index);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === current ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>

            <motion.button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
});
TestimonialsCarousel.displayName = "TestimonialsCarousel";
