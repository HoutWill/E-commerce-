import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Clock, 
  ShieldCheck,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { api } from '../services/api';

interface AdminGateProps {
  onSuccess: (token: string) => void;
  onClose: () => void;
}

export const AdminGate: React.FC<AdminGateProps> = ({ onSuccess, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);
  const [isLocked, setIsLocked] = useState(false);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) {
      if (isLocked) setIsLocked(false);
      return;
    }
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          setIsLocked(false);
          setErrorMessage(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds, isLocked]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await api.loginAdmin({ email, password });

      if (res.success && res.token) {
        sessionStorage.setItem('classybling_admin_token', res.token);
        onSuccess(res.token);
      } else {
        setErrorMessage(res.error || 'Invalid credentials. Please verify your email and password.');
        if (res.isLocked && res.remainingSeconds) {
          setIsLocked(true);
          setLockoutSeconds(res.remainingSeconds);
        } else if (res.remainingAttempts !== undefined) {
          setRemainingAttempts(res.remainingAttempts);
        }
      }
    } catch (err: any) {
      setErrorMessage('Security Gate: Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#D8E5FD] dark:bg-[#0B1329] flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans select-none animate-fade-in">
      
      {/* Background Soft Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/30 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-300/30 dark:bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Responsive Rounded Card */}
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-4xl bg-white dark:bg-[#131B2E] rounded-2xl sm:rounded-3xl md:rounded-[36px] shadow-2xl shadow-blue-900/10 dark:shadow-black/60 border border-white/80 dark:border-slate-800 p-4 sm:p-6 md:p-10 z-10 my-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-12 items-center">
          
          {/* DESKTOP LEFT COLUMN: Full 3D Character (Hidden on Mobile) */}
          <div className="hidden md:flex relative w-full aspect-square max-w-[340px] mx-auto rounded-[28px] bg-gradient-to-b from-[#DCE7FD] to-[#C8DDFD] dark:from-slate-800 dark:to-slate-900/80 p-3 sm:p-4 items-center justify-center overflow-hidden shadow-inner">
            <img
              src="/admin_login_character.jpg"
              alt="Admin Character"
              className="w-full h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* RIGHT COLUMN: Sign In Form (Compact on Mobile) */}
          <div className="space-y-4 sm:space-y-5 max-w-sm mx-auto w-full">
            
            {/* MOBILE COMPACT HEADER: Small circular character badge */}
            <div className="flex flex-col items-center justify-center text-center space-y-1">
              <div className="md:hidden w-16 h-16 rounded-2xl bg-gradient-to-b from-[#DCE7FD] to-[#C8DDFD] dark:from-slate-800 dark:to-slate-900 p-1.5 shadow-md mb-1 border border-blue-200/60 dark:border-slate-700 overflow-hidden">
                <img
                  src="/admin_login_character.jpg"
                  alt="Admin Character"
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-display">
                Sign In
              </h2>
              <p className="text-[11px] sm:text-xs md:text-sm text-slate-400 dark:text-slate-400 font-medium">
                Unlock your world.
              </p>
            </div>

            {/* Lockout Banner */}
            {isLocked && (
              <div className="p-3 sm:p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs space-y-2 animate-shake">
                <div className="flex items-center gap-2 font-black uppercase text-[11px]">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>IP Temporarily Restricted</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Too many failed login attempts. Access will be unlocked in:
                </p>
                <div className="flex items-center gap-2 font-mono text-sm font-black text-rose-600 dark:text-rose-300 bg-white dark:bg-rose-900/50 py-1 px-3 rounded-xl w-fit border border-rose-200 dark:border-rose-800">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>{formatTimer(lockoutSeconds)}</span>
                </div>
              </div>
            )}

            {/* Simple Clean Error Message */}
            {!isLocked && errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="font-semibold text-[11px] sm:text-xs">{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              
              {/* Email Field */}
              <div className="space-y-1">
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="text-rose-500 mr-1">*</span>Email
                </label>
                <input
                  type="email"
                  required
                  disabled={isLocked || isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@xample.com"
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition-all"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="text-rose-500 mr-1">*</span>Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isLocked || isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3.5 py-2.5 sm:py-3 pr-10 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Action Button: Sign In */}
              <button
                type="submit"
                disabled={isLocked || isLoading || !email || !password}
                className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#1E6FFE] hover:bg-[#175cd3] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              {/* Secondary Action Button: Return to Storefront */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] text-slate-600 dark:text-slate-300 font-bold text-[11px] sm:text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Store</span>
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};
