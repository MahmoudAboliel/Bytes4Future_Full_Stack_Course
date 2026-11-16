import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

// ============ ثوابت التصميم ============
const SEAT_SIZE = 42;
const AISLE_WIDTH = 40;

export type BusTypes =
  | "economyLarge"
  | "economyMedium"
  | "firstClassLarge"
  | "firstClassMedium"
  | "businessLarge"
  | "businessMedium";

export type SeatStatus = "available" | "reserved" | "fixed" | "booking";

interface BusLayoutConfig {
  label: string;
  rows: number;
  columns: ("seat" | "aisle")[];
  extraMiddleSeat: boolean;
  totalSeats: number;
}

type BusLayouts = Record<BusTypes, BusLayoutConfig>;

interface SeatProps {
  number: number;
  status?: SeatStatus;
  onPress: (num: number) => void;
}

interface SeatCell {
  type: "seat" | "aisle" | "empty";
  number?: number;
}

interface RowDefinition {
  type: "normal" | "extra";
  seats: SeatCell[];
}

interface SeatsMapBaseProps {
  layout: BusTypes;
  reservedSeats?: number[];
  fixedSeats?: number[];
  bookingSeats?: number[],
  onSeatPress: (seatNumber: number) => void;
}

// ============ إعدادات النماذج الستة ============
// 'seat' = مقعد، 'aisle' = ممر
export const BUS_LAYOUTS: BusLayouts = {
  economyLarge: {
    label: "إقتصادي - كبير",
    rows: 11,
    columns: ["seat", "seat", "aisle", "seat", "seat"],
    extraMiddleSeat: true,
    totalSeats: 45,
  },
  economyMedium: {
    label: "إقتصادي - متوسط",
    rows: 9,
    columns: ["seat", "seat", "aisle", "seat", "seat"],
    extraMiddleSeat: true,
    totalSeats: 37,
  },
  firstClassLarge: {
    label: "درجة أولى - كبير",
    rows: 11,
    columns: ["seat", "seat", "aisle", "seat"],
    extraMiddleSeat: false,
    totalSeats: 33,
  },
  firstClassMedium: {
    label: "درجة أولى - متوسط",
    rows: 9,
    columns: ["seat", "seat", "aisle", "seat"],
    extraMiddleSeat: false,
    totalSeats: 27,
  },
  businessLarge: {
    label: "رجال الأعمال - كبير",
    rows: 11,
    columns: ["seat", "aisle", "seat"],
    extraMiddleSeat: false,
    totalSeats: 22,
  },
  businessMedium: {
    label: "رجال الأعمال - متوسط",
    rows: 9,
    columns: ["seat", "aisle", "seat"],
    extraMiddleSeat: false,
    totalSeats: 18,
  },
};

// ============ مكوّن المقعد الواحد ============
const Seat = ({ number, status = "available", onPress }: SeatProps) => {
  const styles: Record<
    SeatStatus,
    {
      box: string;
      text: string;
      bar: string;
    }
  > = {
    available: {
      box: "bg-white",
      text: "text-[#1f2937]",
      bar: "bg-gray-700",
    },
    reserved: {
      box: "bg-[#ea580c]",
      text: "text-white",
      bar: "bg-gray-700",
    },
    booking: {
      box: "bg-[#f7ad31]",
      text: "text-white",
      bar: "bg-gray-700",
    },
    fixed: {
      box: "bg-[#1f2937]",
      text: "text-[#ea580c]",
      bar: "bg-white/40",
    },
  };
  const s = styles[status] || styles.available;

  return (
    <Pressable
      onPress={() =>
        (status === "available" || status === "booking") && onPress?.(number)
      }
      disabled={status !== "available" && status !== "booking"}
      className={`items-center justify-center border border-gray-400 rounded-t-2xl rounded-b-md ${s.box}`}
      style={{ width: SEAT_SIZE, height: SEAT_SIZE }}
    >
      <View className={`h-1.5 w-6 rounded-lg ${s.bar}`} />
      <Text className={`text-xs font-bold mt-1 ${s.text}`}>{number}</Text>
    </Pressable>
  );
};

// ============ المكوّن الأساسي (Base) ============
const SeatsMapBase = ({
  layout,
  reservedSeats = [],
  fixedSeats = [],
  bookingSeats = [],
  onSeatPress,
}: SeatsMapBaseProps) => {
  const config: BusLayoutConfig = BUS_LAYOUTS[layout];

  // بناء بنية الصفوف والمقاعد
  const { rows, totalSeats } = useMemo<{
    rows: RowDefinition[];
    totalSeats: number;
  }>(() => {
    const rows: RowDefinition[] = [];
    let counter = 1;

    // الصفوف العادية
    for (let r = 0; r < config.rows; r++) {
      const rowSeats: SeatCell[] = config.columns.map((col) => {
        if (col === "aisle") return { type: "aisle" };
        return { type: "seat", number: counter++ };
      });
      rows.push({ type: "normal", seats: rowSeats });
    }

    // المقعد الإضافي في نهاية الممر (للنوع العادية فقط)
    if (config.extraMiddleSeat) {
      const rowSeats: SeatCell[] = config.columns.map((col) => {
        if (col === "aisle") return { type: "seat", number: counter++ };
        return { type: "empty" };
      });
      rows.push({ type: "extra", seats: rowSeats });
    }

    return { rows, totalSeats: counter - 1 };
  }, [config]);

  const statusOf = (n: number): SeatStatus => {
    if (fixedSeats.includes(n)) return "fixed";
    if (reservedSeats.includes(n)) return "reserved";
    if (bookingSeats.includes(n)) return "booking";
    return "available";
  };

  return (
    <View className="items-center p-4 gap-3 bg-white border border-[#e5e7eb] rounded-lg">
      {/* الهيدر */}
      <View className="w-full items-end gap-1">
        <Text className="text-xs text-[#ea580c]">خريطة المقاعد</Text>
        <Text className="font-extrabold text-xl">اختر مقعدك المفضل</Text>
        <Text className="text-xs text-gray-500">{config.label}</Text>
      </View>

      {/* مفتاح الألوان (Legend) */}
      <View className="flex-row-reverse flex-wrap items-center gap-2">
        <View className="size-4 bg-white border border-[#ea580c] rounded-md" />
        <Text className="text-sm">متاح</Text>
        <View className="size-4 bg-[#ea580c] border border-[#ea580c] rounded-md" />
        <Text className="text-sm">محجوز</Text>
        <View className="size-4 bg-[#1f2937] border border-[#1f2937] rounded-md" />
        <Text className="text-sm">مثبت</Text>
      </View>

      {/* هيكل الباص */}
      <View className="border border-gray-300 w-full p-4 rounded-t-[30px] rounded-b-md">
        {/* صف السائق */}
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-start",
            marginBottom: 12,
          }}
        >
          <View className="flex gap-2 items-center bg-[#ffedd5] px-4 py-2 rounded-t-3xl rounded-b-lg">
            <Ionicons name="time-outline" size={20} />
            <Text>السائق</Text>
          </View>
        </View>

        {/* صفوف المقاعد */}
        <View className="gap-1.5 items-center">
          {rows.map((row, rIdx) => (
            <View
              key={rIdx}
              className="flex-row items-center justify-center gap-1"
            >
              {row.seats.map((seat, sIdx) => {
                if (seat.type === "aisle") {
                  return <View key={sIdx} style={{ width: AISLE_WIDTH }} />;
                }
                if (seat.type === "empty") {
                  return (
                    <View
                      key={sIdx}
                      style={{ width: SEAT_SIZE, height: SEAT_SIZE }}
                    />
                  );
                }
                return (
                  <Seat
                    key={sIdx}
                    number={seat.number!}
                    status={statusOf(seat.number!)}
                    onPress={onSeatPress}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>

      <Text className="text-xs text-gray-500">
        إجمالي المقاعد: {totalSeats}
      </Text>
    </View>
  );
};

// ============ المكوّنات الستة الجاهزة ============
export const economyLargeBus = (props: SeatsMapBaseProps) => (
  <SeatsMapBase {...props} layout="economyLarge" />
);
export const economyMediumBus = (props: SeatsMapBaseProps) => (
  <SeatsMapBase {...props} layout="economyMedium" />
);
export const FirstClassLargeBus = (props: SeatsMapBaseProps) => (
  <SeatsMapBase {...props} layout="firstClassLarge" />
);
export const FirstClassMediumBus = (props: SeatsMapBaseProps) => (
  <SeatsMapBase {...props} layout="firstClassMedium" />
);
export const BusinessLargeBus = (props: SeatsMapBaseProps) => (
  <SeatsMapBase {...props} layout="businessLarge" />
);
export const BusinessMediumBus = (props: SeatsMapBaseProps) => (
  <SeatsMapBase {...props} layout="businessMedium" />
);

export default SeatsMapBase;
