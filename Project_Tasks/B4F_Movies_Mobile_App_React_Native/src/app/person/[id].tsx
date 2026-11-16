import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ListRenderItemInfo,
} from 'react-native';

import { fetchPersonDetails, imageUrl, type PersonDetails, type PersonMovie } from '@/api/tmdb';
import { LanguageSwitch } from '@/components/language-switch';
import { MovieCard } from '@/components/movie-card';
import { ErrorView, LoadingView } from '@/components/state-views';
import { Colors, Spacing } from '@/constants/theme';
import {
  ageFromBirthday,
  departmentLabel,
  formatDate,
  localizeError,
  useI18n,
} from '@/i18n';

type Phase = 'loading' | 'ready' | 'error';

export default function PersonDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const personId = Number(id);
  const { t, lang, isRTL } = useI18n();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const align = isRTL ? 'right' : 'left';

  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [error, setError] = useState<unknown>(null);
  const [tick, setTick] = useState(0);
  const [bioExpanded, setBioExpanded] = useState(false);

  useEffect(() => {
    let dead = false;
    setPhase('loading');

    fetchPersonDetails(personId, lang)
      .then(async (res) => {
        // بعض السير الذاتية لا تتوفر بالعربية — نرجع للنص الإنجليزي كبدائل
        if (!res.biography?.trim() && lang !== 'en') {
          try {
            const fallback = await fetchPersonDetails(personId, 'en');
            if (fallback.biography?.trim()) {
              return { ...res, biography: fallback.biography };
            }
          } catch {
            // نتجاهل خطأ البديل ونعرض ما لدينا
          }
        }
        return res;
      })
      .then((res) => {
        if (dead) return;
        setPerson(res);
        setPhase('ready');
      })
      .catch((err) => {
        if (dead) return;
        setError(err);
        setPhase('error');
      });

    return () => {
      dead = true;
    };
  }, [personId, lang, tick]);

  const retry = () => setTick((n) => n + 1);

  const movies = useMemo<PersonMovie[]>(() => {
    if (!person) return [];
    const seen = new Set<number>();
    return person.movie_credits.cast
      .filter((movie) => {
        if (!movie.release_date || seen.has(movie.id)) return false;
        seen.add(movie.id);
        return true;
      })
      .sort((a, b) => b.release_date.localeCompare(a.release_date));
  }, [person]);

  const numColumns = width >= 900 ? 4 : width >= 600 ? 3 : 2;
  const contentWidth = Math.min(width, 760);
  const gap = 12;
  const cardWidth = (contentWidth - Spacing.three * 2 - gap * (numColumns - 1)) / numColumns;

  if (phase === 'loading' || !person) {
    return (
      <View style={styles.screen}>
        {phase === 'error' ? (
          <ErrorView message={localizeError(error, t)} onRetry={retry} />
        ) : (
          <LoadingView />
        )}
      </View>
    );
  }

  const photo = imageUrl(person.profile_path, 'w342');
  const age = ageFromBirthday(person.birthday);

  let lifeLine: string | null = null;
  if (person.birthday && person.deathday) {
    lifeLine = `${formatDate(person.birthday, lang)} – ${formatDate(person.deathday, lang)}`;
  } else if (person.birthday) {
    const birthText = formatDate(person.birthday, lang);
    lifeLine = age !== null ? `${birthText} (${t('ageYears', { n: age })})` : birthText;
  }

  const biography = person.biography?.trim() ?? '';
  const bioLong = biography.length > 280;

  const renderMovie = ({ item }: ListRenderItemInfo<PersonMovie>) => (
    <MovieCard
      movie={item}
      width={cardWidth}
      onPress={() =>
        router.push({ pathname: '/movie/[id]', params: { id: String(item.id) } })
      }
    />
  );

  const renderHeader = () => (
    <View style={styles.headerBlock}>
      <View style={[styles.profileRow, isRTL && styles.profileRowRtl]}>
        <View style={styles.photoWrap}>
          {photo ? (
            <Image style={styles.photo} source={photo} contentFit="cover" transition={200} />
          ) : (
            <View style={[styles.photo, styles.photoFallback]}>
              <Ionicons name="person-outline" size={36} color={Colors.dark.textSecondary} />
            </View>
          )}
        </View>

        <View style={styles.profileInfo}>
          <Text style={[styles.name, { textAlign: align }]} numberOfLines={3}>
            {person.name}
          </Text>

          {person.known_for_department ? (
            <View style={[styles.deptChip, isRTL && styles.deptChipRtl]}>
              <Text style={styles.deptChipText}>
                {departmentLabel(person.known_for_department, t)}
              </Text>
            </View>
          ) : null}

          {lifeLine ? (
            <View style={[styles.infoLine, isRTL && styles.infoLineRtl]}>
              <Ionicons name="calendar-outline" size={14} color={Colors.dark.textSecondary} />
              <Text style={[styles.infoText, { textAlign: align }]} numberOfLines={2}>
                {lifeLine}
              </Text>
            </View>
          ) : null}

          {person.place_of_birth ? (
            <View style={[styles.infoLine, isRTL && styles.infoLineRtl]}>
              <Ionicons name="location-outline" size={14} color={Colors.dark.textSecondary} />
              <Text style={[styles.infoText, { textAlign: align }]} numberOfLines={2}>
                {person.place_of_birth}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { textAlign: align }]}>{t('biography')}</Text>
        {biography ? (
          <>
            <Text
              style={[styles.biography, { textAlign: align }]}
              numberOfLines={bioExpanded ? undefined : 6}>
              {biography}
            </Text>
            {bioLong && (
              <Pressable onPress={() => setBioExpanded((prev) => !prev)} hitSlop={6}>
                <Text style={styles.readMore}>
                  {bioExpanded ? t('readLess') : t('readMore')}
                </Text>
              </Pressable>
            )}
          </>
        ) : (
          <Text style={[styles.biography, { textAlign: align }]}>{t('noBiography')}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { textAlign: align }]}>
          {t('filmography')} ({movies.length})
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{ title: person.name, headerRight: () => <LanguageSwitch /> }}
      />
      <FlatList
        key={`columns-${numColumns}`}
        data={movies}
        keyExtractor={(item) => String(item.id)}
        numColumns={numColumns}
        renderItem={renderMovie}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="film-outline" size={44} color={Colors.dark.textSecondary} />
            <Text style={styles.emptyText}>{t('noFilmography')}</Text>
          </View>
        }
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[
          styles.listContent,
          movies.length === 0 && styles.listContentEmpty,
        ]}
        initialNumToRender={8}
        windowSize={7}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  headerBlock: {
    paddingBottom: Spacing.two,
  },
  profileRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
  profileRowRtl: {
    flexDirection: 'row-reverse',
  },
  photoWrap: {
    width: 116,
    height: 174,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.dark.backgroundElement,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    gap: 8,
  },
  name: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  deptChip: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.dark.backgroundSelected,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  deptChipRtl: {
    alignSelf: 'flex-end',
  },
  deptChipText: {
    color: Colors.dark.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  infoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoLineRtl: {
    flexDirection: 'row-reverse',
  },
  infoText: {
    flex: 1,
    color: Colors.dark.textSecondary,
    fontSize: 13,
  },
  section: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    gap: Spacing.two,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 17,
    fontWeight: '800',
  },
  biography: {
    color: Colors.dark.textSecondary,
    fontSize: 15,
    lineHeight: 24,
  },
  readMore: {
    color: Colors.dark.accent,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: 48,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  columnWrapper: {
    gap: 12,
    marginBottom: Spacing.three,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.six,
  },
  emptyText: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
  },
});
