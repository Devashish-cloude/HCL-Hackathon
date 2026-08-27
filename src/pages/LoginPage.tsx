import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Input } from '../components/common/Input.js';
import { Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@learnpath.ai');
    setPassword('Demo@123');
    setIsLoading(true);
    setError('');
    try {
      await login({ email: 'demo@learnpath.ai', password: 'Demo@123' });
      navigate('/dashboard');
    } catch (err: any) {
      // Fallback to devashish demo if demo@ is not seeded
      try {
        await login({ email: 'devashish@learnpath.ai', password: 'password123' });
        navigate('/dashboard');
      } catch (e: any) {
        setError(err.response?.data?.message || 'Demo login failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-6 select-none">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-blue-500/20 font-extrabold text-2xl">
            L
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Sign in to LearnPath AI
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Intelligent personalized roadmaps & AI mentoring
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8 border-slate-200/90 dark:border-slate-800 shadow-xl space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full font-semibold shadow-sm mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Login Option for Reviewers */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDemoLogin}
              className="w-full text-xs font-semibold"
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-blue-500" />}
            >
              Explore with Demo Account (demo@learnpath.ai)
            </Button>
          </div>

          <div className="text-center pt-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
