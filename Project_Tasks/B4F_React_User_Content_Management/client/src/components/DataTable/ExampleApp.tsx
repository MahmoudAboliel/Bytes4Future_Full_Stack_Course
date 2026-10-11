import { useMemo, useState } from "react";
import DataTable from "@/components/DataTable/DataTable";
import type { Column } from "@/components/DataTable/types";

/* ---------- الأنواع ---------- */

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
  {
    id: 2,
    name: "سارة علي",
    email: "sara@mail.com",
    role: "editor",
    status: "active",
    salary: 8500,
    joined: "2023-03-22",
  },
  {
    id: 3,
    name: "خالد يوسف",
    email: "khaled@mail.com",
    role: "viewer",
    status: "inactive",
    salary: 5000,
    joined: "2022-11-02",
  },
  {
    id: 4,
    name: "منى إبراهيم",
    email: "mona@mail.com",
    role: "editor",
    status: "active",
    salary: 9200,
    joined: "2024-02-10",
  },
  {
    id: 5,
    name: "يوسف سالم",
    email: "yousef@mail.com",
    role: "viewer",
    status: "pending",
    salary: 6000,
    joined: "2024-05-01",
  },
  {
    id: 6,
    name: "ليلى حسن",
    email: "laila@mail.com",
    role: "admin",
    status: "active",
    salary: 15000,
    joined: "2021-08-19",
  },
  {
    id: 7,
    name: "عمر فؤاد",
    email: "omar@mail.com",
    role: "viewer",
    status: "inactive",
    salary: 4800,
    joined: "2023-09-30",
  },
  {
    id: 8,
    name: "نور الدين",
    email: "noor@mail.com",
    role: "editor",
    status: "active",
    salary: 8800,
    joined: "2024-01-07",
  },
];

/* ---------- المكوّن ---------- */

export default function App() {
  const [selected, setSelected] = useState<User[]>([]);
  const [loading] = useState(false);

  const columns = useMemo<Column<User>[]>(
    () => [
      {
        key: "name",
        header: "المستخدم",
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white">
              {row.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-800 dark:text-slate-100">
                {row.name}
              </p>
              <p className="truncate text-xs text-slate-400">{row.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: "role",
        header: "الدور",
        sortable: true,
        align: "center",
        render: (row) => {
          const r = ROLE_META[row.role];
          return (
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${r.cls}`}
            >
              {r.label}
            </span>
          );
        },
      },
      {
        key: "status",
        header: "الحالة",
        align: "center",
        sortable: true,
        render: (row) => {
          const s = STATUS_META[row.status];
          return (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
              <span className={`h-2 w-2 rounded-full ${s.c}`} />
              {s.t}
            </span>
          );
        },
      },
      {
        key: "salary",
        header: "الراتب",
        sortable: true,
        align: "end",
        render: (row) => (
          <span className="font-semibold tabular-nums text-slate-800 dark:text-slate-100">
            {row.salary.toLocaleString("ar-EG")} ر.س
          </span>
        ),
      },
      {
        key: "joined",
        header: "تاريخ الانضمام",
        sortable: true,
        align: "end",
        className: "text-slate-500 dark:text-slate-400 tabular-nums",
        sortAccessor: (row) => new Date(row.joined),
        render: (row) => new Date(row.joined).toLocaleDateString("ar-EG"),
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6 dark:bg-slate-950" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <DataTable<User>
          title="إدارة المستخدمين"
          subtitle="تحكم كامل في حسابات الفريق والصلاحيات"
          columns={columns}
          data={USERS}
          rowKey="id"
          loading={loading}
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
              onClick: (rows) => alert(`حذف ${rows.length} مستخدم`),
              className: "bg-red-600 text-white hover:bg-red-700",
            },
            {
              label: "تصدير",
              onClick: (rows) => console.log(rows),
            },
          ]}
          rowActions={[
            { label: "عرض الملف", onClick: (r) => console.log("view", r) },
            { label: "تعديل", onClick: (r) => console.log("edit", r) },
            {
              label: "إعادة تعيين كلمة المرور",
              onClick: (r) => console.log("reset", r),
            },
            {
              label: "حذف",
              className:
                "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40",
              hidden: (r) => r.role === "admin",
              onClick: (r) => console.log("delete", r),
            },
          ]}
          onRowClick={(row) => console.log("row:", row)}
          defaultPageSize={5}
          striped
        />

        <p className="mt-4 text-center text-xs text-slate-400">
          المحدَّد حالياً: {selected.length}
        </p>
      </div>
    </div>
  );
}
