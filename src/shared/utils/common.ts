import { Linking, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export const isIos = Platform.OS === 'ios';

export function randomInRange(min: number, max: number, isInteger = true) {
  if (min > max) {
    throw new Error('min must be less than or equal to max');
  }

  const random = Math.random() * (max - min) + min;

  return isInteger ? Math.floor(random) : random;
}

export const triggerUntilCondition = (
  callback: () => void,
  interval: number,
  checkCondition: () => boolean,
  maxRetries: number = 3,
): (() => void) => {
  if (typeof callback !== 'function') {
    console.error('callback must be a function');
    return () => {};
  }

  if (typeof checkCondition !== 'function') {
    console.error('checkCondition must be a function returning boolean');
    return () => {};
  }

  if (typeof maxRetries !== 'number' || maxRetries <= 0) {
    console.error('maxRetries must be a positive number');
    return () => {};
  }

  let retries = 0;
  const intervalId: NodeJS.Timeout | null = setInterval(() => {
    if (checkCondition()) {
      if (intervalId) clearInterval(intervalId);
      return;
    }

    if (retries >= maxRetries) {
      if (intervalId) clearInterval(intervalId);
      return;
    }

    callback();
    retries++;
  }, interval);

  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
};

export function shuffle<T>(arr: Array<T>): Array<T> {
  return arr
    .map((val) => ({ id: Math.random(), value: val }))
    .sort((a, b) => a.id - b.id)
    .map((val) => val.value);
}

export function decodeHtmlEntities(text: string) {
  const entities: { [key: string]: string } = {
    '&#039;': "'",
    '&#39;': "'",
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&nbsp;': ' ',
  };

  text = text.replace(
    /&#039;|&#39;|&quot;|&amp;|&lt;|&gt;|&nbsp;/g,
    (match) => entities[match],
  );

  text = text.replace(/<\/?[^>]+(>|$)/g, '');
  text = text.replace(/\.([^\s])/g, '. $1');
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

export const formatTime = (seconds: number) => {
  const totalSeconds = Math.max(0, Math.floor(seconds));

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(secs).padStart(2, '0');

  return hours > 0
    ? `${hours}:${formattedMinutes}:${formattedSeconds}`
    : `${formattedMinutes}:${formattedSeconds}`;
};

export function removeVietnameseTones(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export function isValidURL(text: string) {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' +
      '((([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,})|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?' +
      '(\\/[-a-zA-Z0-9@:%._+~#=]*)*' +
      '(\\?[;&a-zA-Z0-9@:%_+~#=-]*)?' +
      '(\\#[-a-zA-Z0-9@:%_+~#=]*)?$',
    'i',
  );
  return urlPattern.test(text);
}

export function getGenreSlug(genre: string) {
  if (genre == 'Hài') return 'phim-hai';
  if (genre == 'Phim 18+') return 'phim-18';

  return genre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

export function parseCategoryData(categoryData: object) {
  const createSlug = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/đ/g, 'd')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();

  const parsedData: Record<string, { value: string; slug: string }[]> = {};

  Object.entries(categoryData).forEach(([key, value]) => {
    if (value?.list) {
      parsedData[key] = value.list.map(
        (item: { id: string; name: string }) => ({
          value: item.name,
          slug: isNaN(Number(item.name)) ? createSlug(item.name) : item.name,
        }),
      );
    }
  });

  return parsedData;
}

export function rgba(hexColor: string, alpha: number = 1): string {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexRegex.test(hexColor)) {
    throw new Error('Invalid hex color format');
  }

  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function transformString(
  input: string,
  transformType: 'uppercase' | 'lowercase' | 'capitalize',
): string {
  switch (transformType) {
    case 'uppercase':
      return input.toUpperCase();
    case 'lowercase':
      return input.toLowerCase();
    /*
     * Convert from:
     * https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Text/RCTTextAttributes.mm
     */
    case 'capitalize':
      const words = input.split(' ');
      const newWords = [];
      const num = new RegExp(/^\d+$/);
      for (const item of words) {
        let word;
        if (item.length > 0 && !num.test(item.charAt(0))) {
          word = item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
        } else {
          word = item.toLowerCase();
        }
        newWords.push(word);
      }
      return newWords.join(' ');
    default:
      return input;
  }
}

export function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url));
}

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function initNetInfoConfiguration() {
  NetInfo.configure({
    reachabilityUrl: 'https://clients3.google.com/generate_204',
    reachabilityLongTimeout: 2000,
    reachabilityShortTimeout: 1000,
    reachabilityRequestTimeout: 1500,
    useNativeReachability: false,
  });
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint, @typescript-eslint/no-explicit-any
export function mergeRefs<T extends any>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>,
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}
