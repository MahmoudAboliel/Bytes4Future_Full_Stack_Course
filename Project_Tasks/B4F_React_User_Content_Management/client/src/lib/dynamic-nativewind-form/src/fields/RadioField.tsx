// src/fields/RadioField.tsx
import { Pressable, Text, View } from "react-native";
import { FieldWrapper } from "../components/FieldWrapper";
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

  return (
    <FieldWrapper
      label={radioField.label}
      description={radioField.description}
      error={error}
      className={radioField.className}
      errorClassName={radioField.errorClassName}
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
                "flex-row items-center gap-2 py-1",
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
                {selected ? (
                  <View className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                ) : null}
              </View>
              <Text className="text-base text-black dark:text-white">
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </FieldWrapper>
  );
}
