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
    mouseX.set((e.clientX - centerX) / 25);
    mouseY.set((e.clientY - centerY) / 25);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      className="relative overflow-hidden bg-gradient-hero py-24 lg:py-32"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ken Burns Background Effect */}
      <motion.div
        className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-10"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 10, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      />

      {/* Parallax Decorative Elements */}
      <motion.div
        className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl"
        style={{ x: useTransform(x, (v) => v * 2), y: useTransform(y, (v) => v * 2) }}
      />
      <motion.div
        className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-accent/15 blur-3xl"
        style={{ x: useTransform(x, (v) => v * -1.5), y: useTransform(y, (v) => v * -1.5) }}
      />
      <motion.div
        className="absolute left-1/4 top-1/3 h-40 w-40 rounded-full bg-primary-foreground/5 blur-2xl"
        style={{ x: useTransform(x, (v) => v * 3), y: useTransform(y, (v) => v * 3) }}
      />

      {/* Floating Geometric Shapes */}
      <motion.div
        className="absolute left-[10%] top-[20%] h-4 w-4 rotate-45 border-2 border-primary-foreground/20"
        animate={{ rotate: [45, 90, 45], y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ x, y }}
      />
      <motion.div
        className="absolute right-[15%] top-[30%] h-6 w-6 rounded-full border-2 border-secondary/30"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ x: useTransform(x, (v) => v * -2), y: useTransform(y, (v) => v * -2) }}
      />
      <motion.div
        className="absolute bottom-[25%] left-[20%] h-3 w-3 bg-accent/40"
        animate={{ rotate: [0, 180, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ x: useTransform(x, (v) => v * 1.5), y: useTransform(y, (v) => v * 1.5) }}
      />

      <div className="container relative mx-auto px-4">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="font-display text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Unlock Your Academic Potential
          </motion.h1>
          <motion.p
            className="mt-6 font-body text-lg text-primary-foreground/90 sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Expert tutoring for NCEA, Cambridge, IB, and university pathways.
            Personalized guidance from qualified educators who understand your goals.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                size="lg"
                className="bg-secondary font-body text-secondary-foreground hover:bg-secondary/90"
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
                className="border-primary-foreground/30 bg-transparent font-body text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/highschool/ncea">Explore Curricula</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
