import { Link } from "react-router-dom";
import { Mountain, Mail, Phone, MapPin } from "lucide-react";
import { PROGRAMS } from "@/data/programs";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Mentor", href: "/mentor" },
  { name: "Resources", href: "/resources" },
  { name: "Contact Us", href: "/contact" },
];

// Program names come from the shared source of truth in src/data/programs.ts.
const programLinks = PROGRAMS.map((p) => ({
  name: p.title,
  href: `/programs#${p.id}`,
}));

export function Footer() {
  return (
    <footer className="relative mt-20">
      {/* Geological layers decoration */}
      <div className="absolute inset-0 geo-layers opacity-50" />
      
      <div className="relative glass-card rounded-t-[40px] border-b-0">
        <div className="container mx-auto px-4 lg:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="/logo.jpg" 
                  alt="G-Dnyasa Logo" 
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <span className="text-xl font-bold text-foreground font-serif">
                  G-Dnyasa
                </span>
              </Link>
              <p className="text-muted-foreground text-sm">
                Personalized mentorship for competitive geology exams. 
                Guiding aspirants towards success in CSIR-NET, GATE, and IIT JAM.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Programs</h4>
              <ul className="space-y-2">
                {programLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>gdnyasa@gmail.com</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+91 Confidential</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4 text-primary mt-0.5" />
                  <span>India</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="mt-10 pt-8 border-t border-border/50">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <span className="text-sm text-muted-foreground">Coming Soon:</span>
              <Link to="/tours" className="badge-quartz text-xs">Geology Educational Tours</Link>
              <Link to="/store" className="badge-garnet text-xs">Study Material Store</Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 pt-6 border-t border-border/50 text-center space-y-2">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} G-Dnyasa | Geology Mentorship Platform
            </p>
            <p>
              <Link to="/admin/login" className="text-xs text-muted-foreground/70 hover:text-primary transition-colors">
                Admin sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
