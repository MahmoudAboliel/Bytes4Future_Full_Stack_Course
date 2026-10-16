# 📘 `README.md` — DataTable

> مكوّن جدول بيانات احترافي لـ **React + TypeScript + Tailwind CSS** — يدعم RTL، الوضع الليلي، البحث، الفلاتر، الترتيب، التحديد المتعدد، إجراءات السطر، والترقيم بدون أي مكتبات خارجية.

---

## 📑 جدول المحتويات

1. [المتطلبات](#-المتطلبات)
2. [البنية](#-البنية)
3. [البدء السريع](#-البدء-السريع)
4. [المرجع الكامل للـ Props](#-المرجع-الكامل-للـ-props)
5. [الأنواع (Types)](#-الأنواع-types)
6. [أمثلة متقدمة](#-أمثلة-متقدمة)
7. [أفضل الممارسات](#-أفضل-الممارسات)
8. [الأداء](#-الأداء)
9. [الأسئلة الشائعة](#-الأسئلة-الشائعة)
10. [استكشاف الأخطاء](#-استكشاف-الأخطاء)
11. [قائمة التحقق قبل النشر](#-قائمة-التحقق-قبل-النشر)

---

## 🧩 المتطلبات

| الحزمة       | الإصدار الأدنى |
| ------------ | -------------- |
| React        | `18.0.0`       |
| TypeScript   | `4.9.0`        |
| Tailwind CSS |`4.0.0`        |

---

## 📁 البنية

```
src/
├── components/
│   └── DataTable/
│       ├── DataTable.tsx     # المكوّن الرئيسي
│       ├── types.ts          # تعريفات الأنواع (Types)
│       └── README.md         # هذا الملف
└── pages/
    └── UsersPage.tsx         # مثال استخدام
```

### الاستيراد

```tsx
// المكوّن الرئيسي
import DataTable from "@/components/DataTable/DataTable";

// الأنواع
import type {
  Column,
  Filter,
  RowAction,
  BulkAction,
  DataTableProps,
} from "@/components/DataTable/types";

// أو استيراد الكل من ملف واحد (إذا أضفت index.ts)
import DataTable, { type Column, type Filter } from "@/components/DataTable";
```

> 💡 **نصيحة:** أضف `index.ts` داخل المجلد لتسهيل الاستيراد:
>
> ```ts
> // src/components/DataTable/index.ts
> export { default } from "./DataTable";
> export * from "./types";
> ```

---

## 🚀 البدء السريع

### 1) مثال بسيط

```tsx
import DataTable from "@/components/DataTable/DataTable";
import type { Column } from "@/components/DataTable/types";

interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "لابتوب", price: 3500 },
  { id: 2, name: "هاتف", price: 1500 },
];

const columns: Column<Product>[] = [
  { key: "name", header: "الاسم", sortable: true },
  { key: "price", header: "السعر", sortable: true, align: "end" },
];

export default function App() {
  return <DataTable<Product> columns={columns} data={products} rowKey="id" />;
}
```

هذا كل شيء! ستحصل تلقائياً على:

- ✅ بحث عام
- ✅ ترتيب بالنقر على الرأس
- ✅ ترقيم
- ✅ دعم RTL
- ✅ الوضع الليلي

---

## 📚 المرجع الكامل للـ Props

### Props الرئيسية

| Prop           | النوع         | الافتراضي                 | الوصف                      |
| -------------- | ------------- | ------------------------- | -------------------------- |
| `columns`      | `Column<T>[]` | **مطلوب**                 | تعريف أعمدة الجدول         |
| `data`         | `T[]`         | **مطلوب**                 | مصفوفة البيانات            |
| `rowKey`       | `keyof T`     | **مطلوب**                 | حقل المفتاح المميّز لكل صف |
| `loading`      | `boolean`     | `false`                   | عرض Skeleton أثناء التحميل |
| `emptyMessage` | `string`      | `"لا توجد بيانات لعرضها"` | رسالة الحالة الفارغة       |
| `className`    | `string`      | `""`                      | كلاسات إضافية للحاوية      |

### الرأس والشريط العلوي

| Prop       | النوع       | الافتراضي | الوصف                                   |
| ---------- | ----------- | --------- | --------------------------------------- |
| `title`    | `ReactNode` | —         | عنوان الجدول                            |
| `subtitle` | `ReactNode` | —         | وصف فرعي تحت العنوان                    |
| `toolbar`  | `ReactNode` | —         | عناصر إضافية بجانب العنوان (أزرار، إلخ) |

### البحث

| Prop                | النوع     | الافتراضي  | الوصف                 |
| ------------------- | --------- | ---------- | --------------------- |
| `searchable`        | `boolean` | `true`     | تفعيل حقل البحث العام |
| `searchPlaceholder` | `string`  | `"بحث..."` | نص الحقل التوضيحي     |

### الفلاتر

| Prop      | النوع         | الافتراضي | الوصف                  |
| --------- | ------------- | --------- | ---------------------- |
| `filters` | `Filter<T>[]` | `[]`      | قائمة الفلاتر المنسدلة |

### التحديد المتعدد

| Prop                | النوع                 | الافتراضي | الوصف                        |
| ------------------- | --------------------- | --------- | ---------------------------- |
| `selectable`        | `boolean`             | `false`   | تفعيل صناديق الاختيار        |
| `onSelectionChange` | `(rows: T[]) => void` | —         | يُستدعى عند تغيير التحديد    |
| `bulkActions`       | `BulkAction<T>[]`     | `[]`      | إجراءات تُطبَّق على المحدَّد |

### إجراءات السطر

| Prop            | النوع            | الافتراضي   | الوصف                                   |
| --------------- | ---------------- | ----------- | --------------------------------------- |
| `rowActions`    | `RowAction<T>[]` | `[]`        | قائمة إجراءات لكل صف                    |
| `actionsHeader` | `string`         | `"إجراءات"` | تسمية قائمة الإجراءات (لأغراض الوصولية) |

### الترقيم

| Prop              | النوع      | الافتراضي         | الوصف                |
| ----------------- | ---------- | ----------------- | -------------------- |
| `pagination`      | `boolean`  | `true`            | تفعيل الترقيم        |
| `defaultPageSize` | `number`   | `10`              | عدد الصفوف في الصفحة |
| `pageSizeOptions` | `number[]` | `[5, 10, 25, 50]` | خيارات حجم الصفحة    |

### المظهر

| Prop         | النوع              | الافتراضي | الوصف                      |
| ------------ | ------------------ | --------- | -------------------------- |
| `striped`    | `boolean`          | `false`   | تلوين الصفوف بالتبادل      |
| `hoverable`  | `boolean`          | `true`    | تأثير عند المرور على الصف  |
| `onRowClick` | `(row: T) => void` | —         | يُستدعى عند النقر على الصف |

---

## 🧬 الأنواع (Types)

> جميع الأنواع معرّفة في `src/components/DataTable/types.ts`.

### `Column<T>`

```ts
export interface Column<T> {
  /** مفتاح فريد للعمود — يُستخدم للربط مع row[key] والترتيب */
  key: string;

  /** نص الرأس — يقبل ReactNode لعرض أيقونات أو عناصر مخصصة */
  header: ReactNode;

  /** لاستخراج القيمة من الصف (يدعم القيم المتداخلة مثل user.address.city) */
  accessor?: (row: T, index: number) => unknown;

  /** عرض JSX مخصص للخلية (يتجاوز accessor والعرض الافتراضي) */
  render?: (row: T, index: number) => ReactNode;

  /** تفعيل الترتيب بالنقر على الرأس */
  sortable?: boolean;

  /** دالة مخصصة للترتيب (مفيدة لتواريخ نصية أو أرقام مُنسّقة) */
  sortAccessor?: (row: T) => string | number | Date | null | undefined;

  /** استثناء العمود من البحث العام (افتراضي: true) */
  searchable?: boolean;

  /** محاذاة محتوى الخلية */
  align?: "start" | "center" | "end";

  /** عرض العمود (يُمرَّر إلى style) */
  width?: string | number;

  /** كلاسات Tailwind إضافية للخلايا */
  className?: string;

  /** كلاسات Tailwind إضافية لرأس العمود */
  headerClassName?: string;
}
```

### `Filter<T>`

```ts
export interface FilterOption {
  label: string;
  value: string;
}

export interface Filter<T> {
  /** اسم الحقل في T (أو مفتاح مخصص مع accessor) */
  key: keyof T | string;

  /** تسمية الفلتر المعروضة في القائمة المنسدلة */
  label: string;

  /** خيارات الفلتر */
  options: FilterOption[];

  /** (اختياري) دالة مخصصة لاستخراج القيمة من الصف */
  accessor?: (row: T) => unknown;
}
```

### `RowAction<T>`

```ts
export interface RowAction<T> {
  /** نص الإجراء المعروض في القائمة */
  label: string;

  /** أيقونة اختيارية (ReactNode) */
  icon?: ReactNode;

  /** الدالة المُنفَّذة عند النقر */
  onClick: (row: T) => void;

  /** كلاسات Tailwind للتنسيق (مثل اللون الأحمر للحذف) */
  className?: string;

  /** إخفاء الإجراء شرطياً */
  hidden?: (row: T) => boolean;
}
```

### `BulkAction<T>`

```ts
export interface BulkAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (rows: T[]) => void;
  className?: string;
}
```

### `DataTableProps<T>`

```ts
export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: keyof T;
  loading?: boolean;
  emptyMessage?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  toolbar?: ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  filters?: Filter<T>[];
  selectable?: boolean;
  onSelectionChange?: (rows: T[]) => void;
  bulkActions?: BulkAction<T>[];
  rowActions?: RowAction<T>[];
  actionsHeader?: string;
  pagination?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  striped?: boolean;
  hoverable?: boolean;
  onRowClick?: (row: T) => void;
  className?: string;
}
```

---

## 🎨 أمثلة متقدمة

### مثال 1: جدول كامل بكل الميزات

```tsx
import { useMemo, useState } from "react";
import DataTable from "@/components/DataTable/DataTable";
import type { Column } from "@/components/DataTable/types";

type Role = "admin" | "editor" | "viewer";
type Status = "active" | "inactive" | "pending";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: Status;
  salary: number;
  joined: string;
}

const ROLE_META: Record<Role, { label: string; cls: string }> = {
  admin: {
    label: "مدير",
    cls: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
  editor: {
    label: "محرر",
    cls: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  viewer: {
    label: "مشاهد",
    cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  },
};

const STATUS_META: Record<Status, { t: string; c: string }> = {
  active: { t: "نشط", c: "bg-emerald-500" },
  inactive: { t: "غير نشط", c: "bg-slate-400" },
  pending: { t: "معلّق", c: "bg-amber-500" },
};

const USERS: User[] = [
  {
    id: 1,
    name: "أحمد محمد",
    email: "ahmed@mail.com",
    role: "admin",
    status: "active",
    salary: 12000,
    joined: "2023-01-15",
  },
  // ...
];

export default function UsersPage() {
  const [selected, setSelected] = useState<User[]>([]);

  const columns = useMemo<Column<User>[]>(
    () => [
      {
        key: "name",
        header: "المستخدم",
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white">
              {row.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium">{row.name}</p>
              <p className="text-xs text-slate-400">{row.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: "role",
        header: "الدور",
        align: "center",
        sortable: true,
        render: (row) => (
          <span
            className={`rounded-full px-2.5 py-1 text-xs ${ROLE_META[row.role].cls}`}
          >
            {ROLE_META[row.role].label}
          </span>
        ),
      },
      {
        key: "status",
        header: "الحالة",
        align: "center",
        render: (row) => (
          <span className="inline-flex items-center gap-1.5 text-xs">
            <span
              className={`h-2 w-2 rounded-full ${STATUS_META[row.status].c}`}
            />
            {STATUS_META[row.status].t}
          </span>
        ),
      },
      {
        key: "salary",
        header: "الراتب",
        align: "end",
        sortable: true,
        render: (row) => (
          <span className="font-semibold tabular-nums">
            {row.salary.toLocaleString("ar-EG")} ر.س
          </span>
        ),
      },
      {
        key: "joined",
        header: "تاريخ الانضمام",
        align: "end",
        sortable: true,
        sortAccessor: (row) => new Date(row.joined),
        render: (row) => new Date(row.joined).toLocaleDateString("ar-EG"),
      },
    ],
    [],
  );

  return (
    <DataTable<User>
      title="إدارة المستخدمين"
      subtitle="تحكم كامل في حسابات الفريق"
      columns={columns}
      data={USERS}
      rowKey="id"
      selectable
      onSelectionChange={setSelected}
      searchPlaceholder="ابحث بالاسم أو البريد..."
      filters={[
        {
          key: "role",
          label: "الدور",
          options: [
            { label: "مدير", value: "admin" },
            { label: "محرر", value: "editor" },
            { label: "مشاهد", value: "viewer" },
          ],
        },
        {
          key: "status",
          label: "الحالة",
          options: [
            { label: "نشط", value: "active" },
            { label: "غير نشط", value: "inactive" },
            { label: "معلّق", value: "pending" },
          ],
        },
      ]}
      bulkActions={[
        {
          label: "حذف المحدد",
          onClick: (rows) => console.log("delete", rows),
          className: "bg-red-600 text-white hover:bg-red-700",
        },
        { label: "تصدير", onClick: (rows) => console.log("export", rows) },
      ]}
      rowActions={[
        { label: "عرض الملف", onClick: (r) => console.log("view", r) },
        { label: "تعديل", onClick: (r) => console.log("edit", r) },
        {
          label: "حذف",
          className: "text-red-600 hover:bg-red-50",
          hidden: (r) => r.role === "admin",
          onClick: (r) => console.log("delete", r),
        },
      ]}
      onRowClick={(row) => console.log("row clicked:", row)}
      defaultPageSize={10}
      striped
    />
  );
}
```

---

### مثال 2: عمود مخصص بقيم متداخلة (Nested Accessor)

```tsx
interface Order {
  id: string;
  customer: { name: string; email: string };
  total: number;
}

const columns: Column<Order>[] = [
  {
    key: "customerName",
    header: "العميل",
    accessor: (row) => row.customer.name,
    sortable: true,
    render: (row) => (
      <div>
        <p>{row.customer.name}</p>
        <p className="text-xs text-slate-400">{row.customer.email}</p>
      </div>
    ),
  },
  {
    key: "total",
    header: "المجموع",
    align: "end",
    sortable: true,
  },
];
```

---

### مثال 3: جدول بدون ترقيم (قائمة قصيرة)

```tsx
<DataTable<Item>
  columns={columns}
  data={items}
  rowKey="id"
  pagination={false}
  searchable={false}
/>
```

---

### مثال 4: جدول للقراءة فقط

```tsx
<DataTable<Log>
  columns={columns}
  data={logs}
  rowKey="id"
  searchable={false}
  filters={[]}
  selectable={false}
  pagination={false}
/>
```

---

### مثال 5: رأس عمود مخصص (ReactNode)

```tsx
const columns: Column<User>[] = [
  {
    key: "salary",
    header: (
      <span className="inline-flex items-center gap-1">
        الراتب
        <span className="text-xs text-slate-400">(ر.س)</span>
      </span>
    ),
    align: "end",
    sortable: true,
  },
];
```

---

### مثال 6: Skeleton أثناء التحميل

```tsx
function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  return (
    <DataTable<User>
      columns={columns}
      data={users}
      rowKey="id"
      loading={loading}
    />
  );
}
```

---

### مثال 7: زر تصدير في الـ toolbar

```tsx
<DataTable<User>
  columns={columns}
  data={users}
  rowKey="id"
  toolbar={
    <button
      onClick={() => exportToCSV(users)}
      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
    >
      تصدير CSV
    </button>
  }
/>
```

---

### مثال 8: الوضع الليلي (Dark Mode)

المكوّن يدعم الوضع الليلي تلقائياً إذا أضفت `class="dark"` على `<html>` أو أي حاوية أعلى:

```tsx
document.documentElement.classList.add("dark");
```

جميع الألوان محددة مسبقاً بـ `dark:` prefixes، فلا تحتاج أي تعديل.

---

## 🏆 أفضل الممارسات

### ✅ استخدم `useMemo` للأعمدة

```tsx
// ✅ صحيح — يمنع إعادة إنشاء الأعمدة في كل render
const columns = useMemo<Column<User>[]>(() => [...], []);

// ❌ خطأ — يعيد إنشاء الأعمدة في كل render مما يبطئ الجدول
const columns: Column<User>[] = [...];
```

### ✅ استخدم `render` للأعمدة المعقدة

بدلاً من تحويل البيانات مسبقاً، اجعل `render` يتولى التنسيق:

```tsx
// ✅ صحيح — البيانات تبقى نظيفة في المصدر
{
  key: "status",
  header: "الحالة",
  render: (row) => <StatusBadge status={row.status} />,
}
```

### ✅ استخدم `sortAccessor` للتواريخ والأرقام المُنسّقة

```tsx
{
  key: "joined",
  header: "تاريخ الانضمام",
  sortable: true,
  // بدونه سيتم الترتيب كنص أبجدي
  sortAccessor: (row) => new Date(row.joined),
  render: (row) => new Date(row.joined).toLocaleDateString("ar-EG"),
}
```

### ✅ استخدم `hidden` لإخفاء الإجراءات غير المصرّح بها

```tsx
{
  label: "حذف",
  hidden: (r) => r.role === "admin",
  onClick: (r) => deleteUser(r.id),
}
```

### ✅ اربط `rowKey` بحقل منطقي فريد

```tsx
// ✅ صحيح
<DataTable<User> rowKey="id" ... />

// ❌ خطأ — قد يسبب مشاكل في التحديد والترتيب
<DataTable<User> rowKey="name" ... />
```

### ✅ استخدم `className` للتحكم بالمظهر الخارجي فقط

```tsx
<DataTable<User> className="shadow-lg" ... />
```

---

## ⚡ الأداء

### للبيانات الصغيرة (< 1,000 صف)

المكوّن يعمل بكفاءة عالية خارج الصندوق. لا حاجة لأي تحسينات.

### للبيانات المتوسطة (1,000 – 10,000 صف)

```tsx
// 1) غلّف الجدول بـ React.memo إذا كانت الـ props ثابتة
const MemoDataTable = React.memo(DataTable) as typeof DataTable;

// 2) استخدم useMemo للأعمدة (إلزامي)
const columns = useMemo(() => [...], []);

// 3) استخدم useCallback للـ handlers
const handleRowClick = useCallback((row: User) => { ... }, []);
```

### للبيانات الضخمة (> 10,000 صف)

يُنصح بالانتقال إلى **server-side pagination/sorting/filtering**. أضف props جديدة:

```ts
interface DataTableProps<T> {
  // ...
  totalCount?: number; // العدد الكلي من السيرفر
  onQueryChange?: (query: {
    page: number;
    pageSize: number;
    search: string;
    sort: { key: string; dir: "asc" | "desc" } | null;
    filters: Record<string, string>;
  }) => void;
}
```

أو استخدم مكتبة مثل `@tanstack/react-table` مع `react-virtual` للـ virtual scrolling.

---

## ❓ الأسئلة الشائعة

### 1) كيف أغيّر لغة الجدول إلى الإنجليزية؟

غيّر `dir="rtl"` إلى `dir="ltr"` في `DataTable.tsx`، واستبدل النصوص الافتراضية:

```tsx
emptyMessage = "No data to display",
searchPlaceholder = "Search...",
actionsHeader = "Actions",
```

### 2) كيف أضيف عمود إجراءات مخصص؟

استخدم `render` مع JSX مخصص:

```tsx
{
  key: "custom",
  header: "إجراءات",
  render: (row) => (
    <button onClick={() => alert(row.id)}>عرض</button>
  ),
}
```

### 3) كيف أُخفي عمود معيّن؟

لا تستخدم `hidden` (غير مدعوم). بدلاً من ذلك، صفِّ الأعمدة قبل تمريرها:

```tsx
const visibleColumns = useMemo(
  () => columns.filter((c) => !c.key.startsWith("_")),
  [columns]
);

<DataTable columns={visibleColumns} ... />
```

### 4) كيف أُترجم اسم الحالة إلى العربية؟

استخدم map + `render`:

```tsx
const STATUS_LABELS: Record<Status, string> = {
  active: "نشط",
  inactive: "غير نشط",
  pending: "معلّق",
};

{
  key: "status",
  header: "الحالة",
  render: (row) => STATUS_LABELS[row.status],
}
```

### 5) كيف أُصدّر الجدول إلى CSV؟

استخدم `toolbar` مع زر مخصص:

```tsx
<DataTable
  toolbar={
    <button
      onClick={() => exportToCSV(users)}
      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white"
    >
      تصدير CSV
    </button>
  }
  ...
/>
```

### 6) هل يمكن استخدامه مع Next.js؟

نعم. أضف `"use client"` في أعلى `DataTable.tsx` إذا كنت تستخدم App Router:

```tsx
"use client";
import { useState } from "react";
// ...
```

### 7) كيف أُغيّر ألوان الجدول (Branding)؟

عدّل كلاسات Tailwind مباشرة في `DataTable.tsx`. مثلاً، استبدل `indigo` بلون آخر:

```
indigo-600 → brand-600
```

أو استخدم `className` لتمرير كلاسات مخصصة على الحاوية:

```tsx
<DataTable className="[&_button.bg-indigo-600]:bg-blue-600" ... />
```

---

## 🔧 استكشاف الأخطاء

### ❌ `Type 'X' does not satisfy the constraint 'Record<string, unknown>'`

**السبب:** استخدام `interface` مع قيد `Record<string, unknown>` في `DataTable.tsx`.

**الحل:** في `DataTable.tsx`، غيّر القيد إلى `object`:

```diff
- export default function DataTable<T extends Record<string, unknown>>({ ... })
+ export default function DataTable<T extends object>({ ... })
```

ثم عدّل الأماكن التي تصل إلى خصائص ديناميكية باستخدام cast:

```ts
const getCellValue = (row: T, col: Column<T>): unknown =>
  col.accessor
    ? col.accessor(row, 0)
    : (row as Record<string, unknown>)[col.key];

const getRowId = (row: T): RowId =>
  (row as Record<string, unknown>)[rowKey as string] as RowId;
```

وفي `filtered`:

```ts
const rowValue = filter?.accessor
  ? filter.accessor(row)
  : (row as Record<string, unknown>)[key];
```

---

### ❌ `Avoid calling setState() directly within an effect`

**السبب:** استخدام `useEffect` لإعادة تعيين الصفحة.

**الحل:** استبدل `useEffect` بتحديث أثناء العرض:

```tsx
// ❌ خطأ
useEffect(() => setPage(1), [search, filterValues, pageSize]);

// ✅ صحيح
const [prevDeps, setPrevDeps] = useState<{
  search: string;
  filterValues: Record<string, string>;
  pageSize: number;
} | null>(null);

if (
  prevDeps === null ||
  prevDeps.search !== search ||
  prevDeps.filterValues !== filterValues ||
  prevDeps.pageSize !== pageSize
) {
  setPrevDeps({ search, filterValues, pageSize });
  setPage(1);
}
```

---

### ❌ `Expected an assignment or function call and instead saw an expression`

**السبب:** استخدام `ternary` كـ statement بدل `if/else`.

**الحل:**

```ts
// ❌ خطأ
next.has(id) ? next.delete(id) : next.add(id);

// ✅ صحيح
if (next.has(id)) next.delete(id);
else next.add(id);
```

---

### ❌ الترتيب لا يعمل على التواريخ

**السبب:** القيم نصية (`"2023-01-15"`).

**الحل:** استخدم `sortAccessor`:

```tsx
{
  key: "joined",
  sortable: true,
  sortAccessor: (row) => new Date(row.joined),
}
```

---

### ❌ الجدول لا يعرض الوضع الليلي

**السبب:** لم تُفعّل `darkMode: "class"` في `tailwind.config.ts`.

**الحل:**

```ts
export default {
  darkMode: "class",
  // ...
};
```

ثم أضف `class="dark"` على `<html>`:

```html
<html class="dark"></html>
```

---

### ❌ الفلاتر لا تعمل على الحقول المتداخلة

**السبب:** `filter.key` يُطابق حقل مباشر فقط.

**الحل:** استخدم `accessor` في الفلتر:

```tsx
{
  key: "city",
  label: "المدينة",
  accessor: (row) => row.address.city,
  options: [...],
}
```

---

### ❌ التحديد المتعدد لا يعمل بشكل صحيح

**السبب:** `rowKey` يحتوي على قيم غير فريدة أو `undefined`.

**الحل:** تأكد أن `rowKey` حقل فريد في كل صف:

```tsx
<DataTable<User> rowKey="id" ... />  // ✅
<DataTable<User> rowKey="name" ... /> // ❌ قد يكون غير فريد
```

---

## 📋 قائمة التحقق قبل النشر

- [ ] `rowKey` حقل فريد في كل صف
- [ ] `columns` مغلّف بـ `useMemo`
- [ ] `sortAccessor` مضاف للتواريخ والأرقام المنسّقة
- [ ] `hidden` مستخدم لإخفاء الإجراءات غير المصرح بها
- [ ] `onSelectionChange` مربوط بحالة خارجية إذا كنت تحتاج المحدَّد
- [ ] `darkMode: "class"` مفعّل في Tailwind إذا أردت الوضع الليلي
- [ ] `dir="rtl"` أو `dir="ltr"` مطابق للغة التطبيق
- [ ] `className` مُستخدم للتحكم بالمظهر الخارجي فقط
- [ ] جميع `useEffect` المتعلقة بإعادة تعيين الصفحة قد أُزيلت
- [ ] `loading` مختبر مع API الفعلي
- [ ] `bulkActions` و `rowActions` مختبرة مع البيانات الفعلية

---

## 📄 الترخيص

هذا المكوّن مجاني للاستخدام والتعديل دون قيود.

---

## 🤝 المساهمة

لإضافة ميزة جديدة:

1. أضف النوع في `types.ts`
2. أضف الـ prop في `DataTableProps<T>` داخل `types.ts`
3. استخدمه في `DataTable.tsx` مع دعم RTL والوضع الليلي
4. حدّث هذا الملف في القسم المناسب

---

> 💡 **نصيحة:** احتفظ بهذا الملف بجانب `DataTable.tsx` و `types.ts` داخل المجلد كمرجع سريع.
