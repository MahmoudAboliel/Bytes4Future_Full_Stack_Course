// src/types.ts
import type { ReactNode } from "react";
import type { Control, FieldErrors } from "react-hook-form";
import type { ZodObject, ZodRawShape } from "zod";

export type Option = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

export type BaseField = {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  errorClassName?: string;
};

export type TextFieldSchema = BaseField & {
  type: "text" | "email" | "password" | "number" | "phone";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
};

export type SelectFieldSchema = BaseField & {
  type:
    | "select"
    | "searchable-select"
    | "multi-select"
    | "searchable-multi-select";
  options: Option[];
  searchPlaceholder?: string;
  maxSelectedDisplay?: number;
};

export type CheckboxFieldSchema = BaseField & {
  type: "checkbox";
};

export type RadioFieldSchema = BaseField & {
  type: "radio";
  options: Option[];
};

export type SwitchFieldSchema = BaseField & {
  type: "switch";
};

export type DateFieldSchema = BaseField & {
  type: "date";
  mode?: "date" | "time" | "datetime";
};

export type SliderFieldSchema = BaseField & {
  type: "slider";
  min?: number;
  max?: number;
  step?: number;
};

export type FieldSchema =
  | TextFieldSchema
  | SelectFieldSchema
  | CheckboxFieldSchema
  | RadioFieldSchema
  | SwitchFieldSchema
  | DateFieldSchema
  | SliderFieldSchema;

export type FormSchema<T extends ZodRawShape> = {
  fields: FieldSchema[];
  validation: ZodObject<T>;
  submitLabel?: string;
};

export type FieldComponentProps = {
  field: FieldSchema;
  value: any;
  onChange: (...event: any[]) => void;
  onBlur: () => void;
  error?: string;
  control: Control<any>;
  errors: FieldErrors;
};
