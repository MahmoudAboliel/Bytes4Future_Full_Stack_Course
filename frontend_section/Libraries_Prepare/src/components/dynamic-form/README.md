# 📘 Dynamic Form Library

مكتبة مكونات نماذج ديناميكية مبنية على **React + TypeScript + shadcn/ui + React Hook Form + Zod**.

تتيح لك بناء نموذج كامل من مصفوفة تكوين (Configuration) بدون كتابة JSX لكل حقل.

---

## ✨ نظرة عامة

- 🎯 **15+ نوع حقل** جاهز للاستخدام
- ✅ **تحقق تلقائي** عبر Zod يُبنى من إعدادات الحقول
- 📐 **تخطيط مرن** (1-4 أعمدة + `colSpan` لكل حقل)
- 📚 **مجموعات (Sections)** لتقسيم النماذج الطويلة
- 🌐 **دعم RTL** كامل للعربية
- ♿ **Accessibility** متوافق مع قارئات الشاشة

---

## 📦 المتطلبات

| المتطلب      | الإصدار |
| ------------ | ------- |
| Node.js      | 18+     |
| React        | 18+     |
| TypeScript   | 5+      |
| Tailwind CSS | 3+ أو 4 |

---

## 🚀 التثبيت

### 1. تهيئة shadcn/ui

```bash
npx shadcn@latest init
```

### 2. تثبيت مكونات shadcn المطلوبة

```bash
npx shadcn@latest add field input textarea select checkbox radio-group switch button calendar popover slider badge command
```

### 3. تثبيت المكتبات الأساسية

```bash
npm install react-hook-form zod @hookform/resolvers date-fns
```

| المكتبة               | الغرض                      |
| --------------------- | -------------------------- |
| `react-hook-form`     | إدارة حالة النموذج         |
| `zod`                 | التحقق من صحة البيانات     |
| `@hookform/resolvers` | ربط Zod بـ React Hook Form |
| `date-fns`            | تنسيق التواريخ             |

### 4. نسخ ملفات المكتبة

انسخ مجلد `dynamic-form/` إلى `src/components/`:

```
src/components/dynamic-form/
├── DynamicForm.tsx
├── FormField.tsx
├── schema-builder.ts
├── types.ts
└── fields/
    ├── TextField.tsx
    ├── NumberField.tsx
    ├── TextareaField.tsx
    ├── SelectField.tsx
    ├── CheckboxField.tsx
    ├── RadioField.tsx
    ├── SwitchField.tsx
    ├── DateField.tsx
    ├── FileField.tsx
    └── SliderField.tsx
```

---

## 🎯 الاستخدام الأساسي

```tsx
import { DynamicForm } from "@/components/dynamic-form/DynamicForm";
import { FieldConfig } from "@/components/dynamic-form/types";

const fields: FieldConfig[] = [
  {
    name: "fullName",
    label: "الاسم الكامل",
    type: "text",
    placeholder: "أدخل اسمك",
    required: true,
  },
  {
    name: "email",
    label: "البريد الإلكتروني",
    type: "email",
    required: true,
  },
];

export default function Page() {
  const handleSubmit = async (data: Record<string, unknown>) => {
    console.log(data);
  };

  return (
    <DynamicForm fields={fields} onSubmit={handleSubmit} submitLabel="حفظ" />
  );
}
```

---

## 📋 خصائص `DynamicForm`

| الخاصية         | النوع              | الافتراضي | الوصف                             |
| --------------- | ------------------ | --------- | --------------------------------- |
| `fields`        | `FieldConfig[]`    | —         | مصفوفة الحقول (بديل `sections`)   |
| `sections`      | `FormSection[]`    | —         | مجموعات من الحقول (بديل `fields`) |
| `schema`        | `ZodSchema`        | —         | Schema مخصص (اختياري)             |
| `onSubmit`      | `(data) => void`   | —         | دالة الإرسال (مطلوبة)             |
| `onError`       | `(errors) => void` | —         | دالة معالجة الأخطاء               |
| `defaultValues` | `object`           | `{}`      | القيم الافتراضية                  |
| `submitLabel`   | `string`           | `"إرسال"` | نص زر الإرسال                     |
| `cancelLabel`   | `string`           | `"إلغاء"` | نص زر الإلغاء                     |
| `onCancel`      | `() => void`       | —         | دالة الإلغاء (اختياري)            |
| `columns`       | `1 \| 2 \| 3 \| 4` | `2`       | عدد الأعمدة                       |
| `className`     | `string`           | —         | فئات CSS إضافية                   |
| `loading`       | `boolean`          | `false`   | حالة التحميل                      |

---

## 🔤 أنواع الحقول المدعومة

جميع الحقول تشترك في هذه الخصائص الأساسية:

| الخاصية       | النوع                         | الوصف                         |
| ------------- | ----------------------------- | ----------------------------- |
| `name`        | `string`                      | معرّف الحقل (مطلوب)           |
| `label`       | `string`                      | التسمية الظاهرة (مطلوب)       |
| `type`        | `FieldType`                   | نوع الحقل (مطلوب)             |
| `description` | `string`                      | نص مساعد أسفل الحقل           |
| `placeholder` | `string`                      | النص التوضيحي داخل الحقل      |
| `required`    | `boolean`                     | هل الحقل مطلوب؟               |
| `disabled`    | `boolean`                     | هل الحقل معطّل؟               |
| `className`   | `string`                      | فئات CSS إضافية               |
| `colSpan`     | `1 \| 2 \| 3 \| 4 \| 6 \| 12` | عدد الأعمدة التي يشغلها الحقل |

---

### 1️⃣ حقول النصوص — `text`, `email`, `password`, `tel`, `url`

**الخصائص الإضافية:**

| الخاصية     | النوع    | الوصف                   |
| ----------- | -------- | ----------------------- |
| `minLength` | `number` | الحد الأدنى لعدد الأحرف |
| `maxLength` | `number` | الحد الأقصى لعدد الأحرف |

**مثال:**

```tsx
{
  name: "username",
  label: "اسم المستخدم",
  type: "text",
  placeholder: "أدخل اسم المستخدم",
  required: true,
  minLength: 3,
  maxLength: 20,
}
```

---

### 2️⃣ الحقل الرقمي — `number`

**الخصائص الإضافية:**

| الخاصية | النوع    | الوصف                     |
| ------- | -------- | ------------------------- |
| `min`   | `number` | الحد الأدنى               |
| `max`   | `number` | الحد الأعلى               |
| `step`  | `number` | مقدار الزيادة (افتراضي 1) |

**مثال:**

```tsx
{
  name: "age",
  label: "العمر",
  type: "number",
  min: 18,
  max: 100,
  step: 1,
  required: true,
}
```

---

### 3️⃣ النص الطويل — `textarea`

**الخصائص الإضافية:**

| الخاصية     | النوع    | الوصف                   |
| ----------- | -------- | ----------------------- |
| `rows`      | `number` | عدد الأسطر (افتراضي 4)  |
| `maxLength` | `number` | الحد الأقصى لعدد الأحرف |

**مثال:**

```tsx
{
  name: "bio",
  label: "نبذة عنك",
  type: "textarea",
  rows: 4,
  maxLength: 500,
  colSpan: 2,
}
```

---

### 4️⃣ القائمة المنسدلة — `select`

**الخصائص الإضافية:**

| الخاصية   | النوع           | الوصف                  |
| --------- | --------------- | ---------------------- |
| `options` | `FieldOption[]` | خيارات القائمة (مطلوب) |

**`FieldOption`:**

```ts
{
  label: string;         // النص الظاهر
  value: string | number; // القيمة المخزّنة
  disabled?: boolean;    // هل الخيار معطّل؟
}
```

**مثال:**

```tsx
{
  name: "country",
  label: "الدولة",
  type: "select",
  searchable: true, // ← تفعيل البحث
  searchPlaceholder: "ابحث عن دولة...", // ← تخصيص نص البحث
  emptyMessage: "لم يتم العثور على دولة.", // ← تخصيص رسالة الفراغ
  placeholder: "اختر الدولة",
  required: true,
  options: [
    { label: "سوريا", value: "sy" },
    { label: "السعودية", value: "sa" },
    { label: "الإمارات", value: "ae", disabled: true },
  ],
}
```

---

### 5️⃣ القائمة متعددة الاختيار — `multiselect`

**الخصائص الإضافية:**

| الخاصية      | النوع           | الوصف                    |
| ------------ | --------------- | ------------------------ |
| `options`    | `FieldOption[]` | خيارات القائمة (مطلوب)   |
| `searchable` | `boolean`       | تفعيل البحث داخل القائمة |

**مثال:**

```tsx
{
  name: "skills",
  label: "المهارات",
  type: "multiselect",
  searchable: true,
  options: [
    { label: "React", value: "react" },
    { label: "TypeScript", value: "typescript" },
    { label: "Node.js", value: "nodejs" },
  ],
}
```

> القيمة المخزّنة: `string[]`

---

### 6️⃣ مربع الاختيار — `checkbox`

يدعم وضعين:

**أ) Checkbox واحد (Boolean):**

```tsx
{
  name: "terms",
  label: "أوافق على الشروط والأحكام",
  type: "checkbox",
  required: true,
}
```

> القيمة المخزّنة: `boolean`

**ب) مجموعة Checkboxes:**

```tsx
{
  name: "interests",
  label: "الاهتمامات",
  type: "checkbox",
  options: [
    { label: "الرياضة", value: "sports" },
    { label: "القراءة", value: "reading" },
    { label: "السفر", value: "travel" },
  ],
}
```

> القيمة المخزّنة: `string[]`

---

### 7️⃣ الأزرار الدائرية — `radio`

**الخصائص الإضافية:**

| الخاصية       | النوع                        | الوصف            |
| ------------- | ---------------------------- | ---------------- |
| `options`     | `FieldOption[]`              | الخيارات (مطلوب) |
| `orientation` | `"horizontal" \| "vertical"` | اتجاه العرض      |

**مثال:**

```tsx
{
  name: "gender",
  label: "الجنس",
  type: "radio",
  required: true,
  orientation: "horizontal",
  options: [
    { label: "ذكر", value: "male" },
    { label: "أنثى", value: "female" },
  ],
}
```

---

### 8️⃣ المفتاح — `switch`

**مثال:**

```tsx
{
  name: "newsletter",
  label: "الاشتراك في النشرة البريدية",
  type: "switch",
  description: "سيتم إرسال آخر الأخبار إلى بريدك",
}
```

> القيمة المخزّنة: `boolean`

---

### 9️⃣ حقل التاريخ — `date`

**الخصائص الإضافية:**

| الخاصية   | النوع  | الوصف            |
| --------- | ------ | ---------------- |
| `minDate` | `Date` | أقل تاريخ مسموح  |
| `maxDate` | `Date` | أكبر تاريخ مسموح |

**مثال:**

```tsx
{
  name: "birthDate",
  label: "تاريخ الميلاد",
  type: "date",
  required: true,
  minDate: new Date(1950, 0, 1),
  maxDate: new Date(),
}
```

> القيمة المخزّنة: `string` بصيغة `YYYY-MM-DD`

---

### 🔟 رفع الملفات — `file`

**الخصائص الإضافية:**

| الخاصية    | النوع     | الوصف                            |
| ---------- | --------- | -------------------------------- |
| `accept`   | `string`  | الصيغ المقبولة (مثل `.pdf,.doc`) |
| `multiple` | `boolean` | هل يسمح بملفات متعددة؟           |
| `maxSize`  | `number`  | الحد الأقصى للحجم بالبايت        |

**مثال:**

```tsx
{
  name: "cv",
  label: "السيرة الذاتية",
  type: "file",
  accept: ".pdf,.doc,.docx",
  maxSize: 5 * 1024 * 1024, // 5 MB
  required: true,
}
```

> القيمة المخزّنة: `File` أو `File[]` حسب `multiple`

---

### 1️⃣1️⃣ شريط التمرير — `slider`

**الخصائص الإضافية:**

| الخاصية | النوع    | الوصف                     |
| ------- | -------- | ------------------------- |
| `min`   | `number` | الحد الأدنى (مطلوب)       |
| `max`   | `number` | الحد الأعلى (مطلوب)       |
| `step`  | `number` | مقدار الزيادة (افتراضي 1) |

**مثال:**

```tsx
{
  name: "experience",
  label: "سنوات الخبرة",
  type: "slider",
  min: 0,
  max: 20,
  step: 1,
}
```

> القيمة المخزّنة: `number`

---

## 📚 استخدام المجموعات (Sections)

لتقسيم النموذج إلى مجموعات منطقية:

```tsx
import { FormSection } from "@/components/dynamic-form/types";

const sections: FormSection[] = [
  {
    title: "المعلومات الشخصية",
    description: "بياناتك الأساسية",
    fields: [
      { name: "fullName", label: "الاسم", type: "text", required: true },
      { name: "email", label: "البريد", type: "email", required: true },
    ],
  },
  {
    title: "التفضيلات",
    fields: [
      {
        name: "country",
        label: "الدولة",
        type: "select",
        options: [
          { label: "سوريا", value: "sy" },
          { label: "السعودية", value: "sa" },
        ],
      },
    ],
  },
];

<DynamicForm sections={sections} onSubmit={handleSubmit} />;
```

---

## 🎨 Schema مخصص

لإضافة تحقق معقّد (مثل تطابق كلمتي المرور):

```tsx
import { z } from "zod";

const customSchema = z
  .object({
    password: z.string().min(8, "كلمة المرور 8 أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

<DynamicForm schema={customSchema} fields={fields} onSubmit={handleSubmit} />;
```

---

## 🧪 مثال شامل

```tsx
"use client";

import { DynamicForm } from "@/components/dynamic-form/DynamicForm";
import { FormSection } from "@/components/dynamic-form/types";

const sections: FormSection[] = [
  {
    title: "المعلومات الشخصية",
    fields: [
      {
        name: "fullName",
        label: "الاسم الكامل",
        type: "text",
        required: true,
        minLength: 3,
      },
      {
        name: "email",
        label: "البريد الإلكتروني",
        type: "email",
        required: true,
      },
      {
        name: "birthDate",
        label: "تاريخ الميلاد",
        type: "date",
        required: true,
        minDate: new Date(1950, 0, 1),
      },
      {
        name: "country",
        label: "الدولة",
        type: "select",
        options: [
          { label: "سوريا", value: "sy" },
          { label: "السعودية", value: "sa" },
        ],
      },
      {
        name: "skills",
        label: "المهارات",
        type: "multiselect",
        searchable: true,
        options: [
          { label: "React", value: "react" },
          { label: "TypeScript", value: "typescript" },
        ],
      },
      {
        name: "experience",
        label: "سنوات الخبرة",
        type: "slider",
        min: 0,
        max: 20,
      },
      {
        name: "bio",
        label: "نبذة عنك",
        type: "textarea",
        rows: 4,
        colSpan: 2,
      },
      {
        name: "terms",
        label: "أوافق على الشروط",
        type: "checkbox",
        required: true,
      },
    ],
  },
];

export default function Page() {
  const handleSubmit = async (data: Record<string, unknown>) => {
    console.log("Form data:", data);
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <DynamicForm
        sections={sections}
        onSubmit={handleSubmit}
        submitLabel="حفظ"
        cancelLabel="إلغاء"
        onCancel={() => console.log("cancelled")}
        columns={2}
      />
    </div>
  );
}
```

---

## 📊 جدول مرجعي سريع

| النوع                                     | القيمة المخزّنة       | خصائص خاصة                      |
| ----------------------------------------- | --------------------- | ------------------------------- |
| `text`, `email`, `password`, `tel`, `url` | `string`              | `minLength`, `maxLength`        |
| `number`                                  | `number`              | `min`, `max`, `step`            |
| `textarea`                                | `string`              | `rows`, `maxLength`             |
| `select`                                  | `string`              | `options`                       |
| `multiselect`                             | `string[]`            | `options`, `searchable`         |
| `checkbox` (مفرد)                         | `boolean`             | —                               |
| `checkbox` (مجموعة)                       | `string[]`            | `options`                       |
| `radio`                                   | `string`              | `options`, `orientation`        |
| `switch`                                  | `boolean`             | —                               |
| `date`                                    | `string` (YYYY-MM-DD) | `minDate`, `maxDate`            |
| `file`                                    | `File` أو `File[]`    | `accept`, `multiple`, `maxSize` |
| `slider`                                  | `number`              | `min`, `max`, `step`            |

---

## 🛠️ استكشاف الأخطاء

| المشكلة                                   | الحل                                                       |
| ----------------------------------------- | ---------------------------------------------------------- |
| `Module not found: @/components/ui/field` | `npx shadcn@latest add field`                              |
| `Cannot find module 'react-hook-form'`    | `npm install react-hook-form zod @hookform/resolvers`      |
| التقويم لا يعرض قائمة السنة               | تأكد من تفعيل `captionLayout="dropdown"`                   |
| اختيار يوم يحدد اليوم السابق              | مشكلة المنطقة الزمنية — تُعالج داخل المكوّن عبر `format()` |
| حدود الحقول باهتة                         | عدّل `--border` في `globals.css`                           |
| `Select` لا يحفظ القيمة                   | استخدم `onValueChange` مع `Controller`                     |
