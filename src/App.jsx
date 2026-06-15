import { useState, useRef } from "react";
import "./App.css";
import { uploadImage, resizeImage } from "./api";
import Header from './Header';
import Footer from './Footer';

const UNITS = [
  { value: "px", label: "Pixels" },
  { value: "cm", label: "Centimeters" },
  { value: "inch", label: "Inches" },
];

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageId, setImageId] = useState(null);

  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState("px");
  const [dpi, setDpi] = useState(300);

  const [uploading, setUploading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setResult(null);
    setError(null);
    setImageId(null);

    try {
      setUploading(true);
      const data = await uploadImage(selected);
      setImageId(data.imageId);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleConvert = async () => {
    if (!imageId) {
      setError("Please upload an image first.");
      return;
    }
    if (!width || !height) {
      setError("Please enter both width and height.");
      return;
    }

    setError(null);
    setResult(null);
    setConverting(true);

    try {
      const data = await resizeImage({
        imageId,
        width: Number(width),
        height: Number(height),
        unit,
        dpi: unit === "px" ? null : Number(dpi),
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setConverting(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setImageId(null);
    setWidth("");
    setHeight("");
    setUnit("px");
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="app-container">
      {/* 1. Global Navigation Header */}
      <Header />

      {/* 2. Main Resizer Application Content Wrapper */}
      <main className="page">
        <div className="card">
          <h1 className="title">Naukriphoto Resizer</h1>
          <p className="subtitle">Upload a photo, choose a size, and download the resized image.</p>

          <label className={`dropzone ${previewUrl ? "has-image" : ""}`}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Preview" className="preview-img" />
                <div className="file-name">
                  {file?.name} {uploading && "— uploading..."}
                  {imageId && !uploading && " — ready"}
                </div>
              </>
            ) : (
              <div className="dropzone-label">
                <strong>Click to upload</strong> or drag and drop an image
              </div>
            )}
          </label>

          <div className="unit-toggle">
            {UNITS.map((u) => (
              <button
                key={u.value}
                className={`unit-btn ${unit === u.value ? "active" : ""}`}
                onClick={() => setUnit(u.value)}
                type="button"
              >
                {u.label}
              </button>
            ))}
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="width">Width ({unit})</label>
              <input
                id="width"
                type="number"
                min="1"
                placeholder="e.g. 200"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="height">Height ({unit})</label>
              <input
                id="height"
                type="number"
                min="1"
                placeholder="e.g. 200"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>

          {unit !== "px" && (
            <>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="dpi">DPI</label>
                  <input
                    id="dpi"
                    type="number"
                    min="50"
                    step="1"
                    value={dpi}
                    onChange={(e) => setDpi(e.target.value)}
                  />
                </div>
              </div>
              <p className="dpi-hint">DPI is used to convert {unit} to pixels (default 300).</p>
            </>
          )}

          <button
            className="convert-btn"
            onClick={handleConvert}
            disabled={!imageId || uploading || converting}
          >
            {converting && <span className="spinner" />}
            {converting ? "Converting..." : "Convert"}
          </button>

          {error && <div className="error-box">{error}</div>}

          {result && (
            <div className="result-box">
              <p className="result-title">Converted image</p>
              <img src={result.downloadUrl} alt="Converted" className="preview-img" />
              <p className="result-dims">
                {Math.round(result.widthInPx)} x {Math.round(result.heightInPx)} px
              </p>
              <a
                className="download-btn"
                href={result.downloadUrl}
                download={result.fileName}
              >
                Download
              </a>
            </div>
          )}

          {(file || result) && (
            <p style={{ textAlign: "center", marginTop: 16 }}>
              <button
                type="button"
                onClick={reset}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6b7280",
                  fontSize: 13,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Start over
              </button>
            </p>
          )}
        </div>
      </main>

      {/* 3. Global Dynamic Footer */}
      <Footer />
    </div>
  );
}

export default App;
