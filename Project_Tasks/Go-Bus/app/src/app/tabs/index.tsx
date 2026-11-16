import FilterSection from "@/components/filter-section";
import Footer from "@/components/footer";
import Header from "@/components/header";
import LandingSection from "@/components/landing-main";
import TripCard from "@/components/trip-card";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// [#1d2432]
export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <ScrollView className="bg-[#fff7ed]">
        <Header />
        <LandingSection />
        <FilterSection />

        <View>
          <View className="flex-row-reverse justify-between px-6">
            <Text className="text-[#ea580c] text-sm">الرحلات المتاحة</Text>
            <Text className="text-gray-500 text-sm">وجدنا 3 رحلات</Text>
          </View>

          <Text className="text-gray-300 font-bold text-4xl text-right pr-6 py-3">
            من دمشق إلى حلب
          </Text>

          <View className="px-6 gap-4">
            <TripCard
              route={() => {
                router.push({
                  pathname: "/trip/[id]",
                  params: { id: String(123) },
                });
              }}
            />
            <TripCard
              route={() => {
                router.push({
                  pathname: "/trip/[id]",
                  params: { id: String("abc") },
                })
              }}
            />
          </View>
        </View>

        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
