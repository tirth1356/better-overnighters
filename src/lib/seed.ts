import type { DB } from './store';
import { addDays, toISODate } from './schedule';

/**
 * Demo data so every screen has something to show on a fresh machine.
 * Dates are relative to "today" so the calendar always looks current.
 */
export function seed(): DB {
  const today = toISODate(new Date());
  return {
    members: [
      { id: 'fm-meera', name: 'Meera Shah', relation: 'Mother', dateOfBirth: '1972-04-11', bloodGroup: 'B+' },
      { id: 'fm-rajesh', name: 'Rajesh Shah', relation: 'Father', dateOfBirth: '1968-11-02', bloodGroup: 'O+' },
      { id: 'fm-kavya', name: 'Kavya Shah', relation: 'Daughter', dateOfBirth: '2016-07-23', bloodGroup: 'B+' },
    ],
    doctors: [
      {
        id: 'dr-shah', name: 'Dr. Anjali Shah', specialization: 'Endocrinologist',
        phone: '+91 98250 11223', email: 'anjali.shah@sterling.in',
        hospital: 'Sterling Hospital', clinic: 'Diabetes & Thyroid Clinic',
        address: 'Gurukul Road, Ahmedabad', notes: 'Reviews HbA1c every 3 months.',
      },
      {
        id: 'dr-mehta', name: 'Dr. Nikhil Mehta', specialization: 'Radiologist',
        phone: '+91 98790 44556', hospital: 'Apollo Imaging Centre',
        address: 'CG Road, Ahmedabad',
      },
      {
        id: 'dr-patel', name: 'Dr. Riya Patel', specialization: 'Paediatrician',
        phone: '+91 99045 77881', clinic: 'Little Steps Child Clinic',
        address: 'Bodakdev, Ahmedabad', notes: 'Handles Kavya’s vaccination schedule.',
      },
    ],
    medicines: [
      {
        id: 'med-metformin', familyMemberId: 'fm-meera', name: 'Metformin', dosage: '500 mg',
        frequency: 2, times: ['08:00', '20:00'], startDate: addDays(today, -20),
        endDate: addDays(today, 40), beforeAfterFood: 'after_food', doctorId: 'dr-shah',
        notes: 'Take with a full glass of water.',
      },
      {
        id: 'med-thyronorm', familyMemberId: 'fm-meera', name: 'Thyronorm', dosage: '50 mcg',
        frequency: 1, times: ['07:00'], startDate: addDays(today, -60),
        beforeAfterFood: 'before_food', doctorId: 'dr-shah',
        notes: 'Empty stomach, 30 minutes before breakfast.',
      },
      {
        id: 'med-telmisartan', familyMemberId: 'fm-rajesh', name: 'Telmisartan', dosage: '40 mg',
        frequency: 1, times: ['09:00'], startDate: addDays(today, -15),
        beforeAfterFood: 'after_food', doctorId: 'dr-shah',
      },
      {
        id: 'med-vitd', familyMemberId: 'fm-kavya', name: 'Vitamin D3 drops', dosage: '400 IU',
        frequency: 1, times: ['13:00'], startDate: addDays(today, -5),
        endDate: addDays(today, 25), beforeAfterFood: 'with_food', doctorId: 'dr-patel',
      },
    ],
    doses: [
      { id: 'dl1', medicineId: 'med-metformin', date: addDays(today, -1), time: '08:00', status: 'taken', recordedAt: '' },
      { id: 'dl2', medicineId: 'med-metformin', date: addDays(today, -1), time: '20:00', status: 'taken', recordedAt: '' },
      { id: 'dl3', medicineId: 'med-thyronorm', date: addDays(today, -1), time: '07:00', status: 'taken', recordedAt: '' },
      { id: 'dl4', medicineId: 'med-metformin', date: today, time: '08:00', status: 'taken', recordedAt: '' },
      { id: 'dl5', medicineId: 'med-thyronorm', date: today, time: '07:00', status: 'taken', recordedAt: '' },
    ],
    vaccinations: [
      {
        id: 'vac-kavya-dtp', familyMemberId: 'fm-kavya', vaccine: 'DTP Booster', dose: 'Booster 2',
        date: addDays(today, -400), nextDueDate: addDays(today, 30), notes: 'Given at Little Steps Clinic.',
      },
      {
        id: 'vac-kavya-flu', familyMemberId: 'fm-kavya', vaccine: 'Influenza', dose: 'Annual',
        date: addDays(today, -380), nextDueDate: addDays(today, -15),
      },
      {
        id: 'vac-meera-covid', familyMemberId: 'fm-meera', vaccine: 'COVID-19', dose: 'Booster 1',
        date: addDays(today, -200),
      },
      {
        id: 'vac-rajesh-tetanus', familyMemberId: 'fm-rajesh', vaccine: 'Tetanus (Td)', dose: 'Dose 1',
        nextDueDate: addDays(today, 12),
      },
    ],
    emergency: [
      {
        familyMemberId: 'fm-meera', bloodGroup: 'B+',
        allergies: ['Penicillin', 'Sulfa drugs'],
        conditions: ['Type 2 Diabetes', 'Hypothyroidism'],
        emergencyContactName: 'Rajesh Shah (Husband)', emergencyContactPhone: '+91 98240 33445',
        primaryDoctorId: 'dr-shah',
      },
      {
        familyMemberId: 'fm-kavya', bloodGroup: 'B+',
        allergies: ['Peanuts'], conditions: ['Mild asthma'],
        emergencyContactName: 'Meera Shah (Mother)', emergencyContactPhone: '+91 98250 99001',
        primaryDoctorId: 'dr-patel',
        notes: 'Carries a salbutamol inhaler in her school bag.',
      },
    ],
    records: [
      { id: 'rec-1', familyMemberId: 'fm-meera', title: 'Blood report — HbA1c', kind: 'report', date: addDays(today, -21), doctorId: 'dr-shah' },
      { id: 'rec-2', familyMemberId: 'fm-meera', title: 'MRI — Lumbar spine', kind: 'report', date: addDays(today, -60), doctorId: 'dr-mehta' },
      { id: 'rec-3', familyMemberId: 'fm-kavya', title: 'Prescription — Vitamin D', kind: 'prescription', date: addDays(today, -5), doctorId: 'dr-patel' },
    ],
  };
}
