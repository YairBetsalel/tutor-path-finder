import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero">
                <span className="font-display text-lg font-bold text-primary-foreground">S</span>
              </div>
              <span className="font-display text-xl font-bold text-foreground">SparkedEducation</span>
            </Link>
            <p className="font-body text-sm text-muted-foreground">
              Empowering students to achieve academic excellence through personalized tutoring and mentorship.
            </p>
          </div>

          {/* Highschool */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold text-foreground">Highschool</h4>
            <ul className="space-y-2 font-body text-sm text-muted-foreground">
              <li><Link to="/highschool/ncea" className="transition-colors hover:text-primary">NCEA</Link></li>
              <li><Link to="/highschool/cambridge" className="transition-colors hover:text-primary">Cambridge</Link></li>
              <li><Link to="/highschool/ib" className="transition-colors hover:text-primary">IB</Link></li>
            </ul>
          </div>

          {/* University */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold text-foreground">University</h4>
            <ul className="space-y-2 font-body text-sm text-muted-foreground">
              <li><Link to="/university/medical" className="transition-colors hover:text-primary">Medical</Link></li>
              <li><Link to="/university/computer-science" className="transition-colors hover:text-primary">Computer Science</Link></li>
              <li><Link to="/university/law" className="transition-colors hover:text-primary">Law</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold text-foreground">Company</h4>
            <ul className="space-y-2 font-body text-sm text-muted-foreground">
              <li><Link to="/our-team" className="transition-colors hover:text-primary">Our Team</Link></li>
              <li><span className="cursor-default">Contact Us</span></li>
              <li><span className="cursor-default">Privacy Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-center font-body text-sm text-muted-foreground">
            © {new Date().getFullYear()} SparkedEducation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
