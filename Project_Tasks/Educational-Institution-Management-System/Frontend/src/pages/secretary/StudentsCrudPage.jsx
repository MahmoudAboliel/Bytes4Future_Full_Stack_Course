import { useMemo, useState } from "react";
import {
  UserPlus,
  Mail,
  BookOpen,
  ClipboardCheck,
  FileText,
  UserRound,
  KeyRound,
} from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Form from "../../components/common/Form";
import Modal from "../../components/common/Modal";
import Table from "../../components/common/Table";
import Filter from "../../components/common/Filter";
import Avatar from "../../components/common/Avatar";
import { accountStatusBadge, enrollmentStatusBadge } from "../../components/common/badges";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import Spinner from "../../components/common/Spinner";
import useFetch from "../../hooks/useFetch";
import { useToast } from "../../context/toast";
import { secretaryApi } from "../../services/secretaryApi";
import {
  alive,
  attendanceForStudent,
  courseForCohort,
  enrollmentsByStudent,
  formatDate,
  percentage,
  resultsForStudent,
  usersByRole,
} from "../../utils";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const StudentsCrudPage = () => {
  const { toast } = useToast();

  const usersResult = useFetch(() => secretaryApi.users.list(), []);
  const enrollmentsResult = useFetch(() => secretaryApi.enrollments.list(), []);
  const attendanceResult = useFetch(() => secretaryApi.attendances.list(), []);
  const resultsResult = useFetch(() => secretaryApi.results.list(), []);
  const cohortsResult = useFetch(() => secretaryApi.cohorts.list(), []);
  const levelsResult = useFetch(() => secretaryApi.levels.list(), []);
  const coursesResult = useFetch(() => secretaryApi.courses.list(), []);

  const { data: allUsers, loading, reload } = usersResult;
  const enrollments = enrollmentsResult.data.filter(alive);
  const attendance = attendanceResult.data;
  const results = resultsResult.data.filter(alive);
  const cohorts = cohortsResult.data.filter(alive);
  const levels = levelsResult.data.filter(alive);
  const courses = coursesResult.data.filter(alive);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [detailUser, setDetailUser] = useState(null);

  const students = useMemo(() => usersByRole(allUsers, "student"), [allUsers]);

  const filtered = useMemo(
    () =>
      students.filter((student) => {
        if (statusFilter !== "all") {
          const expected = statusFilter === "active";
          if (Boolean(student.isActive) !== expected) return false;
        }
        if (search) {
          const query = search.toLowerCase();
          return (
            String(student.fullName).toLowerCase().includes(query) ||
            String(student.email).toLowerCase().includes(query)
          );
        }
        return true;
      }),
    [students, search, statusFilter],
  );

  const sections = [
    {
      title: "بيانات الطالب",
      description: "الاسم والبريد الإلكتروني ورقم التواصل.",
      icon: <UserRound className="h-4 w-4" />,
      fields: [
        {
          name: "fullName",
          label: "الاسم الكامل",
          required: true,
          placeholder: "مثال: عبدالرحمن السالم",
        },
        {
          name: "email",
          label: "البريد الإلكتروني",
          type: "email",
          required: true,
          placeholder: "name@edums.edu",
          className: "ltr",
          validate: (value) => {
            if (!emailPattern.test(String(value || "").trim()))
              return "صيغة بريد غير صحيحة.";
            if (
              allUsers.some(
                (record) =>
                  String(record.email).toLowerCase() ===
                  String(value).trim().toLowerCase(),
              )
            )
              return "البريد مستخدم بالفعل.";
            return undefined;
          },
        },
        {
          name: "phone",
          label: "رقم الجوال",
          type: "tel",
          required: true,
          placeholder: "05xxxxxxxx",
          className: "ltr",
          validate: (value) =>
            String(value || "").trim().length >= 6
              ? undefined
              : "رقم الجوال يجب ألا يقل عن 6 أحرف.",
        },
        {
          name: "birthDate",
          label: "تاريخ الميلاد",
          type: "date",
          required: true,
        },
      ],
    },
    {
      title: "المسار الدراسي",
      description: "يظهر في ملف الطالب ويُعرض في صفحة الدورات.",
      icon: <BookOpen className="h-4 w-4" />,
      fields: [
        {
          name: "study",
          label: "المسار الدراسي",
          required: true,
          placeholder: "مثال: ثانوي — علمي",
          colSpan: 2,
        },
      ],
    },
    {
      title: "حساب الدخول",
      description: "كلمة مرور مؤقتة يغيّرها الطالب بعد أول دخول.",
      icon: <KeyRound className="h-4 w-4" />,
      fields: [
        {
          name: "password",
          label: "كلمة المرور المؤقتة",
          type: "password",
          required: true,
          hint: "لا تقل عن 6 أحرف.",
          colSpan: 2,
          validate: (value) =>
            String(value || "").length < 6
              ? "كلمة المرور يجب ألا تقل عن 6 أحرف."
              : undefined,
        },
      ],
    },
  ];

  const submitCreate = async (values) => {
    try {
      await secretaryApi.students.create({
        fullName: String(values.fullName).trim(),
        email: String(values.email).trim().toLowerCase(),
        phone: String(values.phone || "").trim(),
        password: values.password,
        birthDate: values.birthDate,
        study: String(values.study).trim(),
        role: "student",
        isActive: true,
      });
      toast("success", "تمت إضافة الطالب بنجاح.");
      setAddOpen(false);
      setFormKey((key) => key + 1);
      reload();
    } catch (error) {
      toast("error", error.message);
    }
  };

  /* -------------------- detail (profile) -------------------- */

  const detailEnrollments = detailUser
    ? enrollmentsByStudent(enrollments, detailUser.id)
    : [];
  const detailAttendance = detailUser
    ? attendanceForStudent(attendance, enrollments, detailUser.id)
    : [];
  const detailResults = detailUser
    ? resultsForStudent(results, enrollments, detailUser.id)
    : [];

  const columns = [
    {
      key: "fullName",
      header: "الطالب",
      render: (_, student) => (
        <div className="flex items-center gap-3">
          <Avatar name={student.fullName} seed={student.id} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{student.fullName}</p>
            <p className="ltr truncate text-xs text-muted">{student.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "study",
      header: "المسار الدراسي",
      render: (_, student) => (
        <span className="text-sm text-ink/80">{student.study || "—"}</span>
      ),
    },
    {
      key: "enrollments",
      header: "التسجيلات",
      render: (_, student) => {
        const count = enrollmentsByStudent(enrollments, student.id).filter(
          (enrollment) => enrollment.status === "active",
        ).length;
        return <Badge tone="blue">{count} تسجيل</Badge>;
      },
    },
    {
      key: "isActive",
      header: "الحالة",
      render: (_, student) => accountStatusBadge(student.isActive),
    },
    {
      key: "actions",
      header: "",
      className: "text-left",
      render: (_, student) => (
        <div className="flex items-center justify-end">
          <Button
            size="sm"
            variant="ghost"
            onClick={(event) => {
              event.stopPropagation();
              setDetailUser(student);
            }}
          >
            التفاصيل
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="الطلاب"
        description="إدارة بيانات الطلاب وملفاتهم"
        action={
          <Button
            onClick={() => {
              setFormKey((key) => key + 1);
              setAddOpen(true);
            }}
          >
            <UserPlus className="h-4 w-4" />
            إضافة طالب
          </Button>
        }
      />

      <Card padding="sm">
        <Filter
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="ابحث بالاسم أو البريد..."
          filters={[
            {
              name: "status",
              label: "الحالة",
              options: [
                { value: "active", label: "نشط" },
                { value: "disabled", label: "معطّل" },
              ],
              placeholder: "كل الحالات",
            },
          ]}
          values={{ status: statusFilter }}
          onFilterChange={(_, value) => setStatusFilter(value)}
          onReset={() => {
            setSearch("");
            setStatusFilter("all");
          }}
          searchInputProps={{ prefix: <Mail className="h-4 w-4" /> }}
        />
      </Card>

      <Card padding="none">
        {loading ? (
          <Spinner label="جارٍ تحميل الطلاب…" />
        ) : (
          <Table
            columns={columns}
            data={filtered}
            rowKey="id"
            caption="قائمة الطلاب"
            onRowClick={(student) => setDetailUser(student)}
            loadingState="جارٍ التحميل…"
            emptyMessage="لا يوجد طلاب مطابقون. أضف طالباً جديداً للبدء."
            previousLabel="السابق"
            nextLabel="التالي"
          />
        )}
      </Card>

      {/* Add student */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="إضافة طالب"
        description="سيتم إنشاء حساب وملف طالب مرتبط به."
        size="lg"
      >
        <Form
          key={`create-${formKey}`}
          sections={sections}
          columns={2}
          submitLabel="حفظ الطالب"
          cancelLabel="إلغاء"
          onCancel={() => setAddOpen(false)}
          onSubmit={submitCreate}
        />
      </Modal>

      {/* Detail */}
      <Modal
        open={Boolean(detailUser)}
        onClose={() => setDetailUser(null)}
        title={detailUser?.fullName || ""}
        size="xl"
      >
        {detailUser && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar
                name={detailUser.fullName}
                seed={detailUser.id}
                size="lg"
              />
              <div>
                <p className="text-base font-bold text-ink">
                  {detailUser.fullName}
                </p>
                <p className="ltr text-sm text-muted">{detailUser.email}</p>
                <div className="mt-1.5 flex gap-2">
                  {accountStatusBadge(detailUser.isActive)}
                  <Badge tone="neutral">
                    {formatDate(detailUser.createdAt)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card padding="none" className="p-4">
                <div className="flex items-center gap-2 text-muted">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs">التسجيلات النشطة</span>
                </div>
                <p className="mt-1.5 text-xl font-bold text-ink">
                  {
                    detailEnrollments.filter(
                      (enrollment) => enrollment.status === "active",
                    ).length
                  }
                </p>
              </Card>
              <Card padding="none" className="p-4">
                <div className="flex items-center gap-2 text-muted">
                  <ClipboardCheck className="h-4 w-4" />
                  <span className="text-xs">سجلات الحضور</span>
                </div>
                <p className="mt-1.5 text-xl font-bold text-ink">
                  {detailAttendance.length}
                </p>
              </Card>
              <Card padding="none" className="p-4">
                <div className="flex items-center gap-2 text-muted">
                  <FileText className="h-4 w-4" />
                  <span className="text-xs">النتائج المنشورة</span>
                </div>
                <p className="mt-1.5 text-xl font-bold text-ink">
                  {detailResults.length}
                </p>
              </Card>
            </div>


            <div>
              <h4 className="mb-2 text-sm font-bold text-ink">التسجيلات</h4>
              {detailEnrollments.length === 0 ? (
                <EmptyState title="لا توجد تسجيلات" />
              ) : (
                <div className="space-y-2">
                  {detailEnrollments.map((enrollment) => {
                    const cohort = cohorts.find(
                      (record) => record.id === enrollment.cohortId,
                    );
                    const course = cohort
                      ? courseForCohort(courses, levels, cohort)
                      : undefined;
                    return (
                      <div
                        key={enrollment.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-ink">
                            {course?.name || "—"}
                          </p>
                          <p className="ltr text-xs text-muted">
                            {cohort?.code || "—"}
                          </p>
                        </div>
                        {enrollmentStatusBadge(enrollment.status)}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div>
              <h4 className="mb-2 text-sm font-bold text-ink">النتائج</h4>
              {detailResults.length === 0 ? (
                <EmptyState
                  title="لا توجد نتائج منشورة"
                  description="لم يتم نشر نتائج لهذا الطالب بعد."
                />
              ) : (
                <div className="space-y-2">
                  {detailResults.map((result) => {
                    const enrollment = enrollments.find(
                      (record) => record.id === result.enrollmentId,
                    );
                    const cohort = enrollment
                      ? cohorts.find(
                          (record) => record.id === enrollment.cohortId,
                        )
                      : undefined;
                    const course = cohort
                      ? courseForCohort(courses, levels, cohort)
                      : undefined;
                    return (
                      <div
                        key={result.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-ink">
                            {course?.name || "—"}
                          </p>
                          <p className="ltr text-xs text-muted">
                            {result.score}/{result.maxScore} ·{" "}
                            {percentage(result.score, result.maxScore)}%
                          </p>
                        </div>
                        <Badge tone="blue">{result.grade}</Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentsCrudPage;
