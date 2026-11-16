import { FormRenderer, FieldSchema } from "@/components/dynamic-nativewind-form";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const validation = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  role: z.string().min(1, "Please select a role"),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  newsletter: z.boolean().optional(),
  country: z.string().optional(),
  test: z.string().optional()
});

const fields: FieldSchema[] = [
  {
    name: "fullName",
    type: "text",
    label: "Full Name",
    placeholder: "Jane Doe",
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "jane@example.com",
    keyboardType: "email-address",
    autoCapitalize: "none",
  },
  {
    name: "role",
    type: "select",
    label: "Role",
    options: [
      { label: "Developer", value: "dev" },
      { label: "Designer", value: "design" },
      { label: "Product Manager", value: "pm" },
    ],
  },
  {
    name: "test",
    type: "radio",
    label: "test",
    options: [
      { label: "one", value: "one" },
      { label: "two", value: "two" },
      { label: "three", value: "three" },
    ],
  },
  {
    name: "skills",
    type: "searchable-multi-select",
    label: "Skills",
    searchPlaceholder: "Search skills…",
    options: [
      { label: "React Native", value: "rn" },
      { label: "TypeScript", value: "ts" },
      { label: "Node.js", value: "node" },
      { label: "GraphQL", value: "gql" },
    ],
  },
  {
    name: "newsletter",
    type: "checkbox",
    label: "Subscribe to newsletter",
  },
  {
    name: "exprence",
    type: "slider",
    min: 5,
    max: 20,
    step: 1,
    label: "Exprence",
  },
  {
    name: "country",
    type: "searchable-select",
    label: "Country",
    searchPlaceholder: "Search countries…",
    options: [
      { label: "Netherlands", value: "nl" },
      { label: "Germany", value: "de" },
      { label: "France", value: "fr" },
    ],
  },
];

export default function App() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="p-4 m-4 border border-gray-300 rounded-lg">
          <FormRenderer
          
            schema={{ fields, validation, submitLabel: "Create Account" }}
            onSubmit={(data) => {
              // console.log("Submitted:", data);
              alert(JSON.stringify(data));
            }}

            submitClassName="bg-[#ea580c]"
            
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
