import { useState } from "react";
import { ArrowRight, Camera } from "lucide-react";
import Navbar from "../components/Navbar";
import HeroStrip from "../components/HeroStrip";
import ExamRow from "../components/ExamRow";
import ExamExpanded from "../components/ExamExpanded";
import ImageResizer from "../components/ImageResizer";
import { EXAMS } from "../data/exams";

export default function App() {
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const selectedExam = EXAMS.find((e) => e.id === selectedExamId) ?? null;

  const handleExamSelect = (id: string | null) => {
    setSelectedExamId(id);
    if (id) {
      // Smooth scroll to the expanded section after state update
      setTimeout(() => {
        document.getElementById("exam-expanded")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 80);
    }
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Hero strip ── */}
      {/* <HeroStrip /> */}

      {/* ── Main content ── */}
      <main className="max-w-6xl mx-auto px-5 py-7 space-y-5">

        {/* Recent exams label */}
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-base font-bold text-foreground"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Recent Exams
            </h2>
            <p className="text-xs text-muted-foreground">
              Select an exam to view required documents
            </p>
          </div>
          <button className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            All exams <ArrowRight size={12} />
          </button>
        </div>

        {/* ── Exam cards row ── */}
        <ExamRow selectedId={selectedExamId} onSelect={handleExamSelect} />

        {/* ── Inline expanded exam docs ── */}
        {selectedExam && (
          <div id="exam-expanded">
            <ExamExpanded exam={selectedExam} />
          </div>
        )}

        {/* ── Image resizer ── */}
        <ImageResizer />

      </main>

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
