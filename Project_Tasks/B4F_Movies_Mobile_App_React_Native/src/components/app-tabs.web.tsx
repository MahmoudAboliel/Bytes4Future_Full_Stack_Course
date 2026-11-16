import { Ionicons } from '@expo/vector-icons';
import {
  TabList,
  TabSlot,
  Tabs,
  TabTrigger,
  type TabListProps,
  type TabTriggerSlotProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, Text, View, type PressableProps } from 'react-native';

import { Colors } from '@/constants/theme';
import { useI18n } from '@/i18n';

/** شريط التبويبات السفلي لسطح المكتب/الويب */
export default function AppTabs() {
  const { t } = useI18n();

  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="movies" href="/" asChild>
            <TabButton icon="film" label={t('moviesTab')} />
          </TabTrigger>
          <TabTrigger name="actors" href="/actors" asChild>
            <TabButton icon="people" label={t('actorsTab')} />
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

type TabButtonProps = TabTriggerSlotProps & {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

function TabButton({ icon, label, children, isFocused, ...props }: TabButtonProps) {
  // التوافق مع أنواع expo-router/ui: تمرير كل الخصائص (بما فيها ref) إلى Pressable
  const pressableProps = props as unknown as PressableProps;

  return (
    <Pressable {...pressableProps} style={[styles.tabButton, isFocused && styles.tabButtonFocused]}>
      <Ionicons
        name={icon}
        size={20}
        color={isFocused ? Colors.dark.accent : Colors.dark.textSecondary}
      />
      <Text
        style={[styles.tabLabel, isFocused ? styles.tabLabelFocused : styles.tabLabelIdle]}
        numberOfLines={1}>
        {children ?? label}
      </Text>
    </Pressable>
  );
}

function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.barContainer}>
      <View style={styles.pill}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    position: 'absolute',
    bottom: 12,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 50,
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 999,
    padding: 6,
    gap: 4,
    maxWidth: 420,
    width: '100%',
    boxShadow: '0 6px 24px rgba(0,0,0,0.45)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 8,
    borderRadius: 999,
  },
  tabButtonFocused: {
    backgroundColor: Colors.dark.backgroundSelected,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabLabelIdle: {
    color: Colors.dark.textSecondary,
  },
  tabLabelFocused: {
    color: Colors.dark.text,
  },
});
