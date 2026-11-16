import FilterSection from "@/components/filter-section";
import Footer from "@/components/footer";
import Header from "@/components/header";
import LandingSection from "@/components/landing-main";
import TripsSection from "@/components/trips-section";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="bg-[#fff7ed] flex-1">
      <ScrollView className="flex-1">
        <Header />
        <LandingSection />
        <FilterSection />
        <TripsSection />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
