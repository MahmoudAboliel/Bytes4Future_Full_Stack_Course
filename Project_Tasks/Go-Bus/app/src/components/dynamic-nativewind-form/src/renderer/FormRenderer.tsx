// src/components/dynamic-form/renderer/FormRenderer.tsx
import { View, Pressable, Text, Alert } from "react-native";
import {
  Controller,
  useForm,
  useFormContext,
  type DefaultValues,
  type FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFieldComponent, getMissingFieldTypes } from "../registry";
import { useDirection } from "../direction";
import type { FormSchema, FieldSchema } from "../types";
import { cn } from "../utils/cn";
import type { ZodRawShape, input as ZodInput, output as ZodOutput } from "zod";

type Props<T extends ZodRawShape> = {
  schema: FormSchema<T>;
  onSubmit: (data: FieldValues) => void | Promise<void>;

  // 🆕 خيارات زر الحذف / إعادة التعيين
  showResetButton?: boolean; // افتراضي: false
  resetLabel?: string; // افتراضي: "Reset"
  resetClassName?: string; // تخصيص الستايل
  confirmReset?: boolean; // افتراضي: false — يسأل قبل المسح
  confirmResetMessage?: string; // نص رسالة التأكيد
  onReset?: () => void | Promise<void>; // 🔑 مسح الـ state الخارجي (Jotai, Redux...)

  defaultValues?: Partial<FieldValues>;
  submitClassName?: string;
};

export function FormRenderer<T extends ZodRawShape>({
  schema,
  onSubmit,
  showResetButton = false,
  resetLabel = "Reset",
  resetClassName,
  confirmReset = false,
  confirmResetMessage = "هل تريد مسح كل الحقول؟",
  onReset,
  defaultValues,
  submitClassName,
}: Props<T>) {
  // ✨ يقرأ من FormProvider إن وُجد، وإلا ينشئ form داخلي
  const ctx = useFormContext();

  const internal = useForm<
    ZodInput<typeof schema.validation>,
    unknown,
    ZodOutput<typeof schema.validation>
  >({
    resolver: zodResolver(schema.validation),
    defaultValues: defaultValues as
      | DefaultValues<ZodInput<typeof schema.validation>>
      | undefined,
  });

  const form = ctx ?? internal;
  const {
    control,
    handleSubmit,
    reset, // 🆕
    formState: { errors, isSubmitting, isDirty },
  } = form;

  const { isRTL } = useDirection();

  if (__DEV__) {
    const schemaKeys = Object.keys(schema.validation.shape ?? {});
    const fieldNames = schema.fields.map((f) => f.name);
    const missingInZod = fieldNames.filter((n) => !schemaKeys.includes(n));
    if (missingInZod.length) {
      console.warn(`[dynamic-form] حقول غير موجودة في Zod:`, missingInZod);
    }
    const missingComp = getMissingFieldTypes(schema.fields.map((f) => f.type));
    if (missingComp.length) {
      console.warn(`[dynamic-form] حقول بلا مكوّن:`, missingComp);
    }
  }

  // 🔄 إجراء الحذف
  const doReset = async () => {
    reset(defaultValues as any); // يمسح القيم والأخطاء وisDirty
    await onReset?.(); // يمسح Jotai/Redux/… إن وُجد
  };

  const handleResetPress = () => {
    if (confirmReset) {
      Alert.alert(resetLabel, confirmResetMessage, [
        { text: "Cancel", style: "cancel" },
        { text: resetLabel, style: "destructive", onPress: doReset },
      ]);
    } else {
      doReset();
    }
  };

  return (
    <View className="gap-2">
      {schema.fields.map((fieldSchema: FieldSchema) => {
        const FieldComponent = getFieldComponent(fieldSchema.type);
        if (!FieldComponent) {
          return (
            <View key={fieldSchema.name} className="mb-4">
              <Text className="text-red-500">Unknown: {fieldSchema.type}</Text>
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

      {/* 🎛️ شريط الأزرار */}
      <View
        className={cn("mt-4 gap-3", isRTL ? "flex-row-reverse" : "flex-row")}
      >
        {/* زر الحذف — يظهر فقط عند تفعيله */}
        {showResetButton && (
          <Pressable
            onPress={handleResetPress}
            disabled={isSubmitting || !isDirty}
            className={cn(
              "flex-1 items-center rounded-lg border px-4 py-3",
              "border-red-300 bg-white dark:border-red-700 dark:bg-gray-900",
              (isSubmitting || !isDirty) && "opacity-40",
              resetClassName,
            )}
          >
            <Text className="text-base font-semibold text-red-600 dark:text-red-400">
              {resetLabel}
            </Text>
          </Pressable>
        )}

        {/* زر الإرسال */}
        <Pressable
          onPress={() => {
            void handleSubmit(onSubmit)();
          }}
          disabled={isSubmitting}
          className={cn(
            "flex-1 items-center rounded-lg bg-blue-600 px-4 py-3",
            isSubmitting && "opacity-50",
            !showResetButton && "flex-1", // يبقى بعرض كامل عند إخفاء زر الحذف
            submitClassName,
          )}
        >
          <Text className="text-base font-semibold text-white">
            {isSubmitting ? "..." : (schema.submitLabel ?? "Submit")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
