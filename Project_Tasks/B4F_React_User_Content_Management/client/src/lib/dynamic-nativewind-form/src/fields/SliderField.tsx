// src/fields/SliderField.tsx
import { Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { FieldWrapper } from "../components/FieldWrapper";
import type { FieldComponentProps } from "../types";

export function SliderField({
  field,
  value,
  onChange,
  onBlur,
  error,
}: FieldComponentProps) {
  const sliderField = field as Extract<
    FieldComponentProps["field"],
    { type: "slider" }
  >;

  return (
    <FieldWrapper
      label={sliderField.label}
      description={sliderField.description}
      error={error}
      className={sliderField.className}
      errorClassName={sliderField.errorClassName}
    >
      <View className="flex-row items-center gap-3">
        <Slider
          style={{ flex: 1 }}
          minimumValue={sliderField.min ?? 0}
          maximumValue={sliderField.max ?? 100}
          step={sliderField.step ?? 1}
          value={value ?? sliderField.min ?? 0}
          onValueChange={onChange}
          onSlidingComplete={onBlur}
          disabled={sliderField.disabled}
          minimumTrackTintColor="#2563EB"
          maximumTrackTintColor="#D1D5DB"
          thumbTintColor="#2563EB"
        />
        <Text className="w-10 text-right text-sm text-black dark:text-white">
          {value ?? sliderField.min ?? 0}
        </Text>
      </View>
    </FieldWrapper>
  );
}
