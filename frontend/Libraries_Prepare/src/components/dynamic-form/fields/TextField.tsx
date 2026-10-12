// src/components/dynamic-form/fields/TextField.tsx
"use client";

import { useFormContext, Controller } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { TextFieldConfig } from "../types";

export function TextField({ field }: { field: TextFieldConfig }) {
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
            type={field.type}
            placeholder={field.placeholder}
            disabled={field.disabled}
            minLength={field.minLength}
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
