// src/fields/DateField.tsx
import { useState } from "react";
import { Pressable, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FieldWrapper } from "../components/FieldWrapper";
import { cn } from "../utils/cn";
import type { FieldComponentProps } from "../types";

export function DateField({
  field,
  value,
  onChange,
  onBlur,
  error,
}: FieldComponentProps) {
  const dateField = field as Extract<
    FieldComponentProps["field"],
    { type: "date" }
  >;
  const [show, setShow] = useState(false);

  const date = value ? new Date(value) : new Date();

  const format = (d: Date) => {
    if (dateField.mode === "time") {
      return d.toLocaleTimeString();
    }
    if (dateField.mode === "datetime") {
      return d.toLocaleString();
    }
    return d.toLocaleDateString();
  };

  return (
    <FieldWrapper
      label={dateField.label}
      description={dateField.description}
      error={error}
      className={dateField.className}
      errorClassName={dateField.errorClassName}
    >
      <Pressable
        onPress={() => {
          setShow(true);
          onBlur();
        }}
        className={cn(
          "rounded-lg border bg-white px-3 py-3",
          "border-gray-300 dark:border-gray-600 dark:bg-gray-900",
          error && "border-red-500 dark:border-red-400",
        )}
        disabled={dateField.disabled}
      >
        <Text
          className={cn(
            "text-base",
            value ? "text-black dark:text-white" : "text-gray-400",
          )}
        >
          {value ? format(date) : (dateField.placeholder ?? "Pick a date")}
        </Text>
      </Pressable>

      {show ? (
        <DateTimePicker
          value={date}
          mode={dateField.mode ?? "date"}
          display="default"
          onChange={(_, selected) => {
            setShow(false);
            if (selected) {
              onChange(selected.toISOString());
            }
          }}
        />
      ) : null}
    </FieldWrapper>
  );
}
