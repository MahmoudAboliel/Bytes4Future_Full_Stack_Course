import {
  FieldSchema,
  FormRenderer,
} from "@/components/dynamic-nativewind-form";
import { userApi } from "@/lib/apis";
import { RegisterUser } from "@/lib/types";
import { loginAtom } from "@/store/auth-sotre";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const Register = () => {
  const router = useRouter();
  const login = useSetAtom(loginAtom);
  const validation = z.object({
    name: z.string("الاسم مطلوب").min(3, "ثلاث محارف على الأقل"),
    username: z.string("اسم المستخدم مطلوب").min(3, "ثلاث محارف على الأقل"),
    phone: z
      .string("رقم الهاتف مطلوب")
      .length(10, "يجب إدخال عشر أرقام")
      .startsWith("09", "يجب أن يبدأ الرقم ب 09"),
    password: z.string("كلمة السر مطلوبة").min(8, "ثمانية محارف على الأقل"),
  });

  const fields: FieldSchema[] = [
    {
      name: "name",
      type: "text",
      placeholder: "أدخل اسمك",
      // label: "الإسم",
    },
    {
      name: "username",
      type: "text",
      // label: "اسم المستخدم (اسم فريد)",
      placeholder: "أدخل اسم فريد",
    },
    {
      name: "phone",
      // label: "رقم الهاتف",
      type: "text",
      placeholder: "أدخل رقم الهاتف",
    },
    {
      name: "password",
      // label: "كلمة السر",
      type: "text",
      placeholder: "ادخل كلمة سر 8 محارف على الأقل",
    },
  ];
  return (
    <SafeAreaView className="bg-[#fff7ed] flex-1">
      <ScrollView className="">
        <View className="p-4 bg-white m-8 rounded-lg border border-gray-200 gap-2">
          <Pressable
            onPress={() => router.push({ pathname: "/" })}
            className="flex-row-reverse items-center gap-2"
          >
            <Ionicons name="home" size={18} color={"#ea580c"} />
            <Text className="underline">الصفحة الرئيسية</Text>
          </Pressable>
          <Text className="font-extrabold text-3xl text-center">
            إنشاء حساب
          </Text>

          <FormRenderer
            schema={{ fields, validation, submitLabel: "إنشاء حساب" }}
            onSubmit={async (data) => {
              try {
                const res = await userApi.register(data as RegisterUser);
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
          <Pressable onPress={() => router.push({ pathname: "/login" })}>
            <Text className="p-3 text-right text-blue-400 rounded-lg">
              لديك حساب؟ إنتقل إلى تسجيل الدخول
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
