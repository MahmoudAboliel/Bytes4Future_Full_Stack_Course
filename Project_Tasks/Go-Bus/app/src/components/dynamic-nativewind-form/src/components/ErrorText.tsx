// src/components/ErrorText.tsx
import { Text } from "react-native";
import { cn } from "../utils/cn";

export function ErrorText({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  if (!message) return null;
  return (
    <Text
      accessibilityLiveRegion="polite"
      className={cn("mt-1 text-xs text-red-500 dark:text-red-400", className)}
    >
      {message}
    </Text>
  );
}
