// src/components/SelectList.tsx
import {
  Modal,
  View,
  Text,
  Pressable,
  FlatList,
  TextInput,
} from "react-native";
import { useMemo, useState } from "react";
import type { Option } from "../types";
import { cn } from "../utils/cn";

type Props = {
  visible: boolean;
  onClose: () => void;
  options: Option[];
  value: string | number | (string | number)[] | undefined;
  onChange: (val: string | number | (string | number)[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
};

export function SelectList({
  visible,
  onClose,
  options,
  value,
  onChange,
  multiple = false,
  searchable = false,
  searchPlaceholder = "Search…",
}: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        String(o.value).toLowerCase().includes(q),
    );
  }, [options, query]);

  const isSelected = (option: Option) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(option.value);
    }
    return value === option.value;
  };

  const toggle = (option: Option) => {
    if (option.disabled) return;

    if (multiple) {
      const arr = Array.isArray(value) ? [...value] : [];
      const idx = arr.indexOf(option.value);
      if (idx >= 0) {
        arr.splice(idx, 1);
      } else {
        arr.push(option.value);
      }
      onChange(arr);
    } else {
      onChange(option.value);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable className="flex-1 bg-black/40" onPress={onClose}>
        <Pressable className="mt-auto max-h-[70%] rounded-t-2xl bg-white p-4 dark:bg-gray-900">
          {searchable ? (
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={searchPlaceholder}
              placeholderTextColor="#9CA3AF"
              className="mb-3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-black dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          ) : null}

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
                    "flex-row items-center justify-between rounded-lg px-3 py-3",
                    selected && "bg-blue-50 dark:bg-blue-950",
                    item.disabled && "opacity-40",
                  )}
                >
                  <Text
                    className={cn(
                      "text-base text-black dark:text-white",
                      selected &&
                        "font-semibold text-blue-600 dark:text-blue-400",
                    )}
                  >
                    {item.label}
                  </Text>
                  {selected ? (
                    <Text className="text-blue-600 dark:text-blue-400">✓</Text>
                  ) : null}
                </Pressable>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
