// src/renderer/FormRenderer.tsx
import { View, Pressable, Text } from "react-native";
import { Controller, useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFieldComponent, getMissingFieldTypes } from "../registry";
import type { FormSchema, FieldSchema } from "../types";
import { cn } from "../utils/cn";
import type { ZodRawShape } from "zod";

type Props<T extends ZodRawShape> = {
  schema: FormSchema<T>;
  onSubmit: (data: FieldValues) => void | Promise<void>;
  defaultValues?: Partial<FieldValues>;
  submitClassName?: string;
};

export function FormRenderer<T extends ZodRawShape>({
  schema,
  onSubmit,
  defaultValues,
  submitClassName,
}: Props<T>) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema.validation),
    defaultValues,
  });

  // Dev‑time warning for unregistered types
  if (__DEV__) {
    const missing = getMissingFieldTypes(schema.fields.map((f) => f.type));
    if (missing.length > 0) {
      console.warn(
        `[dynamic-nativewind-form] Missing field components for: ${missing.join(", ")}`,
      );
    }
  }

  return (
    <View className="gap-2">
      {schema.fields.map((fieldSchema: FieldSchema) => {
        const FieldComponent = getFieldComponent(fieldSchema.type);

        if (!FieldComponent) {
          return (
            <View key={fieldSchema.name} className="mb-4">
              <Text className="text-red-500">
                Unknown field type: “{fieldSchema.type}”
              </Text>
            </View>
          );
        }

        return (
          <Controller
            key={fieldSchema.name}
            control={control}
            name={fieldSchema.name}
            render={({ field: { value, onChange, onBlur } }) => (
              <FieldComponent
                field={fieldSchema}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors[fieldSchema.name]?.message as string | undefined}
                control={control}
                errors={errors}
              />
            )}
          />
        );
      })}

      <Pressable
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className={cn(
          "mt-4 items-center rounded-lg bg-blue-600 px-4 py-3",
          isSubmitting && "opacity-50",
          submitClassName,
        )}
      >
        <Text className="text-base font-semibold text-white">
          {isSubmitting ? "Submitting…" : (schema.submitLabel ?? "Submit")}
        </Text>
      </Pressable>
    </View>
  );
}
