// src/components/dynamic-form/fields/SliderField.tsx
"use client";

import { useFormContext, Controller } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import type { SliderFieldConfig } from "../types";

export function SliderField({ field }: { field: SliderFieldConfig }) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => {
        const value = formField.value ?? field.min;

        return (
          <Field data-invalid={fieldState.invalid} className={field.className}>
            <FieldLabel htmlFor={field.name} className="flex justify-between">
              <span>
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </span>
              <span className="text-sm text-muted-foreground font-normal">
                {value}
              </span>
            </FieldLabel>
            <Slider
              id={field.name}
              value={[value]}
              onValueChange={(v) => {
                const nextValue = Array.isArray(v) ? v[0] : v;
                formField.onChange(nextValue);
              }}
              min={field.min}
              max={field.max}
              step={field.step ?? 1}
              disabled={field.disabled}
              aria-invalid={fieldState.invalid}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{field.min}</span>
              <span>{field.max}</span>
            </div>
            {field.description && (
              <FieldDescription>{field.description}</FieldDescription>
            )}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
