import BookingDetails from "@/components/booking-details";
import Header from "@/components/header";
import LandingTrip from "@/components/landing-trip";
import SeatsMapBase, { BusTypes } from "@/components/seats-map";
import { tripsApi } from "@/lib/apis";
import {
  BookingStatus,
  Category,
  Size,
  TripDetails as TripD,
} from "@/lib/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type BookingType = { seatNumber: number; status: BookingStatus };
const TripDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [trip, setTrip] = useState<TripD>();
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [reservedSeats, setReservedSeats] = useState<BookingType[]>([]);

  useEffect(() => {
    const getData = async (id: string) => {
      const res = (await tripsApi.getById(id)) as TripD;
      setTrip(res);
      const initReservedSeats: BookingType[] = [];
      res.tripBooking.forEach((booking) => {
        booking.seatNumbers.forEach((seat) => {
          initReservedSeats.push({ status: booking.status, seatNumber: seat });
        });
      });
      setReservedSeats(initReservedSeats);
    };

    getData(id);
  }, [id]);

  const handleCategory = (cat: Category, size: Size): BusTypes => {
    if (cat === "economy_class") {
      if (size === "large") return "economyLarge";
      else return "economyMedium";
    } else if (cat === "first_class") {
      if (size === "large") return "firstClassLarge";
      else return "firstClassMedium";
    } else if (size === "large") return "businessLarge";
    else return "businessMedium";
  };
  const handleSeatClick = (num: number) => {
    if (selectedSeats.includes(num)) {
      setSelectedSeats((prev) => prev.filter((n) => n !== num));
    } else {
      setSelectedSeats((prev) => prev.concat(num));
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-[#fff7ed]">
      <ScrollView className="">
        <Header />
        <LandingTrip
          source={trip?.source ?? ""}
          destination={trip?.destination ?? ""}
          price={trip?.price ?? 0}
        />
        {trip && (
          <View className="m-4 gap-2">
            <SeatsMapBase
              layout={handleCategory(
                trip?.busModelId.category,
                trip?.busModelId.size,
              )}
              fixedSeats={
                reservedSeats.length > 0
                  ? (reservedSeats.map((res) => {
                      if (res.status === "confirmed") return res.seatNumber;
                    }) as number[])
                  : []
              }
              reservedSeats={
                reservedSeats.length > 0
                  ? (reservedSeats.map((res) => {
                      if (res.status === "reserved") return res.seatNumber;
                    }) as number[])
                  : []
              }
              bookingSeats={selectedSeats}
              onSeatPress={handleSeatClick}
            />
            <BookingDetails trip={trip} selectedSeats={selectedSeats} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TripDetails;
