// src/components/dynamic-form/components/FieldWrapper.tsx
import { View, Text } from "react-native";
import type { ReactNode } from "react";
import { useDirection } from "../direction";
import { cn } from "../utils/cn";

type Props = {
  label?: string;
  description?: string;
  error?: string;
  children: ReactNode;
  className?: string;
  errorClassName?: string;
};

export function FieldWrapper({
  label,
  description,
  error,
  children,
  className,
  errorClassName,
}: Props) {
  const { isRTL } = useDirection();
  const align = isRTL ? "text-right" : "text-left";
  const writing = isRTL ? "rtl" : "ltr";

  return (
    <View className={cn("mb-4 w-full", className)}>
      {label ? (
        <Text
          className={cn(
            "mb-1 text-sm font-medium text-black dark:text-white",
            align,
          )}
          style={{ writingDirection: writing }} // ← iOS: caret + punctuation
        >
          {label}
        </Text>
      ) : null}

      {description ? (
        <Text
          className={cn("mb-1 text-xs text-gray-500 dark:text-gray-400", align)}
          style={{ writingDirection: writing }}
        >
          {description}
        </Text>
      ) : null}

      {children}

      {error ? (
        <Text
          accessibilityLiveRegion="polite"
          className={cn(
            "mt-1 text-xs text-red-500 dark:text-red-400",
            align,
            errorClassName,
          )}
          style={{ writingDirection: writing }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
