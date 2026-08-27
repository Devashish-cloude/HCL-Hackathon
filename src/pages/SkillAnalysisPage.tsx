import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { skillService } from '../services/skillService.js';
import { useAuth } from '../contexts/AuthContext.js';
import { SkillAnalysisData } from '../types/index.js';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import { ProgressBar } from '../components/common/ProgressBar.js';
import {
  GraduationCap,
  Activity,
  AlertTriangle,
  Code2,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const SkillAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const context = useOutletContext<{ openAssessmentModal?: () => void }>();
  const [data, setData] = useState<SkillAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSkills = async () => {
    try {
      const res = await skillService.getSkillAnalysis();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load skill analysis:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
    const handleRefresh = () => fetchSkills();
    window.addEventListener('learnpath:refresh', handleRefresh);
    return () => window.removeEventListener('learnpath:refresh', handleRefresh);
  }, [user?.id]);

  if (isLoading || !data) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  const { primaryAssessment, recommendedNextStep, gapAreas } = data;

  const roleTag = user?.targetRole?.includes('AI')
    ? 'AI'
    : user?.targetRole?.includes('Full')
    ? 'FS'
    : user?.targetRole?.includes('Backend')
    ? 'BE'
    : 'FE';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header Row with Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Skill Analysis
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Career-oriented assessment and competency mapping.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => context?.openAssessmentModal && context.openAssessmentModal()}
          className="font-semibold shadow-sm cursor-pointer"
        >
          New Assessment
        </Button>
      </div>

      {/* Main Grid: Left Column (Competencies + Recommended Next Step) and Right Column (Identified Gap Areas) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Primary Assessment Competency Card */}
          <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-md flex items-center justify-center font-bold text-xs">
                    {roleTag}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {primaryAssessment.category}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Primary technical competency assessment
                </p>
              </div>

              <Badge variant="blue" size="sm">
                Target: {primaryAssessment.targetLevel}
              </Badge>
            </div>

            {/* Overall Proficiency Bar */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Overall Proficiency
                </span>
                <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                  {primaryAssessment.overallProficiency}%
                </span>
              </div>
              <ProgressBar value={primaryAssessment.overallProficiency} size="md" color="blue" />
              <p className="text-right text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1">
                {primaryAssessment.statusLabel}
              </p>
            </div>

            {/* Competency Breakdown Sub-bars */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Competency Breakdown
              </h4>

              <div className="space-y-3.5">
                {primaryAssessment.competencies.map((comp) => (
                  <div key={comp.id} className="flex items-center gap-4 text-xs font-medium">
                    <span className="w-36 text-slate-700 dark:text-slate-300 truncate">
                      {comp.name}
                    </span>
                    <div className="flex-1">
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 dark:bg-blue-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${comp.proficiencyScore}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-10 text-right text-slate-900 dark:text-slate-100 font-bold">
                      {comp.proficiencyScore}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Recommended Next Step Card */}
          <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Recommended Next Step
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {recommendedNextStep.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {recommendedNextStep.description}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Badge variant="slate" size="sm">
                    {recommendedNextStep.typeLabel}
                  </Badge>
                  <span className="text-[11px] text-slate-400">
                    {recommendedNextStep.estimatedHours}
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`/courses/${recommendedNextStep.courseSlug}`)}
                className="font-semibold text-xs whitespace-nowrap cursor-pointer"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Start Practice
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Identified Gap Areas (1 Col) */}
        <div className="space-y-4">
          <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Identified Gap Areas
              </h3>
            </div>

            <div className="space-y-3">
              {gapAreas.map((gap) => (
                <div
                  key={gap.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {gap.skillName}
                    </span>
                    <Badge
                      variant={gap.severity === 'Critical' ? 'red' : 'amber'}
                      size="sm"
                    >
                      {gap.severity}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {gap.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
