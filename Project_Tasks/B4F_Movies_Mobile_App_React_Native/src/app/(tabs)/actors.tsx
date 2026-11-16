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

import { fetchPopularPeople, searchPeople, type PersonListItem } from '@/api/tmdb';
import { LanguageSwitch } from '@/components/language-switch';
import { PersonCard } from '@/components/person-card';
import { SearchBar } from '@/components/search-bar';
import { EmptyView, ErrorView, LoadingView } from '@/components/state-views';
import { Colors, Spacing } from '@/constants/theme';
import { departmentLabel, localizeError, useI18n } from '@/i18n';

const MAX_PAGE = 500;

type Phase = 'loading' | 'ready' | 'error';

export default function ActorsScreen() {
  const { t, lang, isRTL } = useI18n();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [people, setPeople] = useState<PersonListItem[]>([]);
  const [page, setPage] = useState(1);
  const [tick, setTick] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [phase, setPhase] = useState<Phase>('loading');
  const [error, setError] = useState<unknown>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const seqRef = useRef(0);
  const debouncedRef = useRef('');

  // تأخير البحث
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

  // جلب الممثلين (الأكثر شعبية أو نتائج البحث)
  useEffect(() => {
    const seq = ++seqRef.current;
    let dead = false;

    if (page === 1) {
      setPhase('loading');
      setLoadingMore(false);
      setMoreError(null);
    }

    const request = debounced.trim()
      ? searchPeople(debounced, page, lang)
      : fetchPopularPeople(page, lang);

    request
      .then((res) => {
        if (dead || seq !== seqRef.current) return;
        setPeople((prev) => (page === 1 ? res.results : [...prev, ...res.results]));
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
  }, [page, debounced, lang, tick, t]);

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

  const numColumns = width >= 900 ? 4 : width >= 600 ? 3 : 2;
  const contentWidth = Math.min(width, 760);
  const gap = 12;
  const cardWidth = (contentWidth - Spacing.three * 2 - gap * (numColumns - 1)) / numColumns;

  const subtitleFor = (person: PersonListItem): string | undefined => {
    const titles = (person.known_for ?? [])
      .map((item) => (item.media_type === 'movie' ? item.title : item.name))
      .filter((title): title is string => !!title)
      .slice(0, 2);
    if (titles.length > 0) return titles.join(' • ');
    return departmentLabel(person.known_for_department, t) || undefined;
  };

  const renderHeader = () => (
    <View style={styles.headerBlock}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder={t('searchActorsPlaceholder')}
      />
    </View>
  );

  const renderItem = ({ item }: ListRenderItemInfo<PersonListItem>) => (
    <PersonCard
      person={item}
      width={cardWidth}
      subtitle={subtitleFor(item)}
      onPress={() =>
        router.push({ pathname: '/person/[id]', params: { id: String(item.id) } })
      }
    />
  );

  const renderFooter = () => {
    if (loadingMore) {
      return <ActivityIndicator style={styles.footerSpinner} color={Colors.dark.accent} />;
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
          <Text style={styles.appTitle}>{t('actorsTab')}</Text>
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
              data={people}
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
                people.length === 0 && styles.listContentEmpty,
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
      </View>
    </SafeAreaView>
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
    paddingBottom: Spacing.three,
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
