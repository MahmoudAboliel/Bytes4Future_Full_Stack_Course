import type { MyRecord } from "@/lib/types";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";


export type FieldForm = {
    value: string;
    label: string;
    onChange(value: string): void;
    type: "text" | "select" | "date";
    items?: MyRecord[]
}
export interface Props {
  title: string;
  desc: string;
  onSubmit(): void;
  fields: FieldForm[];
}
const RenderForm = ({ title, desc, onSubmit, fields }: Props) => {
  return (
    <FieldSet>
      <FieldLegend>{title}</FieldLegend>
      <FieldDescription>{desc}</FieldDescription>
      <FieldGroup>
        {fields.map(field => {
            if (field.type === "text" || field.type === "date") {
                return (
                  <Field key={field.label}>
                    <FieldLabel htmlFor={field.label}>{field.label}</FieldLabel>
                    <Input
                      id={field.label}
                      type={field.type}
                      autoComplete="off"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </Field>
                );
            }
            else if (field.items) {
                return (
                  <Field key={field.label}>
                    <FieldLabel htmlFor={field.label}>{field.label}</FieldLabel>
                    <Select
                      id={field.label}
                      value={field.value}
                      onValueChange={(value) => field.onChange(value ?? "")}
                      items={field.items}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {field.items.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                );
            }
        })}
        
        <Button
          onClick={onSubmit}
        >
          Submit
        </Button>
      </FieldGroup>
    </FieldSet>
  );
}

export default RenderForm;