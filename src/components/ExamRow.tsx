import { ChevronDown } from "lucide-react";
import { RECENT_EXAMS } from "../data/exams";
import type { Exam } from "../types";

interface ExamCardProps {
  exam: Exam;
  active: boolean;
  onSelect: () => void;
}

function ExamCard({ exam, active, onSelect }: ExamCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`relative group flex flex-col items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
        active
          ? "border-[var(--exam-color)] shadow-lg scale-[1.02]"
          : "border-border bg-card hover:border-[var(--exam-color)] hover:shadow-md hover:scale-[1.01]"
      }`}
      style={
        {
          "--exam-color": exam.color,
          backgroundColor: active ? exam.bg : undefined,
        } as React.CSSProperties
      }
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
        style={{ backgroundColor: exam.color }}
      >
        {exam.icon}
      </div>

      {/* Text */}
      <div className="w-full min-w-0">
        <p
          className="font-bold text-foreground text-sm leading-tight"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          {exam.name}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight truncate">
          {exam.fullName}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ backgroundColor: exam.color + "20", color: exam.color }}
          >
            {exam.category}
          </span>
          <span className="text-[10px] text-muted-foreground">{exam.date}</span>
        </div>
      </div>

      {/* Chevron */}
      <div
        className={`absolute bottom-3 right-3 transition-transform duration-200 ${
          active ? "rotate-180" : ""
        }`}
      >
        <ChevronDown
          size={14}
          style={{ color: active ? exam.color : undefined }}
          className="text-muted-foreground"
        />
      </div>
    </button>
  );
}

interface ExamRowProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function ExamRow({ selectedId, onSelect }: ExamRowProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {RECENT_EXAMS.map((exam) => (
        <ExamCard
          key={exam.id}
          exam={exam}
          active={selectedId === exam.id}
          onSelect={() => onSelect(selectedId === exam.id ? null : exam.id)}
        />
      ))}
    </div>
  );
}
