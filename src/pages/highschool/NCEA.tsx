import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function NCEAPage() {
  const features = [
    'Expert understanding of NCEA standards and achievement criteria',
    'Internal and external assessment preparation',
    'Merit and Excellence endorsement strategies',
    'Subject-specific tutoring across all levels',
    'Scholarship exam preparation',
  ];

  return (
    <Layout>
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 font-body text-sm font-medium text-primary">
              Highschool Curriculum
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold text-foreground sm:text-5xl">
              NCEA Tutoring
            </h1>
            <p className="mt-6 font-body text-lg text-muted-foreground">
              The National Certificate of Educational Achievement (NCEA) is New Zealand's main secondary school qualification. Our tutors have deep expertise in NCEA assessment requirements and help students achieve their best possible results at all levels.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl">
            <div className="rounded-2xl bg-card p-8 shadow-medium">
              <h2 className="font-display text-xl font-semibold text-foreground">What We Offer</h2>
              <ul className="mt-6 space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="font-body text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" className="font-body">
              <Link to="/our-team">
                View NCEA Tutors <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
