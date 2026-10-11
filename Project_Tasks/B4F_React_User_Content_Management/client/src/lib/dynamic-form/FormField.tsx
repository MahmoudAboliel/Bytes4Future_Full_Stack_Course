// src/components/dynamic-form/FormField.tsx
"use client";

import type { FieldConfig } from "./types";
import { TextField } from "./fields/TextField";
import { NumberField } from "./fields/NumberField";
import { TextareaField } from "./fields/TextareaField";
import { SelectField } from "./fields/SelectField";
import { CheckboxField } from "./fields/CheckboxField";
import { RadioField } from "./fields/RadioField";
import { SwitchField } from "./fields/SwitchField";
import { DateField } from "./fields/DateField";
import { FileField } from "./fields/FileField";
import { SliderField } from "./fields/SliderField";

export function FormField({ field }: { field: FieldConfig }) {
  switch (field.type) {
    case "text":
    case "email":
    case "password":
    case "tel":
    case "url":
      return <TextField field={field} />;
    case "number":
      return <NumberField field={field} />;
    case "textarea":
      return <TextareaField field={field} />;
    case "select":
    case "multiselect":
      return <SelectField field={field} />;
    case "checkbox":
      return <CheckboxField field={field} />;
    case "radio":
      return <RadioField field={field} />;
    case "switch":
      return <SwitchField field={field} />;
    case "date":
      return <DateField field={field} />;
    case "file":
      return <FileField field={field} />;
    case "slider":
      return <SliderField field={field} />;
    default:
      return null;
  }
}
