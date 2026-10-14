import { Profile } from '../types';

export const INITIAL_MOCK_PROFILES: Profile[] = [
  {
    userId: 'user_linh_01',
    displayName: 'Thảo Linh',
    gender: 'FEMALE',
    birthDate: '2001-04-12',
    age: 24,
    bio: 'UI/UX Designer tại Cầu Giấy 🌿 Yêu những buổi chiều cà phê ngắm phố mưa Hà Nội, mê nhạc indie & mèo béo. Đang tìm một người cùng chia sẻ playlist và cùng khám phá những quán ăn ẩn mình.',
    photos: [
      '/src/assets/images/cupid_linh_portrait_1791186047763.jpg',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    ],
    locationName: 'Hà Nội',
    latitude: 21.0285,
    longitude: 105.8542,
    distanceKm: 3.2,
    targetGender: 'MALE',
    minAgePref: 22,
    maxAgePref: 32,
    maxDistancePref: 25,
    interests: ['Cà phê', 'Thiết kế', 'Indie pop', 'Nhiếp ảnh', 'Nuôi mèo', 'Board game'],
    lookingFor: 'Người yêu lâu dài',
    jobTitle: 'Senior UI/UX Designer',
    company: 'Tech Studio Hanoi',
    education: 'ĐH Mỹ thuật Công nghiệp',
    zodiac: 'Bạch Dương',
    heightCm: 163,
    lifestyle: {
      drinking: 'Thỉnh thoảng uống cocktail',
      smoking: 'Không hút thuốc',
      exercise: 'Yoga 3 buổi/tuần',
      pets: 'Nuôi 2 chú mèo mướp',
    },
    compatibilityRate: 96,
    compatibilityDetails: {
      music: 98,
      lifestyle: 94,
      values: 96,
    },
    prompts: [
      {
        question: 'Chủ nhật lý tưởng của mình là...',
        answer: 'Thức dậy muộn không báo thức, dạo quanh Hồ Tây, nhâm nhi một ly cold brew và đọc nốt cuốn sách còn dở.'
      },
      {
        question: 'Điểm cộng lớn nhất ở một người là...',
        answer: 'Biết lắng nghe, có mắt thẩm mỹ và yêu động vật.'
      }
    ],
    hasLikedCurrentUser: true, // Will match immediately if current user likes!
    isVerified: true,
  },
  {
    userId: 'user_minh_02',
    displayName: 'Minh Quân',
    gender: 'MALE',
    birthDate: '1998-08-19',
    age: 27,
    bio: 'Software Engineer & thích thể thao ngoài trời 🏃‍♂️ Cuối tuần thường chạy bộ ven sông hoặc cắm trại ngoại ô. Nấu ăn khá ổn, hy vọng tìm được bạn đồng hành chia sẻ những điều giản dị.',
    photos: [
      '/src/assets/images/cupid_minh_portrait_1791186060876.jpg',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    ],
    locationName: 'TP. Hồ Chí Minh',
    latitude: 10.7769,
    longitude: 106.7009,
    distanceKm: 5.8,
    targetGender: 'FEMALE',
    minAgePref: 20,
    maxAgePref: 28,
    maxDistancePref: 30,
    interests: ['Chạy bộ', 'Công nghệ', 'Cắm trại', 'Nấu ăn', 'Podcast', 'Du lịch bụi'],
    lookingFor: 'Hẹn hò tìm hiểu',
    jobTitle: 'Tech Lead',
    company: 'Fintech Startup Sài Gòn',
    education: 'ĐH Bách Khoa TP.HCM',
    zodiac: 'Sư Tử',
    heightCm: 178,
    lifestyle: {
      drinking: 'Uống xã giao',
      smoking: 'Không hút thuốc',
      exercise: 'Chạy bộ 4 buổi/tuần',
      pets: 'Yêu cún Golden',
    },
    compatibilityRate: 92,
    compatibilityDetails: {
      music: 88,
      lifestyle: 95,
      values: 93,
    },
    prompts: [
      {
        question: 'Tài lẻ không ngờ của mình là...',
        answer: 'Nấu món bò kho gia truyền cực ngon và sửa chữa mọi thiết bị điện trong nhà!'
      }
    ],
    hasLikedCurrentUser: true,
    isVerified: true,
  },
  {
    userId: 'user_ha_03',
    displayName: 'Ngọc Hà',
    gender: 'FEMALE',
    birthDate: '2002-11-05',
    age: 23,
    bio: 'Art Curator & Content Creator 🎨 Thích lượn lờ triển lãm nghệ thuật, săn đồ vintage và nghe đĩa than. Tìm một tâm hồn đồng điệu để cùng đi xem hòa nhạc hoặc ngồi ngắm hoàng hôn.',
    photos: [
      '/src/assets/images/cupid_ha_portrait_1791186074150.jpg',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    ],
    locationName: 'Quận 1, TP. Hồ Chí Minh',
    latitude: 10.7756,
    longitude: 106.7019,
    distanceKm: 2.1,
    targetGender: 'MALE',
    minAgePref: 23,
    maxAgePref: 33,
    maxDistancePref: 15,
    interests: ['Bảo tàng', 'Thời trang', 'Đĩa than', 'Cocktail', 'Điện ảnh', 'Du lịch'],
    lookingFor: 'Người yêu lâu dài',
    jobTitle: 'Creative Director',
    company: 'Design & Media Agency',
    education: 'ĐH Kiến Trúc TP.HCM',
    zodiac: 'Bọ Cạp',
    heightCm: 165,
    lifestyle: {
      drinking: 'Gu rượu vang & craft beer',
      smoking: 'Không bao giờ',
      exercise: 'Pilates',
      pets: 'Nuôi một bé mèo Anh lông ngắn',
    },
    compatibilityRate: 95,
    compatibilityDetails: {
      music: 99,
      lifestyle: 91,
      values: 95,
    },
    prompts: [
      {
        question: 'Cách nhanh nhất để lấy lòng mình là...',
        answer: 'Rủ đi một triển lãm mới mở rồi cùng ngồi uống trà thảo mộc bàn luận về nghệ thuật.'
      }
    ],
    hasLikedCurrentUser: true,
    isVerified: true,
  },
  {
    userId: 'user_tuan_04',
    displayName: 'Tuấn Anh',
    gender: 'MALE',
    birthDate: '1997-02-14',
    age: 28,
    bio: 'Kiến trúc sư & Guitarist nghiệp dư 🎸 Thích không gian mở, ánh sáng tự nhiên và tiếng sóng biển. Sống tích cực, ghét sự giả tạo, thích những cuộc trò chuyện sâu sắc.',
    photos: [
      '/src/assets/images/cupid_tuan_portrait_1791186089711.jpg',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    ],
    locationName: 'Hải Châu, Đà Nẵng',
    latitude: 16.0544,
    longitude: 108.2022,
    distanceKm: 8.4,
    targetGender: 'FEMALE',
    minAgePref: 21,
    maxAgePref: 29,
    maxDistancePref: 50,
    interests: ['Acoustic guitar', 'Kiến trúc', 'Lướt sóng', 'Cà phê specialty', 'Sách triết học'],
    lookingFor: 'Tìm bạn tâm giao',
    jobTitle: 'Senior Architect',
    company: 'Studio Kien Truc Xanh',
    education: 'ĐH Xây Dựng',
    zodiac: 'Bảo Bình',
    heightCm: 182,
    lifestyle: {
      drinking: 'Uống dịp đặc biệt',
      smoking: 'Không',
      exercise: 'Gym & bơi lội',
      pets: 'Yêu chó chăn cừu',
    },
    compatibilityRate: 89,
    compatibilityDetails: {
      music: 94,
      lifestyle: 86,
      values: 87,
    },
    prompts: [
      {
        question: 'Kỷ niệm khó quên nhất...',
        answer: 'Tự tay dựng căn nhà gỗ nhỏ ven đồi ở Đà Lạt và đón sương sớm bên tiếng đàn guitar.'
      }
    ],
    hasLikedCurrentUser: false,
    isVerified: true,
  },
  {
    userId: 'user_vy_05',
    displayName: 'Phương Vy',
    gender: 'FEMALE',
    birthDate: '2000-09-30',
    age: 25,
    bio: 'Bác sĩ thú y 🐾 Yêu thiên nhiên, cây cối và mọi chú cún gặp trên đường. Rảnh rỗi làm gốm và làm bánh ngọt chia cho bạn bè. Tìm người chân thành, tử tế.',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    ],
    locationName: 'Hà Nội',
    latitude: 21.0333,
    longitude: 105.8500,
    distanceKm: 4.5,
    targetGender: 'MALE',
    minAgePref: 24,
    maxAgePref: 34,
    maxDistancePref: 20,
    interests: ['Động vật', 'Làm gốm', 'Làm bánh', 'Cắm hoa', 'Đi dạo', 'Nhạc acoustic'],
    lookingFor: 'Người yêu lâu dài',
    jobTitle: 'Bác sĩ Thú Y',
    company: 'Bệnh viện thú y quốc tế',
    education: 'Học viện Nông nghiệp',
    zodiac: 'Thiên Bình',
    heightCm: 160,
    lifestyle: {
      drinking: 'Rất hiếm khi',
      smoking: 'Không bao giờ',
      exercise: 'Đi bộ hàng ngày',
      pets: 'Nuôi 2 bé Corgi & 1 mèo',
    },
    compatibilityRate: 94,
    compatibilityDetails: {
      music: 90,
      lifestyle: 96,
      values: 96,
    },
    prompts: [
      {
        question: 'Điều khiến mình mỉm cười lập tức...',
        answer: 'Nhìn thấy một chú cún chạy lon ton lại chào mình bằng cả trái tim!'
      }
    ],
    hasLikedCurrentUser: true,
    isVerified: true,
  },
  {
    userId: 'user_nam_06',
    displayName: 'Hoàng Nam',
    gender: 'MALE',
    birthDate: '1999-06-25',
    age: 26,
    bio: 'Chủ quán cà phê specialty tại Thảo Điền ☕ Đam mê hương vị arabica nguyên bản, mê nhạc jazz và du lịch xe máy xuyên Việt. Muốn tìm một người cùng thưởng thức những ly cà phê sáng.',
    photos: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80',
    ],
    locationName: 'Thảo Điền, TP. Hồ Chí Minh',
    latitude: 10.8034,
    longitude: 106.7328,
    distanceKm: 6.2,
    targetGender: 'FEMALE',
    minAgePref: 20,
    maxAgePref: 30,
    maxDistancePref: 25,
    interests: ['Cà phê Specialty', 'Jazz', 'Du lịch xe máy', 'Ẩm thực', 'Chụp ảnh film'],
    lookingFor: 'Hẹn hò tìm hiểu',
    jobTitle: 'Founder / Head Barista',
    company: 'The Roastery Studio',
    education: 'ĐH Kinh Tế TP.HCM',
    zodiac: 'Cự Giải',
    heightCm: 176,
    lifestyle: {
      drinking: 'Uống cùng bạn bè',
      smoking: 'Không',
      exercise: 'Bơi lội cuối tuần',
      pets: 'Có nuôi mèo tại quán',
    },
    compatibilityRate: 88,
    compatibilityDetails: {
      music: 92,
      lifestyle: 85,
      values: 87,
    },
    prompts: [
      {
        question: 'Buổi hẹn đầu tiên hoàn hảo theo mình là...',
        answer: 'Mình tự tay pha một ly Pour-over chuẩn vị cho bạn, ngồi nghe đĩa jazz và nói chuyện không cần nhìn điện thoại.'
      }
    ],
    hasLikedCurrentUser: false,
    isVerified: true,
  }
];

export const AVAILABLE_INTERESTS = [
  'Cà phê',
  'Du lịch',
  'Nấu ăn',
  'Âm nhạc',
  'Đọc sách',
  'Gym & Thể thao',
  'Nhiếp ảnh',
  'Phim ảnh',
  'Board game',
  'Nuôi chó mèo',
  'Leo núi / Cắm trại',
  'Thời trang',
  'Bảo tàng & Nghệ thuật',
  'Chạy bộ',
  'Yoga & Thiền',
  'Công nghệ',
  'Làm bánh & Đồ ngọt',
  'Cocktail & Rượu vang',
  'Nhạc Indie & Jazz',
  'Chụp ảnh film'
];

export const LOOKING_FOR_OPTIONS = [
  'Người yêu lâu dài',
  'Hẹn hò tìm hiểu',
  'Tìm bạn tâm giao',
  'Chưa rõ ràng, tùy duyên'
];

export const ICEBREAKER_TEMPLATES = [
  'Chào bạn! Nhìn profile gu thẩm mỹ xịn quá, nhất là gu cafe của bạn ✨',
  'Chào bạn, nếu được đi du lịch bất cứ đâu vào cuối tuần này thì bạn sẽ chọn đi đâu?',
  'Hồ Tây hay phố cổ? Mình thấy trong profile bạn có ghé quán này quen lắm nè!',
  'Chào bạn nha! Điểm chung lớn nhất của 2 đứa là đều mê đồ ăn ngon đúng không? 🍜',
  'Thả thính một chút nè: Cà phê sữa hay bạc xỉu thì ngọt hơn nụ cười của bạn ta?'
];

export const AUTO_REPLIES: Record<string, string[]> = {
  user_linh_01: [
    'Chào bạn nè! Thấy tụi mình match bất ngờ ghê, bạn cũng thích nghe nhạc indie với cà phê ngắm phố hả? 🌸',
    'Haha chuẩn luôn á! Cuối tuần này bạn có định ghé quán cà phê nào quanh Cầu Giấy hoặc Hồ Tây không?',
    'Thế thì tuyệt vời quá! Mình đang có danh sách mấy quán cà phê rooftop view siêu thơ, hôm nào tụi mình cùng đi nhé!'
  ],
  user_minh_02: [
    'Chào em nha! Rất vui được match với em, profile em dễ thương lắm luôn 🏃‍♂️',
    'Anh cũng thích nấu ăn và chạy bộ đó. Em thường hay rảnh vào buổi chiều hay tối cuối tuần hơn?',
    'Hay là cuối tuần này anh mời em một ly cafe nhé, mình có thể ngồi chia sẻ nhiều hơn!'
  ],
  user_ha_03: [
    'Hé lô! Vừa thấy thông báo match là phải vào xem ngay, gu của bạn ấn tượng thật sự 🎨',
    'Bạn cũng thích đi xem triển lãm với nghe đĩa than hả? Tuần này đang có một triển lãm tranh đương đại ở Quận 1 xịn lắm!',
    'Tuyệt! Nếu bạn không phiền thì thứ 7 này mình cùng đi nhé?'
  ],
  user_vy_05: [
    'Chào bạn nha! Cảm ơn vì đã match với mình 🐾 Bạn có nuôi chú cún hay bé mèo nào ở nhà không?',
    'Dễ thương quá đi mất! Mình cực kỳ thích những người yêu động vật chân thành.',
    'Hôm nào rảnh mình mời bạn qua tiệm bánh mình tự làm bánh kem matcha mời bạn nha!'
  ]
};
