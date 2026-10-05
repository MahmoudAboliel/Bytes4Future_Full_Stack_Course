// src/components/dynamic-form/fields/SelectField.tsx
"use client";

import { useFormContext, Controller } from "react-hook-form";
import { useState } from "react";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SelectFieldConfig } from "../types";

export function SelectField({ field }: { field: SelectFieldConfig }) {
  const { control } = useFormContext();
  const [search, setSearch] = useState("");

  if (field.type === "multiselect") {
    return (
      <Controller
        control={control}
        name={field.name}
        render={({ field: formField, fieldState }) => {
          const value: string[] = formField.value ?? [];
          const filtered = field.options.filter((o) =>
            o.label.toLowerCase().includes(search.toLowerCase()),
          );
          const toggle = (val: string) => {
            const next = value.includes(val)
              ? value.filter((v) => v !== val)
              : [...value, val];
            formField.onChange(next);
          };

          return (
            <Field
              data-invalid={fieldState.invalid}
              className={field.className}
            >
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
                      role="combobox"
                      className="w-full justify-between font-normal"
                      disabled={field.disabled}
                      aria-invalid={fieldState.invalid}
                    />
                  }
                >
                  <div className="flex flex-wrap gap-1">
                    {value.length === 0 && (
                      <span className="text-muted-foreground">
                        {field.placeholder ?? "اختر..."}
                      </span>
                    )}
                    {value.slice(0, 2).map((v) => (
                      <Badge key={v} variant="secondary">
                        {field.options.find((o) => o.value === v)?.label ?? v}
                      </Badge>
                    ))}
                    {value.length > 2 && (
                      <Badge variant="secondary">+{value.length - 2}</Badge>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  {field.searchable && (
                    <div className="p-2 border-b">
                      <Input
                        placeholder="بحث..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="max-h-60 overflow-y-auto p-1">
                    {filtered.map((option) => (
                      <div
                        key={option.value}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-accent",
                          option.disabled && "opacity-50 cursor-not-allowed",
                        )}
                        onClick={() =>
                          !option.disabled && toggle(String(option.value))
                        }
                      >
                        <div
                          className={cn(
                            "h-4 w-4 border rounded flex items-center justify-center",
                            value.includes(String(option.value)) &&
                              "bg-primary border-primary",
                          )}
                        >
                          {value.includes(String(option.value)) && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <span>{option.label}</span>
                      </div>
                    ))}
                  </div>
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
          <Select
            onValueChange={formField.onChange}
            value={formField.value ?? ""}
            disabled={field.disabled}
          >
            <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
              <SelectValue placeholder={field.placeholder ?? "اختر..."} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={String(option.value)}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.description && (
            <FieldDescription>{field.description}</FieldDescription>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
