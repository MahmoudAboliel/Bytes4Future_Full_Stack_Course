// src/fields/SelectField.tsx
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { FieldWrapper } from "../components/FieldWrapper";
import { SelectList } from "../components/SelectList";
import { cn } from "../utils/cn";
import type { FieldComponentProps, Option } from "../types";

export function SelectField({
  field,
  value,
  onChange,
  onBlur,
  error,
}: FieldComponentProps) {
  const selectField = field as Extract<
    FieldComponentProps["field"],
    {
      type:
        | "select"
        | "searchable-select"
        | "multi-select"
        | "searchable-multi-select";
    }
  >;

  const [open, setOpen] = useState(false);

  const multiple =
    selectField.type === "multi-select" ||
    selectField.type === "searchable-multi-select";

  const searchable =
    selectField.type === "searchable-select" ||
    selectField.type === "searchable-multi-select";

  const displayValue = (): string => {
    if (value == null || (Array.isArray(value) && value.length === 0)) {
      return selectField.placeholder ?? "Select…";
    }

    if (multiple) {
      const selectedLabels = selectField.options
        .filter((o: Option) => (value as (string | number)[]).includes(o.value))
        .map((o) => o.label);

      if (selectedLabels.length === 0)
        return selectField.placeholder ?? "Select…";
      if (selectedLabels.length <= 2) return selectedLabels.join(", ");
      return `${selectedLabels.length} selected`;
    }

    const opt = selectField.options.find((o) => o.value === value);
    return opt?.label ?? selectField.placeholder ?? "Select…";
  };

  return (
    <FieldWrapper
      label={selectField.label}
      description={selectField.description}
      error={error}
      className={selectField.className}
      errorClassName={selectField.errorClassName}
    >
      <Pressable
        onPress={() => {
          setOpen(true);
          onBlur();
        }}
        className={cn(
          "flex-row items-center justify-between rounded-lg border bg-white px-3 py-3",
          "border-gray-300 dark:border-gray-600 dark:bg-gray-900",
          error && "border-red-500 dark:border-red-400",
          selectField.disabled && "opacity-50",
        )}
        disabled={selectField.disabled}
      >
        <Text
          className={cn(
            "flex-1 text-base",
            value == null || (Array.isArray(value) && value.length === 0)
              ? "text-gray-400 dark:text-gray-500"
              : "text-black dark:text-white",
          )}
          numberOfLines={1}
        >
          {displayValue()}
        </Text>
        <Text className="ml-2 text-gray-500 dark:text-gray-400">▾</Text>
      </Pressable>

      <SelectList
        visible={open}
        onClose={() => setOpen(false)}
        options={selectField.options}
        value={value}
        onChange={(val) => {
          onChange(val);
          if (!multiple) onBlur();
        }}
        multiple={multiple}
        searchable={searchable}
        searchPlaceholder={selectField.searchPlaceholder}
      />
    </FieldWrapper>
  );
}
