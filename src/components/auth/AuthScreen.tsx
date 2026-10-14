import React, { useState } from 'react';
import { Heart, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, UserPlus, LogIn } from 'lucide-react';
import { useDating } from '../../context/DatingContext';

export const AuthScreen: React.FC = () => {
  const { login, register, showToast, setIsAdminMode } = useDating();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }

    if (mode === 'forgot') {
      showToast(`Đã gửi liên kết khôi phục mật khẩu đến ${email}`);
      setMode('login');
      return;
    }

    if (!password) {
      showToast('Vui lòng nhập mật khẩu');
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'login') {
        const ok = login(email, false, password);
        if (ok) {
          showToast('Đăng nhập thành công! Chào mừng bạn trở lại.');
        }
      } else {
        const ok = register(email, password);
        if (ok) {
          showToast('Đăng ký thành công! Hãy hoàn tất hồ sơ của bạn.');
        }
      }
    }, 450);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login('khoa.nguyen@cupidgo.vn', true, '123456');
      showToast('Đã đăng nhập tài khoản mẫu Đăng Khoa (VIP)');
    }, 300);
  };

  const handleQuickNewUser = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      register('newbie@cupidgo.vn', '123456');
      showToast('Bắt đầu quy trình tạo hồ sơ mới');
    }, 300);
  };

  return (
    <div className="flex flex-col min-h-full justify-between p-6 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-100">
      {/* Brand Header */}
      <div className="pt-8 pb-4 text-center">
        <div className="relative inline-block mb-3 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-2xl shadow-rose-500/25 border-2 border-rose-400/40 mx-auto transition-transform hover:scale-105 duration-300">
            <img
              src="/cupid_logo.jpg"
              alt="Cupid Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
          Cupid
        </h1>
        <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
          Ứng dụng hẹn hò & kết đôi thông minh thế hệ mới
        </p>
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-sm mx-auto bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex border-b border-neutral-800 mb-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 pb-3 text-sm font-semibold text-center transition-colors border-b-2 ${
              mode === 'login'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 pb-3 text-sm font-semibold text-center transition-colors border-b-2 ${
              mode === 'register'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Đăng ký
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">
              Địa chỉ Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tenban@email.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-neutral-400">
                  Mật khẩu
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-rose-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                Đăng nhập
              </>
            ) : mode === 'register' ? (
              <>
                <UserPlus className="w-4 h-4" />
                Tạo tài khoản mới
              </>
            ) : (
              'Gửi liên kết khôi phục'
            )}
          </button>
        </form>

        {mode === 'forgot' && (
          <button
            type="button"
            onClick={() => setMode('login')}
            className="w-full mt-3 text-xs text-center text-neutral-400 hover:text-neutral-200"
          >
            Quay lại Đăng nhập
          </button>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-neutral-900 px-2 text-neutral-500">Hoặc thử nghiệm nhanh</span>
          </div>
        </div>

        {/* Demo Fast Logins for Testing */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 px-3 bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 rounded-xl text-xs font-semibold text-neutral-200 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Vào ngay với Hồ sơ mẫu (VIP)</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          <button
            type="button"
            onClick={handleQuickNewUser}
            className="w-full py-2.5 px-3 bg-neutral-800/40 hover:bg-neutral-800/80 border border-neutral-800 rounded-xl text-xs font-medium text-neutral-300 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <UserPlus className="w-3.5 h-3.5 text-rose-400" />
              <span>Trải nghiệm tạo hồ sơ (Onboarding)</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
          </button>
        </div>

        {/* Dedicated Admin Portal Entry */}
        <div className="mt-4 pt-3 border-t border-neutral-800/60 text-center">
          <button
            type="button"
            onClick={() => setIsAdminMode(true)}
            className="text-[11px] text-neutral-400 hover:text-rose-400 transition-colors inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-neutral-800/50"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
            <span>Cổng Quản Trị Hệ Thống (Admin Portal)</span>
          </button>
        </div>
      </div>

      {/* Safety Notice & Footer */}
      <div className="pt-6 pb-2 text-center text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Bảo mật thông tin & kết nối an toàn 100%</span>
      </div>
    </div>
  );
};
