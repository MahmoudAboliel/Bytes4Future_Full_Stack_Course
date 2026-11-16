/**
 * نظام اللغة — يدعم العربية والإنجليزية مع حفظ الاختيار.
 * يوفّر: اللغة الحالية، اتجاه الكتابة، دالة الترجمة t()، وتنسيق التواريخ.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { I18nManager, Platform } from 'react-native';

import { TmdbError } from '@/api/tmdb';

export type Lang = 'ar' | 'en';

const STORAGE_KEY = '@cinema_app_lang';

// ---------------------------------------------------------------------------
// نصوص الواجهة
// ---------------------------------------------------------------------------

const en = {
  // التبويبات والعناوين
  moviesTab: 'Movies',
  actorsTab: 'Actors',
  searchMoviesPlaceholder: 'Search for a movie…',
  searchActorsPlaceholder: 'Search for an actor…',

  // الفلاتر
  allGenres: 'All',
  sortBy: 'Sort by',
  minRatingLabel: 'Rating',
  yearLabel: 'Year',
  sortPopular: 'Most popular',
  sortTopRated: 'Top rated',
  sortNewest: 'Newest',
  sortOldest: 'Oldest',
  sortTitle: 'Title (A–Z)',
  ratingAny: 'Any rating',
  yearAny: 'Any year',

  // الحالات
  loading: 'Loading…',
  noResults: 'No results found',
  noResultsHint: 'Try a different search term or filters',
  noOverview: 'No overview available.',
  networkError: "Couldn't connect to the internet",
  missingApiKey: 'TMDB API key is not configured',
  errorGeneric: 'Something went wrong',
  tryAgain: 'Try again',

  // تفاصيل الفيلم
  overview: 'Overview',
  cast: 'Cast',
  noCast: 'No cast information available',
  director: 'Director',
  originalTitle: 'Original title',
  runtime: '{h}h {m}m',
  movieHeader: 'Movie',

  // تفاصيل الممثل
  filmography: 'Filmography',
  noFilmography: 'No movies found',
  biography: 'Biography',
  noBiography: 'No biography available',
  readMore: 'Read more',
  readLess: 'Read less',
  birthday: 'Birthday',
  placeOfBirth: 'Place of birth',
  ageYears: '{n} years',
  personHeader: 'Person',

  // الأقسام الوظيفية
  deptActing: 'Acting',
  deptDirecting: 'Directing',
  deptWriting: 'Writing',
  deptProducing: 'Producing',
  deptCamera: 'Camera',
  deptEditing: 'Editing',
  deptArt: 'Art',
  deptSound: 'Sound',
  deptCostume: 'Costume & Makeup',
  deptVisualEffects: 'Visual Effects',
  deptCrew: 'Crew',
  deptLighting: 'Lighting',
  deptAnimation: 'Animation',
} as const;

export type StringKey = keyof typeof en;

const ar: Record<StringKey, string> = {
  // التبويبات والعناوين
  moviesTab: 'الأفلام',
  actorsTab: 'الممثلون',
  searchMoviesPlaceholder: 'ابحث عن فيلم…',
  searchActorsPlaceholder: 'ابحث عن ممثل…',

  // الفلاتر
  allGenres: 'الكل',
  sortBy: 'الترتيب',
  minRatingLabel: 'التقييم',
  yearLabel: 'السنة',
  sortPopular: 'الأكثر شعبية',
  sortTopRated: 'الأعلى تقييماً',
  sortNewest: 'الأحدث',
  sortOldest: 'الأقدم',
  sortTitle: 'أبجدي (أ–ي)',
  ratingAny: 'أي تقييم',
  yearAny: 'كل السنوات',

  // الحالات
  loading: 'جارٍ التحميل…',
  noResults: 'لا توجد نتائج',
  noResultsHint: 'جرّب تغيير كلمة البحث أو الفلاتر',
  noOverview: 'لا يتوفر ملخص لهذا الفيلم.',
  networkError: 'تعذر الاتصال بالإنترنت',
  missingApiKey: 'مفتاح TMDB API غير مضبوط',
  errorGeneric: 'حدث خطأ ما',
  tryAgain: 'إعادة المحاولة',

  // تفاصيل الفيلم
  overview: 'القصة',
  cast: 'طاقم التمثيل',
  noCast: 'لا تتوفر بيانات طاقم التمثيل',
  director: 'المخرج',
  originalTitle: 'العنوان الأصلي',
  runtime: '{h}س {m}د',
  movieHeader: 'الفيلم',

  // تفاصيل الممثل
  filmography: 'الأفلام التي شارك بها',
  noFilmography: 'لم يشارك في أي فيلم',
  biography: 'السيرة الذاتية',
  noBiography: 'لا تتوفر سيرة ذاتية',
  readMore: 'عرض المزيد',
  readLess: 'عرض أقل',
  birthday: 'تاريخ الميلاد',
  placeOfBirth: 'مكان الميلاد',
  ageYears: '{n} سنة',
  personHeader: 'الممثل',

  // الأقسام الوظيفية
  deptActing: 'التمثيل',
  deptDirecting: 'الإخراج',
  deptWriting: 'الكتابة',
  deptProducing: 'الإنتاج',
  deptCamera: 'التصوير',
  deptEditing: 'المونتاج',
  deptArt: 'الفنون البصرية',
  deptSound: 'الصوت',
  deptCostume: 'الأزياء والمكياج',
  deptVisualEffects: 'المؤثرات البصرية',
  deptCrew: 'طاقم العمل',
  deptLighting: 'الإضاءة',
  deptAnimation: 'الرسوم المتحركة',
};

const dictionaries: Record<Lang, Record<StringKey, string>> = { en, ar };

// ---------------------------------------------------------------------------
// التواريخ
// ---------------------------------------------------------------------------

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

/** يحوّل تاريخ بصيغة YYYY-MM-DD إلى نص حسب اللغة */
export function formatDate(iso: string | null | undefined, lang: Lang): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  if (lang === 'ar') return `${d} ${MONTHS_AR[m - 1]} ${y}`;
  return `${MONTHS_EN[m - 1]} ${d}, ${y}`;
}

/** عمر الشخص بالسنوات من تاريخ الميلاد */
export function ageFromBirthday(birthday: string | null | undefined): number | null {
  if (!birthday) return null;
  const time = new Date(birthday).getTime();
  if (Number.isNaN(time)) return null;
  return Math.max(0, Math.floor((Date.now() - time) / (365.25 * 24 * 60 * 60 * 1000)));
}

// ---------------------------------------------------------------------------
// السياق
// ---------------------------------------------------------------------------

type I18nValue = {
  lang: Lang;
  isRTL: boolean;
  t: (key: StringKey, params?: Record<string, string | number>) => string;
  setLang: (lang: Lang) => void;
};

const I18nContext = createContext<I18nValue | null>(null);

/**
 * القيمة الابتدائية للغة (تُحسب مزامنة):
 * - على الويب: نقرأ التخزين المحلي مباشرة ثم نكشف لغة المتصفح — بدون SSR فلا يوجد خطر hydration.
 * - على الأجهزة: لغة النظام، ويُقرأ التخزين المحفوظ بعد الإقلاع في الأثر أدناه.
 */
function detectInitialLang(): Lang {
  if (Platform.OS === 'web') {
    try {
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (saved === 'ar' || saved === 'en') return saved;
    } catch {
      // localStorage قد يكون محظوراً — نتجاهل ونستخدم الكشف
    }
    if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('ar')) {
      return 'ar';
    }
    return 'en';
  }
  return I18nManager.isRTL ? 'ar' : 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitialLang);

  useEffect(() => {
    if (Platform.OS === 'web') return; // عولجت مزامنة أعلاه
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (alive && (saved === 'ar' || saved === 'en')) setLangState(saved);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const t = useCallback(
    (key: StringKey, params?: Record<string, string | number>) => {
      const text = dictionaries[lang][key] ?? dictionaries.en[key] ?? key;
      if (!params) return text;
      return text.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in params ? String(params[name]) : match,
      );
    },
    [lang],
  );

  const value = useMemo<I18nValue>(
    () => ({ lang, isRTL: lang === 'ar', t, setLang }),
    [lang, t, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  // قيمة افتراضية عند غياب السياق (مثل إعادة التحميل السريع HMR في التطوير)
  return (
    useContext(I18nContext) ?? {
      lang: 'en',
      isRTL: false,
      t: (key) => dictionaries.en[key],
      setLang: () => {},
    }
  );
}

/** يحوّل خطأ الـ API إلى نص مناسب للعرض */
export function localizeError(error: unknown, t: I18nValue['t']): string {
  if (error instanceof TmdbError) {
    if (error.kind === 'network') return t('networkError');
    if (error.kind === 'missingKey') return t('missingApiKey');
    return error.message || t('errorGeneric');
  }
  return t('errorGeneric');
}

const DEPARTMENT_KEYS: Record<string, StringKey> = {
  Acting: 'deptActing',
  Directing: 'deptDirecting',
  Writing: 'deptWriting',
  Producing: 'deptProducing',
  Camera: 'deptCamera',
  Editing: 'deptEditing',
  Art: 'deptArt',
  Sound: 'deptSound',
  'Costume & Makeup': 'deptCostume',
  'Visual Effects': 'deptVisualEffects',
  Crew: 'deptCrew',
  Lighting: 'deptLighting',
  Animation: 'deptAnimation',
};

/** يترجم القسم الوظيفي للممثل (Known for department) إلى نص حسب اللغة */
export function departmentLabel(department: string | null | undefined, t: I18nValue['t']): string {
  if (!department) return '';
  const key = DEPARTMENT_KEYS[department];
  return key ? t(key) : department;
}
