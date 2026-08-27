import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  GitFork,
  BrainCircuit,
  MessageSquareCode,
  Compass,
  BarChart2,
  Settings,
  HelpCircle,
  Plus,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';
import { Avatar } from '../common/Avatar.js';
import { cn } from '../../lib/utils.js';

interface SidebarProps {
  onOpenAssessmentModal?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenAssessmentModal,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Learning Path', path: '/learning-path', icon: GitFork },
    { name: 'Skill Analysis', path: '/skills', icon: BrainCircuit },
    { name: 'AI Mentor', path: '/ai-mentor', icon: MessageSquareCode },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Progress', path: '/progress', icon: BarChart2 },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      {/* Brand Header */}
      <div className="p-6 pb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-blue-500/20 font-bold text-lg">
            L
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-blue-600 dark:text-blue-500 leading-tight">
              LearnPath AI
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              {user?.headline || 'Professional Learner'}
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            type="button"
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3.5 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (onMobileClose) onMobileClose();
              }}
              className={cn(
                'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 flex-shrink-0 transition-colors',
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                )}
              />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Bottom CTA & Utilities */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
        {/* New Assessment Primary Button */}
        <button
          onClick={() => {
            if (onMobileClose) onMobileClose();
            if (onOpenAssessmentModal) onOpenAssessmentModal();
          }}
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-medium text-sm py-2.5 px-4 rounded-xl shadow-sm shadow-blue-500/10 transition-all duration-150 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Assessment</span>
        </button>

        {/* Secondary Nav Links */}
        <div className="space-y-0.5 pt-1">
          <NavLink
            to="/settings"
            onClick={() => {
              if (onMobileClose) onMobileClose();
            }}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors',
                isActive && 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30'
              )
            }
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings</span>
          </NavLink>
          <NavLink
            to="/help"
            onClick={() => {
              if (onMobileClose) onMobileClose();
            }}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors',
                isActive && 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30'
              )
            }
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Help</span>
          </NavLink>
        </div>

        {/* User Card */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-3 px-1">
          <Avatar name={user?.name || 'Devashish'} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
              {user?.name || 'Devashish'}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
              {user?.headline || 'Professional Learner'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r border-slate-200/80 dark:border-slate-800 h-screen sticky top-0 select-none z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
