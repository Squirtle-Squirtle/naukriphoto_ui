import { useState, useRef, useCallback } from "react";
import { Upload, Download, ImageIcon, X, RefreshCw, ZoomIn, AlertCircle } from "lucide-react";
import { uploadImage, resizeImage } from "../services/imageService";

type Format = "jpeg" | "png" | "webp";

export default function ImageResizer() {
  // File & preview state
  const [originalFile, setOriginalFile]     = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [resizedPreview, setResizedPreview] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl]       = useState<string | null>(null);

  // Controls
  const [width, setWidth]           = useState(350);
  const [height, setHeight]         = useState(450);
  const [lockAspect, setLockAspect] = useState(true);
  const [quality, setQuality]       = useState(85);
  const [format, setFormat]         = useState<Format>("jpeg");
  const [unit, setUnit]             = useState<"px" | "cm" | "inch">("px");
  const [dpi, setDpi]               = useState(96);

  // UI state
  const [dragOver, setDragOver]   = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const [originalDims, setOriginalDims] = useState<{ w: number; h: number } | null>(null);

  const inputRef  = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ── Load file ──────────────────────────────────────────────────────────────

  const loadFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setOriginalFile(file);
    setResizedPreview(null);
    setDownloadUrl(null);
    setError(null);
    const url = URL.createObjectURL(file);
    setOriginalPreview(url);
    const img = new Image();
    img.onload = () => {
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      setOriginalDims({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = url;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }, []);

  // ── Aspect lock ────────────────────────────────────────────────────────────

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect && originalDims)
      setHeight(Math.round((val / originalDims.w) * originalDims.h));
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect && originalDims)
      setWidth(Math.round((val / originalDims.h) * originalDims.w));
  };

  // ── Resize via API ─────────────────────────────────────────────────────────

  const handleResize = async () => {
    if (!originalFile) return;
    setProcessing(true);
    setError(null);

    try {
      // 1. Upload file → get imageId
      const { imageId } = await uploadImage(originalFile);

      // 2. Send resize request → get downloadUrl + final dims
      const result = await resizeImage({ imageId, width, height, unit, dpi });

      setDownloadUrl(result.downloadUrl);

      // Show preview by fetching the resized image URL
      setResizedPreview(result.downloadUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);

      // Fallback: do client-side resize so UI isn't broken while backend is offline
      clientSideFallback();
    } finally {
      setProcessing(false);
    }
  };

  // Client-side fallback (used when backend is unavailable / during development)
  const clientSideFallback = () => {
    if (!originalPreview) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width  = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      const mime = format === "jpeg" ? "image/jpeg" : format === "png" ? "image/png" : "image/webp";
      const dataUrl = canvas.toDataURL(mime, format === "png" ? 1 : quality / 100);
      setResizedPreview(dataUrl);
      setDownloadUrl(dataUrl);
    };
    img.src = originalPreview;
  };

  // ── Download ───────────────────────────────────────────────────────────────

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `naukari-photo.${format}`;
    a.click();
  };

  // ── Reset ──────────────────────────────────────────────────────────────────

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalPreview(null);
    setResizedPreview(null);
    setDownloadUrl(null);
    setOriginalDims(null);
    setError(null);
    setWidth(350);
    setHeight(450);
  };

  const fileSizeKB = originalFile ? (originalFile.size / 1024).toFixed(1) : null;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <section className="bg-card border border-border rounded-2xl overflow-hidden" id="resizer">
      <canvas ref={canvasRef} className="hidden" />

      {/* Section header */}
      <div className="flex items-center gap-3 px-7 py-4 border-b border-border bg-muted/30">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <ZoomIn size={17} className="text-primary" />
        </div>
        <div>
          <h2
            className="text-sm font-bold text-foreground"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Image Resizer
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Resize to exact exam specifications · powered by NaukariPhoto API
          </p>
        </div>
        <div className="ml-auto hidden sm:flex gap-2 text-[11px] font-semibold text-muted-foreground">
          {(["JPEG", "PNG", "WEBP"] as const).map((f) => (
            <span key={f} className="px-2 py-1 bg-muted rounded-lg">{f}</span>
          ))}
        </div>
      </div>

      <div className="p-7">
        {!originalFile ? (
          /* ── Drop zone ── */
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 py-14 cursor-pointer transition-all ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/20 hover:border-primary/40 hover:bg-primary/3"
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Upload size={26} className="text-primary" />
            </div>
            <div className="text-center">
              <p className="font-bold text-foreground text-sm" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                Drop your photo or signature here
              </p>
              <p className="text-xs text-muted-foreground mt-1">JPG · PNG · WEBP · GIF supported</p>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition">
              <Upload size={13} /> Browse files
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])}
            />
          </div>
        ) : (
          /* ── Editor ── */
          <div className="space-y-5">

            {/* Error banner */}
            {error && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">API error — showing client-side preview instead</p>
                  <p className="text-red-500 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Previews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Original</p>
                <div className="rounded-xl overflow-hidden bg-muted/30 border border-border aspect-video flex items-center justify-center">
                  <img src={originalPreview!} alt="Original" className="max-w-full max-h-full object-contain" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {originalDims ? `${originalDims.w} × ${originalDims.h} px` : ""}
                  {fileSizeKB ? ` · ${fileSizeKB} KB` : ""}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Resized Preview</p>
                <div className="rounded-xl overflow-hidden bg-muted/30 border border-border aspect-video flex items-center justify-center">
                  {resizedPreview ? (
                    <img src={resizedPreview} alt="Resized" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <ImageIcon size={28} className="text-muted-foreground mx-auto mb-1.5" />
                      <p className="text-xs text-muted-foreground">Click Resize to preview</p>
                    </div>
                  )}
                </div>
                {resizedPreview && (
                  <p className="text-xs text-muted-foreground">{width} × {height} px · {format.toUpperCase()}</p>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-muted/20 rounded-xl p-5 space-y-4 border border-border">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Width</label>
                  <input
                    type="number" value={width} min={1}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Height</label>
                  <input
                    type="number" value={height} min={1}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Unit</label>
                  <select
                    value={unit} onChange={(e) => setUnit(e.target.value as "px" | "cm" | "inch")}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 transition appearance-none cursor-pointer"
                  >
                    <option value="px">px</option>
                    <option value="cm">cm</option>
                    <option value="inch">inch</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">DPI</label>
                  <input
                    type="number" value={dpi} min={72} max={600} step={1}
                    onChange={(e) => setDpi(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Format</label>
                  <select
                    value={format} onChange={(e) => setFormat(e.target.value as Format)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 transition appearance-none cursor-pointer"
                  >
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                    <option value="webp">WEBP</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Quality — {quality}%
                  </label>
                  <input
                    type="range" min={10} max={100} value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    disabled={format === "png"}
                    className="w-full mt-2 accent-primary cursor-pointer disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Aspect lock */}
              <button
                onClick={() => setLockAspect((v) => !v)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  lockAspect
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-card border-border text-muted-foreground"
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border-2 transition ${lockAspect ? "bg-primary border-primary" : "border-current"}`}>
                  {lockAspect && <span className="w-1.5 h-1.5 rounded-sm bg-white block" />}
                </span>
                Lock aspect ratio
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleResize}
                disabled={processing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition"
              >
                {processing ? <RefreshCw size={15} className="animate-spin" /> : <ZoomIn size={15} />}
                {processing ? "Processing…" : "Resize Image"}
              </button>

              {downloadUrl && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition"
                >
                  <Download size={15} /> Download
                </button>
              )}

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground transition ml-auto"
              >
                <X size={14} /> Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
