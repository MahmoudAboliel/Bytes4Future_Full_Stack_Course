/* ================================================================== */
/*  الأنواع (Types)                                                   */
/* ================================================================== */

import type { ReactNode } from "react";

/** نوع استخراج القيمة من صف */
export type Accessor<T> = (row: T, index: number) => unknown;

/** تعريف عمود واحد */
export interface Column<T> {
  /** مفتاح فريد للعمود (يُستخدم أيضاً للربط مع `row[key]` عند عدم وجود accessor) */
  key: string;
  /** نص الرأس — يقبل ReactNode لعرض أيقونات مثلاً */
  header: ReactNode;
  /** لاستخراج القيمة من الصف (يدعم القيم المتداخلة) */
  accessor?: Accessor<T>;
  /** عرض JSX مخصص للخلية */
  render?: (row: T, index: number) => ReactNode;
  /** تفعيل الترتيب بالنقر على الرأس */
  sortable?: boolean;
  /** دالة مخصصة للترتيب (تتجاوز accessor عند وجودها) */
  sortAccessor?: (row: T) => string | number | Date | null | undefined;
  /** إخفاء العمود من البحث العام */
  searchable?: boolean;
  /** محاذاة الخلية */
  align?: "start" | "center" | "end";
  /** عرض العمود (يُمرَّر إلى style) */
  width?: string | number;
  /** كلاسات Tailwind إضافية للخلايا */
  className?: string;
  /** كلاسات Tailwind إضافية لرأس العمود */
  headerClassName?: string;
}

/** فلتر منسدل */
export interface FilterOption {
  label: string;
  value: string;
}

export interface Filter<T> {
  key: keyof T | string;
  label: string;
  options: FilterOption[];
  /** دالة مخصصة لاستخراج القيمة (للحقول المتداخلة) */
  accessor?: (row: T) => unknown;
}

/** إجراء (سطر واحد أو جماعي) */
export interface RowAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (row: T) => void;
  className?: string;
  /** إخفاء الإجراء شرطياً */
  hidden?: (row: T) => boolean;
}

export interface BulkAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (rows: T[]) => void;
  className?: string;
}

/** Props المكوّن الرئيسي */
export interface DataTableProps<T> {
  /* البيانات */
  columns: Column<T>[];
  data: T[];
  /** اسم الحقل المميّز — يجب أن يكون مفتاحاً في T */
  rowKey: keyof T;

  /* الحالات */
  loading?: boolean;
  emptyMessage?: string;

  /* الرأس */
  title?: ReactNode;
  subtitle?: ReactNode;
  toolbar?: ReactNode;

  /* البحث */
  searchable?: boolean;
  searchPlaceholder?: string;

  /* الفلاتر */
  filters?: Filter<T>[];

  /* التحديد المتعدد */
  selectable?: boolean;
  onSelectionChange?: (rows: T[]) => void;
  bulkActions?: BulkAction<T>[];

  /* إجراءات السطر */
  rowActions?: RowAction<T>[];
  actionsHeader?: string;

  /* الترقيم */
  pagination?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];

  /* المظهر */
  striped?: boolean;
  hoverable?: boolean;
  onRowClick?: (row: T) => void;
  className?: string;
}

/** الاتجاه */
export type SortDir = "asc" | "desc";
export type SortState<T> = { key: keyof T | string; dir: SortDir } | null;

/** قيمة قد تكون مفتاح صف */
export type RowId = string | number;