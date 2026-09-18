import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import AppShell from '@/components/layout/AppShell';

// Auth pages — Person 1
import LoginPage  from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';

// Core pages — Person 1
import DashboardPage  from '@/pages/DashboardPage';
import FamilyPage     from '@/pages/FamilyPage';
import FamilyTreePage from '@/pages/FamilyTreePage';

// Medical Records & Vault — Person 2
import MedicalRecordsPage from '@/features/records/MedicalRecordsPage';
import RecordDetailPage from '@/features/records/RecordDetailPage';
import RecordUploadPage from '@/features/records/RecordUploadPage';

// Health Modules — Person 3
import MedicinesPage from '@/features/medicines/MedicinesPage';
import DoctorsPage from '@/features/doctors/DoctorsPage';
import DoctorProfilePage from '@/features/doctors/DoctorProfilePage';
import VaccinationsPage from '@/features/vaccinations/VaccinationsPage';
import EmergencyPage from '@/features/emergency/EmergencyPage';
import ExplainPage from '@/features/ai/ExplainPage';

export const router = createBrowserRouter([
  // Public routes
  { path: '/login',  element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },

  // Protected routes (requires auth)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          // Default redirect
          { path: '/', element: <Navigate to="/dashboard" replace /> },

          // Person 1 pages
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/family', element: <FamilyPage /> },
          { path: '/family-tree', element: <FamilyTreePage /> },

          // Person 2 pages (Records Vault & Detail)
          { path: '/medical-records', element: <MedicalRecordsPage /> },
          { path: '/records', element: <Navigate to="/medical-records" replace /> },
          { path: '/records/upload', element: <RecordUploadPage /> },
          { path: '/records/:id', element: <RecordDetailPage /> },

          // Person 3 pages (Medicines, Doctors, Vaccinations, Emergency, AI)
          { path: '/medicines', element: <MedicinesPage /> },
          { path: '/doctors', element: <DoctorsPage /> },
          { path: '/doctors/:doctorId', element: <DoctorProfilePage /> },
          { path: '/vaccinations', element: <VaccinationsPage /> },
          { path: '/emergency', element: <EmergencyPage /> },
          { path: '/ai/explain', element: <ExplainPage /> },
          { path: '/explain', element: <ExplainPage /> },
        ],
      },
    ],
  },

  // Fallback
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);

// Re-export AuthProvider so App.tsx stays clean
export { AuthProvider };
