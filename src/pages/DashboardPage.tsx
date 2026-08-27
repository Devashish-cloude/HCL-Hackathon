import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService.js';
import { DashboardData } from '../types/index.js';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import { ProgressBar } from '../components/common/ProgressBar.js';
import {
  Clock,
  Check,
  Lock,
  Flame,
  TrendingUp,
  Award,
  GraduationCap,
  Sparkles,
  Target,
  Plus,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext.js';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardService.getDashboardData();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const handleRefresh = () => fetchDashboard();
    window.addEventListener('learnpath:refresh', handleRefresh);
    return () => window.removeEventListener('learnpath:refresh', handleRefresh);
  }, []);

  const handleToggleTask = async (taskId: string) => {
    if (!data) return;
    // Optimistic UI update
    setData({
      ...data,
      todayFocus: data.todayFocus.map((t) =>
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      ),
    });

    try {
      await dashboardService.toggleFocusTask(taskId);
    } catch (err) {
      console.error('Failed to toggle task:', err);
      fetchDashboard();
    }
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  const { user, heroCourse, todayFocus, roadmapTrack, stats, recommendation } = data;
  const displayName = authUser?.name || user.name || 'Learner';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Greeting */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Good morning, {displayName}.
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
          Here's what you should focus on today.
        </p>
      </div>

      {/* Row 1: Hero Continue Learning Card + Today's Focus Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Hero Course Card (2 Columns) */}
        <Card className="lg:col-span-2 p-0 overflow-hidden flex flex-col sm:flex-row border-slate-200/90 dark:border-slate-800 shadow-sm">
          {/* Left Graphic Banner */}
          <div className="sm:w-2/5 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 p-6 flex flex-col justify-between text-white relative overflow-hidden min-h-[220px]">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-1 z-10">
              <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
                Featured Track
              </span>
              <h3 className="font-extrabold text-lg leading-tight tracking-tight text-white">
                ASYNCHRONOUS JAVASCRIPT
              </h3>
            </div>

            {/* Illustration Concept Graphic */}
            <div className="my-auto py-2 z-10">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 inline-flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-300" />
                <span className="text-xs font-semibold text-white">Event Loop & Callbacks</span>
              </div>
            </div>

            <div className="text-[10px] font-medium tracking-wider text-slate-300 z-10 uppercase">
              PROMISES | CALLBACKS | EVENT LOOP | FETCH
            </div>
          </div>

          {/* Right Details */}
          <div className="sm:w-3/5 p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="blue" size="sm">
                  {heroCourse.tag}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{heroCourse.timeRemainingMinutes} min remaining</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-2.5">
                {heroCourse.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {heroCourse.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>
                    Module {heroCourse.currentModuleNumber} of {heroCourse.totalModules}
                  </span>
                  <span>{heroCourse.progressPercentage}% Complete</span>
                </div>
                <ProgressBar value={heroCourse.progressPercentage} size="md" color="blue" />
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(`/courses/${heroCourse.slug}`)}
                className="w-full sm:w-auto font-semibold px-6"
              >
                Continue Learning
              </Button>
            </div>
          </div>
        </Card>

        {/* Right: Today's Focus Card (1 Column) */}
        <Card className="p-6 flex flex-col justify-between border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Target className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Today's Focus
              </h3>
            </div>

            {/* Checklist */}
            <div className="space-y-3.5">
              {todayFocus.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className="flex items-start gap-3 cursor-pointer group select-none"
                >
                  <div
                    className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition-all ${
                      task.isCompleted
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 group-hover:border-blue-400'
                    }`}
                  >
                    {task.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-semibold leading-tight transition-all ${
                        task.isCompleted
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {task.typeLabel} • {task.durationMinutes} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Row 2: Frontend Engineering Path Roadmap Track */}
      <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
            {roadmapTrack.pathTitle}
          </h3>
          <button
            onClick={() => navigate('/learning-path')}
            type="button"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
          >
            View full roadmap
          </button>
        </div>

        {/* Milestone Steps Timeline */}
        <div className="overflow-x-auto pb-2 -mx-2 px-2">
          <div className="relative flex items-center justify-between min-w-[480px]">
            {/* Connector Line */}
            <div className="absolute left-8 right-8 top-4 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />

          {roadmapTrack.steps.map((step, idx) => {
            const isCompleted = step.status === 'COMPLETED';
            const isInProgress = step.status === 'IN_PROGRESS';
            const isLocked = step.status === 'LOCKED';

            return (
              <div
                key={step.id}
                className="flex flex-col items-center text-center z-10 flex-1 px-1 cursor-pointer"
                onClick={() => navigate('/learning-path')}
              >
                {/* Node Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-blue-600 text-white shadow-sm ring-4 ring-blue-50 dark:ring-blue-950'
                      : isInProgress
                      ? 'border-2 border-blue-600 bg-white dark:bg-slate-900 text-blue-600 ring-4 ring-blue-100 dark:ring-blue-950'
                      : 'border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : isInProgress ? (
                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Step Title & Status */}
                <div className="mt-2.5">
                  <p
                    className={`text-xs font-semibold leading-tight ${
                      isInProgress
                        ? 'text-blue-600 dark:text-blue-400 font-bold'
                        : isCompleted
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                    {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Locked'}
                  </p>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </Card>

      {/* Row 3: 4 Metric Cards + Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 4 Stat Cards in 2x2 grid (2 Cols) */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-2 gap-4">
          {/* Card 1: Overall Progress */}
          <Card className="p-5 flex flex-col justify-between border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h4 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {stats.overallProgress}%
              </h4>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Overall Progress
              </p>
            </div>
          </Card>

          {/* Card 2: Learning Streak */}
          <Card className="p-5 flex flex-col justify-between border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h4 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {stats.learningStreak}d
              </h4>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Learning Streak
              </p>
            </div>
          </Card>

          {/* Card 3: Skills Mastered */}
          <Card className="p-5 flex flex-col justify-between border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h4 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {stats.skillsMastered}
              </h4>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Skills Mastered
              </p>
            </div>
          </Card>

          {/* Card 4: Courses Completed */}
          <Card className="p-5 flex flex-col justify-between border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h4 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {stats.coursesCompleted}
              </h4>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Courses Completed
              </p>
            </div>
          </Card>
        </div>

        {/* Recommended for you Card (1 Col) */}
        <Card className="p-5 flex flex-col justify-between border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Recommended for you</span>
            </div>

            <div className="flex gap-3 items-start mt-2">
              {/* Mini Course Icon */}
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-200/70 dark:border-slate-700/70">
                <div className="w-6 h-6 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                  API
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {recommendation.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {recommendation.reason}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/courses/apis-and-fetch')}
              className="w-full text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-semibold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add to Path
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
