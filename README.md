# Aarogya Parivar (आरोग्य परिवार) — Family Healthcare Platform

> **Better Overnighters HealthTech**  
> One digital health space for an entire family to manage medical records, prescriptions, medicines, doctors, vaccinations, and emergency health information, with multilingual AI assistance in **English**, **Hindi (हिंदी)**, and **Gujarati (ગુજરાતી)**.

---

## Team Division of Responsibilities

| Role | Domain & Modules | Status |
| :--- | :--- | :--- |
| **Person 1** | Project Foundation, Authentication, Family Tree, Family Health Dashboard, Doctors, Vaccinations, Emergency Health Card | Foundation & Stubs Ready |
| **Person 2** | **Medical Record Vault, Upload Flow, Record Detail View, AI Report Explanation UI, Prescription OCR Flow, Medical Timeline, Report Comparison, AI Service Abstraction** | **Implemented on `feat/person-2-medical-records`** |
| **Person 3** | Medicine Tracker, Dosage Reminders, Inventory Management | Extension points ready |
| **Person 4** | Family Health Copilot, Vector DB, RAG, Semantic Search | AI Service Abstraction ready for LLM swap |

---

## Person 2 Implemented Features

### 1. Medical Document Vault (`/records`)
- Document categories: Blood Reports, Prescriptions, X-Rays, CT/MRI, Discharge Summaries, Lab Reports, Vaccination Records, Other
- Search by keywords, hospital, and clinical tags
- Multi-dimensional filters: Family Member, Document Type, Attending Doctor, Date Range
- Record cards with document category icons, patient tags, attending physician, and AI availability badges

### 2. Record Upload Experience (`/records/upload`)
- Drag-and-drop file upload with format validation (`.pdf`, `.jpg`, `.png` up to 20MB)
- Metadata form: Family Member tag, Document Type, Medical Date, Doctor selector, Hospital/Clinic, Clinical Notes, Tags
- Abstracted file storage layer (`services/storageService.ts`) ready for Firebase/S3

### 3. Comprehensive Record Detail Viewer (`/records/[id]`)
- Editorial clinical document preview simulation
- Patient identity card (relationship, gender, blood group, chronic conditions)
- Service date, upload timestamp, and attending physician credentials
- Quick actions: Open Original Document, Download, Share, Compare Reports, and Explain with AI

### 4. Multilingual AI Report Explanation (`/records/[id]/explain`)
- Interactive language toggle: **English**, **हिंदी**, **ગુજરાતી**
- 5 structured sections:
  1. **Simple Explanation** (layman-friendly clinical breakdown)
  2. **Key Medical Terms** (biomarker definitions, e.g. HbA1c, WBC, Haemoglobin)
  3. **Values and Reference Range** (interactive matrix with status pills: Normal, High, Low)
  4. **Questions to Ask Your Doctor** (copyable prompt cards for doctor consultations)
  5. **Important Notice**
- Prominent non-diagnostic disclaimer: *"This explanation is for understanding your report and is not a medical diagnosis."*

### 5. Prescription Upload & OCR Extraction (`/records/prescription-upload`)
- Multi-step guided flow:
  1. Upload prescription image or PDF
  2. Animated OCR scanning indicator
  3. Extracted medicine review table with inline editing (Name, Dosage, Frequency, Duration, Instructions)
  4. Ability to add additional medicines or delete detected rows
  5. Direct confirmation into the Family Medicine Tracker and Medical Vault

### 6. Chronological Medical Timeline (`/timeline`)
- Visual chronological spine tracking medical milestones across all family members
- Filtering by family member
- Color-coded badges for event types (Doctor visits, lab tests, prescriptions, surgeries, vaccinations)
- Links directly to full records in the vault

### 7. Cross-Report Comparative Analytics (`/records/compare`)
- Select 2 or more reports to evaluate biomarker shifts over time (e.g. June 2026 vs September 2026)
- Structured parameter matrix: Biomarker, Reference Range, Report Values, and Trend Indicators (Improving, Stable, Worsening)
- Objective AI longitudinal trend explanation without inventing conclusions

---

## Design System

Designed specifically to avoid generic blue healthcare software and neon AI interfaces:

- **Cream / Ivory / Warm Beige**: Page and surface backgrounds (`#FAF7F2`, `#F5EFE6`, `#F0E8DC`)
- **Terracotta / Warm Brown**: Accent branding, buttons, active navigation (`#C4704F`, `#8F4428`, `#7A6040`)
- **Muted Sage**: Success indicators, AI Ready badges, improving trends (`#5A8B4A`, `#EEF4EA`)
- **Espresso**: High-contrast typography (`#2C1810`)
- **Typography**: DM Serif Display for headers, Inter for crisp clinical reading
- **Iconography**: Clean Lucide React medical iconography

---

## AI Service Abstraction (`services/aiService.ts`)

Person 4 can connect real LLMs without altering any UI components:

```typescript
export interface AIService {
  explainMedicalRecord(record: MedicalRecord, language: Language): Promise<AIExplanation>
  extractPrescription(fileUrl: string, fileType: string): Promise<ExtractedPrescription>
  compareReports(records: MedicalRecord[]): Promise<ReportComparison>
}
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Run production build check
npm run build

# Run linting
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
