import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

const Footer = () => {
  return (
    <View className="bg-[#111827] p-4 mt-4 gap-4 relative overflow-hidden">
      <View className="absolute size-[340px] left-3 border-[50px] border-[#1d2432] rounded-full" />
      <View className="absolute size-[200px] left-[80px] top-20 border-[50px] border-[#1d2432] rounded-full" />
      <View className="flex-row-reverse items-center gap-4">
        <Ionicons name="shield-checkmark-outline" color="#ea580c" size={20} />
        <View className="items-end">
          <Text className="text-white text-lg font-semibold">حجز موثوق</Text>
          <Text className="text-gray-300">بياناتك مخفية دائماً</Text>
        </View>
      </View>
      <View className="flex-row-reverse items-center gap-4">
        <Ionicons name="extension-puzzle-outline" color="#ea580c" size={20} />
        <View className="items-end">
          <Text className="text-white text-lg font-semibold">تعديل مرن</Text>
          <Text className="text-gray-300">عدّل حجزك قبل التثبيت</Text>
        </View>
      </View>
      <View className="flex-row-reverse items-center gap-4">
        <Ionicons name="people-outline" color="#ea580c" size={20} />
        <View className="items-end">
          <Text className="text-white text-lg font-semibold">دعم متواصل</Text>
          <Text className="text-gray-300">فريقنا جاهز لمساعدتك</Text>
        </View>
      </View>
    </View>
  );
};

export default Footer;
