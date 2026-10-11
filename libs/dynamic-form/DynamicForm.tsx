// src/components/dynamic-form/DynamicForm.tsx
"use client";

import {
  useForm,
  FormProvider,
  type SubmitErrorHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { DynamicFormProps, FieldConfig } from "./types";
import { buildSchema } from "./schema-builder";
import { FormField } from "./FormField";
import { Button } from "@/components/ui/button";
import {
  // FieldGroup,
  FieldSet,
  FieldLegend,
  FieldSeparator,
} from "@/components/ui/field";
import { Loader2 } from "lucide-react";

const columnClasses: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

const colSpanClasses: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-1 md:col-span-2",
  3: "col-span-1 md:col-span-2 lg:col-span-3",
  4: "col-span-1 md:col-span-2 lg:col-span-4",
  6: "col-span-1 md:col-span-2 lg:col-span-6",
  12: "col-span-full",
};

export function DynamicForm({
  fields,
  sections,
  schema,
  onSubmit,
  onError,
  defaultValues = {},
  submitLabel = "إرسال",
  cancelLabel = "إلغاء",
  onCancel,
  columns = 2,
  className,
  loading = false,
}: DynamicFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allFields = useMemo<FieldConfig[]>(() => {
    if (fields) return fields;
    if (sections) return sections.flatMap((s) => s.fields);
    return [];
  }, [fields, sections]);

  const validationSchema = useMemo(
    () => schema ?? buildSchema(allFields),
    [schema, allFields],
  );

  const form = useForm({
    resolver: zodResolver(validationSchema as any),
    defaultValues: defaultValues as never,
    mode: "onBlur",
  });

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      
      form.reset(defaultValues as never);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInvalid: SubmitErrorHandler<any> = (errors: { [s: string]: unknown; } | ArrayLike<unknown>) => {
    if (onError) {
      const formatted = Object.entries(errors).reduce(
        (acc, [key, value]) => {
          acc[key] =
            typeof value?.message === "string"
              ? value.message
              : "خطأ في التحقق";
          return acc;
        },
        {} as Record<string, string>,
      );
      onError(formatted);
    }
  };

  const renderField = (field: FieldConfig) => (
    <div
      key={field.name}
      className={cn(field.colSpan && colSpanClasses[field.colSpan])}
    >
      <FormField field={field} />
    </div>
  );

  const renderFields = (fieldsToRender: FieldConfig[]) => (
    <div className={cn("grid gap-3", columnClasses[columns])}>
      {fieldsToRender.map(renderField)}
    </div>
  );

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, handleInvalid)}
        className={cn("space-y-3", className)}
      >
        {sections ? (
          <div className="space-y-4">
            {sections.map((section, index) => (
              <FieldSet key={index}>
                {section.title && (
                  <FieldLegend variant="legend">{section.title}</FieldLegend>
                )}
                {section.description && (
                  <p className="text-sm text-muted-foreground -mt-2">
                    {section.description}
                  </p>
                )}
                {index > 0 && <FieldSeparator />}
                {renderFields(section.fields)}
              </FieldSet>
            ))}
          </div>
        ) : (
          renderFields(allFields)
        )}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting || loading}>
            {(isSubmitting || loading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {submitLabel}
          </Button>
          {onCancel && (
            <Button
              type="reset"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {cancelLabel}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
