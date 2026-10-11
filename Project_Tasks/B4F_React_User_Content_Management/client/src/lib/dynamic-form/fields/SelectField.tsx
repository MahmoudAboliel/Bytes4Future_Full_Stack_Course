// src/components/dynamic-form/fields/SelectField.tsx
"use client";

import { useFormContext, Controller } from "react-hook-form";
import { useState, useMemo } from "react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SelectFieldConfig } from "../types";

export function SelectField({ field }: { field: SelectFieldConfig }) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  // استخدام Combobox إذا كان searchable مفعّلًا
  if (field.searchable) {
    return (
      <Controller
        control={control}
        name={field.name}
        render={({ field: formField, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className={field.className}>
            <FieldLabel htmlFor={field.name}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FieldLabel>
            <Combobox
              options={field.options}
              value={formField.value}
              onChange={formField.onChange}
              multiple={field.type === "multiselect"}
              placeholder={field.placeholder ?? "اختر..."}
              searchPlaceholder={field.searchPlaceholder ?? "ابحث..."}
              emptyMessage={field.emptyMessage ?? "لا توجد نتائج."}
              disabled={field.disabled}
              invalid={fieldState.invalid}
              id={field.name}
              open={open}
              setOpen={setOpen}
            />
            {field.description && (
              <FieldDescription>{field.description}</FieldDescription>
            )}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    );
  }

  // ==== Select تقليدي (بدون بحث) ====
  if (field.type === "multiselect") {
    // ... الكود القديم للـ multiselect العادي يبقى هنا
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

// ================================================
// مكوّن Combobox الداخلي — يدعم الوضع الفردي والمتعدد
// ================================================
interface ComboboxProps {
  options: { label: string; value: string | number; disabled?: boolean }[];
  value: string | string[] | null;
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  disabled?: boolean;
  invalid?: boolean;
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

function Combobox({
  options,
  value,
  onChange,
  multiple,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  disabled,
  invalid,
  id,
  open,
  setOpen,
}: ComboboxProps) {
  const selectedValues = useMemo(() => {
    if (multiple) return (value as string[]) ?? [];
    return value ? [String(value)] : [];
  }, [value, multiple]);

  const toggle = (val: string) => {
    if (multiple) {
      const next = selectedValues.includes(val)
        ? selectedValues.filter((v) => v !== val)
        : [...selectedValues, val];
      onChange(next);
    } else {
      onChange(val);
      setOpen(false);
    }
  };

  const remove = (val: string) => {
    if (multiple) {
      onChange(selectedValues.filter((v) => v !== val));
    } else {
      onChange("");
    }
  };

  // الحصول على التسميات المختارة
  const selectedLabels = selectedValues.map(
    (v) => options.find((o) => String(o.value) === v)?.label ?? v,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={invalid}
            className={cn(
              "w-full justify-between font-normal min-h-10 h-auto",
              !selectedValues.length && "text-muted-foreground",
            )}
            disabled={disabled}
          />
        }
      >
        <div className="flex flex-wrap gap-1 items-center">
          {selectedLabels.length === 0 && <span>{placeholder}</span>}

          {/* وضع فردي: نص عادي */}
          {!multiple && selectedLabels[0] && <span>{selectedLabels[0]}</span>}

          {/* وضع متعدد: Badges */}
          {multiple &&
            selectedLabels.length <= 2 &&
            selectedLabels.map((label, i) => (
              <Badge key={i} variant="secondary" className="gap-1">
                {label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(selectedValues[i]);
                  }}
                />
              </Badge>
            ))}

          {multiple && selectedLabels.length > 2 && (
            <>
              <Badge variant="secondary" className="gap-1">
                {selectedLabels[0]}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(selectedValues[0]);
                  }}
                />
              </Badge>
              <Badge variant="secondary">+{selectedLabels.length - 1}</Badge>
            </>
          )}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.includes(
                  String(option.value),
                );
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label} // ← مهم: البحث يعتمد على label
                    disabled={option.disabled}
                    onSelect={() =>
                      !option.disabled && toggle(String(option.value))
                    }
                    className="cursor-pointer"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-muted-foreground/30",
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// // src/components/dynamic-form/fields/SelectField.tsx
// "use client";

// import { useFormContext, Controller } from "react-hook-form";
// import { useState } from "react";
// import {
//   Field,
//   FieldLabel,
//   FieldDescription,
//   FieldError,
// } from "@/components/ui/field";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Check, ChevronDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";
// import type { SelectFieldConfig } from "../types";

// export function SelectField({ field }: { field: SelectFieldConfig }) {
//   const { control } = useFormContext();
//   const [search, setSearch] = useState("");

//   if (field.type === "multiselect") {
//     return (
//       <Controller
//         control={control}
//         name={field.name}
//         render={({ field: formField, fieldState }) => {
//           const value: string[] = formField.value ?? [];
//           const filtered = field.options.filter((o) =>
//             o.label.toLowerCase().includes(search.toLowerCase()),
//           );
//           const toggle = (val: string) => {
//             const next = value.includes(val)
//               ? value.filter((v) => v !== val)
//               : [...value, val];
//             formField.onChange(next);
//           };

//           return (
//             <Field
//               data-invalid={fieldState.invalid}
//               className={field.className}
//             >
//               <FieldLabel htmlFor={field.name}>
//                 {field.label}
//                 {field.required && (
//                   <span className="text-destructive ml-1">*</span>
//                 )}
//               </FieldLabel>
//               <Popover>
//                 <PopoverTrigger
//                   render={
//                     <Button
//                       id={field.name}
//                       variant="outline"
//                       role="combobox"
//                       className="w-full justify-between font-normal"
//                       disabled={field.disabled}
//                       aria-invalid={fieldState.invalid}
//                     />
//                   }
//                 >
//                   <div className="flex flex-wrap gap-1">
//                     {value.length === 0 && (
//                       <span className="text-muted-foreground">
//                         {field.placeholder ?? "اختر..."}
//                       </span>
//                     )}
//                     {value.slice(0, 2).map((v) => (
//                       <Badge key={v} variant="secondary">
//                         {field.options.find((o) => o.value === v)?.label ?? v}
//                       </Badge>
//                     ))}
//                     {value.length > 2 && (
//                       <Badge variant="secondary">+{value.length - 2}</Badge>
//                     )}
//                   </div>
//                   <ChevronDown className="h-4 w-4 opacity-50" />
//                 </PopoverTrigger>
//                 <PopoverContent className="w-full p-0" align="start">
//                   {field.searchable && (
//                     <div className="p-2 border-b">
//                       <Input
//                         placeholder="بحث..."
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                       />
//                     </div>
//                   )}
//                   <div className="max-h-60 overflow-y-auto p-1">
//                     {filtered.map((option) => (
//                       <div
//                         key={option.value}
//                         className={cn(
//                           "flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-accent",
//                           option.disabled && "opacity-50 cursor-not-allowed",
//                         )}
//                         onClick={() =>
//                           !option.disabled && toggle(String(option.value))
//                         }
//                       >
//                         <div
//                           className={cn(
//                             "h-4 w-4 border rounded flex items-center justify-center",
//                             value.includes(String(option.value)) &&
//                               "bg-primary border-primary",
//                           )}
//                         >
//                           {value.includes(String(option.value)) && (
//                             <Check className="h-3 w-3 text-primary-foreground" />
//                           )}
//                         </div>
//                         <span>{option.label}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </PopoverContent>
//               </Popover>
//               {field.description && (
//                 <FieldDescription>{field.description}</FieldDescription>
//               )}
//               {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
//             </Field>
//           );
//         }}
//       />
//     );
//   }

//   return (
//     <Controller
//       control={control}
//       name={field.name}
//       render={({ field: formField, fieldState }) => (
//         <Field data-invalid={fieldState.invalid} className={field.className}>
//           <FieldLabel htmlFor={field.name}>
//             {field.label}
//             {field.required && <span className="text-destructive ml-1">*</span>}
//           </FieldLabel>
//           <Select
//             onValueChange={formField.onChange}
//             value={formField.value ?? ""}
//             disabled={field.disabled}
//           >
//             <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
//               <SelectValue placeholder={field.placeholder ?? "اختر..."} />
//             </SelectTrigger>
//             <SelectContent>
//               {field.options.map((option) => (
//                 <SelectItem
//                   key={option.value}
//                   value={String(option.value)}
//                   disabled={option.disabled}
//                 >
//                   {option.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           {field.description && (
//             <FieldDescription>{field.description}</FieldDescription>
//           )}
//           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
//         </Field>
//       )}
//     />
//   );
// }
