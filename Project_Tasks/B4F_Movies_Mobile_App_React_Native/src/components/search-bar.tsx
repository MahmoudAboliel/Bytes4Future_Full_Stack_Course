import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useI18n } from '@/i18n';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
};

export function SearchBar({ value, onChangeText, placeholder }: Props) {
  const { isRTL } = useI18n();
  const align = isRTL ? 'right' : 'left';

  return (
    <View style={[styles.container, isRTL && styles.containerRtl]}>
      <Ionicons name="search" size={18} color={Colors.dark.textSecondary} />
      <TextInput
        style={[styles.input, { textAlign: align }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.dark.textSecondary}
        returnKeyType="search"
        autoCorrect={false}
        clearButtonMode="never"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={8} accessibilityLabel="clear">
          <Ionicons name="close-circle" size={18} color={Colors.dark.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.dark.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  containerRtl: {
    flexDirection: 'row-reverse',
  },
  input: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 15,
    paddingVertical: 0,
  },
});
