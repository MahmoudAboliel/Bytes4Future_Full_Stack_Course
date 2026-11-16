import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import { useI18n } from '@/i18n';

type OnRetry = () => void;

export function LoadingView() {
  const { t } = useI18n();
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={Colors.dark.accent} />
      <Text style={styles.secondaryText}>{t('loading')}</Text>
    </View>
  );
}

type ErrorViewProps = {
  message: string;
  onRetry?: OnRetry;
};

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  const { t } = useI18n();
  return (
    <View style={styles.center}>
      <Ionicons name="cloud-offline-outline" size={52} color={Colors.dark.textSecondary} />
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}>
          <Ionicons name="refresh" size={16} color="#fff" />
          <Text style={styles.retryLabel}>{t('tryAgain')}</Text>
        </Pressable>
      )}
    </View>
  );
}

type EmptyViewProps = {
  message: string;
  hint?: string;
};

export function EmptyView({ message, hint }: EmptyViewProps) {
  return (
    <View style={styles.center}>
      <Ionicons name="film-outline" size={52} color={Colors.dark.textSecondary} />
      <Text style={styles.message}>{message}</Text>
      {hint ? <Text style={styles.secondaryText}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  message: {
    color: Colors.dark.text,
    fontSize: 15,
    textAlign: 'center',
  },
  secondaryText: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: Spacing.four,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: Spacing.two,
  },
  retryLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});
