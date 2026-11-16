import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

interface Props {
  source: string;
  destination: string;
  price: number;
}
const LandingTrip = ({ source, destination, price }: Props) => {
  const router = useRouter();
  return (
    <View className="bg-[#111827] items-end px-5 py-8 gap-4 relative overflow-hidden">
      <View className="absolute size-[360px] left-0 border-[50px] border-[#1d2432] rounded-full" />
      <View className="absolute size-[200px] left-[80px] top-20 border-[50px] border-[#1d2432] rounded-full" />
      <Pressable
        className="flex-row-reverse items-center gap-2 underline"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-forward" color={"white"} size={18} />
        <Text className="text-white text-xl">العودة إلى الرحلات</Text>
      </Pressable>
      <Text className="text-[#fdba74] bg-[#ea580c18] border border-[#ea580c55] text-xs p-2 rounded-full">
        الخطوة التالية
      </Text>
      <Text className="text-white text-4xl font-semibold">اختر مقعدك</Text>
      <Text className="text-gray-300 text-sm animate-bounce">
        سعر المقعد {price.toLocaleString()} ل.س
      </Text>
    </View>
  );
};

export default LandingTrip;
