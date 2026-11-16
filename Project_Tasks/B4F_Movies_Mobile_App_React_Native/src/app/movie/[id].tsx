import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';

import {
  fetchMovieDetails,
  imageUrl,
  type CastMember,
  type MovieDetails,
} from '@/api/tmdb';
import { LanguageSwitch } from '@/components/language-switch';
import { ErrorView, LoadingView } from '@/components/state-views';
import { Colors, Spacing } from '@/constants/theme';
import { localizeError, useI18n } from '@/i18n';

type Phase = 'loading' | 'ready' | 'error';

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = Number(id);
  const { t, lang, isRTL } = useI18n();
  const router = useRouter();
  const align = isRTL ? 'right' : 'left';

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [error, setError] = useState<unknown>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let dead = false;
    setPhase('loading');

    fetchMovieDetails(movieId, lang)
      .then((res) => {
        if (dead) return;
        setMovie(res);
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
  }, [movieId, lang, tick]);

  const retry = () => setTick((n) => n + 1);

  if (phase === 'loading' || !movie) {
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

  const backdrop = imageUrl(movie.backdrop_path, 'w500');
  const poster = imageUrl(movie.poster_path, 'w342');
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '';
  const rating = movie.vote_average > 0 ? movie.vote_average.toFixed(1) : null;
  const directors = (movie.credits?.crew ?? [])
    .filter((member) => member.job === 'Director')
    .map((member) => member.name);

  let runtimeLabel: string | null = null;
  if (movie.runtime && movie.runtime > 0) {
    const h = Math.floor(movie.runtime / 60);
    const m = movie.runtime % 60;
    runtimeLabel = h > 0 ? t('runtime', { h, m }) : `${m}${lang === 'ar' ? ' د' : ' min'}`;
  }

  const metaParts = [rating ? `★ ${rating}` : null, year || null, runtimeLabel].filter(
    (part): part is string => !!part,
  );

  const renderCast = ({ item }: ListRenderItemInfo<CastMember>) => (
    <Pressable
      onPress={() =>
        router.push({ pathname: '/person/[id]', params: { id: String(item.id) } })
      }
      style={({ pressed }) => [styles.castCard, pressed && styles.pressed]}>
      <View style={styles.castPhotoWrap}>
        {item.profile_path ? (
          <Image
            style={styles.castPhoto}
            source={imageUrl(item.profile_path, 'w185')}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={[styles.castPhoto, styles.photoFallback]}>
            <Ionicons name="person-outline" size={26} color={Colors.dark.textSecondary} />
          </View>
        )}
      </View>
      <Text style={styles.castName} numberOfLines={2}>
        {item.name}
      </Text>
      {item.character ? (
        <Text style={styles.castCharacter} numberOfLines={1}>
          {item.character}
        </Text>
      ) : null}
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{ title: movie.title, headerRight: () => <LanguageSwitch /> }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.backdropWrap}>
          {backdrop ? (
            <Image style={styles.backdrop} source={backdrop} contentFit="cover" transition={200} />
          ) : null}
          <View style={styles.backdropFade} />
        </View>

        <View style={[styles.infoRow, isRTL && styles.infoRowRtl]}>
          <View style={styles.posterWrap}>
            {poster ? (
              <Image style={styles.poster} source={poster} contentFit="cover" transition={200} />
            ) : (
              <View style={[styles.poster, styles.photoFallback]}>
                <Ionicons name="film-outline" size={30} color={Colors.dark.textSecondary} />
              </View>
            )}
          </View>

          <View style={styles.titleCol}>
            <Text style={[styles.title, { textAlign: align }]} numberOfLines={3}>
              {movie.title}
            </Text>
            {movie.original_title !== movie.title && (
              <Text style={[styles.originalTitle, { textAlign: align }]} numberOfLines={2}>
                {t('originalTitle')}: {movie.original_title}
              </Text>
            )}
            <View style={[styles.metaRow, isRTL && styles.metaRowRtl]}>
              {metaParts.map((part) => (
                <Text key={part} style={styles.metaPart}>
                  {part}
                </Text>
              ))}
              {movie.original_language ? (
                <View style={styles.langChip}>
                  <Text style={styles.langChipText}>
                    {movie.original_language.toUpperCase()}
                  </Text>
                </View>
              ) : null}
            </View>
            {movie.tagline ? (
              <Text style={[styles.tagline, { textAlign: align }]} numberOfLines={2}>
                “{movie.tagline}”
              </Text>
            ) : null}
          </View>
        </View>

        {movie.genres.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.genreRow, isRTL && styles.genreRowRtl]}>
            {movie.genres.map((genre) => (
              <View key={genre.id} style={styles.genreChip}>
                <Text style={styles.genreChipText}>{genre.name}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        <Section title={t('overview')} align={align}>
          <Text style={[styles.overview, { textAlign: align }]}>
            {movie.overview || t('noOverview')}
          </Text>
        </Section>

        {directors.length > 0 && (
          <Section title={t('director')} align={align}>
            <Text style={[styles.director, { textAlign: align }]}>
              {directors.slice(0, 3).join(', ')}
            </Text>
          </Section>
        )}

        <Section title={t('cast')} align={align}>
          {(movie.credits?.cast ?? []).length === 0 ? (
            <Text style={[styles.noCast, { textAlign: align }]}>{t('noCast')}</Text>
          ) : (
            <FlatList
              data={movie.credits.cast}
              keyExtractor={(item) => `${item.id}-${item.order ?? 0}`}
              renderItem={renderCast}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.castList}
            />
          )}
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  align,
  children,
}: {
  title: string;
  align: 'left' | 'right';
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { textAlign: align }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  backdropWrap: {
    height: 190,
    backgroundColor: Colors.dark.backgroundElement,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdropFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    experimental_backgroundImage: 'linear-gradient(180deg, rgba(11,13,18,0) 0%, #0B0D12 100%)',
  },
  infoRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    marginTop: -48,
  },
  infoRowRtl: {
    flexDirection: 'row-reverse',
  },
  posterWrap: {
    width: 104,
    height: 156,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.dark.background,
    backgroundColor: Colors.dark.backgroundElement,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  photoFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCol: {
    flex: 1,
    gap: 6,
    paddingTop: 52,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
  },
  originalTitle: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  metaRowRtl: {
    flexDirection: 'row-reverse',
  },
  metaPart: {
    color: Colors.dark.accent,
    fontSize: 13.5,
    fontWeight: '700',
  },
  langChip: {
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  langChipText: {
    color: Colors.dark.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  tagline: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
  },
  genreRow: {
    gap: 8,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
  genreRowRtl: {
    flexDirection: 'row-reverse',
  },
  genreChip: {
    borderWidth: 1,
    borderColor: Colors.dark.border,
    backgroundColor: Colors.dark.backgroundElement,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  genreChipText: {
    color: Colors.dark.text,
    fontSize: 12.5,
    fontWeight: '600',
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
  overview: {
    color: Colors.dark.textSecondary,
    fontSize: 15,
    lineHeight: 24,
  },
  director: {
    color: Colors.dark.text,
    fontSize: 15,
    fontWeight: '600',
  },
  noCast: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
  },
  castList: {
    gap: 12,
    paddingVertical: 4,
  },
  castCard: {
    width: 96,
    gap: 5,
  },
  castPhotoWrap: {
    width: 96,
    height: 144,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.dark.backgroundElement,
  },
  castPhoto: {
    width: '100%',
    height: '100%',
  },
  castName: {
    color: Colors.dark.text,
    fontSize: 12.5,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  castCharacter: {
    color: Colors.dark.textSecondary,
    fontSize: 11,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
