import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function LawPage() {
  const features = [
    'LSAT preparation and strategy coaching',
    'Legal reasoning and critical thinking development',
    'Law school application and personal statement guidance',
    'Moot court and oral advocacy training',
    'Contract, tort, and constitutional law tutoring',
  ];

  return (
    <Layout>
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-secondary/20 px-4 py-1.5 font-body text-sm font-medium text-secondary">
              University Pathway
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold text-foreground sm:text-5xl">
              Law Pathway
            </h1>
            <p className="mt-6 font-body text-lg text-muted-foreground">
              A career in law demands exceptional analytical and communication skills. Our law tutors are experienced legal professionals and academics who guide students through entrance requirements, academic studies, and practical skills development.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl">
            <div className="rounded-2xl bg-card p-8 shadow-medium">
              <h2 className="font-display text-xl font-semibold text-foreground">What We Offer</h2>
              <ul className="mt-6 space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span className="font-body text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-secondary font-body hover:bg-secondary/90">
              <Link to="/our-team">
                View Law Tutors <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
