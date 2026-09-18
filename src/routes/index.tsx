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

// Placeholder pages — Persons 2 & 3
import {
  MedicalRecordsPage,
  MedicinesPage,
  DoctorsPage,
  VaccinationsPage,
  EmergencyPage,
} from '@/pages/PlaceholderPages';

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

          // Person 2 pages (placeholders)
          { path: '/medical-records', element: <MedicalRecordsPage /> },
          { path: '/medicines',       element: <MedicinesPage /> },

          // Person 3 pages (placeholders)
          { path: '/doctors',        element: <DoctorsPage /> },
          { path: '/vaccinations',   element: <VaccinationsPage /> },
          { path: '/emergency',      element: <EmergencyPage /> },
        ],
      },
    ],
  },

  // Fallback
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);

// Re-export AuthProvider so App.tsx stays clean
export { AuthProvider };
