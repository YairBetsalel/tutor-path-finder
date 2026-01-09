import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function ParallaxHero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / 30);
    mouseY.set((e.clientY - centerY) / 30);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      className="relative min-h-[90vh] overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-50" />
      
      {/* Parallax Decorative Elements - Subtle glows */}
      <motion.div
        className="absolute -left-40 top-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]"
        style={{ x: useTransform(x, (v) => v * 2), y: useTransform(y, (v) => v * 2) }}
      />
      <motion.div
        className="absolute -right-40 bottom-40 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[150px]"
        style={{ x: useTransform(x, (v) => v * -1.5), y: useTransform(y, (v) => v * -1.5) }}
      />

      {/* Floating Geometric Shapes - Minimal */}
      <motion.div
        className="absolute left-[15%] top-[25%] h-px w-20 bg-divider"
        animate={{ opacity: [0.3, 0.6, 0.3], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ x, y }}
      />
      <motion.div
        className="absolute right-[20%] top-[35%] h-2 w-2 rounded-full border border-primary/30"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ x: useTransform(x, (v) => v * -2), y: useTransform(y, (v) => v * -2) }}
      />
      <motion.div
        className="absolute bottom-[30%] left-[25%] h-px w-32 rotate-45 bg-divider/50"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ x: useTransform(x, (v) => v * 1.5), y: useTransform(y, (v) => v * 1.5) }}
      />

      <div className="container relative mx-auto flex min-h-[90vh] items-center px-4">
        <motion.div
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Eyebrow text */}
          <motion.p
            className="text-caps mb-8 text-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Premium Academic Tutoring
          </motion.p>

          <motion.h1
            className="font-display text-display-lg font-medium tracking-tight text-foreground sm:text-display-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Unlock Your
            <br />
            <span className="text-gradient-primary">Academic Potential</span>
          </motion.h1>

          <motion.p
            className="mt-8 max-w-xl font-body text-lg font-light leading-relaxed text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Expert tutoring for NCEA, Cambridge, IB, and university pathways.
            Personalized guidance from qualified educators who understand your goals.
          </motion.p>

          <motion.div
            className="mt-12 flex flex-col gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                size="lg"
                className="bg-primary font-body text-sm font-normal text-primary-foreground hover:bg-accent"
              >
                <Link to="/our-team">
                  Meet Our Tutors <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border bg-transparent font-body text-sm font-light text-foreground hover:border-primary hover:bg-primary/10"
              >
                <Link to="/highschool/ncea">Explore Curricula</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
