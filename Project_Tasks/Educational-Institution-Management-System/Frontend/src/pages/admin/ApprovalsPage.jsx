import { useState } from "react";
import { BookOpen, Users, CheckCircle2 } from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import Avatar from "../../components/common/Avatar";
import Spinner from "../../components/common/Spinner";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { approvalBadge } from "../../components/common/badges";
import useFetch from "../../hooks/useFetch";
import { useToast } from "../../context/toast";
import { adminApi } from "../../services/adminApi";
import { alive, formatDate } from "../../utils";

const ApprovalsPage = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState("courses");
  const [rejectTarget, setRejectTarget] = useState(null);

  const usersResult = useFetch(() => adminApi.users.list(), []);
  const coursesResult = useFetch(() => adminApi.courses.list(), []);

  const users = usersResult.data.filter(alive);
  const courses = coursesResult.data.filter(alive);

  // Anything not approved yet: pending (!isActive, still open) or rejected (deletedAt).
  const openCourses = courses.filter((course) => !course.isActive);
  const openTeachers = users.filter(
    (record) => record.role === "teacher" && !record.isActive,
  );

  const loading = usersResult.loading || coursesResult.loading;

  const decide = async () => {
    if (!rejectTarget) return;
    const { kind, record } = rejectTarget;
    try {
      // Rejecting closes the request with a soft delete.
      if (kind === "course") {
        await adminApi.courses.remove(record.id);
      } else {
        await adminApi.users.remove(record.id);
      }
      toast("warning", "تم رفض الطلب.");
      usersResult.reload();
      coursesResult.reload();
    } catch (error) {
      toast("error", error.message);
    }
  };

  const approve = async (kind, record) => {
    try {
      if (kind === "course") {
        await adminApi.approvals.approve("courses", record.id);
      } else {
        await adminApi.approvals.approve("users", record.id);
      }
      toast("success", "تمت الموافقة على الطلب.");
      usersResult.reload();
      coursesResult.reload();
    } catch (error) {
      toast("error", error.message);
    }
  };

  if (loading) return <Spinner label="جارٍ تحميل الطلبات…" />;

  const tabClass = (active) =>
    `flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
      active
        ? "bg-brand-blue text-white shadow-sm"
        : "text-muted hover:bg-black/[0.04] hover:text-ink"
    }`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="مركز الاعتماد"
        description="مراجعة طلبات الدورات والمدربين الجدد"
      />

      <div className="w-fit rounded-card border border-border bg-white p-1">
        <button
          onClick={() => setTab("courses")}
          className={tabClass(tab === "courses")}
        >
          <BookOpen className="h-4 w-4" /> الدورات
          {openCourses.length > 0 && (
            <span
              className={`rounded-full px-1.5 text-xs ${
                tab === "courses"
                  ? "bg-white/20"
                  : "bg-brand-amber/15 text-[#a06a1f]"
              }`}
            >
              {openCourses.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("teachers")}
          className={tabClass(tab === "teachers")}
        >
          <Users className="h-4 w-4" /> المدربون
          {openTeachers.length > 0 && (
            <span
              className={`rounded-full px-1.5 text-xs ${
                tab === "teachers"
                  ? "bg-white/20"
                  : "bg-brand-amber/15 text-[#a06a1f]"
              }`}
            >
              {openTeachers.length}
            </span>
          )}
        </button>
      </div>

      {tab === "courses" && (
        <div className="space-y-3">
          {openCourses.length === 0 && (
            <EmptyState
              icon={<CheckCircle2 className="h-7 w-7" />}
              title="لا توجد طلبات دورات"
              description="جميع طلبات الدورات تمت معالجتها."
            />
          )}
          {openCourses.map((course) => (
            <Card key={course.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-ink">
                      {course.name}
                    </h3>
                    {approvalBadge(course)}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {course.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    <span>تاريخ الطلب: {formatDate(course.createdAt)}</span>
                    {course.deletedAt && (
                      <span className="text-error-600">تم الرفض</span>
                    )}
                  </div>
                </div>
                {!course.deletedAt && !course.isActive && (
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => approve("course", course)}
                    >
                      اعتماد
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setRejectTarget({ kind: "course", record: course })
                      }
                    >
                      رفض
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "teachers" && (
        <div className="space-y-3">
          {openTeachers.length === 0 && (
            <EmptyState
              icon={<CheckCircle2 className="h-7 w-7" />}
              title="لا توجد طلبات مدربين"
              description="جميع طلبات المدربين تمت معالجتها."
            />
          )}
          {openTeachers.map((teacher) => (
            <Card key={teacher.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <Avatar
                    name={teacher.fullName}
                    seed={teacher.id}
                    size="lg"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-ink">
                        {teacher.fullName}
                      </h3>
                      {approvalBadge(teacher)}
                    </div>
                    <p className="mt-1 text-sm font-medium text-brand-blue">
                      {teacher.specialization || "—"}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {teacher.bio}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                      <span className="ltr">{teacher.email}</span>
                      {teacher.phone && (
                        <span className="ltr">{teacher.phone}</span>
                      )}
                      <span>تاريخ الطلب: {formatDate(teacher.createdAt)}</span>
                    </div>
                  </div>
                </div>
                {!teacher.deletedAt && !teacher.isActive && (
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => approve("teacher", teacher)}
                    >
                      اعتماد
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setRejectTarget({ kind: "teacher", record: teacher })
                      }
                    >
                      رفض
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        onConfirm={decide}
        title="رفض الطلب"
        description="سيتم إغلاق الطلب ويمكن لمقدّمه إعادة الإنشاء لاحقاً. هل تريد المتابعة؟"
        confirmLabel="تأكيد الرفض"
        tone="danger"
      />
    </div>
  );
};

export default ApprovalsPage;
