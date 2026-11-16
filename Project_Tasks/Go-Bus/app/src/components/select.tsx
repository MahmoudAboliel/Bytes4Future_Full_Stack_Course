// components/ui/Select.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SelectProps {
  label: string | React.ReactNode;
  placeholder?: string;
  options: { label: string, value: string | null }[];
  value: string | null;
  className?: string;
  onChange: (item: string | null) => void;
}
const Select = ({
  label, // عنوان الحقل
  placeholder = "اختر...",
  options = [], // [{ label, value }, ...]
  value, // القيمة المحددة
  onChange, // (value) => void
  className = "",
}: SelectProps) => {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <View className={`gap-1 ${className}`}>
      {typeof label === "string" ? (
        <Text className="text-sm font-semibold text-gray-700">{label}</Text>
      ) : (label)}

      {/* الحقل */}
      <Pressable
        onPress={() => setOpen(true)}
        className="flex-row-reverse items-center justify-between border border-gray-300 rounded-lg px-4 py-3 bg-white"
      >
        <Ionicons name="chevron-down" size={18} color="#6b7280" />
        <Text
          className={`text-base ${selected ? "text-gray-900" : "text-gray-400"}`}
          numberOfLines={1}
        >
          {selected ? selected.label : placeholder}
        </Text>
      </Pressable>

      {/* نافذة الاختيار */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View className="flex-1 bg-black/40 justify-center px-6">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-2xl max-h-[70%] overflow-hidden">
                {/* رأس النافذة */}
                <View className="flex-row-reverse items-center justify-between px-4 py-3 border-b border-gray-200">
                  <Text className="font-bold text-base">{label || "اختر"}</Text>
                  <Pressable onPress={() => setOpen(false)} hitSlop={10}>
                    <Ionicons name="close" size={22} color="#374151" />
                  </Pressable>
                </View>
 
                {/* الخيارات */}
                <FlatList
                  data={options}
                  keyExtractor={(item) => String(item.value)}
                  renderItem={({ item }) => {
                    const isActive = item.value === value;
                    return (
                      <Pressable
                        onPress={() => {
                          onChange?.(item.value);
                          setOpen(false);
                        }}
                        className={`flex-row-reverse items-center justify-between px-4 py-3 border-b border-gray-100 ${
                          isActive ? "bg-[#ffedd5]" : ""
                        }`}
                      >
                        <Text
                          className={`text-base ${
                            isActive
                              ? "text-[#ea580c] font-bold"
                              : "text-gray-800"
                          }`}
                        >
                          {item.label}
                        </Text>
                        {isActive && (
                          <Ionicons
                            name="checkmark"
                            size={20}
                            color="#ea580c"
                          />
                        )}
                      </Pressable>
                    );
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default Select;
