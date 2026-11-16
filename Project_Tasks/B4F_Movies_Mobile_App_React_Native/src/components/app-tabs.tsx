import { NativeTabs } from 'expo-router/native-tabs';

import { Colors } from '@/constants/theme';
import { useI18n } from '@/i18n';

/** شريط التبويبات السفلي (أطراف أصلية) — يظهر على iOS و Android */
export default function AppTabs() {
  const { t, lang } = useI18n();
  const colors = Colors.dark;

  // key يجبر إعادة بناء التبويبات عند تغيير اللغة لتحديث العناوين
  return (
    <NativeTabs
      key={lang}
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundSelected}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{t('moviesTab')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="actors">
        <NativeTabs.Trigger.Label>{t('actorsTab')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
