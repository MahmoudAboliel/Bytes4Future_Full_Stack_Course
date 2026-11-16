import { Text, View } from "react-native";

const LandingSection = () => {
  return (
    <View className="bg-[#111827] items-end px-5 py-20 gap-4 relative overflow-hidden">
      <View className="absolute size-[360px] left-0 border-[50px] border-[#1d2432] rounded-full" />
      <View className="absolute size-[200px] left-[80px] top-20 border-[50px] border-[#1d2432] rounded-full" />
      <Text className="text-[#fdba74] bg-[#ea580c18] border border-[#ea580c55] text-xs p-2 rounded-full">
        رحلات يومية مريحة وآمنة
      </Text>
      <Text className="text-white text-4xl font-semibold">
        وجهتك أقرب مما تتخيّل
      </Text>
      <Text className="text-gray-300 text-sm">
        احجز مقعدك في دقائق. واختر رحلتك القادمة معنا.
      </Text>
    </View>
  );
};

export default LandingSection;
