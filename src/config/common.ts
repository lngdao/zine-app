import { dayjs } from '@/libs/date';
import { screenHeight } from '@/shared/theme';
import { Platform, PlatformIOSStatic } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const APP_NAME = 'ZINE';
export const APP_VER = '1.1.0';
export const APP_BUILD = '1';
export const APP_DIST = 'public';

export const BOOKMARD_DEFAULT_ID = 'bookmark-default';
export const BOOKMARD_DEFAULT_NAME = 'Tất cả phim';

export const isIphoneX = DeviceInfo.hasNotch() || DeviceInfo.hasDynamicIsland();
export const isIpad = () => {
  if (Platform.OS === 'ios') {
    const platformIOS = Platform as PlatformIOSStatic;

    return platformIOS.isPad;
  }

  return false;
};
export const isAndroid = () => Platform.OS === 'android';

export const TAB_BAR_HEIGHT =
  Platform.OS === 'ios' ? (isIphoneX || isIpad() ? 80 : 60) : 60;
export const BOTTOM_INSET = 20;

const SkeletonCommonProps = {
  colorMode: 'dark',
  colors: ['#171717', '#2c2c2c', '#262626'],
} as const;

enum MovieCategoryKey {
  Format = '1',
  Genre = '2',
  Year = '3',
  Country = '4',
}

export const movieFormat = {
  tvshow: {
    slug: 'tv-shows',
    name: 'TV Shows',
  },
  single: {
    slug: 'phim-le',
    name: 'Phim lẻ',
  },
  series: { slug: 'phim-bo', name: 'Phim bộ' },
  anime: { slug: 'hoat-hinh', name: 'Phim hoạt hình' },
  vietsub: { slug: 'phim-vietsub', name: 'Phim Việt-Sub' },
  explanatory: { slug: 'phim-thuyet-minh', name: 'Phim thuyết minh' },
};

export const movieYear = {
  ...Array.from(
    { length: dayjs().year() - 1970 + 1 },
    (_, i) => 1970 + i,
  ).reduce((acc: Record<string, { slug: string; name: string }>, year) => {
    acc[year] = {
      slug: `${year}`,
      name: `Phim năm ${year}`,
    };
    return acc;
  }, {}),
};

export const movieGenres = {
  action: { slug: 'hanh-dong', name: 'Phim hành động' },
  ancient: { slug: 'co-trang', name: 'Phim cổ trang' },
  war: { slug: 'chien-tranh', name: 'Phim chiến tranh' },
  sciFi: { slug: 'vien-tuong', name: 'Phim viễn tưởng' },
  horror: { slug: 'kinh-di', name: 'Phim kinh dị' },
  documentary: { slug: 'tai-lieu', name: 'Phim tài liệu' },
  mystery: { slug: 'bi-an', name: 'Phim bí ẩn' },
  adult: { slug: 'phim-18', name: 'Phim 18+' },
  romance: { slug: 'tinh-cam', name: 'Phim tình cảm' },
  psychology: { slug: 'tam-ly', name: 'Phim tâm lý' },
  sports: { slug: 'the-thao', name: 'Phim thể thao' },
  adventure: { slug: 'phieu-luu', name: 'Phim phiêu lưu' },
  music: { slug: 'am-nhac', name: 'Phim âm nhạc' },
  family: { slug: 'gia-dinh', name: 'Phim gia đình' },
  school: { slug: 'hoc-duong', name: 'Phim học đường' },
  // comedy: { slug: 'hai-huoc', name: 'Phim hài hước' },
  criminal: { slug: 'hinh-su', name: 'Phim hình sự' },
  martialArts: { slug: 'vo-thuat', name: 'Phim võ thuật' },
  science: { slug: 'khoa-hoc', name: 'Phim khoa học' },
  mythology: { slug: 'than-thoai', name: 'Phim thần thoại' },
  drama: { slug: 'chinh-kich', name: 'Phim chính kịch' },
  classic: { slug: 'kinh-dien', name: 'Phim kinh điển' },
};

export const movieCountries = {
  china: { slug: 'trung-quoc', name: 'Phim Trung Quốc' },
  thailand: { slug: 'thai-lan', name: 'Phim Thái Lan' },
  hongKong: { slug: 'hong-kong', name: 'Phim Hồng Kông' },
  france: { slug: 'phap', name: 'Phim Pháp' },
  germany: { slug: 'duc', name: 'Phim Đức' },
  netherlands: { slug: 'ha-lan', name: 'Phim Hà Lan' },
  mexico: { slug: 'mexico', name: 'Phim Mexico' },
  sweden: { slug: 'thuy-dien', name: 'Phim Thụy Điển' },
  philippines: { slug: 'philippines', name: 'Phim Philippines' },
  denmark: { slug: 'dan-mach', name: 'Phim Đan Mạch' },
  switzerland: { slug: 'thuy-si', name: 'Phim Thụy Sĩ' },
  ukraine: { slug: 'ukraina', name: 'Phim Ukraina' },
  southKorea: { slug: 'han-quoc', name: 'Phim Hàn Quốc' },
  usEurope: { slug: 'au-my', name: 'Phim Âu Mỹ' },
  india: { slug: 'an-do', name: 'Phim Ấn Độ' },
  canada: { slug: 'canada', name: 'Phim Canada' },
  spain: { slug: 'tay-ban-nha', name: 'Phim Tây Ban Nha' },
  indonesia: { slug: 'indonesia', name: 'Phim Indonesia' },
  poland: { slug: 'ba-lan', name: 'Phim Ba Lan' },
  malaysia: { slug: 'malaysia', name: 'Phim Malaysia' },
  portugal: { slug: 'bo-dao-nha', name: 'Phim Bồ Đào Nha' },
  uae: { slug: 'uae', name: 'Phim UAE' },
  africa: { slug: 'chau-phi', name: 'Phim Châu Phi' },
  saudiArabia: { slug: 'a-rap-xe-ut', name: 'Phim Ả Rập Xê Út' },
  japan: { slug: 'nhat-ban', name: 'Phim Nhật Bản' },
  taiwan: { slug: 'dai-loan', name: 'Phim Đài Loan' },
  uk: { slug: 'anh', name: 'Phim Anh' },
  turkey: { slug: 'tho-nhi-ky', name: 'Phim Thổ Nhĩ Kỳ' },
  russia: { slug: 'nga', name: 'Phim Nga' },
  australia: { slug: 'uc', name: 'Phim Úc' },
  brazil: { slug: 'brazil', name: 'Phim Brazil' },
  italy: { slug: 'y', name: 'Phim Ý' },
  norway: { slug: 'na-uy', name: 'Phim Na Uy' },
  southAfrica: { slug: 'nam-phi', name: 'Phim Nam Phi' },
  vietnam: { slug: 'viet-nam', name: 'Phim Việt Nam' },
  other: { slug: 'quoc-gia-khac', name: 'Phim Quốc gia khác' },
};

export const IMG_HEADER_HEIGHT = screenHeight * 2.2;

export { SkeletonCommonProps, MovieCategoryKey };
