import DocSlot from "./DocSlot";
import ExamLogo from "./ExamLogo";

export default function ExamExpanded({ exam }) {
  const requiredCount = exam.documents.filter((d) => d.required).length;
  const optionalCount = exam.documents.filter((d) => !d.required).length;

  return (
    <div
      className="rounded-2xl border-2 overflow-hidden"
      style={{ borderColor: exam.color + "40", backgroundColor: exam.bg }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-6 py-4"
        style={{ borderBottom: `1px solid ${exam.color}20` }}
      >
        <ExamLogo src={exam.logoUrl} name={exam.name} color={exam.color} size={40} />
        <div>
          <h3
            className="font-bold text-foreground"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            {exam.name} — Required Documents
          </h3>
          {/* Full form + date shown here only, never on the card */}
          <p className="text-xs text-muted-foreground">
            {exam.fullName}{exam.date ? ` · ${exam.date}` : ""}
          </p>
        </div>
        <div className="ml-auto">
          <span className="text-xs font-semibold text-muted-foreground">
            {requiredCount} required · {optionalCount} optional
          </span>
        </div>
      </div>

      {/* Document slots */}
      <div className="p-6 bg-white/70">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {exam.documents.map((doc) => (
            <DocSlot key={doc.id} doc={doc} />
          ))}
        </div>

        {/* Tip banner */}
        <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <span>⚡</span>
          <span>
            Use the Image Resizer below to resize your photo and signature to
            the exact pixel dimensions required.
          </span>
        </div>
      </div>
    </div>
  );
}
