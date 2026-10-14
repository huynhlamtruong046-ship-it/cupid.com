import React, { useState } from 'react';
import {
  Clock,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Monitor,
  Tablet,
  Download,
  Trash2,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  XCircle,
  LogOut,
  UserPlus,
  RefreshCw,
  Globe,
  Lock,
  ChevronRight,
  Info,
  X,
} from 'lucide-react';
import { useDating } from '../../context/DatingContext';
import { LoginHistoryItem } from '../../types';

export const LoginHistoryTab: React.FC = () => {
  const { loginHistory, clearLoginHistory, recordLoginHistory, showToast } = useDating();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'FAILED' | 'LOGOUT' | 'REGISTER'>('ALL');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');
  const [selectedLog, setSelectedLog] = useState<LoginHistoryItem | null>(null);

  // Filtered logs
  const filteredLogs = loginHistory.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      item.email.toLowerCase().includes(term) ||
      (item.userName && item.userName.toLowerCase().includes(term)) ||
      item.ipAddress.toLowerCase().includes(term) ||
      item.device.toLowerCase().includes(term) ||
      item.location.toLowerCase().includes(term) ||
      item.method.toLowerCase().includes(term);

    if (!matchesSearch) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (roleFilter !== 'ALL' && item.role !== roleFilter) return false;

    return true;
  });

  // Analytics Stats
  const totalLogs = loginHistory.length;
  const successCount = loginHistory.filter((l) => l.status === 'SUCCESS').length;
  const failedCount = loginHistory.filter((l) => l.status === 'FAILED').length;
  const uniqueDevices = new Set(loginHistory.map((l) => l.device)).size;

  // Export CSV
  const handleExportCSV = () => {
    if (loginHistory.length === 0) {
      showToast('Không có dữ liệu lịch sử để xuất.');
      return;
    }

    const headers = ['ID', 'Thời Gian', 'Email', 'Tên Người Dùng', 'Vai Trò', 'Trạng Thái', 'Địa Chỉ IP', 'Khu Vực', 'Thiết Bị', 'Trình Duyệt', 'Phương Thức'];
    const rows = loginHistory.map((item) => [
      item.id,
      item.formattedTime,
      item.email,
      item.userName || '',
      item.role,
      item.status,
      item.ipAddress,
      `"${item.location}"`,
      `"${item.device}"`,
      `"${item.browser}"`,
      `"${item.method}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cupid-login-audit-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất file báo cáo lịch sử đăng nhập (.csv)');
  };

  // Simulate test log
  const handleSimulateLogin = (status: 'SUCCESS' | 'FAILED') => {
    if (status === 'SUCCESS') {
      recordLoginHistory({
        email: 'ha.le@cupidgo.vn',
        userName: 'Ngọc Hà',
        role: 'USER',
        status: 'SUCCESS',
        ipAddress: '113.161.45.89',
        location: 'TP. Hồ Chí Minh, VN',
        device: 'Apple iPhone 14 Pro',
        deviceType: 'MOBILE',
        browser: 'Safari 17.2',
        method: 'Đăng nhập Mật khẩu',
      });
      showToast('Đã thêm 1 bản ghi đăng nhập thành công mẫu.');
    } else {
      recordLoginHistory({
        email: 'attacker_sample@domain.xyz',
        userName: 'Nghi vấn xâm nhập',
        role: 'USER',
        status: 'FAILED',
        ipAddress: '42.112.98.11',
        location: 'Hải Phòng, VN',
        device: 'Linux Desktop',
        deviceType: 'DESKTOP',
        browser: 'Chromium 123',
        method: 'Thử brute-force mật khẩu',
      });
      showToast('Đã ghi nhận 1 cảnh báo đăng nhập thất bại mẫu.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-neutral-100">
              Nhật Ký & Lịch Sử Đăng Nhập
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] font-bold text-rose-400">
              Live Audit Log
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Giám sát toàn bộ phiên truy cập, lưu vết IP, thiết bị, thời gian và phát hiện các nỗ lực đăng nhập bất thường.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-semibold shadow-sm transition-colors"
            title="Xuất file CSV báo cáo kiểm toán"
          >
            <Download className="w-3.5 h-3.5 text-rose-400" />
            <span>Xuất file CSV</span>
          </button>

          <button
            onClick={() => handleSimulateLogin('SUCCESS')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-semibold transition-colors"
            title="Tạo log đăng nhập giả lập để kiểm tra"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Mô phỏng log</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử đăng nhập hệ thống?')) {
                clearLoginHistory();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-rose-500/10 border border-neutral-800 hover:border-rose-500/30 text-neutral-400 hover:text-rose-400 text-xs font-semibold transition-colors"
            title="Xóa toàn bộ bản ghi lịch sử"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa lịch sử</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1 */}
        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Tổng số phiên</span>
            <Clock className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-black text-neutral-100 font-mono tabular-nums">
            {totalLogs}
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">
            Bản ghi hoạt động ghi nhận
          </span>
        </div>

        {/* Card 2 */}
        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Đăng nhập thành công</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums">
            {successCount}
          </div>
          <span className="text-[10px] text-emerald-400/80 mt-1 block">
            {totalLogs > 0 ? Math.round((successCount / totalLogs) * 100) : 100}% tỉ lệ hợp lệ
          </span>
        </div>

        {/* Card 3 */}
        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Cảnh báo / Sai mật khẩu</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono tabular-nums">
            {failedCount}
          </div>
          <span className="text-[10px] text-rose-400/80 mt-1 block">
            {failedCount > 0 ? 'Phát hiện đăng nhập bất thường' : 'An toàn, không có tấn công'}
          </span>
        </div>

        {/* Card 4 */}
        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Thiết bị duy nhất</span>
            <Monitor className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">
            {uniqueDevices}
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">
            Nền tảng di động & máy tính
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo email, tên, địa chỉ IP, thiết bị, khu vực..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] text-neutral-400 font-semibold shrink-0">Trạng thái:</span>
          {(['ALL', 'SUCCESS', 'FAILED', 'LOGOUT', 'REGISTER'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                statusFilter === st
                  ? 'bg-rose-500 text-white font-semibold shadow-sm'
                  : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {st === 'ALL'
                ? 'Tất cả'
                : st === 'SUCCESS'
                ? 'Thành công'
                : st === 'FAILED'
                ? 'Thất bại'
                : st === 'LOGOUT'
                ? 'Đăng xuất'
                : 'Đăng ký'}
            </button>
          ))}

          {/* Role Filter */}
          <span className="text-[11px] text-neutral-400 font-semibold ml-2 shrink-0">Vai trò:</span>
          {(['ALL', 'USER', 'ADMIN'] as const).map((rf) => (
            <button
              key={rf}
              onClick={() => setRoleFilter(rf)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                roleFilter === rf
                  ? 'bg-neutral-200 text-neutral-950 font-bold'
                  : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {rf === 'ALL' ? 'Tất cả' : rf === 'USER' ? 'Người dùng' : 'Admin'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table View */}
      <div className="border border-neutral-800 rounded-2xl bg-neutral-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950/80 border-b border-neutral-800 text-neutral-400 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Tài khoản & Người dùng</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Phương thức</th>
                <th className="py-3 px-4">Thiết bị & Trình duyệt</th>
                <th className="py-3 px-4">Địa chỉ IP & Vị trí</th>
                <th className="py-3 px-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500 text-xs">
                    Không tìm thấy bản ghi đăng nhập nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((item) => {
                  const isSuccess = item.status === 'SUCCESS';
                  const isFailed = item.status === 'FAILED';
                  const isLogout = item.status === 'LOGOUT';
                  const isRegister = item.status === 'REGISTER';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedLog(item)}
                      className="hover:bg-neutral-800/40 cursor-pointer transition-colors"
                    >
                      {/* Timestamp */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono text-neutral-200 text-xs font-medium">
                          {item.formattedTime}
                        </div>
                      </td>

                      {/* Account & Role */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              item.role === 'ADMIN'
                                ? 'bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow'
                                : 'bg-neutral-800 text-neutral-300'
                            }`}
                          >
                            {item.userName ? item.userName.charAt(0).toUpperCase() : item.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-neutral-100 truncate flex items-center gap-1.5">
                              <span>{item.userName || 'Chưa đặt tên'}</span>
                              {item.role === 'ADMIN' && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[9px] font-bold">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-neutral-400 block truncate font-mono">
                              {item.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isSuccess && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Thành công</span>
                          </span>
                        )}
                        {isFailed && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[11px] font-bold">
                            <XCircle className="w-3 h-3" />
                            <span>Thất bại</span>
                          </span>
                        )}
                        {isLogout && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 text-[11px] font-medium">
                            <LogOut className="w-3 h-3" />
                            <span>Đăng xuất</span>
                          </span>
                        )}
                        {isRegister && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[11px] font-bold">
                            <UserPlus className="w-3 h-3" />
                            <span>Đăng ký mới</span>
                          </span>
                        )}
                      </td>

                      {/* Method */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-xs text-neutral-300 font-medium bg-neutral-950 px-2 py-1 rounded-lg border border-neutral-800">
                          {item.method}
                        </span>
                      </td>

                      {/* Device & Browser */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {item.deviceType === 'MOBILE' ? (
                            <Smartphone className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          ) : item.deviceType === 'TABLET' ? (
                            <Tablet className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          ) : (
                            <Monitor className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="text-neutral-200 text-xs truncate font-medium">
                              {item.device}
                            </div>
                            <span className="text-[10px] text-neutral-500 truncate block">
                              {item.browser}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* IP & Location */}
                      <td className="py-3 px-4">
                        <div className="font-mono text-xs text-neutral-300 flex items-center gap-1.5">
                          <Globe className="w-3 h-3 text-neutral-500 shrink-0" />
                          <span>{item.ipAddress}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 block truncate">
                          {item.location}
                        </span>
                      </td>

                      {/* Detail Button */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <span>Xem</span>
                          <ChevronRight className="w-3 h-3 text-neutral-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-neutral-950/60 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>
            Hiển thị <strong>{filteredLogs.length}</strong> / <strong>{totalLogs}</strong> lượt ghi nhật ký
          </span>
          <span className="text-[11px] text-neutral-500">
            Dữ liệu được mã hóa & đồng bộ an toàn tại LocalStorage
          </span>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-neutral-100">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                  <Info className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-100">Chi Tiết Phiên Đăng Nhập</h3>
                  <span className="text-[10px] text-neutral-500 font-mono">ID: {selectedLog.id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                <span className="text-neutral-400">Trạng thái xác thực:</span>
                <span className="font-bold text-sm">
                  {selectedLog.status === 'SUCCESS' && <span className="text-emerald-400">Thành Công ✓</span>}
                  {selectedLog.status === 'FAILED' && <span className="text-rose-400">Thất Bại (Cảnh Báo) ✕</span>}
                  {selectedLog.status === 'LOGOUT' && <span className="text-neutral-400">Đã Đăng Xuất</span>}
                  {selectedLog.status === 'REGISTER' && <span className="text-sky-400">Đăng Ký Tài Khoản Mới</span>}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-850">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">Thời gian</span>
                  <div className="font-semibold text-neutral-200">{selectedLog.formattedTime}</div>
                  <span className="text-[10px] text-neutral-500 font-mono">{selectedLog.timestamp}</span>
                </div>

                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-850">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">Phương thức</span>
                  <div className="font-semibold text-neutral-200">{selectedLog.method}</div>
                  <span className="text-[10px] text-neutral-500">Vai trò: {selectedLog.role}</span>
                </div>

                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-850">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">Thiết bị & OS</span>
                  <div className="font-semibold text-neutral-200">{selectedLog.device}</div>
                  <span className="text-[10px] text-neutral-400">{selectedLog.browser}</span>
                </div>

                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-850">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">Địa chỉ IP & Vị trí</span>
                  <div className="font-mono font-semibold text-neutral-200">{selectedLog.ipAddress}</div>
                  <span className="text-[10px] text-neutral-400">{selectedLog.location}</span>
                </div>
              </div>

              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-850">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">Tài khoản</span>
                <div className="text-neutral-200 font-medium">{selectedLog.userName} ({selectedLog.email})</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs rounded-xl transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
