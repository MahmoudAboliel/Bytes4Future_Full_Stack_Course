import { Switch, Text, View } from "react-native";
import { FieldWrapper } from "../components/FieldWrapper";
import { useDirection } from "../direction";
import { cn } from "../utils/cn";
import type { FieldComponentProps } from "../types";

export function SwitchField({
  field,
  value,
  onChange,
  onBlur,
  error,
}: FieldComponentProps) {
  const { isRTL } = useDirection();
  return (
    <FieldWrapper
      label={undefined}
      description={field.description}
      error={error}
    >
      <View
        className={cn(
          "items-center justify-between py-1",
          isRTL ? "flex-row-reverse" : "flex-row",
        )}
      >
        <Text className="flex-1 text-base text-black dark:text-white">
          {field.label}
        </Text>
        <Switch
          value={Boolean(value)}
          onValueChange={(v) => {
            onChange(v);
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
