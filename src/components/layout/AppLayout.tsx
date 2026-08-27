import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.js';
import { TopNav } from './TopNav.js';
import { AssessmentModal } from '../assessment/AssessmentModal.js';

export const AppLayout: React.FC = () => {
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-row">
      {/* Sidebar (Desktop sticky & Mobile drawer) */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
        onOpenAssessmentModal={() => setIsAssessmentModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet context={{ openAssessmentModal: () => setIsAssessmentModalOpen(true) }} />
        </main>
      </div>

      {/* Global Assessment Modal */}
      <AssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        onAssessmentCompleted={() => {
          window.dispatchEvent(new Event('learnpath:refresh'));
        }}
      />
    </div>
  );
};
