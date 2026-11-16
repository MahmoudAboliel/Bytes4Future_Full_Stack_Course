# dynamic-nativewind-form

A schema-driven, fully dynamic form library for React Native (Expo or bare) styled with **NativeWind**. Powered by **React Hook Form** + **Zod**.

- ⚡ Declare your form as a JSON-ish schema — no boilerplate `Controller` wiring.
- 🎨 Styled with NativeWind classes (light + dark out of the box).
- 🧠 Validation via Zod (`.refine`, `.superRefine`, `.transform` all work).
- 🔽 Rich select fields: single, **searchable**, **multi**, **searchable multi**.
- 🧩 Extensible field registry — swap or add field components without touching the engine.
- ♿ Accessible error messages with `accessibilityLiveRegion`.
- 🧾 First-class error handling (client + server-side).

---

## Table of Contents

- [Installation](#installation)
- [Peer Dependencies](#peer-dependencies)
- [NativeWind Setup](#nativewind-setup)
- [Quick Start](#quick-start)
- [Field Types Reference](#field-types-reference)
- [Select Fields (Single / Searchable / Multi / Searchable Multi)](#select-fields-single--searchable--multi--searchable-multi)
- [Error Handling](#error-handling)
- [Server-Side Errors](#server-side-errors)
- [Customising Styles](#customising-styles)
- [Registering Custom Fields](#registering-custom-fields)
- [Headless Mode (Bring Your Own Form)](#headless-mode-bring-your-own-form)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

---

## Installation

```bash
# Core library
npm install dynamic-nativewind-form

# Required peer dependencies
npm install react-hook-form @hookform/resolvers zod
npm install clsx tailwind-merge

# Optional — only if you use `date` fields
npm install @react-native-community/datetimepicker

# Optional — only if you use `slider` fields
npm install @react-native-community/slider
```

> Works with **Expo SDK 52+** and **bare React Native 0.76+**.

---

## Peer Dependencies

| Package | Version | Required |
|---|---|---|
| `react` | `>= 18` | ✅ |
| `react-native` | `>= 0.74` | ✅ |
| `react-hook-form` | `>= 7.45` | ✅ |
| `@hookform/resolvers` | `>= 3.3` | ✅ |
| `zod` | `>= 3.22` | ✅ |
| `nativewind` | `>= 4.0` | ✅ |
| `tailwind-merge` | `>= 2.2` | ✅ |
| `clsx` | `>= 2.0` | ✅ |
| `@react-native-community/datetimepicker` | `>= 7.0` | ⬜ only for `date` |
| `@react-native-community/slider` | `>= 4.0` | ⬜ only for `slider` |

---

## NativeWind Setup

NativeWind v4 **compiles Tailwind classes at build time**. You must tell Tailwind to scan the library's compiled files, otherwise the classes used inside the library will not be generated.

### 1. Update `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    // 👇 REQUIRED — scans the library’s compiled classes
    "./node_modules/dynamic-nativewind-form/**/*.{js,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Optional — semantic tokens you can override
        primary: { DEFAULT: "#2563EB", foreground: "#FFFFFF" },
        border: "#D1D5DB",
        destructive: { DEFAULT: "#DC2626", foreground: "#FFFFFF" },
      },
    },
  },
  plugins: [],
};
```

### 2. Ensure `babel.config.js` includes NativeWind

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

### 3. Ensure `metro.config.js` is set up

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

### 4. Import `global.css` once at the app root

```tsx
// App.tsx
import "./global.css";
```

> ⚠️ **NativeWind has no CSS cascade inheritance in React Native.** Every style must be declared explicitly (including both `light` and `dark` variants). The library's built-in fields already follow this rule — if you override styles, remember to declare both modes.

---

## Quick Start

```tsx
import { FormRenderer } from "@/components/dynamic-form";
import { z } from "zod";

const validation = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  role: z.string().min(1, "Please select a role"),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  newsletter: z.boolean().optional(),
});

const fields = [
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
];

export default function App() {
  return (
    <FormRenderer
      schema={{ fields, validation, submitLabel: "Create Account" }}
      onSubmit={(data) => {
        console.log("Submitted:", data);
      }}
    />
  );
}
```

---

## Field Types Reference

Every field accepts `name`, `label`, `description`, `disabled`, `className`, and `errorClassName`.

| `type` | Value shape | Notable props |
|---|---|---|
| `"text"` | `string` | `placeholder`, `autoCapitalize` |
| `"email"` | `string` | `keyboardType` defaults to `email-address` |
| `"password"` | `string` | `secureTextEntry` is applied automatically |
| `"number"` | `string` | `keyboardType: "numeric"` |
| `"phone"` | `string` | `keyboardType: "phone-pad"` |
| `"select"` | `string \| number` | `options`, `placeholder` |
| `"searchable-select"` | `string \| number` | + `searchPlaceholder` |
| `"multi-select"` | `(string \| number)[]` | `options`, `placeholder` |
| `"searchable-multi-select"` | `(string \| number)[]` | + `searchPlaceholder` |
| `"checkbox"` | `boolean` | — |
| `"radio"` | `string \| number` | `options` |
| `"switch"` | `boolean` | — |
| `"date"` | ISO string | `mode: "date" \| "time" \| "datetime"` |
| `"slider"` | `number` | `min`, `max`, `step` |

---

## Select Fields (Single / Searchable / Multi / Searchable Multi)

The library ships **four** select variants — pick the one that fits your UX. All four render as a **modal bottom sheet**, which avoids the classic React Native dropdown problems (z-index, ScrollView gesture conflicts, keyboard overlap).

### Single select

```ts
{
  name: "role",
  type: "select",
  label: "Role",
  placeholder: "Choose a role",
  options: [
    { label: "Developer", value: "dev" },
    { label: "Designer", value: "design" },
  ],
}
```

### Single searchable select

Useful for long option lists.

```ts
{
  name: "country",
  type: "searchable-select",
  label: "Country",
  searchPlaceholder: "Search countries…",
  options: [
    { label: "Netherlands", value: "nl" },
    { label: "Germany", value: "de" },
    { label: "France", value: "fr" },
    // …
  ],
}
```

### Multi select

Stores an **array** of values. The collapsed label shows up to 2 selected items, then `"N selected"`.

```ts
{
  name: "interests",
  type: "multi-select",
  label: "Interests",
  placeholder: "Pick interests",
  options: [
    { label: "Coding", value: "code" },
    { label: "Design", value: "design" },
    { label: "Writing", value: "write" },
  ],
}
```

### Searchable multi select

```ts
{
  name: "skills",
  type: "searchable-multi-select",
  label: "Skills",
  searchPlaceholder: "Search skills…",
  options: [
    { label: "React Native", value: "rn" },
    { label: "TypeScript", value: "ts" },
    { label: "Node.js", value: "node" },
  ],
}
```

### Zod schemas for selects

```ts
const validation = z.object({
  role: z.string().min(1, "Please select a role"),
  country: z.string().min(1, "Please select a country"),
  interests: z.array(z.string()).min(1, "Pick at least one interest"),
  skills: z.array(z.string()).min(2, "Pick at least two skills"),
});
```

### Common select options shape

```ts
type Option = {
  label: string;
  value: string | number;
  disabled?: boolean; // greys out and prevents selection
};
```

---

## Error Handling

Errors flow through the standard React Hook Form pipeline:

```
Zod schema  →  @hookform/resolvers/zod  →  useForm.errors  →  Field.error  →  FieldWrapper
```

Every error is rendered **immediately below its field**, using `accessibilityLiveRegion="polite"` so screen readers announce it.

### Supported scenarios

| Scenario | Behaviour |
|---|---|
| Required field left empty | Zod throws → RHF captures → red border + red message |
| Invalid email format | Same pipeline; the message is what you passed to Zod |
| Custom validation logic | Any `.refine`, `.superRefine`, `.transform` is supported |
| Server-side error | Use `setError` — see below |
| Errors on hidden fields | If you filter fields before rendering, their errors are simply not shown (RHF still tracks them) |

### Example: multi-error with custom messages

```ts
const validation = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("That doesn't look like an email"),
  age: z
    .number({ invalid_type_error: "Age must be a number" })
    .min(18, "You must be 18 or older"),
});
```

---

## Server-Side Errors

Because `FormRenderer` keeps its own internal form instance, server errors are best handled by lifting the form logic into your own component and using `FormProvider`.

### Option A — Use `FormProvider` (recommended)

```tsx
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormRenderer } from "dynamic-nativewind-form";

export function SignupScreen() {
  const methods = useForm({
    resolver: zodResolver(validation),
    defaultValues: {},
  });

  const onSubmit = async (data) => {
    try {
      await api.createUser(data);
    } catch (err) {
      if (err.field === "email") {
        methods.setError("email", {
          type: "server",
          message: "This email is already registered.",
        });
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <FormRenderer
        schema={{ fields, validation, submitLabel: "Sign Up" }}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
}
```

> When a `FormProvider` is present, `FormRenderer` automatically uses the surrounding form instance via `useFormContext`, so `setError` from any descendant works instantly.

### Option B — Validate on the server and re-render

If you don't want `FormProvider`, return field errors from your API and call `setError` in a wrapper. The wrapper approach is identical, but you own the `useForm` instance.

---

## Customising Styles

Every field schema accepts `className` and `errorClassName`. They are merged with the library defaults using **`tailwind-merge`**, so conflicting utilities are resolved in your favour.

```ts
{
  name: "bio",
  type: "text",
  label: "Bio",
  className: "rounded-xl border-2 border-purple-400 bg-purple-50",
  errorClassName: "text-purple-600",
}
```

### Dark mode

NativeWind does **not** inherit classes from a parent. Always declare both variants:

```ts
className: "text-black dark:text-white border-gray-300 dark:border-gray-600"
```

### Theming via `tailwind.config`

Override the semantic tokens to re-skin every field at once:

```js
theme: {
  extend: {
    colors: {
      primary: { DEFAULT: "#7C3AED", foreground: "#FFFFFF" },
      border: "#E5E7EB",
      destructive: { DEFAULT: "#EF4444", foreground: "#FFFFFF" },
    },
  },
},
```

---

## Registering Custom Fields

Add your own field components at runtime — no fork required.

```tsx
import {
  registerField,
  FieldWrapper,
  type FieldComponentProps,
} from "dynamic-nativewind-form";

function ColorPickerField({
  field,
  value,
  onChange,
  error,
}: FieldComponentProps) {
  return (
    <FieldWrapper label={field.label} error={error}>
      {/* your implementation */}
    </FieldWrapper>
  );
}

registerField("color-picker", ColorPickerField);
```

Then use it in your schema:

```ts
{
  name: "accentColor",
  type: "color-picker",
  label: "Accent colour",
}
```

### Custom component contract

```ts
type FieldComponentProps = {
  field: FieldSchema;
  value: any;
  onChange: (...event: any[]) => void;
  onBlur: () => void;
  error?: string;
  control: Control<any>;
  errors: FieldErrors;
};
```

---

## Headless Mode (Bring Your Own Form)

You can bypass `FormRenderer` and render fields directly. This is useful if you want total control over state (e.g. `Formik`, `zustand`, or a custom reducer).

```tsx
import { getFieldComponent } from "dynamic-nativewind-form";

const FieldComponent = getFieldComponent("text");

<FieldComponent
  field={{ name: "name", type: "text", label: "Name" }}
  value={value}
  onChange={setValue}
  onBlur={() => {}}
  error={error}
  control={control}
  errors={errors}
/>
```

---

## API Reference

### `<FormRenderer />`

| Prop | Type | Required | Description |
|---|---|---|---|
| `schema.fields` | `FieldSchema[]` | ✅ | Ordered list of field definitions |
| `schema.validation` | `ZodObject<any>` | ✅ | Zod object used by `zodResolver` |
| `schema.submitLabel` | `string` | ⬜ | Defaults to `"Submit"` |
| `onSubmit` | `(data) => void \| Promise<void>` | ✅ | Called with validated data |
| `defaultValues` | `Partial<FieldValues>` | ⬜ | Passed to `useForm` |
| `submitClassName` | `string` | ⬜ | Extra classes for the submit button |

### `registerField(type, component)`

Register or override a field component. Both built-ins and custom components use the same signature.

### `getFieldComponent(type)`

Returns the registered `ComponentType` for a field type, or `undefined`.

### `getMissingFieldTypes(types)`

Dev helper. Returns any field types that have no registered component. Called automatically inside `FormRenderer` when `__DEV__` and logs a warning.

### `<FieldWrapper />`

Shared layout used by all built-in fields — label, description, children, and error text.

### `<ErrorText />`

Standalone error text, useful if you build custom field layouts.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| **Styles are missing / fields render unstyled** | Tailwind is not scanning the library's `node_modules` path | Add `"./node_modules/dynamic-nativewind-form/**/*.{js,ts,tsx}"` to `content` in `tailwind.config.js` |
| **Dark mode colours don't switch** | You overrode classes without declaring both light + dark variants | Always pair: e.g. `"text-black dark:text-white"` |
| **Select opens behind other UI / inside a modal** | You replaced the built-in `SelectField` with an inline dropdown | The built-in uses a `Modal` bottom sheet; keep that pattern or use a portal |
| **"Unknown field type" red text appears** | A field `type` has no registered component | Use a supported type, or call `registerField` for your custom type |
| **Validation errors don't appear** | The Zod schema and field `name`s are out of sync | Ensure every field has a matching key in the Zod object |
| **`setError` from server has no effect** | `FormRenderer` keeps the form instance internal | Wrap your screen in `<FormProvider {...methods}>` — see [Server-Side Errors](#server-side-errors) |
| **`searchable-select` search doesn't filter** | Your `options[].label` isn't a string | `label` must be a string; it's the value used for the search filter |
| **`multi-select` value is `undefined` on submit** | Zod schema expects `array`, but `defaultValues` is empty | Pass `defaultValues={{ skills: [] }}` so RHF knows the shape is an array |

---

## FAQ

**Q: Does this work with Expo Go?**
A: Yes, with one caveat — `@react-native-community/datetimepicker` and `@react-native-community/slider` may require a development build on some platforms. Text, select, checkbox, radio, and switch fields work fine in Expo Go.

**Q: Can I use React Hook Form v6?**
A: No. The library targets RHF v7 and its `control`/`Controller` API.

**Q: Does it support Yup?**
A: The renderer uses `@hookform/resolvers/zod`. If you need Yup, use [Headless Mode](#headless-mode-bring-your-own-form) with your own resolver, or open an issue.

**Q: Can I render two forms on one screen?**
A: Yes — each `FormRenderer` instance has its own internal `useForm`. Just make sure `name`s in the two Zod schemas don't collide if you use `FormProvider`.

**Q: How do I make a field conditionally visible?**
A: Filter `schema.fields` before rendering, based on values read from `useWatch` inside a parent that owns the `FormProvider`.

```tsx
const role = useWatch({ control, name: "role" });
const visibleFields = fields.filter(
  (f) => f.name !== "companyName" || role === "business"
);
```

---

## License

MIT © You