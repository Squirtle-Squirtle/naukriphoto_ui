export interface ExamDocument {
  id: string;
  label: string;
  icon: React.ReactNode;
  specs: string;
  required: boolean;
}

export interface Exam {
  id: string;
  name: string;
  fullName: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  date: string;
  documents: ExamDocument[];
}

export interface UploadedDoc {
  name: string;
  size: string;
  preview?: string;
}

// API response types
export interface UploadImageResponse {
  imageId: string;
  url: string;
}

export interface ResizeImagePayload {
  imageId: string;
  width: number;
  height: number;
  unit: "px" | "cm" | "inch";
  dpi: number;
}

export interface ResizeImageResponse {
  fileName: string;
  downloadUrl: string;
  widthInPx: number;
  heightInPx: number;
}
