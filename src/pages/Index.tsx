import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { ParallaxHero } from '@/components/hero/ParallaxHero';
import { FloatingStats } from '@/components/home/FloatingStats';
import { TestimonialsCarousel } from '@/components/home/TestimonialsCarousel';
import { ParallaxShowcase } from '@/components/home/ParallaxShowcase';
import { ArrowRight, BookOpen, Users, Trophy, GraduationCap } from 'lucide-react';

const featureCards = [
  {
    icon: BookOpen,
    title: 'Expert Curriculum Knowledge',
    description: 'Tutors specialized in NCEA, Cambridge, and IB with deep assessment understanding.',
    colorClass: 'bg-primary/10 group-hover:bg-primary/20',
    iconColor: 'text-primary',
  },
  {
    icon: Users,
    title: 'Personalized Learning',
    description: 'Tailored lesson plans that adapt to each student\'s unique learning style and pace.',
    colorClass: 'bg-secondary/10 group-hover:bg-secondary/20',
    iconColor: 'text-secondary',
  },
  {
    icon: Trophy,
    title: 'Proven Results',
    description: 'Track record of helping students achieve top grades and university placements.',
    colorClass: 'bg-accent/20 group-hover:bg-accent/30',
    iconColor: 'text-accent-foreground',
  },
  {
    icon: GraduationCap,
    title: 'University Pathways',
    description: 'Specialized preparation for Medical, Law, and Computer Science admissions.',
    colorClass: 'bg-primary/10 group-hover:bg-primary/20',
    iconColor: 'text-primary',
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Parallax Hero Section */}
      <ParallaxHero />

      {/* Floating Stats Ribbon */}
      <FloatingStats />

      {/* Features Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Why Choose SparkedEducation?
            </h2>
            <p className="mt-4 font-body text-lg text-muted-foreground">
              We combine academic excellence with personalized attention to help every student succeed.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="group h-full border-0 bg-gradient-card shadow-soft transition-all duration-300 hover:shadow-medium">
                    <CardContent className="pt-8 text-center">
                      <motion.div
                        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-xl transition-colors ${feature.colorClass}`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
                      </motion.div>
                      <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="mt-2 font-body text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax Showcase */}
      <ParallaxShowcase />

      {/* Testimonials Carousel */}
      <TestimonialsCarousel />

      {/* CTA Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Ready to Excel?
            </h2>
            <p className="mt-4 font-body text-lg text-muted-foreground">
              Join hundreds of students who have transformed their academic journey with SparkedEducation.
            </p>
            <motion.div
              className="mt-8"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button asChild size="lg" className="font-body">
                <Link to="/our-team">
                  Find Your Tutor <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
