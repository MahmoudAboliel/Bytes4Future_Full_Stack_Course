import { Pressable, Text, View } from "react-native";
import { FieldWrapper } from "../components/FieldWrapper";
import { useDirection } from "../direction";
import { cn } from "../utils/cn";
import type { FieldComponentProps } from "../types";

export function RadioField({
  field,
  value,
  onChange,
  onBlur,
  error,
}: FieldComponentProps) {
  const radioField = field as Extract<
    FieldComponentProps["field"],
    { type: "radio" }
  >;
  const { isRTL } = useDirection();

  return (
    <FieldWrapper
      label={radioField.label}
      description={radioField.description}
      error={error}
    >
      <View className="gap-2">
        {radioField.options.map((opt) => {
          const selected = value === opt.value;
          return (
            <Pressable
              key={String(opt.value)}
              onPress={() => {
                if (!opt.disabled) {
                  onChange(opt.value);
                  onBlur();
                }
              }}
              disabled={opt.disabled}
              className={cn(
                "items-center gap-2 py-1",
                isRTL ? "flex-row-reverse" : "flex-row",
                opt.disabled && "opacity-50",
              )}
            >
              <View
                className={cn(
                  "h-5 w-5 items-center justify-center rounded-full border-2",
                  selected
                    ? "border-blue-600"
                    : "border-gray-400 dark:border-gray-500",
                )}
              >
                {selected && (
                  <View className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                )}
              </View>
              <Text className="flex-1 text-base text-black dark:text-white">
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </FieldWrapper>
  );
}
