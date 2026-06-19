import { GraduationCap, BookOpen, Award } from "lucide-react";
import { Camera, PenLine, CreditCard, FileText } from "lucide-react";
import type { Exam } from "../types";

export const EXAMS: Exam[] = [
  {
    id: "jee",
    name: "JEE Main",
    fullName: "Joint Entrance Examination",
    category: "Engineering",
    icon: <GraduationCap size={24} />,
    color: "#3b3bf5",
    bg: "#eeeeff",
    date: "Jan – Apr 2025",
    documents: [
      { id: "photo",     label: "Passport Photo",    icon: <Camera size={15} />,   specs: "JPG/PNG · 10–200 KB · 3.5×4.5 cm · white background", required: true  },
      { id: "signature", label: "Signature",          icon: <PenLine size={15} />,  specs: "JPG/PNG · 4–30 KB · 3.5×1.5 cm · white background",   required: true  },
      { id: "id",        label: "Photo ID Proof",     icon: <CreditCard size={15} />, specs: "Aadhaar / PAN / Passport · PDF or JPG · max 1 MB",   required: true  },
      { id: "marks",     label: "Class 10 Marksheet", icon: <FileText size={15} />, specs: "PDF · max 2 MB · original or scanned copy",             required: true  },
    ],
  },
  {
    id: "neet",
    name: "NEET UG",
    fullName: "National Eligibility cum Entrance Test",
    category: "Medical",
    icon: <BookOpen size={24} />,
    color: "#0ea5e9",
    bg: "#e0f5ff",
    date: "May 2025",
    documents: [
      { id: "photo",      label: "Passport Photo",       icon: <Camera size={15} />,     specs: "JPG · 10–200 KB · 3.5×4.5 cm · light background", required: true  },
      { id: "signature",  label: "Signature",             icon: <PenLine size={15} />,    specs: "JPG · 4–30 KB · 3.5×1.5 cm · white background",   required: true  },
      { id: "id",         label: "Government ID",         icon: <CreditCard size={15} />, specs: "Aadhaar / Passport · JPG or PDF · max 500 KB",     required: true  },
      { id: "category",   label: "Category Certificate",  icon: <FileText size={15} />,   specs: "SC/ST/OBC/EWS · PDF · max 1 MB",                  required: false },
      { id: "disability", label: "PwD Certificate",       icon: <FileText size={15} />,   specs: "If applicable · PDF · max 1 MB",                  required: false },
    ],
  },
  {
    id: "upsc",
    name: "UPSC CSE",
    fullName: "Civil Services Examination",
    category: "Government",
    icon: <Award size={24} />,
    color: "#8b5cf6",
    bg: "#f0ebff",
    date: "Feb – Sep 2025",
    documents: [
      { id: "photo",     label: "Passport Photo",     icon: <Camera size={15} />,     specs: "JPG · max 300 KB · 35×45 mm · white background", required: true },
      { id: "signature", label: "Signature",           icon: <PenLine size={15} />,    specs: "JPG · max 100 KB · 20×60 mm",                   required: true },
      { id: "id",        label: "Photo ID",            icon: <CreditCard size={15} />, specs: "Any govt-issued ID · PDF or JPG · max 1 MB",    required: true },
      { id: "degree",    label: "Degree Certificate",  icon: <FileText size={15} />,   specs: "Bachelor's degree · PDF · max 2 MB",            required: true },
      { id: "dob",       label: "Date of Birth Proof", icon: <FileText size={15} />,   specs: "Class 10 certificate · PDF",                   required: true },
    ],
  },
  {
    id: "gate",
    name: "GATE 2025",
    fullName: "Graduate Aptitude Test in Engineering",
    category: "Engineering",
    icon: <BookOpen size={24} />,
    color: "#10b981",
    bg: "#e6faf4",
    date: "Feb 2025",
    documents: [
      { id: "photo",      label: "Passport Photo",              icon: <Camera size={15} />,     specs: "JPG · 480×640 px · max 500 KB · white background", required: true  },
      { id: "signature",  label: "Signature",                   icon: <PenLine size={15} />,    specs: "JPG · 160×560 px · max 200 KB",                   required: true  },
      { id: "id",         label: "Photo ID",                    icon: <CreditCard size={15} />, specs: "Aadhaar / Passport / Driving License · JPG/PDF",   required: true  },
      { id: "qualifying", label: "Qualifying Degree Certificate",icon: <FileText size={15} />,  specs: "PDF · max 2 MB",                                  required: true  },
      { id: "category",   label: "Category Certificate",        icon: <FileText size={15} />,   specs: "SC/ST/PwD · PDF · max 1 MB",                      required: false },
    ],
  },
  {
    id: "cat",
    name: "CAT 2025",
    fullName: "Common Admission Test",
    category: "Management",
    icon: <GraduationCap size={24} />,
    color: "#f59e0b",
    bg: "#fff8e0",
    date: "Nov 2025",
    documents: [
      { id: "photo",      label: "Passport Photo",       icon: <Camera size={15} />,   specs: "JPG · 20–50 KB · 3.5×4.5 cm · white background", required: true  },
      { id: "signature",  label: "Signature",             icon: <PenLine size={15} />,  specs: "JPG · 10–20 KB · 3.5×1.5 cm",                   required: true  },
      { id: "degree",     label: "Bachelor's Degree",     icon: <FileText size={15} />, specs: "PDF · max 2 MB",                                 required: true  },
      { id: "transcript", label: "Final Year Transcript", icon: <FileText size={15} />, specs: "PDF · max 1 MB",                                 required: false },
    ],
  },
  {
    id: "ssc",
    name: "SSC CGL",
    fullName: "Staff Selection Commission CGL",
    category: "Government",
    icon: <Award size={24} />,
    color: "#ef4444",
    bg: "#fff0f0",
    date: "Jun – Sep 2025",
    documents: [
      { id: "photo",     label: "Recent Photograph",        icon: <Camera size={15} />,   specs: "JPG · 4–12 KB · 1×1 inch · plain background",  required: true  },
      { id: "signature", label: "Signature",                 icon: <PenLine size={15} />,  specs: "JPG · 1–3 KB · 2.5×7.5 cm",                   required: true  },
      { id: "dob",       label: "Date of Birth Certificate", icon: <FileText size={15} />, specs: "Class 10 marksheet · PDF · max 1 MB",          required: true  },
      { id: "degree",    label: "Graduation Degree",         icon: <FileText size={15} />, specs: "PDF · max 2 MB",                               required: true  },
      { id: "noc",       label: "No Objection Certificate",  icon: <FileText size={15} />, specs: "If employed in Govt. · PDF · max 1 MB",        required: false },
    ],
  },
];

// The 4 most recent exams shown on the homepage
export const RECENT_EXAMS = EXAMS.slice(0, 4);
