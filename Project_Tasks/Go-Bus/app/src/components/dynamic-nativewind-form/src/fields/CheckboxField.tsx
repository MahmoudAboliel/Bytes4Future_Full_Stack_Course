import { Pressable, Text, View } from "react-native";
import { FieldWrapper } from "../components/FieldWrapper";
import { useDirection } from "../direction";
import { cn } from "../utils/cn";
import type { FieldComponentProps } from "../types";

export function CheckboxField({
  field,
  value,
  onChange,
  onBlur,
  error,
}: FieldComponentProps) {
  const checked = Boolean(value);
  const { isRTL } = useDirection();

  return (
    <FieldWrapper
      label={undefined}
      description={field.description}
      error={error}
    >
      <Pressable
        onPress={() => {
          onChange(!checked);
          onBlur();
        }}
        disabled={field.disabled}
        className={cn(
          "items-center gap-2 py-2",
          isRTL ? "flex-row-reverse" : "flex-row",
        )}
      >
        <View
          className={cn(
            "h-5 w-5 items-center justify-center rounded border-2",
            checked
              ? "border-blue-600 bg-blue-600"
              : "border-gray-400 bg-white dark:border-gray-500 dark:bg-gray-900",
            field.disabled && "opacity-50",
          )}
        >
          {checked && <Text className="text-xs font-bold text-white">✓</Text>}
        </View>
        <Text className="flex-1 text-base text-black dark:text-white">
          {field.label}
        </Text>
      </Pressable>
    </FieldWrapper>
  );
}
