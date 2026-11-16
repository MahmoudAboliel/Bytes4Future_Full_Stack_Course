import { submitBooking } from "@/lib/apis";
import { Trip } from "@/lib/types";
import { authAtom } from "@/store/auth-sotre";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  trip: Trip;
  selectedSeats: number[];
}
const BookingDetails = ({ trip, selectedSeats }: Props) => {
  const { token } = useAtomValue(authAtom);
  const router = useRouter();

  const handleTime = useMemo(() => {
    const [h, m] = trip.tripTime.split(":");
    let time = "";
    if (Number(h) < 12) time = `${h}:${m} صباحاً`;
    else {
      let hh = Number(h) % 12;
      time = `${hh < 10 ? `0${hh}` : hh}:${m} مساءً`;
    }
    return time;
  }, [trip.tripTime]);
  return (
    <View className="items-end gap-4 bg-white p-4 border border-[#e5e7eb] rounded-lg">
      <Text className="text-[#ea580c] text-xs">ملخص الحجز</Text>
      <Text className="font-extrabold text-xl">
        {trip.source} <Ionicons name="arrow-back" /> {trip.destination}
      </Text>

      {/* row */}
      <View className="flex-row-reverse items-center justify-between w-full border-b border-gray-300 pb-2">
        <View className="flex-row-reverse items-center gap-1">
          <Text>
            <Ionicons name="calendar-outline" color={"gray"} size={15} />
          </Text>
          <Text className="text-sm text-gray-500">التاريخ</Text>
        </View>
        <Text className="text-xs">
          {new Date(trip.tripDate).toDateString()}
        </Text>
      </View>

      <View className="flex-row-reverse items-center justify-between w-full border-b border-gray-300 pb-2">
        <View className="flex-row-reverse items-center gap-1">
          <Text>
            <Ionicons name="time-outline" color={"gray"} size={15} />
          </Text>
          <Text className="text-sm text-gray-500">الإنطلاق</Text>
        </View>
        <Text className="text-xs">{handleTime}</Text>
      </View>

      <View className="flex-row-reverse items-center justify-between w-full border-b border-gray-300 pb-2">
        <View className="flex-row-reverse items-center gap-1">
          <Text>
            <Ionicons name="bus" color={"gray"} size={15} />
          </Text>
          <Text className="text-sm text-gray-500">نوع البولمان</Text>
        </View>
        <Text className="text-xs">{trip.busModelId.title}</Text>
      </View>

      <Text className="text-gray-500 text-sm">المقاعد المختارة</Text>
      <View className="flex-row-reverse items-center gap-2 flex-wrap border-b border-[#ea580c] w-full pb-4">
        {selectedSeats.map((i) => (
          <Text key={i} className="text-white bg-[#ea580c] p-2 px-4 rounded-lg">
            {i}
          </Text>
        ))}
      </View>

      <View className="flex-row-reverse items-center justify-between w-full">
        <Text className="text-gray-500">المجموع</Text>
        <Text className="font-extrabold">
          {(trip.price * selectedSeats.length).toLocaleString()} ل.س
        </Text>
      </View>

      <Pressable
        className="w-full"
        onPress={async () => {
          const res = (await submitBooking(
            trip._id,
            selectedSeats,
            router,
            token,
          )) as { message: string };
          alert(res?.message);
          router.replace({ pathname: "/trip/[id]", params: { id: trip._id } });
        }}
      >
        <Text className="bg-[#ea580c] text-white text-center py-3 rounded-lg">
          تأكيد الحجز
        </Text>
      </Pressable>

      <View className="flex-row-reverse items-center gap-2 justify-center w-full">
        <Ionicons name="shield-checkmark-outline" />
        <Text className="text-sm">الحجز مؤقت حتى تثبيته نقداً لدي المكتب</Text>
      </View>
    </View>
  );
};

export default BookingDetails;
