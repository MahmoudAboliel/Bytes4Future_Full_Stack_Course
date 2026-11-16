import {
  FieldSchema,
  FormRenderer,
} from "@/components/dynamic-nativewind-form";
import { userApi } from "@/lib/apis";
import { LoginUser } from "@/lib/types";
import { loginAtom } from "@/store/auth-sotre";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const Login = () => {
  const router = useRouter();
  const login = useSetAtom(loginAtom);
  const validation = z.object({
    username: z.string("اسم المستخدم مطلوب").min(3, "ثلاث محارف على الأقل"),
    password: z.string("كلمة السر مطلوبة").min(8, "ثمانية محارف على الأقل"),
  });

  const fields: FieldSchema[] = [
    {
      name: "username",
      type: "text",
      // label: "اسم المستخدم (اسم فريد)",
      placeholder: "اسم المستخدم",
    },

    {
      name: "password",
      // label: "كلمة السر",
      type: "text",
      placeholder: "كلمة سر 8 محارف على الأقل",
    },
  ];
  return (
    <SafeAreaView className="bg-[#fff7ed] flex-1">
      <ScrollView className="">
        <View className="flex-1 justify-center p-4 bg-white m-8 rounded-lg gap-2">
          <Pressable
            onPress={() => router.push({ pathname: "/" })}
            className="flex-row-reverse items-center gap-2"
          >
            <Ionicons name="home" size={18} color={"#ea580c"} />
            <Text className="underline">الصفحة الرئيسية</Text>
          </Pressable>
          <Text className="font-extrabold text-3xl text-center">
            تسجيل الدخول
          </Text>

          <FormRenderer
            schema={{ fields, validation, submitLabel: "تسجيل الدخول" }}
            onSubmit={async (data) => {
              try {
                const res = await userApi.login(data as LoginUser);
                login({ token: res.data.token, user: res.data.user });
                router.replace("/");
              } catch (error) {
                alert(error instanceof Error ? error.message : error);
              }
            }}
            showResetButton
            resetLabel="مسح"
            onReset={() => {}}
            submitClassName="bg-[#ea580c]"
          />
          <Pressable onPress={() => router.push({ pathname: "/register" })}>
            <Text className="p-3 text-right text-blue-400 rounded-lg">
              ليس لديك حساب؟ إنشاء حساب
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
