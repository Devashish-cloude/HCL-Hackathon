import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout.js';
import { ProtectedRoute } from '../components/layout/ProtectedRoute.js';

// Pages
import { DashboardPage } from '../pages/DashboardPage.js';
import { LearningPathPage } from '../pages/LearningPathPage.js';
import { SkillAnalysisPage } from '../pages/SkillAnalysisPage.js';
import { AIMentorPage } from '../pages/AIMentorPage.js';
import { ExplorePage } from '../pages/ExplorePage.js';
import { CourseDetailPage } from '../pages/CourseDetailPage.js';
import { ProgressPage } from '../pages/ProgressPage.js';
import { SettingsPage } from '../pages/SettingsPage.js';
import { OnboardingPage } from '../pages/OnboardingPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { RegisterPage } from '../pages/RegisterPage.js';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/learning-path" element={<LearningPathPage />} />
          <Route path="/skills" element={<SkillAnalysisPage />} />
          <Route path="/ai-mentor" element={<AIMentorPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/courses/:slug" element={<CourseDetailPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
