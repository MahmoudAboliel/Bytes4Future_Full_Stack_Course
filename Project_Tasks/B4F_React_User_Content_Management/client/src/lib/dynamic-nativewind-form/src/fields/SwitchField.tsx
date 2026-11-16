// src/fields/SwitchField.tsx
import { Switch, Text, View } from "react-native";
import { FieldWrapper } from "../components/FieldWrapper";
import type { FieldComponentProps } from "../types";

export function SwitchField({
  field,
  value,
  onChange,
  onBlur,
  error,
}: FieldComponentProps) {
  return (
    <FieldWrapper
      label={field.label}
      description={field.description}
      error={error}
      className={field.className}
      errorClassName={field.errorClassName}
    >
      <View className="flex-row items-center justify-between py-1">
        <Text className="text-base text-black dark:text-white">
          {field.label}
        </Text>
        <Switch
          value={Boolean(value)}
          onValueChange={(val) => {
            onChange(val);
            onBlur();
          }}
          disabled={field.disabled}
          trackColor={{ false: "#D1D5DB", true: "#2563EB" }}
          thumbColor="#FFFFFF"
        />
      </View>
    </FieldWrapper>
  );
}
