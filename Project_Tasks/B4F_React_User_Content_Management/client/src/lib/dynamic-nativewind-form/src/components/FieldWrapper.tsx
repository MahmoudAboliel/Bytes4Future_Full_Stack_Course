// src/components/FieldWrapper.tsx
import { View, Text } from "react-native";
import { cn } from "../utils/cn";
import type { ReactNode } from "react";

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
  return (
    <View className={cn("mb-4 w-full", className)}>
      {label ? (
        <Text className="mb-1 text-sm font-medium text-black dark:text-white">
          {label}
        </Text>
      ) : null}

      {description ? (
        <Text className="mb-1 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </Text>
      ) : null}

      {children}

      {error ? (
        <Text
          accessibilityLiveRegion="polite"
          className={cn(
            "mt-1 text-xs text-red-500 dark:text-red-400",
            errorClassName,
          )}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
