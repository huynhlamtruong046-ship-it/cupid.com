import React, { useState } from 'react';
import { Camera, MapPin, Sparkles, Check, ArrowRight, ArrowLeft, Image as ImageIcon, Heart } from 'lucide-react';
import { useDating } from '../../context/DatingContext';
import { AVAILABLE_INTERESTS, LOOKING_FOR_OPTIONS } from '../../data/mockProfiles';
import { Gender, TargetGender } from '../../types';

export const OnboardingScreen: React.FC = () => {
  const { completeOnboarding, showToast } = useDating();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [photos, setPhotos] = useState<string[]>([
    '/src/assets/images/cupid_minh_portrait_1791186060876.jpg',
  ]);
  const [displayName, setDisplayName] = useState('');
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [gender, setGender] = useState<Gender>('MALE');
  const [targetGender, setTargetGender] = useState<TargetGender>('FEMALE');
  const [locationName, setLocationName] = useState('TP. Hồ Chí Minh');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Cà phê',
    'Du lịch',
    'Âm nhạc',
  ]);
  const [lookingFor, setLookingFor] = useState<string>(LOOKING_FOR_OPTIONS[0]);

  // Pre-curated photo choices for quick selection
  const avatarChoices = [
    '/src/assets/images/cupid_minh_portrait_1791186060876.jpg',
    '/src/assets/images/cupid_linh_portrait_1791186047763.jpg',
    '/src/assets/images/cupid_ha_portrait_1791186074150.jpg',
    '/src/assets/images/cupid_tuan_portrait_1791186089711.jpg',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  ];

  const handleToggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      if (selectedInterests.length >= 6) {
        showToast('Bạn chỉ nên chọn tối đa 6 sở thích nổi bật nhất');
        return;
      }
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleAddPhoto = (url: string) => {
    if (photos.includes(url)) {
      if (photos.length === 1) {
        showToast('Cần ít nhất 1 ảnh đại diện');
        return;
      }
      setPhotos(photos.filter((p) => p !== url));
    } else {
      if (photos.length >= 6) {
        showToast('Tối đa 6 ảnh trong bộ sưu tập');
        return;
      }
      setPhotos([...photos, url]);
    }
  };

  const calculateAge = (dateStr: string) => {
    const birth = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return Math.max(18, age);
  };

  const handleNext = () => {
    if (step === 1) {
      if (photos.length === 0) {
        showToast('Vui lòng chọn ít nhất 1 ảnh đại diện');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!displayName.trim()) {
        showToast('Vui lòng nhập họ và tên của bạn');
        return;
      }
      const age = calculateAge(birthDate);
      if (age < 18) {
        showToast('Bạn phải từ đủ 18 tuổi để tham gia');
        return;
      }
      setStep(3);
    } else {
      if (selectedInterests.length < 2) {
        showToast('Vui lòng chọn ít nhất 2 sở thích');
        return;
      }

      // Finish Onboarding
      completeOnboarding({
        displayName,
        gender,
        birthDate,
        age: calculateAge(birthDate),
        bio: bio.trim() || 'Rất vui được kết nối cùng bạn!',
        photos,
        locationName,
        targetGender,
        interests: selectedInterests,
        lookingFor,
        jobTitle: jobTitle.trim() || undefined,
        company: company.trim() || undefined,
        compatibilityRate: 95,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-full justify-between p-6 bg-neutral-950 text-neutral-100 overflow-y-auto">
      {/* Progress Bar Header */}
      <div>
        <div className="flex items-center justify-between pb-3">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as any)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-5" />
          )}
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Bước {step} / 3
          </span>
          <div className="w-5" />
        </div>

        {/* Step indicator bar */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className={`h-1.5 rounded-full ${step >= 1 ? 'bg-rose-500' : 'bg-neutral-800'}`} />
          <div className={`h-1.5 rounded-full ${step >= 2 ? 'bg-rose-500' : 'bg-neutral-800'}`} />
          <div className={`h-1.5 rounded-full ${step >= 3 ? 'bg-rose-500' : 'bg-neutral-800'}`} />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 py-2">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-neutral-100">Chọn ảnh đại diện của bạn</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Ảnh đại diện rõ mặt và tự nhiên sẽ giúp bạn nhận được nhiều lượt Match hơn tới 70%.
              </p>
            </div>

            {/* Selected Photos Slots */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              {[0, 1, 2, 3, 4, 5].map((index) => {
                const photo = photos[index];
                return (
                  <div
                    key={index}
                    className="relative aspect-[3/4] rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center group"
                  >
                    {photo ? (
                      <>
                        <img
                          src={photo}
                          alt={`Ảnh ${index + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          onClick={() => handleAddPhoto(photo)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center backdrop-blur-sm opacity-90 hover:opacity-100"
                        >
                          ✕
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-rose-500 text-[10px] font-bold text-white rounded">
                            Ảnh chính
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="text-center p-2 text-neutral-600">
                        <Camera className="w-5 h-5 mx-auto mb-1 text-neutral-600" />
                        <span className="text-[10px] block">Thêm ảnh</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick avatar choices */}
            <div className="pt-3">
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                Hoặc chọn nhanh từ thư viện chân dung mẫu:
              </label>
              <div className="grid grid-cols-6 gap-2">
                {avatarChoices.map((url, idx) => {
                  const isSelected = photos.includes(url);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddPhoto(url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        isSelected ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-neutral-800 hover:border-neutral-600'
                      }`}
                    >
                      <img src={url} alt="Mẫu" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-rose-500/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-neutral-100">Thông tin cơ bản</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Hãy cho mọi người biết về bạn và những điều bạn tự hào nhất.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Họ và tên hiển thị *
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Long, Bảo Trâm..."
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Ngày sinh *
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max="2008-01-01"
                    className="w-full px-3 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-neutral-100 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Giới tính của bạn
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full px-3 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-neutral-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Khu vực / Tọa độ GPS
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Quận 1, TP. Hồ Chí Minh..."
                    className="w-full pl-10 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-neutral-100 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Nghề nghiệp & Nơi làm việc
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Vị trí (Design, Dev...)"
                    className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-neutral-100 focus:outline-none focus:border-rose-500"
                  />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Công ty / Trường học"
                    className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-neutral-100 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Đôi lời giới thiệu (Bio)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  placeholder="Chia sẻ ngắn về tính cách, gu âm nhạc hoặc điều bạn tìm kiếm..."
                  className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-neutral-100">Sở thích & Mục tiêu</h2>
              <p className="text-xs text-neutral-400 mt-1">
                CupidGo sử dụng sở thích và mục tiêu này để tính toán tỷ lệ tương thích (%) chính xác nhất cho bạn.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                Mục tiêu hẹn hò của bạn:
              </label>
              <div className="space-y-2">
                {LOOKING_FOR_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setLookingFor(opt)}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                      lookingFor === opt
                        ? 'border-rose-500 bg-rose-500/10 text-rose-300'
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <span>{opt}</span>
                    {lookingFor === opt && <Check className="w-4 h-4 text-rose-500" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-neutral-300">
                  Sở thích (Chọn 2 - 6 mục):
                </label>
                <span className="text-xs text-rose-400 font-medium">
                  {selectedInterests.length}/6 đã chọn
                </span>
              </div>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                {AVAILABLE_INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleToggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action CTA */}
      <div className="pt-4">
        <button
          onClick={handleNext}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-rose-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {step === 3 ? (
            <>
              <Sparkles className="w-4 h-4" />
              Hoàn tất & Bắt đầu khám phá
            </>
          ) : (
            <>
              Tiếp tục
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
