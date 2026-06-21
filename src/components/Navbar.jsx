import { useState } from "react";
import { Camera, History, Phone, Heart, HelpCircle, Menu, X, ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Past Exams", icon: <History size={15} /> },
  { label: "Contact Us", icon: <Phone size={15} /> },
  { label: "Support Us", icon: <Heart size={15} /> },
  { label: "Help",       icon: <HelpCircle size={15} /> },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Camera size={16} className="text-white" />
          </div>
          <span
            className="font-extrabold text-foreground text-lg tracking-tight"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Naukari<span className="text-primary">Photo</span>
          </span>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition"
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <button className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition">
          Get Started <ArrowRight size={14} />
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg hover:bg-muted transition"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 text-left transition"
            >
              {link.icon} {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
