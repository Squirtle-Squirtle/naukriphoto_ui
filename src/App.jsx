import { useState } from "react";
import { ArrowRight, Camera, Loader2, AlertTriangle } from "lucide-react";
import Navbar from "./components/Navbar";
import HeroStrip from "./components/HeroStrip";
import ExamRow from "./components/ExamRow";
import ExamExpanded from "./components/ExamExpanded";
import ImageResizer from "./components/ImageResizer";
import ExamSidebar from "./components/ExamSidebar";
import { useCatalog } from "./hooks/useCatalog";

export default function App() {
  const { exams, services, loading, error } = useCatalog();

  const [selectedExamId, setSelectedExamId] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const selectedExam = exams.find((e) => e.id === selectedExamId) ?? null;
  const selectedService = services.find((s) => s.id === selectedServiceId) ?? null;

  // Only show first 30 exams in Recent Exams section
  const recentExams = exams.slice(0, 30);

  const scrollToExpanded = (elId) => {
    setTimeout(() => {
      document.getElementById(elId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  const handleExamSelect = (id) => {
    setSelectedExamId(id);
    if (id) scrollToExpanded("exam-expanded");
  };

  const handleServiceSelect = (id) => {
    setSelectedServiceId(id);
    if (id) scrollToExpanded("service-expanded");
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Main layout with sidebar ── */}
      <div className="flex">
        
        {/* ── Main content ── */}
        <main className="flex-1 max-w-6xl mx-auto px-5 py-7 space-y-8">

          {/* Catalog loading / error states */}
          {loading && (
            <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground text-sm">
              <Loader2 size={16} className="animate-spin" />
              Loading exam catalog…
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Couldn't load exams.xml</p>
                <p className="text-red-500 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* ── Recent Exams section (scrollable — first 30 only) ── */}
              <section className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      className="text-base font-bold text-foreground"
                      style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                    >
                      Recent Exams
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Scroll the strip to browse recent entries · select one to view required documents
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground shrink-0">
                    Browse
                  </span>
                </div>

                <ExamRow items={recentExams} selectedId={selectedExamId} onSelect={handleExamSelect} />

                {selectedExam && (
                  <div id="exam-expanded">
                    <ExamExpanded exam={selectedExam} />
                  </div>
                )}
              </section>

              {/* ── General Services section (also scrollable) ── */}
              <section className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      className="text-base font-bold text-foreground"
                      style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                    >
                      General Services
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Everyday photo & document needs, outside of exams
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground shrink-0">
                    {services.length} service{services.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <ExamRow items={services} selectedId={selectedServiceId} onSelect={handleServiceSelect} />

                {selectedService && (
                  <div id="service-expanded">
                    <ExamExpanded exam={selectedService} />
                  </div>
                )}
              </section>
            </>
          )}

          {/* ── Image resizer ── */}
          <ImageResizer />

        </main>

        {/* ── Right Sidebar with all exams ── */}
        {!loading && !error && (
          <ExamSidebar 
            items={exams} 
            selectedId={selectedExamId} 
            onSelect={handleExamSelect}
          />
        )}

      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-card mt-10">
        <div className="max-w-6xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <Camera size={12} className="text-white" />
            </div>
            <span
              className="text-sm font-bold text-foreground"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Naukari<span className="text-primary">Photo</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Image processing powered by NaukariPhoto API · No raw files stored permanently
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <button className="hover:text-foreground transition">Privacy</button>
            <button className="hover:text-foreground transition">Terms</button>
            <button className="hover:text-foreground transition">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
