import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import { useI18n } from '@/i18n';

export type SheetOption<T> = {
  value: T;
  label: string;
};

type Props<T> = {
  visible: boolean;
  title: string;
  options: SheetOption<T>[];
  selectedValue: T | null;
  onSelect: (value: T) => void;
  onClose: () => void;
};

/** قائمة منسدلة (Modal) لاختيار قيمة واحدة — تستخدم لفلاتر الترتيب والتقييم والسنة */
export function OptionSheet<T extends string | number | null>({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: Props<T>) {
  const { isRTL } = useI18n();
  const align = isRTL ? 'right' : 'left';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.header, isRTL && styles.headerRtl]}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={10} accessibilityLabel="close">
              <Ionicons name="close" size={22} color={Colors.dark.textSecondary} />
            </Pressable>
          </View>

          <ScrollView style={styles.list} bounces={false}>
            {options.map((option) => {
              const selected = option.value === selectedValue;
              return (
                <Pressable
                  key={String(option.value)}
                  onPress={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.option,
                    selected && styles.optionSelected,
                    pressed && styles.optionPressed,
                  ]}>
                  <Text
                    style={[
                      styles.optionLabel,
                      { textAlign: align },
                      selected && styles.optionLabelSelected,
                    ]}
                    numberOfLines={1}>
                    {option.label}
                  </Text>
                  {selected && (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.dark.accent} />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  sheet: {
    backgroundColor: Colors.dark.backgroundElement,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    maxHeight: '75%',
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.two,
  },
  headerRtl: {
    flexDirection: 'row-reverse',
  },
  title: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '700',
  },
  list: {
    marginTop: Spacing.one,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  optionSelected: {
    backgroundColor: Colors.dark.backgroundSelected,
  },
  optionPressed: {
    opacity: 0.6,
  },
  optionLabel: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 15,
  },
  optionLabelSelected: {
    color: Colors.dark.accent,
    fontWeight: '700',
  },
});
