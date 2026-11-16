import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  fetchGenres,
  fetchMovies,
  type Genre,
  type MovieListItem,
  type MovieSort,
} from '@/api/tmdb';
import { LanguageSwitch } from '@/components/language-switch';
import { MovieCard } from '@/components/movie-card';
import { OptionSheet, type SheetOption } from '@/components/option-sheet';
import { SearchBar } from '@/components/search-bar';
import { EmptyView, ErrorView, LoadingView } from '@/components/state-views';
import { Colors, Spacing } from '@/constants/theme';
import { localizeError, useI18n, type StringKey } from '@/i18n';

const SORT_OPTIONS: Array<{ value: MovieSort; labelKey: StringKey }> = [
  { value: 'popularity.desc', labelKey: 'sortPopular' },
  { value: 'vote_average.desc', labelKey: 'sortTopRated' },
  { value: 'release_date.desc', labelKey: 'sortNewest' },
  { value: 'release_date.asc', labelKey: 'sortOldest' },
  { value: 'title.asc', labelKey: 'sortTitle' },
];

const RATING_OPTIONS = [0, 6, 7, 8, 9];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS: Array<number | null> = [
  null,
  ...Array.from({ length: CURRENT_YEAR - 1919 }, (_, index) => CURRENT_YEAR - index),
];

const MAX_PAGE = 500;

type Phase = 'loading' | 'ready' | 'error';

export default function MoviesScreen() {
  const { t, lang, isRTL } = useI18n();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const align = isRTL ? 'right' : 'left';

  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [genreId, setGenreId] = useState<number | null>(null);
  const [sort, setSort] = useState<MovieSort>('popularity.desc');
  const [minRating, setMinRating] = useState(0);
  const [year, setYear] = useState<number | null>(null);

  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<MovieListItem[]>([]);
  const [page, setPage] = useState(1);
  const [tick, setTick] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [phase, setPhase] = useState<Phase>('loading');
  const [error, setError] = useState<unknown>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [sheet, setSheet] = useState<'sort' | 'rating' | 'year' | null>(null);

  const seqRef = useRef(0);
  const debouncedRef = useRef('');

  // تأخير البحث — يعيد البحث بعد 400 مللي ثانية من آخر تعديل
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedRef.current !== query) {
        debouncedRef.current = query;
        setDebounced(query);
        setPage(1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  // جلب الأنواع (Genres) عند تغيير اللغة
  useEffect(() => {
    let dead = false;
    fetchGenres(lang)
      .then((res) => {
        if (!dead) setGenres(res.genres);
      })
      .catch(() => {});
    return () => {
      dead = true;
    };
  }, [lang]);

  // جلب الأفلام حسب الفلاتر والصفحة الحالية
  useEffect(() => {
    const seq = ++seqRef.current;
    let dead = false;

    if (page === 1) {
      setPhase('loading');
      setLoadingMore(false);
      setMoreError(null);
    }

    fetchMovies({ page, lang, query: debounced, genreId, sort, minRating, year })
      .then((res) => {
        if (dead || seq !== seqRef.current) return;
        setMovies((prev) => (page === 1 ? res.results : [...prev, ...res.results]));
        setTotalPages(Math.min(res.total_pages, MAX_PAGE));
        setPhase('ready');
        setLoadingMore(false);
        setRefreshing(false);
      })
      .catch((err) => {
        if (dead || seq !== seqRef.current) return;
        if (page === 1) {
          setError(err);
          setPhase('error');
        } else {
          setMoreError(localizeError(err, t));
        }
        setLoadingMore(false);
        setRefreshing(false);
      });

    return () => {
      dead = true;
    };
  }, [page, debounced, genreId, sort, minRating, year, lang, tick, t]);

  const retry = () => setTick((n) => n + 1);

  const loadMore = () => {
    if (phase !== 'ready' || loadingMore || moreError || page >= totalPages) return;
    setLoadingMore(true);
    setPage((p) => p + 1);
  };

  const retryMore = () => {
    setMoreError(null);
    setLoadingMore(true);
    setTick((n) => n + 1);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setTick((n) => n + 1);
  };

  const selectGenre = (id: number | null) => {
    setGenreId(id);
    setPage(1);
  };
  const selectSort = (value: MovieSort) => {
    setSort(value);
    setPage(1);
  };
  const selectRating = (value: number) => {
    setMinRating(value);
    setPage(1);
  };
  const selectYear = (value: number | null) => {
    setYear(value);
    setPage(1);
  };

  const numColumns = width >= 900 ? 4 : width >= 600 ? 3 : 2;
  const contentWidth = Math.min(width, 760);
  const gap = 12;
  const cardWidth = (contentWidth - Spacing.three * 2 - gap * (numColumns - 1)) / numColumns;

  const sortLabel = t(
    SORT_OPTIONS.find((option) => option.value === sort)?.labelKey ?? 'sortPopular',
  );
  const ratingLabel = minRating === 0 ? t('ratingAny') : `${minRating}+`;
  const yearLabel = year === null ? t('yearAny') : String(year);

  const sortSheetOptions: SheetOption<MovieSort>[] = SORT_OPTIONS.map((option) => ({
    value: option.value,
    label: t(option.labelKey),
  }));
  const ratingSheetOptions: SheetOption<number>[] = RATING_OPTIONS.map((value) => ({
    value,
    label: value === 0 ? t('ratingAny') : `${value}+`,
  }));
  const yearSheetOptions: SheetOption<number | null>[] = YEAR_OPTIONS.map((value) => ({
    value,
    label: value === null ? t('yearAny') : String(value),
  }));

  const renderHeader = () => (
    <View style={styles.headerBlock}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder={t('searchMoviesPlaceholder')}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}>
        <Chip label={t('allGenres')} active={genreId === null} onPress={() => selectGenre(null)} />
        {genres.map((genre) => (
          <Chip
            key={genre.id}
            label={genre.name}
            active={genreId === genre.id}
            onPress={() => selectGenre(genre.id)}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}>
        <FilterButton
          icon="swap-vertical"
          label={`${t('sortBy')}: ${sortLabel}`}
          onPress={() => setSheet('sort')}
        />
        <FilterButton
          icon="star-outline"
          label={`${t('minRatingLabel')}: ${ratingLabel}`}
          onPress={() => setSheet('rating')}
        />
        <FilterButton
          icon="calendar-outline"
          label={`${t('yearLabel')}: ${yearLabel}`}
          onPress={() => setSheet('year')}
        />
      </ScrollView>
    </View>
  );

  const renderItem = ({ item }: ListRenderItemInfo<MovieListItem>) => (
    <MovieCard
      movie={item}
      width={cardWidth}
      onPress={() =>
        router.push({ pathname: '/movie/[id]', params: { id: String(item.id) } })
      }
    />
  );

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <ActivityIndicator style={styles.footerSpinner} color={Colors.dark.accent} />
      );
    }
    if (moreError) {
      return (
        <Pressable onPress={retryMore} style={styles.moreError}>
          <Text style={styles.moreErrorText}>{moreError}</Text>
          <Text style={styles.moreRetry}>{t('tryAgain')}</Text>
        </Pressable>
      );
    }
    return <View style={styles.footerSpacer} />;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.page}>
        <View style={[styles.topBar, isRTL && styles.topBarRtl]}>
          <Text style={styles.appTitle}>{t('moviesTab')}</Text>
          <LanguageSwitch />
        </View>

        {phase === 'loading' ? (
          <>
            {renderHeader()}
            <LoadingView />
          </>
        ) : phase === 'error' ? (
          <>
            {renderHeader()}
            <ErrorView message={localizeError(error, t)} onRetry={retry} />
          </>
        ) : (
          <>
            {renderHeader()}
            <FlatList
              key={`columns-${numColumns}`}
              data={movies}
              keyExtractor={(item) => String(item.id)}
              numColumns={numColumns}
              renderItem={renderItem}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={
                <EmptyView message={t('noResults')} hint={t('noResultsHint')} />
              }
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={[
                styles.listContent,
                movies.length === 0 && styles.listContentEmpty,
              ]}
              onEndReached={loadMore}
              onEndReachedThreshold={0.4}
              keyboardShouldPersistTaps="handled"
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={Colors.dark.accent}
                  colors={[Colors.dark.accent]}
                />
              }
            />
          </>
        )}

        {/* تُركَّب قائمة واحدة فقط في كل مرة حتى لا تتراكب أثناء إغلاق القائمة السابقة */}
        {sheet === 'sort' && (
          <OptionSheet
            visible
            title={t('sortBy')}
            options={sortSheetOptions}
            selectedValue={sort}
            onSelect={selectSort}
            onClose={() => setSheet(null)}
          />
        )}
        {sheet === 'rating' && (
          <OptionSheet
            visible
            title={t('minRatingLabel')}
            options={ratingSheetOptions}
            selectedValue={minRating}
            onSelect={selectRating}
            onClose={() => setSheet(null)}
          />
        )}
        {sheet === 'year' && (
          <OptionSheet
            visible
            title={t('yearLabel')}
            options={yearSheetOptions}
            selectedValue={year}
            onSelect={selectYear}
            onClose={() => setSheet(null)}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

type ChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function Chip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && styles.chipActive,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

type FilterButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
};

function FilterButton({ icon, label, onPress }: FilterButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.filterButton, pressed && styles.pressed]}>
      <Ionicons name={icon} size={14} color={Colors.dark.accent} />
      <Text style={styles.filterLabel} numberOfLines={1}>
        {label}
      </Text>
      <Ionicons name="chevron-down" size={14} color={Colors.dark.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  page: {
    flex: 1,
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  topBarRtl: {
    flexDirection: 'row-reverse',
  },
  appTitle: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: '800',
  },
  headerBlock: {
    gap: Spacing.two,
    paddingBottom: Spacing.three,
  },
  chipsRow: {
    gap: Spacing.two,
    paddingVertical: 2,
  },
  chip: {
    backgroundColor: Colors.dark.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  chipLabel: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: '600',
  },
  chipLabelActive: {
    color: '#fff',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.dark.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  filterLabel: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: 110,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  columnWrapper: {
    gap: 12,
    marginBottom: Spacing.three,
  },
  footerSpinner: {
    marginVertical: Spacing.three,
  },
  footerSpacer: {
    height: Spacing.four,
  },
  moreError: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.three,
  },
  moreErrorText: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  moreRetry: {
    color: Colors.dark.accent,
    fontSize: 14,
    fontWeight: '700',
  },
});
