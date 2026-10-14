import React from 'react';
import {
  X,
  Shield,
  Smartphone,
  Monitor,
  Tablet,
  CheckCircle2,
  XCircle,
  Clock,
  Globe,
  LogOut,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { useDating } from '../../context/DatingContext';

export const MyLoginHistoryModal: React.FC = () => {
  const {
    isMyLoginHistoryModalOpen,
    setIsMyLoginHistoryModalOpen,
    currentUser,
    currentProfile,
    loginHistory,
    showToast,
  } = useDating();

  if (!isMyLoginHistoryModalOpen || !currentUser) return null;

  // Filter logs for this specific user
  const myLogs = loginHistory.filter(
    (l) => l.email.toLowerCase() === currentUser.email.toLowerCase()
  );

  const handleRevokeOtherSessions = () => {
    showToast('Đã đăng xuất khỏi tất cả các thiết bị khác thành công!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-end sm:items-center p-0 sm:p-4">
      <div
        className="w-full max-w-md max-h-[90vh] bg-neutral-900 border-t sm:border border-neutral-800 rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200 text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-100">
                Lịch Sử Đăng Nhập Của Tôi
              </h2>
              <span className="text-[10px] text-neutral-400">
                {currentUser.email} • Bảo mật tài khoản
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsMyLoginHistoryModalOpen(false)}
            className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Active Device Highlight Card */}
          <div className="p-4 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-100">Thiết bị hiện tại</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                    Đang hoạt động
                  </span>
                </div>
                <span className="text-[11px] text-neutral-400 block mt-0.5">
                  Ứng dụng Cupid • Phiên làm việc bảo mật
                </span>
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-3 bg-neutral-950/80 border border-neutral-800 rounded-xl flex items-start gap-2.5 text-xs text-neutral-400">
            <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>
              Lịch sử ghi lại địa chỉ IP, tên thiết bị và thời gian truy cập. Nếu phát hiện hoạt động lạ, bạn có thể đăng xuất từ xa ngay lập tức.
            </span>
          </div>

          {/* Sessions List */}
          <div>
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2.5">
              Các lần truy cập gần đây ({myLogs.length})
            </div>

            <div className="space-y-2">
              {myLogs.length === 0 ? (
                <div className="text-center py-6 text-neutral-500 text-xs">
                  Chưa ghi nhận thêm phiên đăng nhập nào khác.
                </div>
              ) : (
                myLogs.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-neutral-300">
                        {item.deviceType === 'MOBILE' ? (
                          <Smartphone className="w-4 h-4 text-rose-400" />
                        ) : (
                          <Monitor className="w-4 h-4 text-sky-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-neutral-200 truncate flex items-center gap-1.5">
                          <span>{item.device}</span>
                          {item.status === 'SUCCESS' && (
                            <span className="text-[10px] text-emerald-400 font-bold">✓</span>
                          )}
                          {item.status === 'FAILED' && (
                            <span className="text-[10px] text-rose-400 font-bold">✕ Sai mật khẩu</span>
                          )}
                          {item.status === 'LOGOUT' && (
                            <span className="text-[10px] text-neutral-500">Đăng xuất</span>
                          )}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate flex items-center gap-2 mt-0.5">
                          <span>{item.browser}</span>
                          <span>•</span>
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[11px] font-mono text-neutral-300 font-medium">
                        {item.formattedTime}
                      </div>
                      <span className="text-[9px] text-neutral-500 font-mono block">
                        IP: {item.ipAddress}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action button: Revoke other sessions */}
          <button
            onClick={handleRevokeOtherSessions}
            className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất khỏi tất cả các thiết bị khác</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 shrink-0">
          <button
            onClick={() => setIsMyLoginHistoryModalOpen(false)}
            className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
