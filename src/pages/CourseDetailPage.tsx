import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService.js';
import { Course, CourseModule, Lesson } from '../types/index.js';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import { ProgressBar } from '../components/common/ProgressBar.js';
import {
  PlayCircle,
  BookOpen,
  HelpCircle,
  Code,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<{ [key: string]: boolean }>({
    '0-0': true,
    '0-1': true,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      if (!slug) return;
      try {
        const res = await courseService.getCourseBySlug(slug);
        if (res.success) {
          setCourse(res.data);
        }
      } catch (err) {
        console.error('Failed to load course:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCourse();
  }, [slug]);

  if (isLoading || !course) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  const currentModule: CourseModule | undefined = course.modules?.[activeModuleIndex];
  const currentLesson: Lesson | undefined = currentModule?.lessons?.[activeLessonIndex];

  const totalLessonsCount =
    course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 1;
  const completedCount = Object.values(completedLessons).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalLessonsCount) * 100);

  const handleMarkComplete = () => {
    const key = `${activeModuleIndex}-${activeLessonIndex}`;
    setCompletedLessons((prev) => ({ ...prev, [key]: true }));

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });

    // Advance to next lesson if available
    if (currentModule && activeLessonIndex < currentModule.lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    } else if (course.modules && activeModuleIndex < course.modules.length - 1) {
      setActiveModuleIndex(activeModuleIndex + 1);
      setActiveLessonIndex(0);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return PlayCircle;
      case 'READING':
        return BookOpen;
      case 'QUIZ':
        return HelpCircle;
      case 'CODING_CHALLENGE':
        return Code;
      default:
        return PlayCircle;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            {course.category} Track
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {course.title}
          </h2>
        </div>
      </div>

      {/* Main Grid: Player on left (2 Cols), Syllabus on right (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Lesson Player (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <Badge variant="blue" size="sm">
                  {currentLesson?.type || 'LESSON'}
                </Badge>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-2">
                  {currentLesson?.title || 'Lesson Content'}
                </h3>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {currentLesson?.durationMinutes} min estimated
              </span>
            </div>

            {/* Lesson Body */}
            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <p>{currentLesson?.content}</p>

              {currentLesson?.type === 'CODING_CHALLENGE' && (
                <div className="mt-4 p-4 bg-slate-950 text-slate-100 rounded-xl font-mono text-xs border border-slate-800">
                  <p className="text-slate-400 mb-2">// Implement your solution:</p>
                  <code>{`function handleAsyncPipeline(requests) {
  // Use Promise.allSettled with error boundaries
  return Promise.allSettled(requests.map(req => fetch(req.url)));
}`}</code>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (activeLessonIndex > 0) {
                    setActiveLessonIndex(activeLessonIndex - 1);
                  }
                }}
                disabled={activeLessonIndex === 0 && activeModuleIndex === 0}
              >
                Previous Lesson
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleMarkComplete}
                className="font-semibold shadow-sm"
              >
                <CheckCircle className="w-4 h-4 mr-1.5" />
                Complete & Continue
              </Button>
            </div>
          </Card>
        </div>

        {/* Syllabus / Module List (1 Col) */}
        <div className="space-y-6">
          <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Course Syllabus
                </h4>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {progressPercent}%
                </span>
              </div>
              <ProgressBar value={progressPercent} size="sm" />
            </div>

            {/* Modules List */}
            <div className="space-y-4 pt-2">
              {course.modules?.map((mod, mIdx) => (
                <div key={mod.id} className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>
                      Module {mIdx + 1}: {mod.title}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {mod.lessons?.map((lesson, lIdx) => {
                      const Icon = getLessonIcon(lesson.type);
                      const isCurrent =
                        activeModuleIndex === mIdx && activeLessonIndex === lIdx;
                      const isDone = completedLessons[`${mIdx}-${lIdx}`];

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            setActiveModuleIndex(mIdx);
                            setActiveLessonIndex(lIdx);
                          }}
                          type="button"
                          className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Icon
                              className={`w-3.5 h-3.5 flex-shrink-0 ${
                                isCurrent ? 'text-blue-600' : 'text-slate-400'
                              }`}
                            />
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          {isDone && (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
