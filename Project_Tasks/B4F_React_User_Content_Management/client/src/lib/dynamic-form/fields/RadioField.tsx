// src/components/dynamic-form/fields/RadioField.tsx
"use client";

import { useFormContext, Controller } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { RadioFieldConfig } from "../types";

export function RadioField({ field }: { field: RadioFieldConfig }) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={field.className}>
          <FieldLabel>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </FieldLabel>
          <RadioGroup
            onValueChange={formField.onChange}
            value={formField.value ?? ""}
            disabled={field.disabled}
            aria-invalid={fieldState.invalid}
            className={cn(
              field.orientation === "horizontal"
                ? "flex flex-wrap gap-4"
                : "space-y-2",
              "mt-1",
            )}
          >
            {field.options.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <RadioGroupItem
                  value={String(option.value)}
                  id={`${field.name}-${option.value}`}
                  disabled={option.disabled}
                />
                <label
                  htmlFor={`${field.name}-${option.value}`}
                  className="text-sm cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </RadioGroup>
          {field.description && (
            <FieldDescription>{field.description}</FieldDescription>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
