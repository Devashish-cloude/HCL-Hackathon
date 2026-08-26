import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { learningPathService } from '../services/learningPathService.js';
import { LearningPathData } from '../types/index.js';
import { Card } from '../components/common/Card.js';
import { Badge } from '../components/common/Badge.js';
import { ProgressBar } from '../components/common/ProgressBar.js';
import {
  TrendingUp,
  Clock,
  Target,
  CheckCircle2,
  Lock,
  GraduationCap,
  Trophy,
  ArrowRight,
  PlayCircle,
} from 'lucide-react';

export const LearningPathPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<LearningPathData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPath = async () => {
    try {
      const res = await learningPathService.getLearningPath();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load learning path:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPath();
    const handleRefresh = () => fetchPath();
    window.addEventListener('learnpath:refresh', handleRefresh);
    return () => window.removeEventListener('learnpath:refresh', handleRefresh);
  }, []);

  if (isLoading || !data) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  const { stats, phases } = data;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          My Learning Path
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          {data.description}
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Metric 1: Overall Progress */}
        <Card className="p-5 border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              OVERALL PROGRESS
            </span>
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {stats.overallProgress}%
            </h3>
            <ProgressBar value={stats.overallProgress} size="sm" className="mt-2.5" />
          </div>
        </Card>

        {/* Metric 2: Time Invested */}
        <Card className="p-5 border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              TIME INVESTED
            </span>
            <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {Math.round(stats.timeInvestedHours)}h
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Estimated {stats.estimatedRemainingHours}h remaining to target role.
            </p>
          </div>
        </Card>

        {/* Metric 3: Current Focus */}
        <Card className="p-5 border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              CURRENT FOCUS
            </span>
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 truncate">
              {stats.currentFocus}
            </h3>
            <button
              onClick={() => navigate('/courses/js-async-programming')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 mt-1 cursor-pointer"
            >
              <span>Resume Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>
      </div>

      {/* Curriculum Roadmap Card */}
      <Card className="p-8 border-slate-200/90 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-8">
          Curriculum Roadmap
        </h3>

        {/* Timeline Container */}
        <div className="space-y-10 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {phases.map((phase) => {
            const isCompleted = phase.status === 'COMPLETED';
            const isInProgress = phase.status === 'IN_PROGRESS';
            const isLocked = phase.status === 'LOCKED';

            return (
              <div key={phase.id} className="relative flex items-start gap-6 group">
                {/* Phase Icon Node */}
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                    isCompleted
                      ? 'bg-blue-600 text-white shadow-sm ring-4 ring-white dark:ring-slate-900'
                      : isInProgress
                      ? 'bg-blue-600 text-white shadow-sm ring-4 ring-blue-100 dark:ring-blue-950'
                      : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-400 ring-4 ring-white dark:ring-slate-900'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isInProgress ? (
                    <GraduationCap className="w-5 h-5" />
                  ) : phase.phaseNumber === 4 ? (
                    <Trophy className="w-5 h-5" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </div>

                {/* Phase Content Area */}
                <div className="flex-1 min-w-0 pt-0.5">
                  {/* Phase Subtitle & Status */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                      PHASE {phase.phaseNumber}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{phase.estimatedHours}h total</span>
                    </div>
                    {isInProgress && (
                      <Badge variant="blue" size="sm">
                        🔄 In Progress
                      </Badge>
                    )}
                    {isLocked && phase.phaseNumber === 3 && (
                      <Badge variant="slate" size="sm">
                        Up Next
                      </Badge>
                    )}
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {phase.title}
                  </h4>
                  {phase.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-3">
                      {phase.description}
                    </p>
                  )}

                  {/* Phase Modules Box */}
                  <div className="mt-3 space-y-2.5">
                    {phase.modules.map((mod) => {
                      if (mod.isCurrent) {
                        return (
                          /* Active / Current Module Highlighted Card matching Screenshot */
                          <div
                            key={mod.id}
                            className="p-4 rounded-xl border-2 border-blue-600 bg-white dark:bg-slate-900 shadow-sm"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-2.5">
                                <PlayCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    {mod.title}
                                  </h5>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {mod.summary}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="blue" size="sm">
                                Current
                              </Badge>
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                  {mod.progressPercentage}% Complete
                                </div>
                                <ProgressBar value={mod.progressPercentage} size="sm" />
                              </div>
                              <button
                                onClick={() => navigate('/courses/js-async-programming')}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                              >
                                Continue
                              </button>
                            </div>
                          </div>
                        );
                      }

                      if (isCompleted || mod.status === 'COMPLETED') {
                        return (
                          <div
                            key={mod.id}
                            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                              <div>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  {mod.title}
                                </span>
                                {mod.summary && (
                                  <span className="text-xs text-slate-400 dark:text-slate-500 ml-2 hidden sm:inline">
                                    {mod.summary}
                                  </span>
                                )}
                              </div>
                            </div>
                            {mod.progressPercentage > 0 && (
                              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                {mod.progressPercentage}%
                              </span>
                            )}
                          </div>
                        );
                      }

                      // Locked modules
                      return (
                        <div
                          key={mod.id}
                          className="p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 flex items-center justify-between opacity-80"
                        >
                          <div>
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              {mod.title}
                            </p>
                            {mod.summary && (
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                                {mod.summary}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
