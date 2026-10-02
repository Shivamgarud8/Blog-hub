import React, { useState } from 'react';
import { X, Mail, Lock, ArrowRight, Sparkles, Feather } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, pass: string) => Promise<void>;
  onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onSwitchToRegister,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onLogin(email, password);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('priya.sharma@example.com');
    setPassword('password123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-rose-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold text-stone-900">Welcome Back</h3>
              <p className="text-[11px] text-stone-500">Sign in to your BloomScript author account</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="my-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs text-stone-900 bg-rose-50/20 rounded-xl border border-rose-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs text-stone-900 bg-rose-50/20 rounded-xl border border-rose-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 rounded-xl shadow-md shadow-rose-300/40 transition-all"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Account Quick-Fill Button */}
        <div className="mt-4 pt-4 border-t border-rose-100 flex flex-col gap-2">
          <button
            type="button"
            onClick={fillDemoAccount}
            className="flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors"
          >
            <Feather className="h-3.5 w-3.5 text-rose-500" />
            <span>Fill Demo Credentials (Priya Sharma)</span>
          </button>

          <p className="text-center text-xs text-stone-500 pt-1">
            Don't have an author profile?{' '}
            <button
              onClick={() => {
                onClose();
                onSwitchToRegister();
              }}
              className="font-semibold text-rose-600 hover:underline"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
