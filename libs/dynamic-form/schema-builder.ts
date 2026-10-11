// src/components/dynamic-form/schema-builder.ts
import { z } from "zod";
import type { FieldConfig } from "./types";

export function buildSchema(fields: FieldConfig[]): z.ZodObject<z.ZodRawShape> {
  const shape: Record<string, z.ZodType> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodType;

    switch (field.type) {
      case "text":
      case "password":
      case "tel":
        fieldSchema = z.string();
        break;
      case "email":
        fieldSchema = z.string().email("البريد الإلكتروني غير صالح");
        break;
      case "url":
        fieldSchema = z.string().url("الرابط غير صالح");
        break;
      case "number":
      case "slider":
        fieldSchema = z.coerce.number();
        break;
      case "textarea":
      case "select":
      case "radio":
      case "date":
        fieldSchema = z.string();
        break;
      case "multiselect":
        fieldSchema = z.array(z.string());
        break;
      case "checkbox":
        fieldSchema = field.options ? z.array(z.string()) : z.boolean();
        break;
      case "switch":
        fieldSchema = z.boolean();
        break;
      case "file":
        fieldSchema = z
          .any()
          .refine(
            (v) =>
              v instanceof File ||
              (Array.isArray(v) && v.every((f) => f instanceof File)),
            "يرجى اختيار ملف صالح",
          );
        break;
      default:
        fieldSchema = z.any();
    }

    // القيود
    if (field.type === "number" || field.type === "slider") {
      const numSchema = fieldSchema as z.ZodNumber;
      if ("min" in field && field.min !== undefined)
        fieldSchema = numSchema.min(field.min);
      if ("max" in field && field.max !== undefined)
        fieldSchema = numSchema.max(field.max);
    }
    if (field.type === "text" || field.type === "textarea") {
      const strSchema = fieldSchema as z.ZodString;
      if ("minLength" in field && field.minLength)
        fieldSchema = strSchema.min(field.minLength);
      if ("maxLength" in field && field.maxLength)
        fieldSchema = strSchema.max(field.maxLength);
    }

    // مطلوب / اختياري
    if (!field.required) {
      fieldSchema = fieldSchema.optional().or(z.literal(""));
    } else {
      if (fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.min(1, `${field.label} مطلوب`);
      }
      if (fieldSchema instanceof z.ZodArray) {
        fieldSchema = fieldSchema.min(1, `${field.label} مطلوب`);
      }
    }

    shape[field.name] = fieldSchema;
  });

  return z.object(shape);
}
