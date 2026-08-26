import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { skillService } from '../services/skillService.js';
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
} from 'lucide-react';

export const SkillAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
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
  }, []);

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
          className="font-semibold shadow-sm"
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
                  <div className="w-5 h-5 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded flex items-center justify-center font-bold text-xs">
                    JS
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
                          className="bg-blue-300 dark:bg-blue-400 h-full rounded-full"
                          style={{ width: `${comp.proficiencyScore}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-10 text-right font-bold text-slate-700 dark:text-slate-300">
                      {comp.proficiencyScore}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Recommended Next Step Card */}
          <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              RECOMMENDED NEXT STEP
            </span>

            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {recommendedNextStep.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md leading-relaxed">
                    {recommendedNextStep.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="slate" size="sm">
                      {recommendedNextStep.estimatedHours}
                    </Badge>
                    <Badge variant="blue" size="sm">
                      {recommendedNextStep.typeLabel}
                    </Badge>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="md"
                onClick={() => navigate(`/courses/${recommendedNextStep.courseSlug}`)}
                className="w-full sm:w-auto font-semibold border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap"
              >
                Start Course
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Identified Gap Areas (1 Col) */}
        <Card className="p-6 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Identified Gap Areas
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Based on your recent assessments and code reviews, these areas require focus to reach your target Advanced level.
          </p>

          <div className="space-y-5">
            {gapAreas.map((gap) => {
              const isCritical = gap.severity === 'Critical';
              return (
                <div key={gap.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {gap.skillName}
                    </span>
                    <span
                      className={`text-[11px] font-bold ${
                        isCritical ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {gap.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {gap.description}
                  </p>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full ${
                        isCritical ? 'bg-red-500 w-1/4' : 'bg-slate-400 dark:bg-slate-600 w-1/2'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
