import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import AppShell from '@/components/layout/AppShell';

// Auth pages
import LoginPage  from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';

// Protected pages — Person 1
import DashboardPage  from '@/pages/DashboardPage';
import FamilyPage     from '@/pages/FamilyPage';
import FamilyTreePage from '@/pages/FamilyTreePage';

// Placeholder pages — Person 2 (medical records UI still lives in the Next.js tree)
import { MedicalRecordsPage } from '@/pages/PlaceholderPages';

// Person 3 pages
import MedicinesPage      from '@/features/medicines/MedicinesPage';
import DoctorsPage        from '@/features/doctors/DoctorsPage';
import DoctorProfilePage  from '@/features/doctors/DoctorProfilePage';
import VaccinationsPage   from '@/features/vaccinations/VaccinationsPage';
import EmergencyPage      from '@/features/emergency/EmergencyPage';
import ExplainPage        from '@/features/ai/ExplainPage';

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
          { path: '/',               element: <Navigate to="/dashboard" replace /> },

          // Person 1 pages
          { path: '/dashboard',      element: <DashboardPage /> },
          { path: '/family',         element: <FamilyPage /> },
          { path: '/family-tree',    element: <FamilyTreePage /> },

          // Person 2 pages
          { path: '/medical-records', element: <MedicalRecordsPage /> },

          // Person 3 pages
          { path: '/medicines',        element: <MedicinesPage /> },
          { path: '/doctors',          element: <DoctorsPage /> },
          { path: '/doctors/:doctorId', element: <DoctorProfilePage /> },
          { path: '/vaccinations',     element: <VaccinationsPage /> },
          { path: '/emergency',        element: <EmergencyPage /> },
          { path: '/explain',          element: <ExplainPage /> },
        ],
      },
    ],
  },

  // Fallback
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);

// Re-export AuthProvider so App.tsx stays clean
export { AuthProvider };
