import { DirectionProvider } from "@/components/dynamic-nativewind-form";
import { Stack } from "expo-router";
import "../../global.css";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { loadAuthAtom } from "@/store/auth-sotre";
import { SplashScreen } from "@/components/SplashScreen";

export default function RootLayout() {
  const load = useSetAtom(loadAuthAtom);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    load().finally(() => setReady(true));
  }, [load]);
  
  if (!ready) {
    return (
      <DirectionProvider direction={"rtl"}>
        <SplashScreen title="Go Bus" />
      </DirectionProvider>
    );
  }
  return (
    <DirectionProvider direction={"rtl"}>
      <Stack screenOptions={{ headerShown: false }} />
    </DirectionProvider>
  );
}
