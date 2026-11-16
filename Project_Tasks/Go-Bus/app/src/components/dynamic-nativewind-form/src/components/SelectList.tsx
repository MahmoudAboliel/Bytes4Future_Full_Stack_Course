import { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, Text, TextInput } from "react-native";
import { useDirection } from "../direction";
import type { Option } from "../types";
import { cn } from "../utils/cn";

export function SelectList({
  visible,
  onClose,
  options,
  value,
  onChange,
  multiple = false,
  searchable = false,
  searchPlaceholder = "Search…",
}: {
  visible: boolean;
  onClose: () => void;
  options: Option[];
  value: string | number | (string | number)[] | undefined;
  onChange: (v: string | number | (string | number)[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
}) {
  const [query, setQuery] = useState("");
  const { isRTL } = useDirection();

  const filtered = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        String(o.value).toLowerCase().includes(q),
    );
  }, [options, query]);

  const isSelected = (o: Option) =>
    multiple
      ? Array.isArray(value) && value.includes(o.value)
      : value === o.value;

  const toggle = (o: Option) => {
    if (o.disabled) return;
    if (multiple) {
      const arr = Array.isArray(value) ? [...value] : [];
      const i = arr.indexOf(o.value);
      if (i >= 0) arr.splice(i, 1);
      else arr.push(o.value);
      onChange(arr);
    } else {
      onChange(o.value);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable className="flex-1 bg-black/40" onPress={onClose}>
        <Pressable className="mt-auto max-h-[70%] rounded-t-2xl bg-white p-4 dark:bg-gray-900">
          {searchable && (
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={searchPlaceholder}
              placeholderTextColor="#9CA3AF"
              textAlign={isRTL ? "right" : "left"}
              className={cn(
                "mb-3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-black",
                "dark:border-gray-600 dark:bg-gray-800 dark:text-white",
                isRTL ? "text-right" : "text-left",
              )}
            />
          )}

          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.value)}
            renderItem={({ item }) => {
              const selected = isSelected(item);
              return (
                <Pressable
                  onPress={() => toggle(item)}
                  disabled={item.disabled}
                  className={cn(
                    "items-center justify-between rounded-lg px-3 py-3",
                    isRTL ? "flex-row-reverse" : "flex-row",
                    selected && "bg-blue-50 dark:bg-blue-950",
                    item.disabled && "opacity-40",
                  )}
                >
                  <Text
                    className={cn(
                      "flex-1 text-base text-black dark:text-white",
                      isRTL ? "text-right" : "text-left",
                      selected &&
                        "font-semibold text-blue-600 dark:text-blue-400",
                    )}
                  >
                    {item.label}
                  </Text>
                  {selected && (
                    <Text className="mx-2 text-blue-600 dark:text-blue-400">
                      ✓
                    </Text>
                  )}
                </Pressable>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
