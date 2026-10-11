import { useMemo, useState } from 'react';
import { DataTable } from '../src/components/DataTable';
import type { ColumnDef } from '../src/types';

interface User extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  salary: number;
  joinedAt: string;
  active: boolean;
}

const ROLES: User['role'][] = ['admin', 'editor', 'viewer'];

function makeData(count: number): User[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `مستخدم ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ROLES[i % 3],
    salary: 3000 + (i % 10) * 450,
    joinedAt: new Date(2022, i % 12, (i % 27) + 1).toISOString().slice(0, 10),
    active: i % 4 !== 0,
  }));
}

const columns: ColumnDef<User>[] = [
  { id: 'id', header: '#', width: 60 },
  { id: 'name', header: 'الاسم' },
  { id: 'email', header: 'البريد الإلكتروني' },
  {
    id: 'role',
    header: 'الدور',
    cell: (row) => (
      <span
        className={
          row.role === 'admin'
            ? 'rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700'
            : row.role === 'editor'
              ? 'rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700'
              : 'rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600'
        }
      >
        {row.role}
      </span>
    ),
  },
  {
    id: 'salary',
    header: 'الراتب',
    align: 'right',
    accessor: 'salary',
    // فلتر مخصص: أكبر من أو يساوي القيمة المدخلة
    filterFn: (row, value) => row.salary >= Number(value || 0),
    cell: (row) => <span className="font-mono">{row.salary.toLocaleString('en-US')} $</span>,
  },
  { id: 'joinedAt', header: 'تاريخ الانضمام', align: 'center' },
  {
    id: 'active',
    header: 'الحالة',
    sortable: false,
    filterable: false,
    cell: (row) => (
      <span className={row.active ? 'text-green-600' : 'text-red-500'}>{row.active ? '● نشط' : '● موقوف'}</span>
    ),
  },
];

export default function App() {
  const data = useMemo(() => makeData(137), []);
  const [page, setPage] = useState('');

  return (
    <div dir="rtl" className="mx-auto max-w-6xl p-6">
      <h1 className="mb-4 text-2xl font-bold">مثال: جدول المستخدمين</h1>
      <input value={page} onChange={(e) => setPage(e.target.value)} placeholder="input عادي للتأكد من عدم التعارض" />
      <DataTable
        data={data}
        columns={columns}
        options={{
          defaultPageSize: 10,
          enableMultiSort: true,
          placeholder: '🗂️ لا يوجد مستخدمون مطابقون لبحثك',
        }}
      />
    </div>
  );
}
