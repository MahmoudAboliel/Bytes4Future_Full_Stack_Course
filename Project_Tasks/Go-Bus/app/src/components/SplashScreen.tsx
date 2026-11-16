/* eslint-disable react-hooks/refs */
// src/components/SplashScreen.tsx
import { useEffect, useRef } from "react";
import { Animated, Easing, Image, Text, View } from "react-native";
import { useDirection } from "@/components/dynamic-nativewind-form";

type Props = {
  /** نص يظهر تحت الشعار (اسم التطبيق افتراضيًا) */
  title?: string;
  /** نص فرعي اختياري */
  subtitle?: string;
  /** مسار الشعار */
  logo?: any;
};

export function SplashScreen({ title = "MyApp", subtitle, logo }: Props) {
  const { isRTL } = useDirection();

  // قيم الأنيميشن
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // 1. ظهور الشعار
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. نبض النقاط الثلاث (loop)
    const pulse = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );

    const a1 = pulse(dot1, 0);
    const a2 = pulse(dot2, 200);
    const a3 = pulse(dot3, 400);
    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950">
      {/* الشعار */}
      <Animated.View
        style={{ opacity, transform: [{ scale }] }}
        className="mb-6 h-24 w-24 items-center justify-center rounded-2xl bg-blue-600"
      >
        {logo ? (
          <Image source={logo} className="h-16 w-16" resizeMode="contain" />
        ) : (
          <Text className="text-3xl font-bold text-white">◈</Text>
        )}
      </Animated.View>

      {/* اسم التطبيق */}
      <Animated.Text
        style={{ opacity }}
        className="text-2xl font-bold text-black dark:text-white"
      >
        {title}
      </Animated.Text>

      {/* النص الفرعي */}
      {subtitle ? (
        <Animated.Text
          style={{ opacity }}
          className="mt-1 text-sm text-gray-500 dark:text-gray-400"
        >
          {subtitle}
        </Animated.Text>
      ) : null}

      {/* نقاط التحميل */}
      <View
        className="mt-8 flex-row items-center gap-2"
        // RTL: النقاط لا تُعكس — ترتيبها محايد
        style={{ flexDirection: isRTL ? "row" : "row" }}
      >
        <Animated.View
          style={{ opacity: dot1 }}
          className="h-2 w-2 rounded-full bg-blue-600"
        />
        <Animated.View
          style={{ opacity: dot2 }}
          className="h-2 w-2 rounded-full bg-blue-600"
        />
        <Animated.View
          style={{ opacity: dot3 }}
          className="h-2 w-2 rounded-full bg-blue-600"
        />
      </View>

      {/* التذييل */}
      <Text className="absolute bottom-8 text-xs text-gray-400 dark:text-gray-600">
        v1.0.0
      </Text>
    </View>
  );
}
