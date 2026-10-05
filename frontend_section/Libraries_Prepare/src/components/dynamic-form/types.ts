// src/components/dynamic-form/types.ts
import { z } from "zod";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "switch"
  | "date"
  | "file"
  | "slider"
  | "tel"
  | "url";

export interface FieldOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface BaseFieldConfig {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  colSpan?: 1 | 2 | 3 | 4 | 6 | 12;
  defaultValue?: unknown;
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "email" | "password" | "tel" | "url";
  minLength?: number;
  maxLength?: number;
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  type: "textarea";
  rows?: number;
  maxLength?: number;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select" | "multiselect";
  options: FieldOption[];
  searchable?: boolean;
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: "checkbox";
  options?: FieldOption[];
}

export interface RadioFieldConfig extends BaseFieldConfig {
  type: "radio";
  options: FieldOption[];
  orientation?: "horizontal" | "vertical";
}

export interface SwitchFieldConfig extends BaseFieldConfig {
  type: "switch";
}

export interface DateFieldConfig extends BaseFieldConfig {
  type: "date";
  minDate?: Date;
  maxDate?: Date;
}

export interface FileFieldConfig extends BaseFieldConfig {
  type: "file";
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
}

export interface SliderFieldConfig extends BaseFieldConfig {
  type: "slider";
  min: number;
  max: number;
  step?: number;
}

export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig
  | CheckboxFieldConfig
  | RadioFieldConfig
  | SwitchFieldConfig
  | DateFieldConfig
  | FileFieldConfig
  | SliderFieldConfig;

export interface FormSection {
  title?: string;
  description?: string;
  fields: FieldConfig[];
}

export interface DynamicFormProps {
  fields?: FieldConfig[];
  sections?: FormSection[];
  schema?: z.ZodSchema;
  onSubmit: (data: Record<string, unknown>) => void | Promise<void>;
  onError?: (errors: Record<string, string>) => void;
  defaultValues?: Record<string, unknown>;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  loading?: boolean;
}
