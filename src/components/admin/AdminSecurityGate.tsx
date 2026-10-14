import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, Smartphone, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { useDating } from '../../context/DatingContext';

export const AdminSecurityGate: React.FC = () => {
  const { loginAdmin, setIsAdminMode } = useDating();
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setErrorMsg('Vui lòng nhập mã bảo mật quản trị');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsLoading(false);
      const success = loginAdmin(passcode);
      if (!success) {
        setErrorMsg('Mã bảo mật không chính xác. Vui lòng thử lại!');
      }
    }, 400);
  };

  const handleQuickDemoCode = (code: string) => {
    setPasscode(code);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4 selection:bg-rose-500 selection:text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-rose-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Security Card */}
      <div className="w-full max-w-md bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Icon */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-3">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-rose-500/40 shadow-xl shadow-rose-500/20 mx-auto">
              <img
                src="/cupid_logo.jpg"
                alt="Cupid Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-600 border-2 border-neutral-900 flex items-center justify-center shadow">
              <Lock className="w-3 h-3 text-white" />
            </div>
          </div>

          <h1 className="text-xl font-extrabold tracking-tight text-neutral-100">
            Cổng Quản Trị Hệ Thống
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
            Cupid Command Center • Khu vực kiểm soát dữ liệu, người dùng và bảo mật
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
              <span>Mã PIN / Mật khẩu Quản trị</span>
              <span className="text-[11px] text-rose-400 font-normal">SuperAdmin Gate</span>
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Nhập mã xác thực (VD: admin123)"
                autoFocus
                required
                className={`w-full pl-10 pr-4 py-3 bg-neutral-950 border ${
                  errorMsg ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-neutral-800 focus:border-rose-500'
                } rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none transition-colors tracking-wider`}
              />
            </div>
            {errorMsg && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-2 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Xác thực & Vào Trang Quản Trị</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access Pills */}
        <div className="mt-6 pt-5 border-t border-neutral-800/80">
          <div className="text-[11px] text-neutral-400 font-medium mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Mã truy cập mặc định tiện ích:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoCode('admin123')}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-[11px] font-mono text-neutral-200 hover:text-white transition-colors text-center"
            >
              admin123
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoCode('888888')}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-[11px] font-mono text-neutral-200 hover:text-white transition-colors text-center"
            >
              PIN: 888888
            </button>
          </div>
        </div>

        {/* Return to App Button */}
        <button
          type="button"
          onClick={() => setIsAdminMode(false)}
          className="w-full mt-4 py-2.5 text-xs text-neutral-400 hover:text-neutral-200 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Quay lại ứng dụng hẹn hò Cupid</span>
        </button>
      </div>

      <div className="mt-6 text-[11px] text-neutral-500 font-medium">
        Hệ thống ghi nhận và lưu nhật ký tự động mọi lần đăng nhập quản trị
      </div>
    </div>
  );
};
