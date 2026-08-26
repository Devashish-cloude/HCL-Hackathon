import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.js';
import { TopNav } from './TopNav.js';
import { AssessmentModal } from '../assessment/AssessmentModal.js';

export const AppLayout: React.FC = () => {
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-row">
      {/* Sidebar */}
      <Sidebar onOpenAssessmentModal={() => setIsAssessmentModalOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet context={{ openAssessmentModal: () => setIsAssessmentModalOpen(true) }} />
        </main>
      </div>

      {/* Global Assessment Modal */}
      <AssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        onAssessmentCompleted={() => {
          // Trigger global re-fetch or event
          window.dispatchEvent(new Event('learnpath:refresh'));
        }}
      />
    </div>
  );
};
