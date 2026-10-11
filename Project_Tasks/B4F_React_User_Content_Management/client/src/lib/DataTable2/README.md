# flex-table

مكتبة جداول احترافية لـ React — بدون أي اعتماديات خارجية (ما عدا React و Tailwind CSS).

## ✨ الميزات

- 🔎 **بحث شامل** في جميع الأعمدة
- 🧪 **فلاتر لكل عمود** (مع إمكانية تخصيص دالة الفلترة)
- ↕️ **ترتيب** انقر = تصاعدي ← تنازلي ← بدون، و**Shift+انقر** للترتيب المتعدد
- ✅ **تحديد الصفوف** (فردي + تحديد الكل بحالة `indeterminate`)
- 📄 **ترقيم صفحات** مع اختيار حجم الصفحة ونافذة أرقام ذكية
- 👁️ **إظهار/إخفاء الأعمدة**
- ⬇️ **تصدير CSV** (يدعم العربية في Excel عبر BOM)
- 🌙 **وضع داكن** تلقائي (فئات `dark:`)
- 🧩 **Headless Hook**: استخدم `useTable` لوحدك وابنِ واجهتك الخاصة

## 🚀 التثبيت والاستخدام

انسخ مجلد `src/` إلى مشروعك مباشرة (Vite / Next.js / CRA — أي مشروع يدعم TypeScript و Tailwind)، ثم:

```tsx
import { DataTable } from './flex-table';
import type { ColumnDef } from './flex-table';

const columns: ColumnDef<User>[] = [
  { id: 'name', header: 'الاسم' },
  { id: 'salary', header: 'الراتب', align: 'right',
    filterFn: (row, v) => row.salary >= Number(v || 0) },   // فلتر مخصص
  { id: 'role', header: 'الدور', cell: (row) => <Badge>{row.role}</Badge> },
];

<DataTable data={users} columns={columns} options={{ defaultPageSize: 20 }} />
```

> لا تحتاج إلا Tailwind مفعّلاً في مشروعك. لا حاجة لمكتبات خارجية.

## ⚙️ خيارات `TableOptions`

| الخيار | الافتراضي | الوصف |
|---|---|---|
| `getRowId` | `(row) => row.id ?? index` | مفتاح فريد لكل صف |
| `defaultPageSize` | `10` | حجم الصفحة الافتراضي |
| `pageSizeOptions` | `[5, 10, 20, 50]` | خيارات حجم الصفحة |
| `enableMultiSort` | `true` | ترتيب متعدد بـ Shift |
| `enableSelection` | `true` | تحديد الصفوف |
| `enableColumnVisibility` | `true` | قائمة إخفاء الأعمدة |
| `enableGlobalFilter` | `true` | شريط البحث |
| `enableColumnFilters` | `true` | صف الفلاتر |
| `enablePagination` | `true` | الترقيم |
| `enableCsvExport` | `true` | زر التصدير |
| `initialSorting` | `[]` | ترتيب أولي |
| `placeholder` | نص افتراضي | حالة عدم وجود نتائج |

## 🧩 بناء واجهة مخصصة (Headless)

```tsx
const table = useTable(data, columns);
const { rows, toggleSort } = table;
```

جميع الحالة والدوال متاحة عبر `TableInstance` — راجع `src/types.ts`.

## 🗺️ خارطة التطوير المقترحة

- [ ] تغيير حجم الأعمدة بالسحب (column resize)
- [ ] تجميع الصفوف (grouping) والتجميع الجماعي (aggregation)
- [ ] توسيع الصفوف (expandable rows)
- [ ] تحميل بيانات عبر الخادم (server-side mode: `manualPagination`/`manualSorting`)
- [ ] تجميد الأعمدة والتمرير الافتراضي (virtualization بـ `@tanstack/react-virtual`)
