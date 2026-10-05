// src/components/dynamic-form/fields/DateField.tsx
"use client";

import { useFormContext, Controller } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { DateFieldConfig } from "../types";

export function DateField({ field }: { field: DateFieldConfig }) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => {
        const date = formField.value ? new Date(formField.value) : undefined;

        return (
          <Field data-invalid={fieldState.invalid} className={field.className}>
            <FieldLabel htmlFor={field.name}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FieldLabel>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    id={field.name}
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                    disabled={field.disabled}
                    aria-invalid={fieldState.invalid}
                  />
                }
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date
                  ? format(date, "PPP")
                  : (field.placeholder ?? "اختر تاريخاً")}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) =>
                    formField.onChange(d ? d.toISOString().split("T")[0] : "")
                  }
                  disabled={(d) =>
                    (field.minDate ? d < field.minDate : false) ||
                    (field.maxDate ? d > field.maxDate : false)
                  }
                />
              </PopoverContent>
            </Popover>
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
