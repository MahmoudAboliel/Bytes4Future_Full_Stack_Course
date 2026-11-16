import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors } from '@/constants/theme';
import { useI18n } from '@/i18n';

/** زر تبديل اللغة — يعرض اسم اللغة الأخرى للتبديل إليها */
export function LanguageSwitch() {
  const { lang, setLang } = useI18n();
  const label = lang === 'en' ? 'العربية' : 'English';

  return (
    <Pressable
      onPress={() => setLang(lang === 'en' ? 'ar' : 'en')}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityLabel={`Switch language to ${label}`}>
      <Ionicons name="globe-outline" size={16} color={Colors.dark.accent} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.dark.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: '600',
  },
});
