import {
  setDirection,
  useDirection,
} from "@/components/dynamic-nativewind-form";
import { authAtom, logoutAtom } from "@/store/auth-sotre";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { Pressable, Text, View } from "react-native";

const Header = () => {
  const router = useRouter();
  const { isRTL } = useDirection();
  const { user } = useAtomValue(authAtom);
  const logout = useSetAtom(logoutAtom);

  return (
    <View className="bg-[#fff7ed] border-b border-[#fed7aa] py-2 px-4 flex-row-reverse items-center justify-between">
      <View className="flex-row-reverse items-center gap-4">
        <View className="bg-[#ea580c] text-white p-3 rounded-lg">
          <Ionicons name="bus" color={"white"} size={20} />
        </View>
        <View className="items-end">
          <Text className="text-2xl font-bold">رحلة</Text>
          <Text className="text-sm text-gray-500">نصل بك بأمان</Text>
        </View>
      </View>
      <View className="flex-row-reverse gap-2 items-center">
        <Pressable onPress={() => setDirection(isRTL ? "ltr" : "rtl")}>
          <Text className="border border-[#ea580c] text-[#ea580c] text-sm px-3 py-3 rounded-full">
            {isRTL ? "AR" : "EN"}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            if (!user)
              router.push({ pathname: "/login" })
            else logout();
          }}
          className=""
        >
          {user ? (
            <View className="bg-[#1f2937] size-12 flex items-center justify-center rounded-full ">
              <Text className="text-white">
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          ) : (
            <Text className="border border-[#ea580c] text-[#ea580c] text-sm px-3 py-2 rounded-full">
              تسجيل الدخول
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default Header;
