import { tripsApi } from "@/lib/apis";
import { Trip } from "@/lib/types";
import { filterAtom } from "@/store/filter-sotre";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import TripCard from "./trip-card";
import Loading from "./loading";
import { useRouter } from "expo-router";

const TripsSection = () => {
  const router = useRouter();
  const filter = useAtomValue(filterAtom);
  const [scheduleTrips, setScheduleTrips] = useState<Trip[]>([]);
  const [manualTrips, setManualTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        setError(null);
        let query = "?available=true";

        filter.source && (query += `&source=${filter.source}`);
        filter.destination && (query += `&destination=${filter.destination}`);
        filter.tripDate && (query += `&tripDate=${filter.tripDate}`);

        const res = await tripsApi.getAll(query);
        setScheduleTrips(
          res.filter((tr) => tr.scheduleType !== "manual") ?? [],
        );
        setManualTrips(res.filter((tr) => tr.scheduleType === "manual") ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [filter.source, filter.destination, filter.tripDate]);

  if (loading) return (
    <Loading />
  );
  if (!error) return (
    <View className="items-center g-4 p-4">
      <Text className="text-red-500">حدث خطأ ما</Text>
      <Pressable onPress={() => router.replace('/')}>
        <Text className="text-gray-700 text-xl border p-2 rounded-lg">أعد المحاولة</Text>
      </Pressable>
    </View>
  );
  return (
    <View className="px-6">
      <View className="flex-row-reverse justify-between">
        <Text className="text-[#ea580c] text-sm">الرحلات المتاحة</Text>
        <Text className="text-gray-500 text-sm">
          يوجد {manualTrips.length + scheduleTrips.length}{" "}
          {scheduleTrips.length > 1 || manualTrips.length > 1
            ? "رحلات"
            : "رحلة"}
        </Text>
      </View>

      <Text className="text-gray-300 font-normal text-4xl text-right">
        {!filter.source && !filter.destination && "جميع الرحلات"}
        {filter.source && `من ${filter.source} `}
        {filter.destination && `إلى ${filter.destination}`}
      </Text>
      {(filter.section === "both" || filter.section === "manual") && (
        <>
          <Subtitle title="رحلات لمرة واحدة" count={manualTrips.length} />
          <View className="gap-4 mt-3">
            {manualTrips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </View>
        </>
      )}
      {(filter.section === "both" || filter.section === "scheduled") && (
        <>
          <Subtitle title="رحلات مجدولة" count={scheduleTrips.length} />
          <View className="gap-4 mt-3">
            {scheduleTrips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </View>
        </>
      )}
    </View>
  );
};

export default TripsSection;

const Subtitle = ({ title, count }: { title: string; count: number }) => (
  <View className="flex-row-reverse justify-between items-center py-2 border-b border-[#ea580c]">
    <Text className="text-[#ea580c] text-2xl font-bold">{title}</Text>
    <Text className="text-gray-500 text-sm">
      {count} {count > 1 ? "رحلات" : "رحلة"}
    </Text>
  </View>
);
