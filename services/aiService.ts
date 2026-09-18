/**
 * AI Service Abstraction
 * ======================
 * This module defines the interface and mock implementation for all AI features.
 *
 * Person 4 — to connect real AI/LLM:
 *   1. Implement the functions below using your LLM/RAG backend
 *   2. Replace mock* functions or swap the exported service object
 *   3. The UI components depend ONLY on these interfaces — no changes needed there
 *
 * DO NOT implement: Family Health Copilot, RAG, vector search (reserved for Person 4)
 */

import type {
  AIExplanation,
  ExtractedPrescription,
  ReportComparison,
  MedicalRecord,
  Language,
} from '@/types'
import { AI_DISCLAIMER } from '@/lib/constants'

// ── Service Interface ──────────────────────────────────────
// Person 4 can create a class implementing this interface

export interface AIService {
  /**
   * Explain a medical record in the chosen language.
   * Returns structured sections: simple explanation, key terms, lab values, doctor questions.
   */
  explainMedicalRecord(
    record: MedicalRecord,
    language: Language
  ): Promise<AIExplanation>

  /**
   * Extract medicine details from a prescription image/PDF.
   * Returns structured list of medicines with dosage, frequency, duration.
   */
  extractPrescription(
    fileUrl: string,
    fileType: string
  ): Promise<ExtractedPrescription>

  /**
   * Compare two or more reports of the same type.
   * Returns a structured parameter comparison with trend analysis.
   */
  compareReports(
    records: MedicalRecord[]
  ): Promise<ReportComparison>
}

// ── Mock Implementation ────────────────────────────────────

async function mockExplainMedicalRecord(
  record: MedicalRecord,
  language: Language
): Promise<AIExplanation> {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 1200))

  const labels = {
    en: {
      simple: `This is your ${record.title}. Based on the report, most values appear within the normal reference range. Your doctor has reviewed this and may recommend follow-up based on specific values.`,
      notice: 'Your doctor at ' + (record.hospital ?? 'the clinic') + ' has reviewed this report. Please consult them for a complete interpretation.',
    },
    hi: {
      simple: `यह आपकी ${record.title} रिपोर्ट है। रिपोर्ट के अनुसार, अधिकांश मान सामान्य संदर्भ सीमा के भीतर हैं। आपके डॉक्टर ने इसकी समीक्षा की है और विशिष्ट मानों के आधार पर अनुवर्ती कार्रवाई की सिफारिश कर सकते हैं।`,
      notice: 'कृपया संपूर्ण व्याख्या के लिए अपने डॉक्टर से परामर्श करें।',
    },
    gu: {
      simple: `આ તમારી ${record.title} રિપોર્ટ છે. રિપોર્ટ અનુસાર, મોટાભાગના મૂલ્યો સામાન્ય સંદર્ભ શ્રેણીમાં છે. તમારા ડૉક્ટરે આ રિવ્યૂ કર્યો છે.`,
      notice: 'સંપૂર્ણ સ્પષ્ટીકરણ માટે કૃપા કરીને તમારા ડૉક્ટરની સલાહ લો.',
    },
  }

  const isBloodReport = record.documentType === 'blood_report'

  return {
    recordId: record.id,
    language,
    generatedAt: new Date().toISOString(),
    simpleExplanation: labels[language].simple,
    keyTerms: isBloodReport
      ? [
          {
            term: 'HbA1c',
            explanation:
              language === 'en'
                ? 'Glycated haemoglobin — measures your average blood sugar over the past 2–3 months. Target for diabetics is below 7%.'
                : language === 'hi'
                ? 'ग्लाइकेटेड हीमोग्लोबिन — पिछले 2-3 महीनों में औसत रक्त शर्करा को मापता है।'
                : 'ગ્લાયકેટેડ હિમોગ્લોબિન — છેલ્લા 2-3 મહિનાની સરેરાશ બ્લડ સુગર.'
          },
          {
            term: 'WBC',
            explanation:
              language === 'en'
                ? 'White Blood Cells — your immune system cells. Normal range: 4,000–11,000 cells/µL.'
                : language === 'hi'
                ? 'श्वेत रक्त कोशिकाएं — आपकी प्रतिरक्षा प्रणाली की कोशिकाएं।'
                : 'સફેદ રક્ત કોષો — તમારી રોગ પ્રતિરોધક પ્રણાલીના કોષો.'
          },
          {
            term: 'Haemoglobin',
            explanation:
              language === 'en'
                ? 'Protein in red blood cells that carries oxygen. Normal: 13.5–17.5 g/dL (men), 12–15.5 g/dL (women).'
                : language === 'hi'
                ? 'लाल रक्त कोशिकाओं में प्रोटीन जो ऑक्सीजन ले जाता है।'
                : 'લાલ રક્ત કોષોમાં પ્રોટીન જે ઓક્સિજન વહન કરે છે.'
          },
        ]
      : [
          {
            term: 'Reference Range',
            explanation:
              language === 'en'
                ? 'The normal value range for a particular test, based on a healthy population.'
                : language === 'hi'
                ? 'स्वस्थ जनसंख्या के आधार पर किसी विशेष परीक्षण के लिए सामान्य मूल्य सीमा।'
                : 'સ્વસ્થ વ્યક્તિઓ પર આધારિત ચોક્કસ પરીક્ષણ માટે સામાન્ય મૂલ્ય શ્રેણી.'
          },
        ],
    labValues: isBloodReport
      ? [
          {
            parameter: 'Haemoglobin',
            value: '12.4',
            unit: 'g/dL',
            referenceRange: '13.5–17.5',
            status: 'low',
          },
          {
            parameter: 'WBC',
            value: '7.2',
            unit: 'K/µL',
            referenceRange: '4.0–11.0',
            status: 'normal',
          },
          {
            parameter: 'Platelets',
            value: '205',
            unit: 'K/µL',
            referenceRange: '150–400',
            status: 'normal',
          },
          {
            parameter: 'HbA1c',
            value: '7.4',
            unit: '%',
            referenceRange: '< 7.0',
            status: 'high',
          },
        ]
      : [],
    questionsForDoctor:
      language === 'en'
        ? [
            'What does this result mean for my current health condition?',
            'Do I need to change any medication based on this report?',
            'When should I get this test done again?',
            'Are there any lifestyle changes I should make?',
          ]
        : language === 'hi'
        ? [
            'इस परिणाम का मेरी वर्तमान स्वास्थ्य स्थिति के लिए क्या अर्थ है?',
            'क्या इस रिपोर्ट के आधार पर मुझे कोई दवा बदलनी होगी?',
            'मुझे यह परीक्षण फिर कब करवाना चाहिए?',
            'क्या कोई जीवनशैली परिवर्तन हैं जो मुझे करने चाहिए?',
          ]
        : [
            'આ પરિણામ મારી વર્તમાન સ્વાસ્થ્ય સ્થિતિ માટે શું અર્થ ધરાવે છે?',
            'શું આ રિપોર્ટના આધારે મારે કોઈ દવા બદલવી જોઈએ?',
            'મારે આ ટેસ્ટ ક્યારે ફરીથી કરાવવો જોઈએ?',
            'શું જીવનશૈલીમાં કોઈ ફેરફાર કરવો જોઈએ?',
          ],
    importantNotice: labels[language].notice,
    disclaimer: AI_DISCLAIMER,
  }
}

async function mockExtractPrescription(
  _fileUrl: string,
  _fileType: string
): Promise<ExtractedPrescription> {
  await new Promise(r => setTimeout(r, 2000))

  return {
    rawText: 'Metformin 500mg BD x 30 days\nAzithromycin 500mg OD x 5 days',
    medicines: [
      {
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '30 days',
        instructions: 'After meals',
        confidence: 0.96,
      },
      {
        name: 'Azithromycin',
        dosage: '500mg',
        frequency: 'Once daily',
        duration: '5 days',
        instructions: 'Before meals',
        confidence: 0.93,
      },
    ],
    doctorName: 'Dr. Vikram Shah',
    hospitalName: 'Sunshine Multispeciality Hospital',
    date: new Date().toISOString().split('T')[0],
    confidence: 0.94,
    needsReview: false,
  }
}

async function mockCompareReports(
  records: MedicalRecord[]
): Promise<ReportComparison> {
  await new Promise(r => setTimeout(r, 1500))

  const recordIds = records.map(r => r.id)

  return {
    recordIds,
    parameters: [
      {
        parameter: 'Haemoglobin',
        unit: 'g/dL',
        referenceRange: '13.5–17.5',
        values: {
          [recordIds[0]]: '11.8',
          [recordIds[1] ?? recordIds[0]]: '12.4',
        },
        trend: 'improving',
      },
      {
        parameter: 'WBC',
        unit: 'K/µL',
        referenceRange: '4.0–11.0',
        values: {
          [recordIds[0]]: '7.4',
          [recordIds[1] ?? recordIds[0]]: '7.2',
        },
        trend: 'stable',
      },
      {
        parameter: 'Platelets',
        unit: 'K/µL',
        referenceRange: '150–400',
        values: {
          [recordIds[0]]: '190',
          [recordIds[1] ?? recordIds[0]]: '205',
        },
        trend: 'improving',
      },
      {
        parameter: 'HbA1c',
        unit: '%',
        referenceRange: '< 7.0',
        values: {
          [recordIds[0]]: '7.1',
          [recordIds[1] ?? recordIds[0]]: '7.4',
        },
        trend: 'worsening',
      },
    ],
    summary:
      'Overall haemoglobin shows improvement between the two reports, suggesting positive response to supplementation. WBC counts remain stable and within normal range. HbA1c has slightly increased, which may warrant a medication review.',
    generatedAt: new Date().toISOString(),
  }
}

// ── Exported Service ───────────────────────────────────────
// Person 4: Replace this object with your real implementation

export const aiService: AIService = {
  explainMedicalRecord: mockExplainMedicalRecord,
  extractPrescription: mockExtractPrescription,
  compareReports: mockCompareReports,
}
