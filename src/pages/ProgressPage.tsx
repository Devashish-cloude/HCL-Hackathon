import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { assessmentService } from '../services/assessmentService.js';
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
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
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
    loadHistory();
  }, []);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekActivity = [true, true, true, true, true, true, true]; // All active this week!

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Learning Progress & Analytics
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detailed metrics, retention velocity, and competency milestones.
        </p>
      </div>

      {/* Top Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {user?.learningStreak || 14} Days
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Current Active Streak
            </p>
          </div>
        </Card>

        <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {user?.totalHoursInvested || 38} Hours
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Total Study Time
            </p>
          </div>
        </Card>

        <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              12 Mastered
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Verified Technical Skills
            </p>
          </div>
        </Card>
      </div>

      {/* Row 2: Streak Activity & Weekly Study Rhythm */}
      <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              Weekly Activity Rhythm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Consistent daily practice drives 3.4x faster concept retention.
            </p>
          </div>
          <Badge variant="green" size="sm">
            100% Target Met
          </Badge>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-3">
          {daysOfWeek.map((day, idx) => (
            <div
              key={day}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-2"
            >
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
                {day}
              </span>
              <div
                className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center ${
                  weekActivity[idx]
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-slate-400 font-medium block">45m</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Row 3: Assessment History */}
      <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
          Recent Assessment History
        </h3>

        {assessmentHistory.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No completed assessments yet. Click "+ New Assessment" in the sidebar to benchmark your skills!
          </p>
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
