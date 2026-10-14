import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Profile,
  SwipeAction,
  SwipeRecord,
  Match,
  Message,
  FilterState,
  BlockReportRecord,
  ReportItem,
  AdminStats,
  LoginHistoryItem,
} from '../types';
import { INITIAL_MOCK_PROFILES, AUTO_REPLIES } from '../data/mockProfiles';

interface DatingContextType {
  currentUser: User | null;
  currentProfile: Profile | null;
  activeTab: 'discovery' | 'likes' | 'matches' | 'profile';
  setActiveTab: (tab: 'discovery' | 'likes' | 'matches' | 'profile') => void;
  activeChatMatchId: string | null;
  setActiveChatMatchId: (id: string | null) => void;

  // Admin Portal & Security Gate
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  adminAuthenticated: boolean;
  setAdminAuthenticated: (auth: boolean) => void;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  allManagedProfiles: Profile[];
  toggleVerifyUser: (userId: string) => void;
  toggleBanUser: (userId: string) => void;
  reportsList: ReportItem[];
  resolveReport: (reportId: string, action: 'BAN' | 'DISMISS') => void;
  addNewProfile: (profile: Profile) => void;
  updateUserVipStatus: (userId: string, isVip: boolean) => void;
  adminStats: AdminStats;
  
  // Login History & Security Audit
  loginHistory: LoginHistoryItem[];
  recordLoginHistory: (entry: Omit<LoginHistoryItem, 'id' | 'timestamp' | 'formattedTime'>) => void;
  clearLoginHistory: () => void;
  isMyLoginHistoryModalOpen: boolean;
  setIsMyLoginHistoryModalOpen: (open: boolean) => void;
  
  // Discovery stack & Swipes
  candidateProfiles: Profile[];
  currentCandidate: Profile | null;
  swipes: SwipeRecord[];
  swipe: (action: SwipeAction) => void;
  rewindLastSwipe: () => boolean;
  canRewind: boolean;
  
  // Matches & Chat
  matches: Match[];
  messages: Record<string, Message[]>;
  sendMessage: (matchId: string, content: string, type?: 'TEXT' | 'IMAGE', imageUrl?: string) => void;
  activeMatchModal: Profile | null;
  closeMatchModal: () => void;
  
  // Likes You
  likedMeProfiles: Profile[];
  
  // Modals & Sheets
  detailProfileModal: Profile | null;
  setDetailProfileModal: (profile: Profile | null) => void;
  isFilterModalOpen: boolean;
  setIsFilterModalOpen: (open: boolean) => void;
  isPremiumModalOpen: boolean;
  setIsPremiumModalOpen: (open: boolean) => void;
  isEditProfileModalOpen: boolean;
  setIsEditProfileModalOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  isDownloadModalOpen: boolean;
  setIsDownloadModalOpen: (open: boolean) => void;
  blockReportModal: { target: Profile; type: 'BLOCK' | 'REPORT' } | null;
  setBlockReportModal: (val: { target: Profile; type: 'BLOCK' | 'REPORT' } | null) => void;
  
  // Boost & Premium
  activateBoost: () => boolean;
  isBoostActive: boolean;
  boostTimeRemaining: number;
  upgradePremium: (tier: '1_month' | '3_months' | '6_months' | '12_months') => void;
  
  // Filters
  filters: FilterState;
  updateFilters: (newFilters: Partial<FilterState>) => void;
  
  // Auth & Onboarding
  login: (email: string, isDemoReady?: boolean, password?: string) => boolean;
  register: (email: string, password?: string) => boolean;
  logout: () => void;
  completeOnboarding: (data: Partial<Profile>) => void;
  updateProfile: (data: Partial<Profile>) => void;
  
  // Safety actions
  blockUser: (targetId: string) => void;
  reportUser: (targetId: string, reason: string) => void;
  resetAllData: () => void;
  
  // Toasts
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

export interface StoredAccountRecord {
  email: string;
  password?: string;
  user: User;
  profile: Profile | null;
  matches?: Match[];
  messages?: Record<string, Message[]>;
  swipes?: SwipeRecord[];
}

const DatingContext = createContext<DatingContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'cupid_user_v1',
  PROFILE: 'cupid_profile_v1',
  SWIPES: 'cupid_swipes_v1',
  MATCHES: 'cupid_matches_v1',
  MESSAGES: 'cupid_messages_v1',
  BLOCKED: 'cupid_blocked_v1',
  FILTERS: 'cupid_filters_v1',
  ACCOUNTS: 'cupid_accounts_v1',
  LOGIN_HISTORY: 'cupid_login_history_v1',
  ADMIN_AUTH: 'cupid_admin_auth_v1',
};

const DEFAULT_FILTERS: FilterState = {
  gender: 'BOTH',
  minAge: 18,
  maxAge: 40,
  maxDistance: 50,
  selectedInterests: [],
  verifiedOnly: false,
};

const DEFAULT_CURRENT_PROFILE: Profile = {
  userId: 'user_me_001',
  displayName: 'Đăng Khoa',
  gender: 'MALE',
  birthDate: '1999-05-15',
  age: 25,
  bio: 'Product Designer tại Sài Gòn ✨ Thích cà phê specialty, âm nhạc indie và nhiếp ảnh đường phố. Tìm một người bạn chân thành để cùng chia sẻ những điều giản dị.',
  photos: [
    '/src/assets/images/cupid_minh_portrait_1791186060876.jpg',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  ],
  locationName: 'Quận 1, TP. Hồ Chí Minh',
  latitude: 10.7769,
  longitude: 106.7009,
  distanceKm: 0,
  targetGender: 'FEMALE',
  minAgePref: 20,
  maxAgePref: 30,
  maxDistancePref: 35,
  interests: ['Cà phê', 'Thiết kế', 'Nhiếp ảnh', 'Du lịch', 'Âm nhạc', 'Board game'],
  lookingFor: 'Người yêu lâu dài',
  jobTitle: 'Senior Product Designer',
  company: 'Fintech Studio',
  education: 'ĐH Kiến Trúc TP.HCM',
  zodiac: 'Kim Ngưu',
  heightCm: 175,
  lifestyle: {
    drinking: 'Thỉnh thoảng cocktail',
    smoking: 'Không hút thuốc',
    exercise: 'Gym 3 lần/tuần',
    pets: 'Yêu cún & mèo',
  },
  compatibilityRate: 98,
  isVerified: true,
};

const detectClientDevice = (): {
  device: string;
  deviceType: 'MOBILE' | 'DESKTOP' | 'TABLET';
  browser: string;
  ipAddress: string;
  location: string;
} => {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  let device = 'Desktop PC';
  let deviceType: 'MOBILE' | 'DESKTOP' | 'TABLET' = 'DESKTOP';
  let browser = 'Chrome';

  if (/iPad/i.test(ua)) {
    device = 'Apple iPad Pro';
    deviceType = 'TABLET';
  } else if (/iPhone/i.test(ua)) {
    device = 'Apple iPhone 15 Pro';
    deviceType = 'MOBILE';
  } else if (/Android/i.test(ua)) {
    device = /Mobile/i.test(ua) ? 'Samsung Galaxy S24' : 'Galaxy Tab S9';
    deviceType = /Mobile/i.test(ua) ? 'MOBILE' : 'TABLET';
  } else if (/Mac/i.test(ua)) {
    device = 'Apple Mac';
  } else if (/Windows/i.test(ua)) {
    device = 'Windows 11 PC';
  }

  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = 'Safari 17';
  } else if (/Firefox/i.test(ua)) {
    browser = 'Firefox 125';
  } else if (/Edg/i.test(ua)) {
    browser = 'Microsoft Edge';
  } else if (/Chrome/i.test(ua)) {
    browser = 'Chrome 124';
  }

  const sampleLocs = [
    { ip: '113.161.45.89', loc: 'TP. Hồ Chí Minh, VN' },
    { ip: '14.232.18.104', loc: 'Hà Nội, VN' },
    { ip: '115.78.22.61', loc: 'Đà Nẵng, VN' },
    { ip: '171.244.10.15', loc: 'Cần Thơ, VN' },
  ];
  const chosen = sampleLocs[Math.floor(Math.random() * sampleLocs.length)];

  return {
    device,
    deviceType,
    browser,
    ipAddress: chosen.ip,
    location: chosen.loc,
  };
};

export const DatingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentProfile, setCurrentProfile] = useState<Profile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 2. Navigation tabs
  const [activeTab, setActiveTab] = useState<'discovery' | 'likes' | 'matches' | 'profile'>('discovery');
  const [activeChatMatchId, setActiveChatMatchId] = useState<string | null>(null);

  // 3. Swipes & History
  const [swipes, setSwipes] = useState<SwipeRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SWIPES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [swipeHistory, setSwipeHistory] = useState<{ profile: Profile; action: SwipeAction }[]>([]);

  // 4. Matches
  const [matches, setMatches] = useState<Match[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MATCHES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. Messages
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // 6. Blocked users
  const [blockedIds, setBlockedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOCKED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 7. Filters
  const [filters, setFilters] = useState<FilterState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FILTERS);
      return saved ? JSON.parse(saved) : DEFAULT_FILTERS;
    } catch {
      return DEFAULT_FILTERS;
    }
  });

  // 8. Modals
  const [activeMatchModal, setActiveMatchModal] = useState<Profile | null>(null);
  const [detailProfileModal, setDetailProfileModal] = useState<Profile | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [blockReportModal, setBlockReportModal] = useState<{ target: Profile; type: 'BLOCK' | 'REPORT' } | null>(null);

  // Admin Management State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [isMyLoginHistoryModalOpen, setIsMyLoginHistoryModalOpen] = useState(false);

  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGIN_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'log_seed_01',
        email: 'khoa.nguyen@cupidgo.vn',
        userName: 'Đăng Khoa (VIP)',
        role: 'USER',
        timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        formattedTime: 'Hôm nay, 20:30:15',
        status: 'SUCCESS',
        ipAddress: '113.161.45.89',
        location: 'TP. Hồ Chí Minh, VN',
        device: 'Apple iPhone 15 Pro',
        deviceType: 'MOBILE',
        browser: 'Mobile Safari 17.4',
        method: 'Khôi phục phiên đăng nhập',
      },
      {
        id: 'log_seed_02',
        email: 'admin@cupid.vn',
        userName: 'Tổng Quản Trị Viên (SuperAdmin)',
        role: 'ADMIN',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        formattedTime: 'Hôm nay, 18:45:22',
        status: 'SUCCESS',
        ipAddress: '14.232.18.104',
        location: 'Hà Nội, VN',
        device: 'MacBook Pro M3 Max',
        deviceType: 'DESKTOP',
        browser: 'Google Chrome 124',
        method: 'Mã PIN Bảo Mật Admin',
      },
      {
        id: 'log_seed_03',
        email: 'attacker_test@badmail.com',
        userName: 'Chưa xác thực',
        role: 'USER',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        formattedTime: 'Hôm nay, 15:12:08',
        status: 'FAILED',
        ipAddress: '171.244.10.15',
        location: 'Cần Thơ, VN',
        device: 'Windows 11 PC',
        deviceType: 'DESKTOP',
        browser: 'Firefox 125',
        method: 'Sai mật khẩu tài khoản',
      },
      {
        id: 'log_seed_04',
        email: 'thao.linh@cupidgo.vn',
        userName: 'Thảo Linh',
        role: 'USER',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
        formattedTime: 'Hôm qua, 22:15:30',
        status: 'REGISTER',
        ipAddress: '115.78.22.61',
        location: 'Đà Nẵng, VN',
        device: 'Samsung Galaxy S24 Ultra',
        deviceType: 'MOBILE',
        browser: 'Samsung Internet 24.0',
        method: 'Tạo tài khoản & Onboarding',
      },
      {
        id: 'log_seed_05',
        email: 'khoa.nguyen@cupidgo.vn',
        userName: 'Đăng Khoa (VIP)',
        role: 'USER',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
        formattedTime: 'Hôm qua, 18:20:00',
        status: 'LOGOUT',
        ipAddress: '113.161.45.89',
        location: 'TP. Hồ Chí Minh, VN',
        device: 'Apple iPhone 15 Pro',
        deviceType: 'MOBILE',
        browser: 'Mobile Safari 17.4',
        method: 'Chủ động đăng xuất',
      },
    ];
  });
  const [allManagedProfiles, setAllManagedProfiles] = useState<Profile[]>(() => {
    try {
      const saved = localStorage.getItem('cupid_managed_profiles_v1');
      return saved ? JSON.parse(saved) : INITIAL_MOCK_PROFILES;
    } catch {
      return INITIAL_MOCK_PROFILES;
    }
  });

  const [reportsList, setReportsList] = useState<ReportItem[]>(() => {
    try {
      const saved = localStorage.getItem('cupid_reports_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'rep_01',
        reporterId: 'user_vy_05',
        reporterName: 'Phương Vy',
        targetProfile: INITIAL_MOCK_PROFILES[3],
        reason: 'Hồ sơ có dấu hiệu sử dụng hình ảnh không chính chủ',
        createdAt: '13/10/2026 14:20',
        status: 'PENDING',
      },
      {
        id: 'rep_02',
        reporterId: 'user_ha_03',
        reporterName: 'Ngọc Hà',
        targetProfile: INITIAL_MOCK_PROFILES[5],
        reason: 'Gửi link mua hàng bên ngoài qua tin nhắn',
        createdAt: '13/10/2026 11:05',
        status: 'PENDING',
      },
      {
        id: 'rep_03',
        reporterId: 'user_linh_01',
        reporterName: 'Thảo Linh',
        targetProfile: INITIAL_MOCK_PROFILES[1],
        reason: 'Trêu đùa và sử dụng từ ngữ thiếu văn minh',
        createdAt: '12/10/2026 09:30',
        status: 'RESOLVED',
        actionTaken: 'Đã nhắc nhở cảnh cáo quy chuẩn cộng đồng',
      },
    ];
  });

  // 9. Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    else localStorage.removeItem(STORAGE_KEYS.USER);
  }, [currentUser]);

  useEffect(() => {
    if (currentProfile) localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(currentProfile));
    else localStorage.removeItem(STORAGE_KEYS.PROFILE);
  }, [currentProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SWIPES, JSON.stringify(swipes));
  }, [swipes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BLOCKED, JSON.stringify(blockedIds));
  }, [blockedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem('cupid_managed_profiles_v1', JSON.stringify(allManagedProfiles));
  }, [allManagedProfiles]);

  useEffect(() => {
    localStorage.setItem('cupid_reports_v1', JSON.stringify(reportsList));
  }, [reportsList]);

  // Admin Actions
  const toggleVerifyUser = (userId: string) => {
    setAllManagedProfiles((prev) =>
      prev.map((p) => (p.userId === userId ? { ...p, isVerified: !p.isVerified } : p))
    );
    showToast('Đã cập nhật trạng thái xác thực huy hiệu xanh');
  };

  const toggleBanUser = (userId: string) => {
    setAllManagedProfiles((prev) =>
      prev.map((p) => {
        if (p.userId === userId) {
          const newBanned = !p.isBanned;
          if (newBanned) {
            setBlockedIds((b) => [...new Set([...b, userId])]);
          } else {
            setBlockedIds((b) => b.filter((id) => id !== userId));
          }
          return { ...p, isBanned: newBanned };
        }
        return p;
      })
    );
    showToast('Đã cập nhật trạng thái khóa/mở khóa tài khoản');
  };

  const updateUserVipStatus = (userId: string, isVip: boolean) => {
    if (userId === currentUser?.id) {
      setCurrentUser((prev) => (prev ? { ...prev, isPremium: isVip } : null));
    }
    showToast(`Đã ${isVip ? 'cấp' : 'hủy'} quyền VIP cho người dùng`);
  };

  const resolveReport = (reportId: string, action: 'BAN' | 'DISMISS') => {
    setReportsList((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          if (action === 'BAN') {
            toggleBanUser(r.targetProfile.userId);
            return {
              ...r,
              status: 'RESOLVED' as const,
              actionTaken: 'Đã khóa tài khoản vi phạm vĩnh viễn',
            };
          } else {
            return {
              ...r,
              status: 'DISMISSED' as const,
              actionTaken: 'Đã kiểm tra và bác bỏ (Hồ sơ hợp lệ)',
            };
          }
        }
        return r;
      })
    );
    showToast(action === 'BAN' ? 'Đã khóa tài khoản bị báo cáo' : 'Đã đóng và bỏ qua báo cáo');
  };

  const addNewProfile = (newProfile: Profile) => {
    setAllManagedProfiles((prev) => [newProfile, ...prev]);
    showToast(`Đã thêm thành công hồ sơ ${newProfile.displayName}`);
  };

  // Computed Admin Stats
  const adminStats: AdminStats = {
    totalUsers: allManagedProfiles.length + (currentProfile ? 1 : 0),
    premiumUsers: (currentUser?.isPremium ? 1 : 0) + 2,
    totalSwipes: swipes.length + 148,
    totalMatches: matches.length + 24,
    pendingReports: reportsList.filter((r) => r.status === 'PENDING').length,
    estimatedRevenue: (currentUser?.isPremium ? 299000 : 0) + 3880000,
  };

  // Boost timer management
  const [boostTimeRemaining, setBoostTimeRemaining] = useState<number>(0);
  const isBoostActive = boostTimeRemaining > 0;

  useEffect(() => {
    if (!currentUser?.boostActiveUntil) {
      setBoostTimeRemaining(0);
      return;
    }
    const checkBoost = () => {
      const diff = Math.max(0, Math.floor((new Date(currentUser.boostActiveUntil!).getTime() - Date.now()) / 1000));
      setBoostTimeRemaining(diff);
      if (diff === 0 && currentUser.boostActiveUntil) {
        setCurrentUser(prev => prev ? { ...prev, boostActiveUntil: undefined } : null);
      }
    };
    checkBoost();
    const interval = setInterval(checkBoost, 1000);
    return () => clearInterval(interval);
  }, [currentUser?.boostActiveUntil]);

  // Filter candidate profiles
  const swipedIds = new Set(swipes.map((s) => s.targetId));
  const candidateProfiles = allManagedProfiles.filter((p) => {
    if (p.isBanned) return false;
    if (blockedIds.includes(p.userId)) return false;
    if (swipedIds.has(p.userId)) return false;

    // Filter by gender preference
    if (filters.gender !== 'BOTH' && p.gender !== filters.gender) return false;

    // Filter by age
    if (p.age < filters.minAge || p.age > filters.maxAge) return false;

    // Filter by distance
    if (p.distanceKm > filters.maxDistance) return false;

    // Filter by interests (if any selected)
    if (filters.selectedInterests.length > 0) {
      const hasCommon = p.interests.some((i) => filters.selectedInterests.includes(i));
      if (!hasCommon) return false;
    }

    if (filters.verifiedOnly && !p.isVerified) return false;

    return true;
  });

  const currentCandidate = candidateProfiles[0] || null;

  // Profiles that have liked current user
  const likedMeProfiles = allManagedProfiles.filter(
    (p) => !p.isBanned && p.hasLikedCurrentUser && !blockedIds.includes(p.userId)
  );

  // Swipe Action Handler
  const swipe = (action: SwipeAction) => {
    if (!currentCandidate || !currentUser) return;

    const target = currentCandidate;
    const newSwipe: SwipeRecord = {
      id: `swipe_${Date.now()}`,
      swiperId: currentUser.id,
      targetId: target.userId,
      action,
      createdAt: new Date().toISOString(),
    };

    setSwipes((prev) => [...prev, newSwipe]);
    setSwipeHistory((prev) => [...prev, { profile: target, action }]);

    // Check for Match
    if ((action === 'LIKE' || action === 'SUPER_LIKE') && target.hasLikedCurrentUser) {
      const newMatch: Match = {
        id: `match_${Date.now()}`,
        user1Id: currentUser.id,
        user2Id: target.userId,
        matchedAt: new Date().toISOString(),
        partnerProfile: target,
        lastMessage: action === 'SUPER_LIKE' ? '⭐ Bạn đã Siêu Thích người này!' : 'Tương hợp mới! Hãy gửi lời chào ngay.',
        lastMessageTime: 'Vừa xong',
        unreadCount: 0,
      };

      setMatches((prev) => [newMatch, ...prev.filter((m) => m.partnerProfile.userId !== target.userId)]);
      setActiveMatchModal(target);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF4458', '#FE6B8B', '#FFD700', '#FF758C'],
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      if (action === 'SUPER_LIKE') {
        showToast(`Đã gửi Siêu Thích ⭐ cho ${target.displayName}!`);
      }
    }
  };

  // Rewind last swipe
  const canRewind = swipeHistory.length > 0;
  const rewindLastSwipe = (): boolean => {
    if (!canRewind) {
      showToast('Không có lượt vuốt nào để hoàn tác!');
      return false;
    }

    if (!currentUser?.isPremium && (currentUser?.rewindRemaining ?? 0) <= 0) {
      setIsPremiumModalOpen(true);
      return false;
    }

    const last = swipeHistory[swipeHistory.length - 1];
    setSwipeHistory((prev) => prev.slice(0, -1));
    setSwipes((prev) => prev.filter((s) => s.targetId !== last.profile.userId));

    // Also remove match if it was created
    setMatches((prev) => prev.filter((m) => m.partnerProfile.userId !== last.profile.userId));

    if (!currentUser?.isPremium) {
      setCurrentUser((prev) =>
        prev ? { ...prev, rewindRemaining: Math.max(0, prev.rewindRemaining - 1) } : null
      );
    }

    showToast(`Đã quay lại hồ sơ của ${last.profile.displayName}`);
    return true;
  };

  // Boost Profile
  const activateBoost = (): boolean => {
    if (!currentUser) return false;
    const boostUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes
    setCurrentUser((prev) => (prev ? { ...prev, boostActiveUntil: boostUntil } : null));

    showToast('⚡ Tăng Tốc đã kích hoạt! Hồ sơ của bạn đang đứng đầu khu vực trong 30 phút.');
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#8B5CF6', '#EC4899', '#3B82F6'],
      });
    } catch {}
    return true;
  };

  // Send message & Auto-reply simulation
  const sendMessage = (
    matchId: string,
    content: string,
    type: 'TEXT' | 'IMAGE' = 'TEXT',
    imageUrl?: string
  ) => {
    if (!currentUser) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      matchId,
      senderId: currentUser.id,
      content,
      type,
      imageUrl,
      isRead: false,
      sentAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), newMessage],
    }));

    // Update match last message
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              lastMessage: type === 'IMAGE' ? '📷 [Hình ảnh]' : content,
              lastMessageTime: 'Vừa xong',
            }
          : m
      )
    );

    // Auto reply simulation after 1.5s
    const targetMatch = matches.find((m) => m.id === matchId);
    if (targetMatch) {
      const partnerId = targetMatch.partnerProfile.userId;
      const replies = AUTO_REPLIES[partnerId] || [
        'Cảm ơn bạn nhé! Thật vui khi được kết nối cùng bạn ❤️',
        'Mình vừa online nè! Rất vui được trò chuyện với bạn.',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      setTimeout(() => {
        const replyMsg: Message = {
          id: `msg_reply_${Date.now()}`,
          matchId,
          senderId: partnerId,
          content: randomReply,
          type: 'TEXT',
          isRead: true,
          sentAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => ({
          ...prev,
          [matchId]: [...(prev[matchId] || []), replyMsg],
        }));

        setMatches((prev) =>
          prev.map((m) =>
            m.id === matchId
              ? {
                  ...m,
                  lastMessage: randomReply,
                  lastMessageTime: 'Vừa xong',
                }
              : m
          )
        );
      }, 1600);
    }
  };

  // Close match celebration modal
  const closeMatchModal = () => {
    setActiveMatchModal(null);
  };

  // Block & Report
  const blockUser = (targetId: string) => {
    setBlockedIds((prev) => [...prev, targetId]);
    setSwipes((prev) => prev.filter((s) => s.targetId !== targetId));
    setMatches((prev) => prev.filter((m) => m.partnerProfile.userId !== targetId));
    setDetailProfileModal(null);
    setBlockReportModal(null);
    showToast('Đã chặn người dùng thành công.');
  };

  const reportUser = (targetId: string, reason: string) => {
    const reportedProfile = allManagedProfiles.find((p) => p.userId === targetId) || {
      userId: targetId,
      displayName: 'Người dùng',
      photos: ['/src/assets/images/cupid_minh_portrait_1791186060876.jpg'],
      age: 25,
      locationName: 'Việt Nam',
      gender: 'OTHER',
      targetGender: 'BOTH',
      interests: [],
      lookingFor: 'Hẹn hò tìm hiểu',
      compatibilityRate: 90,
      distanceKm: 5,
    } as any;

    const newReport: ReportItem = {
      id: `rep_${Date.now()}`,
      reporterId: currentUser?.id || 'user_anonymous',
      reporterName: currentProfile?.displayName || 'Người dùng',
      targetProfile: reportedProfile,
      reason,
      createdAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING',
    };

    setReportsList((prev) => [newReport, ...prev]);
    blockUser(targetId);
    showToast(`Đã gửi báo cáo vi phạm: "${reason}". Cảm ơn bạn đã giữ an toàn cho cộng đồng!`);
  };

  // Filters
  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    showToast('Đã cập nhật bộ lọc khám phá.');
  };

  const saveAccountToRegistry = (record: Partial<StoredAccountRecord> & { email: string }) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      const accounts: StoredAccountRecord[] = raw ? JSON.parse(raw) : [];
      const idx = accounts.findIndex((a) => a.email.toLowerCase() === record.email.toLowerCase());
      if (idx >= 0) {
        accounts[idx] = { ...accounts[idx], ...record };
      } else {
        accounts.push(record as StoredAccountRecord);
      }
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save account to registry', e);
    }
  };

  // Login History & Security Audit
  const recordLoginHistory = (entry: Omit<LoginHistoryItem, 'id' | 'timestamp' | 'formattedTime'>) => {
    const now = new Date();
    const formattedTime = now.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const newEntry: LoginHistoryItem = {
      id: `login_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: now.toISOString(),
      formattedTime,
      ...entry,
    };

    setLoginHistory((prev) => {
      const updated = [newEntry, ...prev].slice(0, 100);
      try {
        localStorage.setItem(STORAGE_KEYS.LOGIN_HISTORY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearLoginHistory = () => {
    setLoginHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.LOGIN_HISTORY);
    } catch {}
    showToast('Đã xóa toàn bộ lịch sử đăng nhập hệ thống.');
  };

  const loginAdmin = (passcode: string): boolean => {
    const validCodes = ['admin123', '888888', 'cupid2026', 'admin'];
    const device = detectClientDevice();
    if (validCodes.includes(passcode.trim())) {
      setAdminAuthenticated(true);
      try {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      } catch {}
      recordLoginHistory({
        email: 'admin@cupid.vn',
        userName: 'Tổng Quản Trị Viên (SuperAdmin)',
        role: 'ADMIN',
        status: 'SUCCESS',
        ipAddress: device.ipAddress,
        location: device.location,
        device: device.device,
        deviceType: device.deviceType,
        browser: device.browser,
        method: 'Mã PIN Bảo Mật Admin',
      });
      showToast('Đăng nhập Quản Trị Viên thành công!');
      return true;
    } else {
      recordLoginHistory({
        email: 'admin@cupid.vn',
        userName: 'Quản trị viên (Thử nghiệm)',
        role: 'ADMIN',
        status: 'FAILED',
        ipAddress: device.ipAddress,
        location: device.location,
        device: device.device,
        deviceType: device.deviceType,
        browser: device.browser,
        method: 'Sai mã xác thực Admin',
      });
      showToast('Mã bảo mật không đúng! Gợi ý: admin123 hoặc 888888');
      return false;
    }
  };

  const logoutAdmin = () => {
    setAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    } catch {}
    setIsAdminMode(false);
    showToast('Đã đăng xuất khỏi Trang Quản Trị.');
  };

  // Auth
  const login = (email: string, isDemoReady = false, password?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const device = detectClientDevice();

    // 1. Check existing registered accounts in localStorage
    try {
      const savedAccountsRaw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      const accounts: StoredAccountRecord[] = savedAccountsRaw ? JSON.parse(savedAccountsRaw) : [];
      const found = accounts.find((acc) => acc.email.toLowerCase() === cleanEmail);

      if (found) {
        if (password && found.password && found.password !== password) {
          recordLoginHistory({
            email: cleanEmail,
            userName: found.profile?.displayName || found.user.email,
            role: 'USER',
            status: 'FAILED',
            ipAddress: device.ipAddress,
            location: device.location,
            device: device.device,
            deviceType: device.deviceType,
            browser: device.browser,
            method: 'Sai mật khẩu tài khoản',
          });
          showToast('Mật khẩu không chính xác. Vui lòng kiểm tra lại!');
          return false;
        }

        setCurrentUser(found.user);
        setCurrentProfile(found.profile || (isDemoReady ? DEFAULT_CURRENT_PROFILE : null));
        if (found.matches && found.matches.length > 0) {
          setMatches(found.matches);
        }
        if (found.messages && Object.keys(found.messages).length > 0) {
          setMessages(found.messages);
        }
        if (found.swipes && found.swipes.length > 0) {
          setSwipes(found.swipes);
        }

        recordLoginHistory({
          email: cleanEmail,
          userName: found.profile?.displayName || found.user.email,
          role: 'USER',
          status: 'SUCCESS',
          ipAddress: device.ipAddress,
          location: device.location,
          device: device.device,
          deviceType: device.deviceType,
          browser: device.browser,
          method: isDemoReady ? 'Demo VIP Một Chạm' : 'Đăng nhập Mật khẩu',
        });
        return true;
      }
    } catch {}

    // 2. Demo VIP account or fallback
    const user: User = {
      id: isDemoReady ? 'user_me_001' : `user_${Date.now()}`,
      email: cleanEmail,
      phoneNumber: '0912345678',
      isPremium: isDemoReady,
      premiumTier: isDemoReady ? '3_months' : undefined,
      isCompleted: isDemoReady,
      superLikesRemaining: 5,
      rewindRemaining: 5,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);

    if (isDemoReady) {
      setCurrentProfile(DEFAULT_CURRENT_PROFILE);
      const initialMatchUser = INITIAL_MOCK_PROFILES[0];
      const seededMatch: Match = {
        id: 'match_seed_01',
        user1Id: user.id,
        user2Id: initialMatchUser.userId,
        matchedAt: new Date(Date.now() - 3600000).toISOString(),
        partnerProfile: initialMatchUser,
        lastMessage: 'Chào bạn nè! Thấy tụi mình match bất ngờ ghê...',
        lastMessageTime: '10:30',
        unreadCount: 1,
      };
      setMatches([seededMatch]);
      setMessages({
        match_seed_01: [
          {
            id: 'msg_seed_1',
            matchId: 'match_seed_01',
            senderId: initialMatchUser.userId,
            content: 'Chào bạn nè! Thấy tụi mình match bất ngờ ghê, bạn cũng thích nghe nhạc indie với cà phê ngắm phố hả? 🌸',
            type: 'TEXT',
            isRead: true,
            sentAt: '10:30',
          },
        ],
      });
      saveAccountToRegistry({
        email: cleanEmail,
        password: password || '123456',
        user,
        profile: DEFAULT_CURRENT_PROFILE,
        matches: [seededMatch],
      });
    } else {
      setCurrentProfile(null);
      saveAccountToRegistry({
        email: cleanEmail,
        password: password || '',
        user,
        profile: null,
      });
    }

    recordLoginHistory({
      email: cleanEmail,
      userName: isDemoReady ? 'Đăng Khoa (VIP)' : cleanEmail,
      role: 'USER',
      status: 'SUCCESS',
      ipAddress: device.ipAddress,
      location: device.location,
      device: device.device,
      deviceType: device.deviceType,
      browser: device.browser,
      method: isDemoReady ? 'Demo VIP Một Chạm' : 'Khởi tạo tài khoản',
    });

    return true;
  };

  const register = (email: string, password?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const device = detectClientDevice();

    // Check if account already exists
    try {
      const savedAccountsRaw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      const accounts: StoredAccountRecord[] = savedAccountsRaw ? JSON.parse(savedAccountsRaw) : [];
      const found = accounts.find((acc) => acc.email.toLowerCase() === cleanEmail);
      if (found) {
        showToast('Email này đã có tài khoản! Đang đăng nhập...');
        return login(cleanEmail, false, password);
      }
    } catch {}

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: cleanEmail,
      isPremium: false,
      isCompleted: false, // Forces onboarding flow!
      superLikesRemaining: 3,
      rewindRemaining: 3,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    setCurrentProfile(null);

    saveAccountToRegistry({
      email: cleanEmail,
      password: password || '',
      user: newUser,
      profile: null,
    });

    recordLoginHistory({
      email: cleanEmail,
      userName: 'Tài khoản mới',
      role: 'USER',
      status: 'REGISTER',
      ipAddress: device.ipAddress,
      location: device.location,
      device: device.device,
      deviceType: device.deviceType,
      browser: device.browser,
      method: 'Đăng ký tài khoản',
    });

    return true;
  };

  const logout = () => {
    const device = detectClientDevice();
    if (currentUser) {
      recordLoginHistory({
        email: currentUser.email,
        userName: currentProfile?.displayName || currentUser.email,
        role: 'USER',
        status: 'LOGOUT',
        ipAddress: device.ipAddress,
        location: device.location,
        device: device.device,
        deviceType: device.deviceType,
        browser: device.browser,
        method: 'Chủ động đăng xuất',
      });
    }

    setCurrentUser(null);
    setCurrentProfile(null);
    setActiveTab('discovery');
    setActiveChatMatchId(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
  };

  const completeOnboarding = (data: Partial<Profile>) => {
    if (!currentUser) return;

    const completedProfile: Profile = {
      ...DEFAULT_CURRENT_PROFILE,
      ...data,
      userId: currentUser.id,
    };

    setCurrentProfile(completedProfile);
    const updatedUser = { ...currentUser, isCompleted: true };
    setCurrentUser(updatedUser);
    setActiveTab('discovery');

    // Update in accounts registry
    saveAccountToRegistry({
      email: currentUser.email,
      user: updatedUser,
      profile: completedProfile,
      matches,
      messages,
      swipes,
    });

    showToast('🎉 Chúc mừng bạn đã hoàn tất hồ sơ! Bắt đầu kết nối ngay.');
  };

  const updateProfile = (data: Partial<Profile>) => {
    if (!currentProfile || !currentUser) return;
    const updated = { ...currentProfile, ...data };
    setCurrentProfile(updated);

    saveAccountToRegistry({
      email: currentUser.email,
      profile: updated,
    });

    showToast('Đã lưu thông tin hồ sơ.');
  };

  // Upgrade Premium
  const upgradePremium = (tier: '1_month' | '3_months' | '6_months' | '12_months') => {
    if (!currentUser) return;
    setCurrentUser((prev) =>
      prev
        ? {
            ...prev,
            isPremium: true,
            premiumTier: tier,
            superLikesRemaining: 99,
            rewindRemaining: 99,
          }
        : null
    );
    setIsPremiumModalOpen(false);
    showToast('✨ Chúc mừng! Bạn đã nâng cấp CupidGo VIP thành công!');
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#FFD700', '#FFA500', '#FF4458'],
      });
    } catch {}
  };

  // Reset demo
  const resetAllData = () => {
    localStorage.clear();
    setSwipes([]);
    setMatches([]);
    setMessages({});
    setBlockedIds([]);
    setFilters(DEFAULT_FILTERS);
    setSwipeHistory([]);
    setAllManagedProfiles(INITIAL_MOCK_PROFILES);
    login('demo@cupidgo.vn', true);
    showToast('Đã đặt lại dữ liệu ứng dụng về mặc định.');
  };

  return (
    <DatingContext.Provider
      value={{
        currentUser,
        currentProfile,
        activeTab,
        setActiveTab,
        activeChatMatchId,
        setActiveChatMatchId,
        isAdminMode,
        setIsAdminMode,
        adminAuthenticated,
        setAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        loginHistory,
        recordLoginHistory,
        clearLoginHistory,
        isMyLoginHistoryModalOpen,
        setIsMyLoginHistoryModalOpen,
        allManagedProfiles,
        toggleVerifyUser,
        toggleBanUser,
        reportsList,
        resolveReport,
        addNewProfile,
        updateUserVipStatus,
        adminStats,
        candidateProfiles,
        currentCandidate,
        swipes,
        swipe,
        rewindLastSwipe,
        canRewind,
        matches,
        messages,
        sendMessage,
        activeMatchModal,
        closeMatchModal,
        likedMeProfiles,
        detailProfileModal,
        setDetailProfileModal,
        isFilterModalOpen,
        setIsFilterModalOpen,
        isPremiumModalOpen,
        setIsPremiumModalOpen,
        isEditProfileModalOpen,
        setIsEditProfileModalOpen,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isDownloadModalOpen,
        setIsDownloadModalOpen,
        blockReportModal,
        setBlockReportModal,
        activateBoost,
        isBoostActive,
        boostTimeRemaining,
        upgradePremium,
        filters,
        updateFilters,
        login,
        register,
        logout,
        completeOnboarding,
        updateProfile,
        blockUser,
        reportUser,
        resetAllData,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </DatingContext.Provider>
  );
};

export const useDating = () => {
  const context = useContext(DatingContext);
  if (!context) throw new Error('useDating must be used within DatingProvider');
  return context;
};
