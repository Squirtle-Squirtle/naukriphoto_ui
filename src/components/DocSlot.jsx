import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, X, Camera, PenLine, CreditCard } from "lucide-react";
import { formatFileSpec } from "../services/catalogService";

// Maps a document's declared `type` (from XML) to its icon — the only
// place this mapping lives, so new document types just need one new entry.
const ICON_BY_KIND = {
  photo: <Camera size={15} />,
  signature: <PenLine size={15} />,
  id: <CreditCard size={15} />,
  document: <FileText size={15} />,
};

export default function DocSlot({ doc }) {
  const [uploaded, setUploaded] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    setUploaded({
      name: file.name,
      size:
        file.size < 1024 * 1024
          ? `${(file.size / 1024).toFixed(1)} KB`
          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    });
  };

  return (
    <div className="space-y-1.5">
      {/* Label row */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-muted-foreground">{ICON_BY_KIND[doc.type]}</span>
        <span className="text-sm font-semibold text-foreground">{doc.label}</span>
        {doc.required ? (
          <span className="text-[9px] font-bold uppercase tracking-wider text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">
            Required
          </span>
        ) : (
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded">
            Optional
          </span>
        )}
      </div>

      {/* Specs — entirely derived from the XML-declared dimensions/format/size */}
      <p className="text-[11px] text-muted-foreground leading-relaxed">{formatFileSpec(doc)}</p>

      {/* Upload area */}
      {uploaded ? (
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200">
          {uploaded.preview ? (
            <img
              src={uploaded.preview}
              alt=""
              className="w-9 h-9 rounded object-cover border border-emerald-200 shrink-0"
            />
          ) : (
            <FileText size={16} className="text-emerald-600 shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-emerald-800 truncate">{uploaded.name}</p>
            <p className="text-[11px] text-emerald-600">{uploaded.size}</p>
          </div>
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <button
            onClick={() => setUploaded(null)}
            className="text-emerald-400 hover:text-red-400 transition"
            aria-label="Remove file"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed cursor-pointer transition ${
            dragOver
              ? "border-primary bg-primary/5 text-primary"
              : "border-border bg-muted/20 text-muted-foreground hover:border-primary/40 hover:bg-primary/3"
          }`}
        >
          <Upload size={13} />
          <span className="text-xs">Click or drag to upload</span>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      )}
    </div>
  );
}
