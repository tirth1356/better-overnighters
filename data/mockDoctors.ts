import type { Doctor } from '@/types'

export const mockDoctors: Doctor[] = [
  {
    id: 'dr-1',
    name: 'Dr. Vikram Shah',
    specialization: 'Diabetologist & Endocrinologist',
    hospital: 'Sunshine Multispeciality Hospital',
    phone: '+91 98765 43210',
    email: 'dr.vshah@sunshine.in',
  },
  {
    id: 'dr-2',
    name: 'Dr. Meera Patel',
    specialization: 'General Physician & Internal Medicine',
    hospital: 'City Health Clinic, Ahmedabad',
    phone: '+91 99876 54321',
    email: 'dr.mpatel@cityhealthclinic.in',
  },
  {
    id: 'dr-3',
    name: 'Dr. Rajan Nair',
    specialization: 'Pediatrician',
    hospital: 'Rainbow Children\'s Hospital',
    phone: '+91 91234 56789',
    email: 'dr.rnair@rainbow.in',
  },
  {
    id: 'dr-4',
    name: 'Dr. Anita Kapoor',
    specialization: 'Radiologist',
    hospital: 'MedScan Diagnostics Centre',
    phone: '+91 94321 09876',
  },
  {
    id: 'dr-5',
    name: 'Dr. Suresh Joshi',
    specialization: 'Haematologist',
    hospital: 'BloodCare Specialty Clinic',
    phone: '+91 95432 10987',
  },
]
