import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Users, CalendarDays, Layers } from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Form from "../../components/common/Form";
import Modal from "../../components/common/Modal";
import Table from "../../components/common/Table";
import Filter from "../../components/common/Filter";
import Avatar from "../../components/common/Avatar";
import EmptyState from "../../components/common/EmptyState";
import { cohortStatusBadge } from "../../components/common/badges";
import Badge from "../../components/common/Badge";
import Spinner from "../../components/common/Spinner";
import useFetch from "../../hooks/useFetch";
import { useToast } from "../../context/toast";
import { secretaryApi } from "../../services/secretaryApi";
import { alive, byId, cohortEnrollmentCount, formatDate, levelsByCourse, sessionsByCohort, usersByRole } from "../../utils";
import { enrollmentsByCohort } from "../../utils/selectors";

const STATUS_OPTIONS = [
  { value: "planned", label: "مخططة" },
  { value: "active", label: "نشطة" },
  { value: "completed", label: "منتهية" },
  { value: "cancelled", label: "ملغاة" },
];

const CohortsPage = () => {
  const { toast } = useToast();

  const cohortsResult = useFetch(() => secretaryApi.cohorts.list(), []);
  const levelsResult = useFetch(() => secretaryApi.levels.list(), []);
  const coursesResult = useFetch(() => secretaryApi.courses.list(), []);
  const usersResult = useFetch(() => secretaryApi.users.list(), []);
  const enrollmentsResult = useFetch(() => secretaryApi.enrollments.list(), []);
  const sessionsResult = useFetch(() => secretaryApi.sessions.list(), []);

  const { data: cohorts, loading, reload } = cohortsResult;
  const levels = levelsResult.data.filter(alive);
  const courses = coursesResult.data.filter(alive);
  const allUsers = usersResult.data;
  const enrollments = enrollmentsResult.data.filter(alive);
  const sessions = sessionsResult.data.filter(alive);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [editTarget, setEditTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);

  const teachers = useMemo(
    () =>
      usersByRole(allUsers, "teacher").filter(
        (teacher) => teacher.isActive && !teacher.deletedAt,
      ),
    [allUsers],
  );

  const levelOptions = useMemo(() => {
    const options = [{ value: "", label: "اختر المستوى" }];
    courses
      .filter((course) => course.isActive)
      .forEach((course) => {
        levelsByCourse(levels, course.id).forEach((level) => {
          options.push({
            value: level.id,
            label: `${course.name} — ${level.title}`,
          });
        });
      });
    return options;
  }, [courses, levels]);

  const teacherOptions = useMemo(() => {
    const options = [{ value: "", label: "اختر المدرب" }];
    teachers.forEach((teacher) => {
      options.push({ value: teacher.id, label: teacher.fullName });
    });
    return options;
  }, [teachers]);

  const filtered = useMemo(
    () =>
      cohorts.filter((cohort) => {
        if (statusFilter !== "all" && cohort.status !== statusFilter)
          return false;
        if (search) {
          const query = search.toLowerCase();
          const level = byId(levels, cohort.levelId);
          const course = level ? byId(courses, level.courseId) : undefined;
          return (
            String(cohort.code).toLowerCase().includes(query) ||
            String(level?.title || "").toLowerCase().includes(query) ||
            String(course?.name || "").toLowerCase().includes(query)
          );
        }
        return true;
      }),
    [cohorts, statusFilter, search, levels, courses],
  );

  const buildSections = (target) => {
    const teacherInOptions =
      !target?.teacherId || teachers.some((t) => t.id === target.teacherId);
    return [
      {
        title: "هوية الدفعة",
        description: "رمز مميز(level) وحالة الدفعة.",
        icon: <Layers className="h-4 w-4" />,
        fields: [
          {
            name: "code",
            label: "رمز الدفعة",
            required: true,
            placeholder: "مثال: C-2026-01",
            className: "ltr",
          },
          {
            name: "status",
            label: "الحالة",
            options: STATUS_OPTIONS,
            required: true,
          },
        ],
      },
      {
        title: "الربط",
        description: "المستوى الذي تتبعه الدفعة والمدرب المسؤول.",
        icon: <Users className="h-4 w-4" />,
        fields: [
          {
            name: "levelId",
            label: "المستوى",
            options: levelOptions,
            required: true,
          },
          {
            name: "teacherId",
            label: "المدرب",
            options: teacherInOptions
              ? teacherOptions
              : [
                  { value: "", label: "اختر المدرب" },
                  ...teachers.map((t) => ({ value: t.id, label: t.fullName })),
                  { value: target?.teacherId, label: "المدرب الحالي" },
                ],
            required: true,
          },
        ],
      },
      {
        title: "المدة والسعة",
        description: "الفترة الزمنية وعدد المقاعد المتاحة.",
        icon: <CalendarDays className="h-4 w-4" />,
        fields: [
          {
            name: "startDate",
            label: "تاريخ البداية",
            type: "date",
            required: true,
          },
          {
            name: "endDate",
            label: "تاريخ النهاية",
            type: "date",
            required: true,
          },
          {
            name: "capacity",
            label: "السعة",
            type: "number",
            required: true,
            colSpan: 2,
            validate: (value) =>
              Number(value) > 0 ? undefined : "السعة يجب أن تكون موجبة.",
          },
        ],
      },
    ];
  };

  const submitCreate = async (values) => {
    try {
      await secretaryApi.cohorts.create({
        code: String(values.code).trim(),
        levelId: values.levelId,
        teacherId: values.teacherId,
        startDate: values.startDate,
        endDate: values.endDate,
        capacity: Number(values.capacity),
        status: values.status,
        isActive: true,
      });
      toast("success", "تم إنشاء الدفعة بنجاح.");
      setAddOpen(false);
      setFormKey((key) => key + 1);
      reload();
    } catch (error) {
      toast("error", error.message);
    }
  };

  const submitEdit = async (values) => {
    try {
      await secretaryApi.cohorts.update(editTarget.id, {
        code: String(values.code).trim(),
        levelId: values.levelId,
        teacherId: values.teacherId,
        startDate: values.startDate,
        endDate: values.endDate,
        capacity: Number(values.capacity),
        status: values.status,
      });
      toast("success", "تم تحديث الدفعة.");
      setEditTarget(null);
      reload();
    } catch (error) {
      toast("error", error.message);
    }
  };

  const columns = [
    {
      key: "code",
      header: "الرمز",
      render: (_, cohort) => (
        <span className="ltr font-semibold text-ink">{cohort.code}</span>
      ),
    },
    {
      key: "levelId",
      header: "المستوى / الدورة",
      render: (_, cohort) => {
        const level = byId(levels, cohort.levelId);
        const course = level ? byId(courses, level.courseId) : undefined;
        return (
          <div>
            <p className="font-medium text-ink">{level?.title || "—"}</p>
            <p className="text-xs text-muted">{course?.name || "—"}</p>
          </div>
        );
      },
    },
    {
      key: "teacherId",
      header: "المدرب",
      render: (_, cohort) => {
        const teacher = byId(allUsers, cohort.teacherId);
        if (!teacher) return <span className="text-muted">—</span>;
        return (
          <div className="flex items-center gap-2">
            <Avatar name={teacher.fullName} seed={teacher.id} size="sm" />
            <span className="text-sm">{teacher.fullName}</span>
          </div>
        );
      },
    },
    {
      key: "startDate",
      header: "المدة",
      render: (_, cohort) => (
        <span className="text-xs text-muted">
          {formatDate(cohort.startDate)} — {formatDate(cohort.endDate)}
        </span>
      ),
    },
    {
      key: "capacity",
      header: "التسجيلات",
      render: (_, cohort) => {
        const count = cohortEnrollmentCount(enrollments, cohort.id);
        return (
          <Badge tone={count >= (cohort.capacity || Infinity) ? "warning" : "blue"}>
            {count}/{cohort.capacity ?? "—"}
          </Badge>
        );
      },
    },
    {
      key: "status",
      header: "الحالة",
      render: (_, cohort) => cohortStatusBadge(cohort.status),
    },
    {
      key: "actions",
      header: "",
      className: "text-left",
      render: (_, cohort) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(event) => {
              event.stopPropagation();
              setDetailTarget(cohort);
            }}
          >
            التفاصيل
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(event) => {
              event.stopPropagation();
              setFormKey((key) => key + 1);
              setEditTarget(cohort);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
            تعديل
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="الدفعات"
        description="إنشاء ومتابعة دفعات الدورات"
        action={
          <Button
            onClick={() => {
              setFormKey((key) => key + 1);
              setAddOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            إنشاء دفعة
          </Button>
        }
      />

      <Card padding="sm">
        <Filter
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="ابحث برمز الدفعة أو المستوى..."
          filters={[
            {
              name: "status",
              label: "الحالة",
              options: STATUS_OPTIONS.filter(
                (option) => option.value !== "planned",
              ),
              placeholder: "كل الحالات",
            },
          ]}
          values={{ status: statusFilter }}
          onFilterChange={(_, value) => setStatusFilter(value)}
          onReset={() => {
            setSearch("");
            setStatusFilter("all");
          }}
          searchInputProps={{ prefix: <Layers className="h-4 w-4" /> }}
        />
      </Card>

      <Card padding="none">
        {loading ? (
          <Spinner label="جارٍ تحميل الدفعات…" />
        ) : (
          <Table
            columns={columns}
            data={filtered}
            rowKey="id"
            caption="قائمة الدفعات"
            onRowClick={(cohort) => setDetailTarget(cohort)}
            loadingState="جارٍ التحميل…"
            emptyMessage="لا توجد دفعات مطابقة. أنشئ دفعة جديدة للبدء."
            previousLabel="السابق"
            nextLabel="التالي"
          />
        )}
      </Card>

      {/* Create */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="إنشاء دفعة"
        description="اختر المستوى والمدرب وحدّد المدة والسعة."
        size="lg"
      >
        <Form
          key={`create-${formKey}`}
          initialValues={{ status: "planned" }}
          sections={buildSections(null)}
          columns={2}
          submitLabel="إنشاء الدفعة"
          cancelLabel="إلغاء"
          onCancel={() => setAddOpen(false)}
          onSubmit={submitCreate}
        />
      </Modal>

      {/* Edit */}
      <Modal
        open={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        title="تعديل الدفعة"
        size="lg"
      >
        {editTarget && (
          <Form
            key={`edit-${editTarget.id}`}
            initialValues={{
              code: editTarget.code,
              status: editTarget.status,
              levelId: editTarget.levelId,
              teacherId: editTarget.teacherId,
              startDate: String(editTarget.startDate || "").slice(0, 10),
              endDate: String(editTarget.endDate || "").slice(0, 10),
              capacity: editTarget.capacity ?? "",
            }}
            sections={buildSections(editTarget)}
            columns={2}
            submitLabel="حفظ"
            cancelLabel="إلغاء"
            onCancel={() => setEditTarget(null)}
            onSubmit={submitEdit}
          />
        )}
      </Modal>

      {/* Detail */}
      <Modal
        open={Boolean(detailTarget)}
        onClose={() => setDetailTarget(null)}
        title={`دفعة ${detailTarget?.code || ""}`}
        size="lg"
      >
        {detailTarget && (
          <DetailBody
            cohort={detailTarget}
            levels={levels}
            courses={courses}
            users={allUsers}
            enrollments={enrollments}
            sessions={sessions}
          />
        )}
      </Modal>
    </div>
  );
};

const DetailBody = ({
  cohort,
  levels,
  courses,
  users,
  enrollments,
  sessions,
}) => {
  const level = byId(levels, cohort.levelId);
  const course = level ? byId(courses, level.courseId) : undefined;
  const teacher = byId(users, cohort.teacherId);
  const cohortEnrollments = enrollmentsByCohort(enrollments, cohort.id);
  const count = cohortEnrollments.length;
  const cohortSessions = sessionsByCohort(sessions, cohort.id);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-lavender/15 text-[#8b4fb8]">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-ink">{course?.name || "—"}</p>
            <p className="text-xs text-muted">{level?.title || "—"}</p>
          </div>
        </div>
        {cohortStatusBadge(cohort.status)}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted">المدرب</p>
          <div className="mt-1.5 flex items-center gap-2">
            {teacher && (
              <Avatar name={teacher.fullName} seed={teacher.id} size="sm" />
            )}
            <span className="text-sm font-medium text-ink">
              {teacher?.fullName || "—"}
            </span>
          </div>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted">التسجيلات</p>
          <p className="mt-1.5 text-lg font-bold text-ink">
            {count} / {cohort.capacity ?? "—"}
          </p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted">تاريخ البداية</p>
          <p className="mt-1.5 text-sm font-medium text-ink">
            {formatDate(cohort.startDate)}
          </p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted">تاريخ النهاية</p>
          <p className="mt-1.5 text-sm font-medium text-ink">
            {formatDate(cohort.endDate)}
          </p>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="flex items-center gap-2 text-sm font-bold text-ink">
            <CalendarDays className="h-4 w-4 text-muted" /> الجلسات
          </h4>
          <Link to="/secretary/sessions">
            <Button variant="ghost" size="sm">
              عرض الكل
            </Button>
          </Link>
        </div>
        {cohortSessions.length === 0 ? (
          <EmptyState title="لا توجد جلسات" />
        ) : (
          <div className="space-y-2">
            {cohortSessions.slice(0, 6).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border border-border p-2.5 text-sm"
              >
                <span className="text-ink">
                  جلسة {session.sessionNumber} — {session.topic || "بدون موضوع"}
                </span>
                <span className="text-xs text-muted">
                  {formatDate(session.sessionDate)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted">
        <Users className="h-4 w-4" />
        <span>
          اضغط على أي صف في القائمة لعرض تفاصيل الدفعة والطلاب المسجّلين بها.
        </span>
      </div>
    </div>
  );
};

export default CohortsPage;
