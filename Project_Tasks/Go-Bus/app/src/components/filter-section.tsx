import {
  FieldSchema,
  FormRenderer,
} from "@/components/dynamic-nativewind-form";
import { SYRIAN_GOVERNORATES } from "@/lib/constants";
import { toDateString } from "@/lib/utils";
import { filterAtom } from "@/store/filter-sotre";
import { useSetAtom } from "jotai";
import { View } from "react-native";
import { z } from "zod";

const FilterSection = () => {
  const setFilter = useSetAtom(filterAtom);

  const validation = z.object({
    source: z.string().optional(),
    destination: z.string().optional(),
    tripDate: z.string().optional(),
    section: z.string().optional(),
  });

  const fields: FieldSchema[] = [
    {
      name: "source",
      type: "searchable-select",
      placeholder: "اختر محطة الانطلاق",
      // label: "من",
      options: SYRIAN_GOVERNORATES,
    },
    {
      name: "destination",
      type: "searchable-select",
      // label: "إلى",
      placeholder: "اختر محطة الوصول",
      options: SYRIAN_GOVERNORATES,
    },
    {
      name: "tripDate",
      // label: "التاريخ",
      type: "date",
      placeholder: "تاريخ الرحلة",
    },
    {
      name: "section",
      // label: "التاريخ",
      type: "select",
      placeholder: "نوع الرحلة",
      options: [
        //"manual" | "scheduled" | "both"
        { label: "الجميع", value: "both" },
        { label: "رحلات مجدولة", value: "scheduled" },
        { label: "رحلات لمرة واحدة", value: "manual" },
      ],
    },
  ];

  return (
    <View className="bg-white m-8 -mt-8 p-4 rounded-2xl border border-[#fed7aa] gap-3">
      <FormRenderer
        schema={{ fields, validation, submitLabel: "ابحث عن رحلتك" }}
        onSubmit={(data) => {
          // alert(
          //   JSON.stringify({
          //     ...data,
          //     ...(data.tripDate && {
          //       tripDate: toDateString(new Date(data.tripDate)),
          //     }),
          //   }),
          // );
          setFilter({
            source: String(data.source ?? ""),
            destination: String(data.destination ?? ""),
            tripDate: data.tripDate
              ? toDateString(new Date(data.tripDate))
              : "",
            section: data.section,
          });
        }}
        showResetButton
        resetLabel="مسح"
        onReset={() => {
          setFilter({ source: null, destination: null, tripDate: null, section: "both" });
        }}
        submitClassName="bg-[#ea580c]"
      />
    </View>
  );
};

export default FilterSection;
