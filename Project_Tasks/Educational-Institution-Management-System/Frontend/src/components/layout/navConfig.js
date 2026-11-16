import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarDays,
  ClipboardCheck,
  FileText,
  UserCog,
  CheckCircle2,
  Layers,
  FolderTree,
  NotebookPen,
  ClipboardList,
  BookMarked,
  UserRound,
} from "lucide-react";

/**
 * Sidebar navigation per role (same routes/labels as the prototype UX).
 * Paths: /admin | /secretary | /teacher | /student (+ sub routes)
 */

export const navByRole = {
  admin: [
    {
      label: "الرئيسية",
      items: [{ to: "/admin", label: "لوحة التحكم", icon: LayoutDashboard }],
    },
    {
      label: "الإدارة",
      items: [
        {
          to: "/admin/approvals",
          label: "طلبات الاعتماد",
          icon: CheckCircle2,
        },
        {
          to: "/admin/secretaries",
          label: "الحسابات الإدارية",
          icon: UserCog,
        },
      ],
    },
  ],
  secretary: [
    {
      label: "الرئيسية",
      items: [
        { to: "/secretary", label: "لوحة التحكم", icon: LayoutDashboard },
      ],
    },
    {
      label: "الإدارة",
      items: [
        { to: "/secretary/students", label: "الطلاب", icon: GraduationCap },
        { to: "/secretary/teachers", label: "المدربون", icon: Users },
        {
          to: "/secretary/courses",
          label: "الدورات والمستويات",
          icon: FolderTree,
        },
        { to: "/secretary/cohorts", label: "الدفعات", icon: Layers },
        { to: "/secretary/sessions", label: "الجلسات", icon: CalendarDays },
        { to: "/secretary/notes", label: "الملاحظات", icon: NotebookPen },
      ],
    },
  ],
  teacher: [
    {
      label: "الرئيسية",
      items: [
        { to: "/teacher", label: "لوحة التحكم", icon: LayoutDashboard },
      ],
    },
    {
      label: "التدريس",
      items: [
        { to: "/teacher/sessions", label: "الجلسات", icon: CalendarDays },
        { to: "/teacher/attendance", label: "الحضور", icon: ClipboardCheck },
        { to: "/teacher/grades", label: "الدرجات", icon: FileText },
        {
          to: "/teacher/notes",
          label: "ملاحظات الطلاب",
          icon: NotebookPen,
        },
      ],
    },
  ],
  student: [
    {
      label: "الرئيسية",
      items: [
        { to: "/student", label: "لوحة التحكم", icon: LayoutDashboard },
      ],
    },
    {
      label: "تعلّمي",
      items: [
        { to: "/student/courses", label: "دوراتي", icon: BookMarked },
        { to: "/student/attendance", label: "حضوري", icon: ClipboardList },
        { to: "/student/grades", label: "درجاتي", icon: FileText },
        { to: "/student/profile", label: "ملفي الشخصي", icon: UserRound },
      ],
    },
  ],
};

/** Resolve the current page title from the active pathname. */
export const pageTitleFor = (pathname, role) => {
  const groups = navByRole[role] || [];
  for (const group of groups) {
    const item = group.items.find(
      (entry) =>
        pathname === entry.to || pathname.startsWith(`${entry.to}/`),
    );
    if (item) return item.label;
  }
  return "لوحة التحكم";
};

export default navByRole;
