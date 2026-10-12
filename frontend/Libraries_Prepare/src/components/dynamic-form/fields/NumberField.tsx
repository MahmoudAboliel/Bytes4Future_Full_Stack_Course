// src/components/dynamic-form/fields/NumberField.tsx
"use client";

import { useFormContext, Controller } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { NumberFieldConfig } from "../types";

export function NumberField({ field }: { field: NumberFieldConfig }) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={field.className}>
          <FieldLabel htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </FieldLabel>
          <Input
            {...formField}
            id={field.name}
            type="number"
            placeholder={field.placeholder}
            disabled={field.disabled}
            min={field.min}
            max={field.max}
            step={field.step ?? 1}
            aria-invalid={fieldState.invalid}
            onChange={(e) =>
              formField.onChange(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            value={formField.value ?? ""}
          />
          {field.description && (
            <FieldDescription>{field.description}</FieldDescription>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
