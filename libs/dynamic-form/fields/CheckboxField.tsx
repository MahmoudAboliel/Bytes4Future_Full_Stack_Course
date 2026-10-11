// src/components/dynamic-form/fields/CheckboxField.tsx
"use client";

import { useFormContext, Controller } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import type { CheckboxFieldConfig } from "../types";

export function CheckboxField({ field }: { field: CheckboxFieldConfig }) {
  const { control } = useFormContext();

  // Checkbox مفرد
  if (!field.options) {
    return (
      <Controller
        control={control}
        name={field.name}
        render={({ field: formField, fieldState }) => (
          <Field
            orientation="horizontal"
            data-invalid={fieldState.invalid}
            className={field.className}
          >
            <Checkbox
              id={field.name}
              checked={formField.value ?? false}
              onCheckedChange={formField.onChange}
              disabled={field.disabled}
              aria-invalid={fieldState.invalid}
            />
            <div className="space-y-1 leading-none">
              <FieldLabel htmlFor={field.name} className="cursor-pointer">
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </FieldLabel>
              {field.description && (
                <FieldDescription>{field.description}</FieldDescription>
              )}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </div>
          </Field>
        )}
      />
    );
  }

  // مجموعة Checkboxes
  return (
    <Controller
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => {
        const value: string[] = formField.value ?? [];
        const toggle = (val: string) => {
          const next = value.includes(val)
            ? value.filter((v) => v !== val)
            : [...value, val];
          formField.onChange(next);
        };

        return (
          <Field data-invalid={fieldState.invalid} className={field.className}>
            <FieldLabel>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FieldLabel>
            {field.description && (
              <FieldDescription>{field.description}</FieldDescription>
            )}
            <div className="space-y-2 mt-1">
              {field.options!.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`${field.name}-${option.value}`}
                    checked={value.includes(String(option.value))}
                    onCheckedChange={() => toggle(String(option.value))}
                    disabled={field.disabled || option.disabled}
                  />
                  <label
                    htmlFor={`${field.name}-${option.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
