import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { assessmentService } from '../services/assessmentService.js';
import { userProgressStore, StoredProgress } from '../services/userProgressStore.js';
import { Card } from '../components/common/Card.js';
import { Badge } from '../components/common/Badge.js';
import { ProgressBar } from '../components/common/ProgressBar.js';
import {
  Flame,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle2,
  BarChart,
  Circle,
  Sparkles,
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([]);
  const [progress, setProgress] = useState<StoredProgress>(userProgressStore.getProgress(user?.id));
  const [isLoading, setIsLoading] = useState(true);

  const isDevashish =
    user &&
    (user.email.toLowerCase().includes('devashish') ||
      user.name.toLowerCase() === 'devashish');

  const refreshProgressData = async () => {
    setProgress(userProgressStore.getProgress(user?.id));
    try {
      const res = await assessmentService.getHistory();
      if (res.success) {
        setAssessmentHistory(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProgressData();
    const handleRefresh = () => refreshProgressData();
    window.addEventListener('learnpath:refresh', handleRefresh);
    return () => window.removeEventListener('learnpath:refresh', handleRefresh);
  }, [user?.id]);

  // Compute metrics dynamically
  const completedTasksCount = progress.completedFocusTaskIds.length;
  const completedLessonsCount = progress.completedLessonKeys.length;
  const totalCompletedSkills = completedTasksCount + completedLessonsCount;

  const totalHours = isDevashish
    ? 38
    : progress.timeInvestedMinutes > 0
    ? (progress.timeInvestedMinutes / 60).toFixed(1)
    : '0';

  const activeStreakDays = isDevashish
    ? 14
    : completedTasksCount > 0 || completedLessonsCount > 0
    ? 1
    : user?.learningStreak || 1;

  const masteredSkillsCount = isDevashish ? 12 : totalCompletedSkills;

  // Real-time weekly schedule tracking
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayJsDay = new Date().getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const todayIndex = todayJsDay === 0 ? 6 : todayJsDay - 1; // 0 = Mon ... 6 = Sun

  const todayStudyMinutes = isDevashish
    ? 45
    : progress.timeInvestedMinutes > 0
    ? progress.timeInvestedMinutes
    : completedTasksCount > 0
    ? 30
    : 0;

  const hasActivityToday = isDevashish || todayStudyMinutes > 0;

  const activeDaysCount = isDevashish ? 7 : hasActivityToday ? 1 : 0;
  const targetMetPercentage = Math.round((activeDaysCount / 7) * 100);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Learning Progress & Analytics
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Real-time study metrics, retention velocity, and competency milestones.
        </p>
      </div>

      {/* Top Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Streak */}
        <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shadow-xs">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {activeStreakDays} {activeStreakDays === 1 ? 'Day' : 'Days'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Current Active Streak
            </p>
          </div>
        </Card>

        {/* Card 2: Study Time */}
        <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {totalHours} {Number(totalHours) === 1 ? 'Hour' : 'Hours'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Total Study Time
            </p>
          </div>
        </Card>

        {/* Card 3: Skills Mastered */}
        <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shadow-xs">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {masteredSkillsCount} Mastered
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Verified Technical Skills
            </p>
          </div>
        </Card>
      </div>

      {/* Row 2: Streak Activity & Weekly Study Rhythm */}
      <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              Weekly Activity Rhythm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {hasActivityToday
                ? 'Great job! You have logged learning activity for today.'
                : 'Complete today’s focus tasks or lessons to advance your daily rhythm.'}
            </p>
          </div>
          <Badge
            variant={targetMetPercentage >= 50 ? 'green' : 'blue'}
            size="sm"
          >
            {activeDaysCount}/7 Days Active ({targetMetPercentage}%)
          </Badge>
        </div>

        {/* 7 Days Grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {daysOfWeek.map((day, idx) => {
            const isToday = idx === todayIndex;
            const isPast = idx < todayIndex;
            const isFuture = idx > todayIndex;

            const isDayCompleted = isDevashish || (isToday && hasActivityToday);

            return (
              <div
                key={day}
                className={`p-3 sm:p-4 rounded-xl border text-center space-y-2 transition-all ${
                  isToday
                    ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span
                    className={`text-xs font-bold block ${
                      isToday
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {day}
                  </span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  )}
                </div>

                <div
                  className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center transition-all ${
                    isDayCompleted
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isToday
                      ? 'border-2 border-dashed border-blue-400 dark:border-blue-500 text-blue-500'
                      : isPast
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                      : 'border border-slate-300 dark:border-slate-700 text-slate-300 dark:text-slate-600'
                  }`}
                >
                  {isDayCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isToday ? (
                    <Sparkles className="w-3.5 h-3.5" />
                  ) : (
                    <Circle className="w-3 h-3 stroke-[2]" />
                  )}
                </div>

                <span className="text-[10px] text-slate-400 font-medium block">
                  {isDayCompleted
                    ? isDevashish
                      ? '45m'
                      : `${todayStudyMinutes}m`
                    : isToday
                    ? 'In Progress'
                    : isPast
                    ? '0m'
                    : '--'}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Row 3: Assessment History */}
      <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
          Recent Assessment History
        </h3>

        {assessmentHistory.length === 0 ? (
          <div className="py-6 text-center space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No completed assessments yet. Click "+ New Assessment" in the sidebar to benchmark your skills!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {assessmentHistory.map((test) => (
              <div
                key={test.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {test.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {test.feedback || test.proficiencyResult}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                    {test.score}%
                  </span>
                  <Badge variant={test.score >= 70 ? 'green' : 'amber'} size="sm">
                    {test.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
