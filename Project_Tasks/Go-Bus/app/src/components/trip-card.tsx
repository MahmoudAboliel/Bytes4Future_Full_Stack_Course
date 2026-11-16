import { Trip } from "@/lib/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

interface TripCardProps {
  trip: Trip;
}
const TripCard = ({ trip }: TripCardProps) => {
  const router = useRouter();
  return (
    <View className="p-4 bg-white border border-[#e5e7eb] hover:border-[#fed7aa] rounded-lg">
      <View className="flex-row-reverse gap-2 items-center">
        <View className="bg-[#ffedd5] p-3 rounded-lg">
          <Ionicons name="bus" color={"#ea580c"} size={20} />
        </View>
        <Text className="text-gray-300 font-semibold text-sm">
          {trip.busModelId.title}
          {/* {trip.busModelId.category === "economy_class"
            ? "اقتصادي"
            : trip.busModelId.category === "first_class"
              ? "درجة أولى"
              : "رجال أعمال"}
          {" - "}
          {trip.busModelId.size === "large" ? "كبير" : "وسط"} */}
        </Text>
      </View>

      <View className="flex-row-reverse items-center">
        <View className="items-center">
          <Text className="text-gray-300 font-bold text-2xl">
            {trip.tripTime}
          </Text>
          <Text className="text-sm">{trip.source}</Text>
        </View>
        <View className="flex-1 h-px w-full bg-gray-300 relative">
          <View className="absolute left-0 -top-[4px] size-2 rounded-full bg-[#ea580c]" />
          <View className="absolute right-0 -top-[4px] size-2 rounded-full bg-[#ea580c]" />
          <View className="absolute left-1/2 -translate-x-1/2 -top-[25px] gap-2">
            {/* <Text className="text-sm">4 س 15د</Text> */}
            <Text className="text-sm">
              {new Date(trip.tripDate).toLocaleDateString()}
            </Text>
            <Text className="text-sm">مباشر</Text>
          </View>
        </View>
        <View className="items-center">
          <Text className="text-gray-300 font-bold text-2xl">12:45</Text>
          <Text className="text-sm">{trip.destination}</Text>
        </View>
      </View>

      <View className="flex-row-reverse items-center justify-between pt-4">
        <View className="items-end">
          <Text className="text-sm text-gray-400">ابتداءً من</Text>
          <Text className="text-lg font-semibold">{trip.price.toLocaleString()} ل.س</Text>
          <Text className="text-sm text-[#ea580c]">{trip.availableSeats} مقعد متاح</Text>
        </View>

        <Pressable
          onPress={() =>
            router.push({ pathname: "/trip/[id]", params: { id: trip._id } })
          }
        >
          <Text className="text-[#ea580c] border border-[#ea580c] focus-within::bg-black py-2 px-4 rounded-lg">
            اختر مقعد
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default TripCard;
