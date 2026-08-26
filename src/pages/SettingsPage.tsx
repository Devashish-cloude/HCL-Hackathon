import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { useTheme } from '../contexts/ThemeContext.js';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Input } from '../components/common/Input.js';
import { Badge } from '../components/common/Badge.js';
import { Sun, Moon, Check, Save, User, Shield, Target } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUserPreferences, updateUserProfile } = useAuth();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Frontend Engineer');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(user?.dailyGoalMinutes || 45);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setHeadline(user.headline || 'Professional Learner');
      setTargetRole(user.targetRole || 'Frontend Engineer');
      setDailyGoalMinutes(user.dailyGoalMinutes || 45);
    }
  }, [user]);

  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    setTheme(newTheme, true);
    await updateUserPreferences({ theme: newTheme });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile({
        name,
        headline,
        targetRole,
      });
      await updateUserPreferences({
        targetRole,
        dailyGoalMinutes: Number(dailyGoalMinutes),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Settings & Preferences
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your learning environment, target role, and account preferences.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Preferences updated and saved to database successfully!</span>
        </div>
      )}

      {/* Theme Preference Card (Light / Dark) */}
      <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
            Appearance & Theme
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your theme preference is automatically synchronized with your PostgreSQL profile.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          {/* Light Mode Option */}
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                <Sun className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Light Theme</p>
                <p className="text-[11px] text-slate-500">Clean & crisp daylight interface</p>
              </div>
            </div>
            {theme === 'light' && <Check className="w-4 h-4 text-blue-600 font-bold" />}
          </button>

          {/* Dark Mode Option */}
          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-blue-500 bg-blue-950/40 ring-2 ring-blue-500/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400">
                <Moon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Dark Theme</p>
                <p className="text-[11px] text-slate-500">High-contrast sleek dark mode</p>
              </div>
            </div>
            {theme === 'dark' && <Check className="w-4 h-4 text-blue-400 font-bold" />}
          </button>
        </div>
      </Card>

      {/* Profile & Target Role Settings Form */}
      <form onSubmit={handleSaveProfile}>
        <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              Personal Information & Learning Goals
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              These inputs train your personalized AI roadmap generation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Devashish"
            />
            <Input
              label="Headline / Subtitle"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Professional Learner"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Target Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="Full Stack Engineer">Full Stack Engineer</option>
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="AI & Systems Engineer">AI & Systems Engineer</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Daily Study Goal (Minutes / Day)
              </label>
              <input
                type="number"
                min="15"
                max="240"
                step="5"
                value={dailyGoalMinutes}
                onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};
