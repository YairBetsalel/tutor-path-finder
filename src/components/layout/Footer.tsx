import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <span className="font-display text-xl font-medium tracking-tight text-foreground">Tutorly</span>
            </Link>
            <p className="font-body text-sm font-light leading-relaxed text-muted-foreground">
              Empowering students to achieve academic excellence through personalized tutoring and mentorship.
            </p>
          </div>

          {/* Highschool */}
          <div className="space-y-6">
            <h4 className="text-caps text-muted-foreground">Highschool</h4>
            <ul className="space-y-3 font-body text-sm font-light">
              <li><Link to="/highschool/ncea" className="text-foreground transition-colors hover:text-primary">NCEA</Link></li>
              <li><Link to="/highschool/cambridge" className="text-foreground transition-colors hover:text-primary">Cambridge</Link></li>
              <li><Link to="/highschool/ib" className="text-foreground transition-colors hover:text-primary">IB</Link></li>
            </ul>
          </div>

          {/* University */}
          <div className="space-y-6">
            <h4 className="text-caps text-muted-foreground">University</h4>
            <ul className="space-y-3 font-body text-sm font-light">
              <li><Link to="/university/medical" className="text-foreground transition-colors hover:text-primary">Medical</Link></li>
              <li><Link to="/university/computer-science" className="text-foreground transition-colors hover:text-primary">Computer Science</Link></li>
              <li><Link to="/university/law" className="text-foreground transition-colors hover:text-primary">Law</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h4 className="text-caps text-muted-foreground">Company</h4>
            <ul className="space-y-3 font-body text-sm font-light">
              <li><Link to="/our-team" className="text-foreground transition-colors hover:text-primary">Our Team</Link></li>
              <li><span className="cursor-default text-muted-foreground">Contact Us</span></li>
              <li><span className="cursor-default text-muted-foreground">Privacy Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <p className="text-center font-body text-sm font-light text-muted-foreground">
            © {new Date().getFullYear()} Tutorly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
