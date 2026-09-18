# Better Overnighters — family health

Warm, family-oriented health management: medicines, doctors, vaccinations,
emergency cards, and AI that explains medical documents in English, हिंदी and ગુજરાતી.

## Running it

```bash
npm install
cp .env.example .env   # optional — without a key the AI runs in mock mode
npm run dev            # web on :5173, API on :8787
```

`npm test` runs the scheduling, adherence and model-output validation checks.

## Environment

| Variable | Purpose |
| --- | --- |
| `GROQ_API_KEY` | Groq key. **Server-side only** — it is read in the API process, never bundled, never logged. |
| `GROQ_MODEL` | Model id. Configurable so it is not hardcoded anywhere. |
| `API_PORT` | API server port (default 8787). |

`.env` is git-ignored. Without `GROQ_API_KEY` the AI endpoints return mock
responses that are visibly labelled in both the JSON (`meta.source: "mock"`) and
the UI, so the rest of the team can build without a key.

## Layout (Person 3)

```
server/
  index.ts                     express app, loads .env, mounts /api
  routes/ai.ts                 request validation for the AI endpoints
  services/ai/
    index.ts                   the abstraction everything else calls
    groqClient.ts              the only file that knows about Groq
    medicalExplanation.ts      report explanation (use case 1 + 3)
    prescriptionExtraction.ts  OCR text -> structured medicines (use case 2)
    reportComparison.ts        earlier vs later report
    prompts.ts                 shared safety rules + language instruction
    validate.ts                model output is untrusted; coerced here
    mock.ts                    offline fallback
src/
  lib/schedule.ts              dose scheduling + adherence (tested)
  lib/store.ts                 localStorage persistence for these modules
  lib/ai.ts                    browser client for /api/ai — no keys here
  features/medicines|doctors|vaccinations|emergency|ai
```

### AI interface

```ts
explainMedicalReport({ reportText, language, context? })
extractPrescription(prescriptionText)
compareReports({ earlier, later, language })
```

Every prompt forbids diagnosis and invented values, separates extracted facts
from interpretation, and ends by pointing back to a healthcare professional.
Model output is parsed and coerced by `validate.ts` before it reaches the UI —
unreadable times are dropped rather than guessed at, and extracted prescriptions
are confirmed by the user before a medicine is saved.

## Handoff notes

- **Person 1 (foundation):** `src/App.tsx` is a placeholder shell. Keep the
  `<Route>` entries, drop the chrome. `src/types/index.ts` declares a minimal
  `FamilyMember` — replace it with the real one; these modules only use `id`.
  `src/lib/member.tsx` should point at the real family selection.
- **Person 2 (records):** `src/features/ai/ReportExplainer.tsx` takes
  `initialText` and is ready to drop into the report view; `/explain` is only a
  temporary home for it. `MedicalRecordRef` in `src/types` is the shape the
  doctor pages read for record ↔ doctor association.
- **Person 4 (Copilot / RAG):** extend `server/services/ai/index.ts`. Callers
  never import Groq directly, so a retrieval step, another provider or an
  orchestration layer can be added behind those three functions without
  touching a route or a component.
- Emergency cards are serialised by `emergencyPayload()` — encode that object
  for QR access rather than re-deriving the fields.
