import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { imageUrl, type MovieListItem } from '@/api/tmdb';
import { Colors } from '@/constants/theme';
import { useI18n } from '@/i18n';

type Props = {
  movie: Pick<MovieListItem, 'id' | 'title' | 'poster_path' | 'vote_average' | 'release_date'>;
  width: number;
  onPress: () => void;
};

/** بطاقة فيلم — تُستخدم في شبكات الأفلام وفي قوائم الأفلام */
export function MovieCard({ movie, width, onPress }: Props) {
  const { isRTL } = useI18n();
  const align = isRTL ? 'right' : 'left';
  const poster = imageUrl(movie.poster_path, 'w342');
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '';
  const rating = movie.vote_average > 0 ? movie.vote_average.toFixed(1) : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { width }, pressed && styles.pressed]}>
      <View style={[styles.posterWrap, { width, height: width * 1.5 }]}>
        {poster ? (
          <Image
            style={styles.poster}
            source={poster}
            contentFit="cover"
            transition={200}
            accessibilityLabel={movie.title}
          />
        ) : (
          <View style={[styles.poster, styles.posterFallback]}>
            <Ionicons name="film-outline" size={32} color={Colors.dark.textSecondary} />
          </View>
        )}
        {rating && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={11} color={Colors.dark.accent} />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        )}
      </View>

      <Text style={[styles.title, { textAlign: align }]} numberOfLines={2}>
        {movie.title}
      </Text>
      {year.length > 0 && (
        <Text style={[styles.year, { textAlign: align }]} numberOfLines={1}>
          {year}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 6,
  },
  pressed: {
    opacity: 0.75,
  },
  posterWrap: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.dark.backgroundElement,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  posterFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: Colors.dark.text,
    fontSize: 13.5,
    fontWeight: '600',
    lineHeight: 18,
  },
  year: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
  },
});
