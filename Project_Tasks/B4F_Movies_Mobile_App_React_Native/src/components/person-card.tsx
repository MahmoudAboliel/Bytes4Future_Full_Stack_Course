import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { imageUrl } from '@/api/tmdb';
import { Colors } from '@/constants/theme';
import { useI18n } from '@/i18n';

type Props = {
  person: {
    id: number;
    name: string;
    profile_path: string | null;
  };
  width: number;
  /** نص فرعي مثل: الأفلام المعروفة أو القسم الوظيفي */
  subtitle?: string;
  onPress: () => void;
};

/** بطاقة ممثل — تُستخدم في شبكات الممثلين وفي قائمة طاقم التمثيل */
export function PersonCard({ person, width, subtitle, onPress }: Props) {
  const { isRTL } = useI18n();
  const align = isRTL ? 'right' : 'left';
  const photo = imageUrl(person.profile_path, 'w185');
  const height = width * 1.5;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { width }, pressed && styles.pressed]}>
      <View style={[styles.photoWrap, { width, height }]}>
        {photo ? (
          <Image
            style={styles.photo}
            source={photo}
            contentFit="cover"
            transition={200}
            accessibilityLabel={person.name}
          />
        ) : (
          <View style={[styles.photo, styles.photoFallback]}>
            <Ionicons name="person-outline" size={32} color={Colors.dark.textSecondary} />
          </View>
        )}
      </View>

      <Text style={[styles.name, { textAlign: align }]} numberOfLines={2}>
        {person.name}
      </Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { textAlign: align }]} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
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
  photoWrap: {
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
  name: {
    color: Colors.dark.text,
    fontSize: 13.5,
    fontWeight: '600',
    lineHeight: 18,
  },
  subtitle: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
  },
});
