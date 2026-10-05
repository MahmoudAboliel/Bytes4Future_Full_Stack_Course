// src/components/dynamic-form/fields/TextareaField.tsx
"use client";

import { useFormContext, Controller } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { TextareaFieldConfig } from "../types";

export function TextareaField({ field }: { field: TextareaFieldConfig }) {
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
          <Textarea
            {...formField}
            id={field.name}
            placeholder={field.placeholder}
            disabled={field.disabled}
            rows={field.rows ?? 4}
            maxLength={field.maxLength}
            aria-invalid={fieldState.invalid}
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
