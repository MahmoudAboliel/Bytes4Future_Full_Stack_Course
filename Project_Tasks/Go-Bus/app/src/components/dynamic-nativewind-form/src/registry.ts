// src/registry.ts
import type { ComponentType } from "react";
import type { FieldComponentProps } from "./types";
import { TextField } from "./fields/TextField";
import { SelectField } from "./fields/SelectField";
import { CheckboxField } from "./fields/CheckboxField";
import { RadioField } from "./fields/RadioField";
import { SwitchField } from "./fields/SwitchField";
import { DateField } from "./fields/DateField";
import { SliderField } from "./fields/SliderField";

const registry = new Map<string, ComponentType<FieldComponentProps>>();

export function registerField(
  type: string,
  component: ComponentType<FieldComponentProps>,
) {
  registry.set(type, component);
}

export function getFieldComponent(type: string) {
  return registry.get(type);
}

export function getMissingFieldTypes(types: string[]) {
  return types.filter((t) => !registry.has(t));
}

// Register built‑ins
registerField("text", TextField);
registerField("email", TextField);
registerField("password", TextField);
registerField("number", TextField);
registerField("phone", TextField);

registerField("select", SelectField);
registerField("searchable-select", SelectField);
registerField("multi-select", SelectField);
registerField("searchable-multi-select", SelectField);

registerField("checkbox", CheckboxField);
registerField("radio", RadioField);
registerField("switch", SwitchField);
registerField("date", DateField);
registerField("slider", SliderField);
