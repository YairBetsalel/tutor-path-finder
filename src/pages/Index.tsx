import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { ArrowRight, BookOpen, Users, Trophy, GraduationCap } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="animate-fade-in font-display text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              Unlock Your Academic Potential
            </h1>
            <p className="mt-6 animate-slide-up font-body text-lg text-primary-foreground/90 [animation-delay:200ms] sm:text-xl">
              Expert tutoring for NCEA, Cambridge, IB, and university pathways. 
              Personalized guidance from qualified educators who understand your goals.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 [animation-delay:400ms] sm:flex-row animate-slide-up">
              <Button
                asChild
                size="lg"
                className="bg-secondary font-body text-secondary-foreground hover:bg-secondary/90"
              >
                <Link to="/our-team">
                  Meet Our Tutors <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary-foreground/30 bg-transparent font-body text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/highschool/ncea">Explore Curricula</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Why Choose EduPro?
            </h2>
            <p className="mt-4 font-body text-lg text-muted-foreground">
              We combine academic excellence with personalized attention to help every student succeed.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group border-0 bg-gradient-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-medium">
              <CardContent className="pt-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <BookOpen className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                  Expert Curriculum Knowledge
                </h3>
                <p className="mt-2 font-body text-sm text-muted-foreground">
                  Tutors specialized in NCEA, Cambridge, and IB with deep assessment understanding.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 bg-gradient-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-medium">
              <CardContent className="pt-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 transition-colors group-hover:bg-secondary/20">
                  <Users className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                  Personalized Learning
                </h3>
                <p className="mt-2 font-body text-sm text-muted-foreground">
                  Tailored lesson plans that adapt to each student's unique learning style and pace.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 bg-gradient-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-medium">
              <CardContent className="pt-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-accent/20 transition-colors group-hover:bg-accent/30">
                  <Trophy className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                  Proven Results
                </h3>
                <p className="mt-2 font-body text-sm text-muted-foreground">
                  Track record of helping students achieve top grades and university placements.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 bg-gradient-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-medium">
              <CardContent className="pt-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <GraduationCap className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                  University Pathways
                </h3>
                <p className="mt-2 font-body text-sm text-muted-foreground">
                  Specialized preparation for Medical, Law, and Computer Science admissions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Ready to Excel?
            </h2>
            <p className="mt-4 font-body text-lg text-muted-foreground">
              Join hundreds of students who have transformed their academic journey with EduPro.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 font-body"
            >
              <Link to="/our-team">
                Find Your Tutor <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
