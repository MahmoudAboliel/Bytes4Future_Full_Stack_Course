import { Link } from "react-router-dom";
import { useMemo } from "react";
import {
  Layers,
  Users,
  ClipboardCheck,
  CalendarDays,
  FileText,
  NotebookPen,
  ArrowLeft,
} from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import { sessionStatusBadge } from "../../components/common/badges";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/auth";
import { teacherApi } from "../../services/teacherApi";
import {
  alive,
  courseForCohort,
  cohortsByTeacher,
  enrollmentsByCohort,
  formatDate,
  sessionTitle,
  toISODate,
} from "../../utils";

const TeacherDashboard = () => {
  const { user } = useAuth();

  const cohortsResult = useFetch(() => teacherApi.cohorts.list(), []);
  const sessionsResult = useFetch(() => teacherApi.sessions.list(), []);
  const enrollmentsResult = useFetch(() => teacherApi.enrollments.list(), []);
  const catalogResult = useFetch(() => teacherApi.catalog.get(), []);

  const cohorts = cohortsResult.data.filter(alive);
  const sessions = sessionsResult.data.filter(alive);
  const enrollments = enrollmentsResult.data.filter(alive);
  const levels = (catalogResult.single?.levels ?? []).filter(alive);
  const courses = (catalogResult.single?.courses ?? []).filter(alive);

  // Attendance is only reachable per session, so it is loaded for the
  // sessions that are already finished.
  const doneSessionIds = useMemo(
    () =>
      sessions.filter((session) => session.status === "done").map((s) => s.id),
    [sessions],
  );
  const attendanceResult = useFetch(
    () => teacherApi.attendance.listForSessions(doneSessionIds),
    [doneSessionIds.join(",")],
  );
  const attendance = attendanceResult.data;

  const loading =
    cohortsResult.loading ||
    sessionsResult.loading ||
    enrollmentsResult.loading ||
    catalogResult.loading;

  const myCohorts = cohortsByTeacher(cohorts, user?.id);
  const myCohortIds = new Set(myCohorts.map((cohort) => cohort.id));
  const mySessions = sessions.filter((session) =>
    myCohortIds.has(session.cohortId),
  );

  const today = toISODate(new Date());
  const upcoming = mySessions
    .filter(
      (session) =>
        session.status === "scheduled" &&
        String(session.sessionDate || "").slice(0, 10) >= today,
    )
    .sort((a, b) => String(a.sessionDate).localeCompare(String(b.sessionDate)));

  const students = new Set(
    myCohorts.flatMap((cohort) =>
      enrollmentsByCohort(enrollments, cohort.id).map(
        (enrollment) => enrollment.studentId,
      ),
    ),
  );

  const markedSessions = new Set(
    attendance.map((record) => record.sessionId),
  );
  const pendingAttendance = mySessions.filter(
    (session) =>
      session.status === "done" && !markedSessions.has(session.id),
  );

  const shortcuts = [
    { to: "/teacher/sessions", label: "الجلسات", icon: CalendarDays, color: "text-brand-blue bg-brand-blue/12" },
    { to: "/teacher/attendance", label: "تسجيل الحضور", icon: ClipboardCheck, color: "text-success-600 bg-success-50" },
    { to: "/teacher/grades", label: "إدخال الدرجات", icon: FileText, color: "text-brand-amber bg-brand-amber/15" },
    { to: "/teacher/notes", label: "ملاحظات الطلاب", icon: NotebookPen, color: "text-brand-lavender bg-brand-lavender/15" },
  ];

  if (loading) return <Spinner label="جارٍ تحميل لوحة التحكم…" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`مرحباً، ${user?.fullName || ""}`}
        description={user?.specialization || "ملخّص حصصك وواجباتك التدريسية."}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="دفعاتي"
          value={myCohorts.length}
          icon={<Layers className="h-5 w-5" />}
          accent="lavender"
        />
        <StatCard
          label="الطلاب"
          value={students.size}
          icon={<Users className="h-5 w-5" />}
          accent="success"
        />
        <StatCard
          label="جلسات قيد الانتظار"
          value={upcoming.length}
          icon={<CalendarDays className="h-5 w-5" />}
          accent="blue"
        />
        <StatCard
          label="حضور بانتظار التسجيل"
          value={pendingAttendance.length}
          icon={<ClipboardCheck className="h-5 w-5" />}
          accent="amber"
          hint={pendingAttendance.length > 0 ? "أكمل التسجيل" : "كل شيء محدّث"}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card
            title="الجلسات القادمة"
            subtitle="أقرب الجلسات في دفعاتك"
            action={
              <Link to="/teacher/sessions">
                <span className="text-xs font-medium text-brand-blue">
                  إدارة الجلسات
                </span>
              </Link>
            }
          >
            <div className="space-y-2.5">
              {upcoming.length === 0 ? (
                <EmptyState title="لا توجد جلسات قادمة" />
              ) : (
                upcoming.slice(0, 5).map((session) => {
                  const cohort = myCohorts.find(
                    (record) => record.id === session.cohortId,
                  );
                  const course = cohort
                    ? courseForCohort(courses, levels, cohort)
                    : undefined;
                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                          <CalendarDays className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">
                            {sessionTitle(session)}
                          </p>
                          <p className="truncate text-xs text-muted">
                            {course?.name || "—"} ·{" "}
                            {formatDate(session.sessionDate)}
                          </p>
                        </div>
                      </div>
                      {sessionStatusBadge(session.status)}
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          <Card
            title="بانتظار تسجيل الحضور"
            subtitle="جلسات منتهية لم تُسجَّل فيها الحضور بعد"
          >
            <div className="space-y-2.5">
              {pendingAttendance.length === 0 ? (
                <p className="py-3 text-center text-sm text-muted">
                  لا توجد سجلات حضور معلّقة.
                </p>
              ) : (
                pendingAttendance.slice(0, 4).map((session) => {
                  const cohort = myCohorts.find(
                    (record) => record.id === session.cohortId,
                  );
                  return (
                    <Link
                      key={session.id}
                      to="/teacher/attendance"
                      className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 transition hover:bg-canvas/60"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">
                          {sessionTitle(session)} — {cohort?.code || "—"}
                        </p>
                        <p className="text-xs text-muted">
                          {formatDate(session.sessionDate)}
                        </p>
                      </div>
                      <ArrowLeft className="h-4 w-4 shrink-0 text-muted" />
                    </Link>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        <Card title="إجراءات سريعة">
          <div className="grid grid-cols-2 gap-2">
            {shortcuts.map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <Link
                  key={shortcut.to}
                  to={shortcut.to}
                  className="flex flex-col items-start gap-2 rounded-xl border border-border p-3 transition hover:border-brand-blue/40 hover:shadow-card"
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${shortcut.color}`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-sm font-medium text-ink">
                    {shortcut.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
