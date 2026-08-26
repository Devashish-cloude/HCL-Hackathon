import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { learningPathService } from '../services/learningPathService.js';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import { Sparkles, ArrowRight, Code2, Database, Layout, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUserPreferences } = useAuth();
  const [step, setStep] = useState(1);
  const [targetRole, setTargetRole] = useState('Frontend Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [goalDescription, setGoalDescription] = useState('Master React, TypeScript, and Fullstack API integrations.');
  const [isGenerating, setIsGenerating] = useState(false);

  const roles = [
    {
      id: 'Frontend Engineer',
      title: 'Frontend Engineer',
      desc: 'Master React, TypeScript, modern CSS, performance & DOM architecture.',
      icon: Layout,
    },
    {
      id: 'Full Stack Engineer',
      title: 'Full Stack Engineer',
      desc: 'Complete end-to-end systems from UI frameworks to databases & APIs.',
      icon: Code2,
    },
    {
      id: 'Backend Engineer',
      title: 'Backend Engineer',
      desc: 'Distributed systems, PostgreSQL, caching, security, and scalability.',
      icon: Database,
    },
    {
      id: 'AI & Systems Engineer',
      title: 'AI & Systems Engineer',
      desc: 'LLM agents, vector embeddings, fine-tuning, and modern inference.',
      icon: Cpu,
    },
  ];

  const levels = [
    { id: 'Beginner', title: 'Beginner', desc: 'Starting from core language fundamentals.' },
    { id: 'Intermediate', title: 'Intermediate', desc: 'Familiar with syntax, looking for industry patterns & architecture.' },
    { id: 'Advanced', title: 'Advanced', desc: 'Optimizing scale, concurrency, profiling, and system design.' },
  ];

  const handleFinishOnboarding = async () => {
    setIsGenerating(true);
    try {
      await updateUserPreferences({ targetRole, experienceLevel });
      await learningPathService.generatePath({
        targetRole,
        experienceLevel,
        goalDescription,
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (err) {
      console.error('Failed to generate learning path:', err);
      navigate('/dashboard');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 rounded-full text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Curriculum Calibration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Welcome to LearnPath AI, {user?.name || 'Developer'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Step {step} of 2 • Let's personalize your intelligent learning roadmap.
          </p>
        </div>

        <Card className="p-8 border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                What is your target engineering role?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = targetRole === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setTargetRole(r.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-600/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 mb-2.5 ${
                          isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                        }`}
                      />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {r.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {r.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setStep(2)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                What is your current experience level?
              </h3>

              <div className="space-y-3">
                {levels.map((lvl) => {
                  const isSelected = experienceLevel === lvl.id;
                  return (
                    <div
                      key={lvl.id}
                      onClick={() => setExperienceLevel(lvl.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-600/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {lvl.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {lvl.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-between items-center">
                <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                  Back
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  isLoading={isGenerating}
                  onClick={handleFinishOnboarding}
                  rightIcon={<Sparkles className="w-4 h-4" />}
                >
                  Generate AI Learning Path
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
