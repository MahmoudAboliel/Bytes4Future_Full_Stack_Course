// import { TextInput } from "react-native";
import { FieldWrapper } from "../components/FieldWrapper";
import { useDirection } from "../direction";
import { cn } from "../utils/cn";
import type { FieldComponentProps } from "../types";
import { TextInput } from "react-native";

export function TextField({ field, value, onChange, onBlur, error }: FieldComponentProps) {
  const inputProps = field as Extract<
    FieldComponentProps["field"],
    { type: "text" | "email" | "password" | "number" | "phone" }
  >;
  const { isRTL, dir } = useDirection();

  return (
    <FieldWrapper
      label={inputProps.label}
      description={inputProps.description}
      error={error}
      className={inputProps.className}
      errorClassName={inputProps.errorClassName}
    >
      <TextInput
        value={value ?? ""}
        onChangeText={onChange}
        onBlur={onBlur}
        placeholder={inputProps.placeholder}
        placeholderTextColor="#9CA3AF"
        editable={!inputProps.disabled}
        keyboardType={inputProps.keyboardType}
        autoCapitalize={inputProps.autoCapitalize}
        secureTextEntry={inputProps.type === "password"}
        textAlign={isRTL ? "right" : "left"}
        style={isRTL ? { writingDirection: "rtl" } : undefined}
        className={cn(
          "rounded-lg border bg-white px-3 py-2 text-base text-black",
          "border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white",
          error && "border-red-500 dark:border-red-400",
          inputProps.disabled && "opacity-50",
          isRTL ? "text-right" : "text-left",
          inputProps.className
        )}
      />
    </FieldWrapper>
  );
}