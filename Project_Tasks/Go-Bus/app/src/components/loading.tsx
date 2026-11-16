import { View } from "react-native";

const Loading = () => {
  return (
    <View className="py-8 flex-row items-center justify-center gap-4">
      <View className="bg-[#ea580c] size-4 animate-ping rounded-full" />
      <View className="bg-[#ea580c] size-4 animate-ping rounded-full" />
      <View className="bg-[#ea580c] size-4 animate-ping rounded-full" />
    </View>
  );
};

export default Loading;
