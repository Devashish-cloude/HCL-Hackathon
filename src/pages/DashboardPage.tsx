import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService.js';
import { courseService } from '../services/courseService.js';
import { DashboardData, Course } from '../types/index.js';
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
  Sparkles,
  Target,
  BookOpen,
  ArrowRight,
  Zap,
  Layers,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { useAuth } from '../contexts/AuthContext.js';
import { getRoleCurriculum } from '../lib/roleCurricula.js';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser, updateUserPreferences } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const [dashRes, courseRes] = await Promise.all([
        dashboardService.getDashboardData(),
        courseService.getCourses(),
      ]);

      if (dashRes.success) {
        setData(dashRes.data);
      }
      if (courseRes.success) {
        setCourses(courseRes.data);
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
    const task = data.todayFocus.find((t) => t.id === taskId);
    const willBeCompleted = task ? !task.isCompleted : true;

    // Optimistic UI update
    setData({
      ...data,
      todayFocus: data.todayFocus.map((t) =>
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      ),
    });

    if (willBeCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }

    try {
      await dashboardService.toggleFocusTask(taskId);
      fetchDashboard();
    } catch (err) {
      console.error('Failed to toggle task:', err);
      fetchDashboard();
    }
  };

  const handleSwitchActiveTrack = async (targetRole: string) => {
    await updateUserPreferences({ targetRole });
    fetchDashboard();
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
  const roleConfig = getRoleCurriculum(authUser?.targetRole || user.targetRole);

  const categories = ['ALL', 'AI & Systems', 'Frontend', 'Backend', 'Full Stack'];
  const filteredCourses =
    selectedCategory === 'ALL'
      ? courses
      : courses.filter((c) => c.category === selectedCategory);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Greeting */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Good morning, {displayName}.
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
          Explore all engineering courses or continue your active track.
        </p>
      </div>

      {/* Row 1: Hero Course Card + Today's Focus Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Hero Course Card (2 Columns) */}
        <Card className="lg:col-span-2 p-0 overflow-hidden flex flex-col sm:flex-row border-slate-200/90 dark:border-slate-800 shadow-sm">
          {/* Left Graphic Banner */}
          <div className="sm:w-2/5 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 p-6 flex flex-col justify-between text-white relative overflow-hidden min-h-[220px]">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-1 z-10">
              <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
                Active Track
              </span>
              <h3 className="font-extrabold text-lg leading-tight tracking-tight text-white">
                {roleConfig.bannerTitle}
              </h3>
            </div>

            {/* Illustration Concept Graphic */}
            <div className="my-auto py-2 z-10">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-300" />
                <span className="text-xs font-semibold text-white truncate max-w-[200px]">
                  {heroCourse.currentModuleTitle}
                </span>
              </div>
            </div>

            <div className="text-[10px] font-medium tracking-wider text-slate-300 z-10 uppercase truncate">
              {roleConfig.bannerTags}
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

            {/* Module Progress */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>
                    Module {heroCourse.currentModuleNumber} of {heroCourse.totalModules}
                  </span>
                  <span>{heroCourse.progressPercentage}% Complete</span>
                </div>
                <ProgressBar value={heroCourse.progressPercentage} size="sm" />
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(`/courses/${heroCourse.slug}`)}
                className="w-full sm:w-auto font-semibold px-6 cursor-pointer"
              >
                {heroCourse.tag === 'Start Learning' ? 'Start Learning' : 'Continue Learning'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Right: Today's Focus Card (1 Column) */}
        <Card className="p-6 flex flex-col justify-between border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Target className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Today's Focus
                </h3>
              </div>
              <Badge
                variant={todayFocus.every((t) => t.isCompleted) ? 'green' : 'blue'}
                size="sm"
              >
                {todayFocus.filter((t) => t.isCompleted).length} / {todayFocus.length} Done
              </Badge>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              {todayFocus.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-2.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer group select-none ${
                    task.isCompleted
                      ? 'bg-slate-50/70 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800/60'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-2xs'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition-all ${
                      task.isCompleted
                        ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 group-hover:border-blue-500'
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

      {/* Row 2: All Available Courses & Learning Tracks */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              All Courses & Tracks
            </h3>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                type="button"
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => {
            const isCurrentActive =
              heroCourse.slug === course.slug ||
              roleConfig.heroCourse.slug === course.slug;

            return (
              <Card
                key={course.id}
                className={`p-5 flex flex-col justify-between transition-all duration-150 hover:shadow-md border ${
                  isCurrentActive
                    ? 'border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-500/80 bg-blue-50/20 dark:bg-blue-950/20'
                    : 'border-slate-200/90 dark:border-slate-800'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        course.category === 'AI & Systems'
                          ? 'purple'
                          : course.category === 'Backend'
                          ? 'green'
                          : 'blue'
                      }
                      size="sm"
                    >
                      {course.category}
                    </Badge>
                    {isCurrentActive && (
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-md">
                        Active Track
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {course.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {course.modules?.length || 3} Modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {Math.round((course.durationMinutes || 180) / 60)}h total
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/courses/${course.slug}`)}
                      className="flex-1 font-semibold text-xs cursor-pointer"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Start Course
                    </Button>

                    {!isCurrentActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const roleForCategory =
                            course.category === 'AI & Systems'
                              ? 'AI & Systems Engineer'
                              : course.category === 'Backend'
                              ? 'Backend Engineer'
                              : course.category === 'Full Stack'
                              ? 'Full Stack Engineer'
                              : 'Frontend Engineer';
                          handleSwitchActiveTrack(roleForCategory);
                        }}
                        className="text-xs border-slate-200 dark:border-slate-700 cursor-pointer"
                      >
                        Set Active
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Row 3: Active Track Roadmap Track */}
      <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
              Current Roadmap
            </span>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              {roadmapTrack.pathTitle}
            </h3>
          </div>
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

            {roadmapTrack.steps.map((step) => {
              const isCompleted = step.status === 'COMPLETED';
              const isInProgress = step.status === 'IN_PROGRESS';

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

      {/* Row 4: 4 Metric Cards + Recommendation */}
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
                <BookOpen className="w-4 h-4" />
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

        {/* Right Recommendation Card */}
        <Card className="p-6 flex flex-col justify-between border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Recommended for you
              </h3>
            </div>

            <div
              onClick={() => navigate(`/courses/${recommendation.course?.slug || 'js-async-programming'}`)}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3 cursor-pointer hover:border-blue-400 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs flex-shrink-0">
                {recommendation.title.substring(0, 3).toUpperCase()}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {recommendation.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {recommendation.reason}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/courses/${recommendation.course?.slug || 'js-async-programming'}`)}
            type="button"
            className="w-full text-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline pt-4 cursor-pointer"
          >
            Start recommended track →
          </button>
        </Card>
      </div>
    </div>
  );
};
