// src/components/dynamic-form/fields/SwitchField.tsx
"use client";

import { useFormContext, Controller } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import type { SwitchFieldConfig } from "../types";

export function SwitchField({ field }: { field: SwitchFieldConfig }) {
  const { control } = useFormContext();

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
          <div className="space-y-0.5">
            <FieldLabel htmlFor={field.name}>
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
          <Switch
            id={field.name}
            checked={formField.value ?? false}
            onCheckedChange={formField.onChange}
            disabled={field.disabled}
            aria-invalid={fieldState.invalid}
          />
        </Field>
      )}
    />
  );
}
