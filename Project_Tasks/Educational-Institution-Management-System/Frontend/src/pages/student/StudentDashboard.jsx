import { Link } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileText,
  ArrowLeft,
  TrendingUp,
} from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import Badge from "../../components/common/Badge";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/auth";
import { studentApi } from "../../services/studentApi";
import { formatDate, percentage, toISODate } from "../../utils";

const StudentDashboard = () => {
  const { user } = useAuth();

  // GET /api/student/cohorts | /grades | /attendance return ready-made rows.
  const cohortsResult = useFetch(() => studentApi.cohorts.list(), []);
  const gradesResult = useFetch(() => studentApi.grades.list(), []);
  const attendanceResult = useFetch(() => studentApi.attendance.list(), []);

  const loading =
    cohortsResult.loading ||
    gradesResult.loading ||
    attendanceResult.loading;

  const myEnrollments = cohortsResult.data.filter(
    (row) => row.status !== "withdrawn",
  );
  const myGrades = gradesResult.data;
  const myAttendance = attendanceResult.data;

  const presentCount = myAttendance.filter(
    (record) =>
      record.status === "present" ||
      record.status === "late" ||
      record.status === "excused",
  ).length;
  const attendanceRate = myAttendance.length
    ? percentage(presentCount, myAttendance.length)
    : 0;

  const avgPct = myGrades.length
    ? Math.round(
        myGrades.reduce(
          (sum, result) => sum + percentage(result.score, result.maxScore),
          0,
        ) / myGrades.length,
      )
    : 0;

  const today = toISODate(new Date());
  const upcoming = myEnrollments
    .filter((row) => row.nextSession)
    .map((row) => ({
      ...row.nextSession,
      code: row.code,
      courseName: row.courseName,
    }))
    .filter(
      (session) =>
        session.status !== "cancelled" &&
        String(session.sessionDate || "").slice(0, 10) >= today,
    )
    .sort((a, b) =>
      String(a.sessionDate).localeCompare(String(b.sessionDate)),
    )
    .slice(0, 4);

  if (loading) return <Spinner label="جارٍ تحميل لوحة التحكم…" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`مرحباً، ${user?.fullName || ""}`}
        description={
          user?.study
            ? `المسار الدراسي: ${user.study}`
            : "تابع دوراتك وحضورك ودرجاتك."
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="دوراتي النشطة"
          value={myEnrollments.length}
          icon={<BookOpen className="h-5 w-5" />}
          accent="blue"
        />
        <StatCard
          label="نسبة الحضور"
          value={myAttendance.length ? `${attendanceRate}%` : "—"}
          icon={<ClipboardCheck className="h-5 w-5" />}
          accent="success"
          hint={myAttendance.length ? `${myAttendance.length} سجل` : "لا سجلات"}
        />
        <StatCard
          label="متوسط الدرجات"
          value={myGrades.length ? `${avgPct}%` : "—"}
          icon={<FileText className="h-5 w-5" />}
          accent="lavender"
          hint={myGrades.length ? `${myGrades.length} نتيجة` : "لا نتائج"}
        />
        <StatCard
          label="جلسات قادمة"
          value={upcoming.length}
          icon={<CalendarDays className="h-5 w-5" />}
          accent="amber"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card
            title="دوراتي"
            subtitle="الدورات المسجّل فيها حالياً"
            action={
              <Link to="/student/courses">
                <span className="text-xs font-medium text-brand-blue">
                  عرض الكل
                </span>
              </Link>
            }
          >
            <div className="space-y-2.5">
              {myEnrollments.length === 0 ? (
                <EmptyState
                  title="لا توجد تسجيلات نشطة"
                  description="تصفّح الدورات المتاحة وتواصل مع الإدارة للتسجيل."
                />
              ) : (
                myEnrollments.map((row) => (
                  <Link
                    key={row.enrollmentId}
                    to="/student/courses"
                    className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 transition hover:bg-canvas/60"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">
                          {row.courseName || "—"}
                        </p>
                        <p className="ltr truncate text-xs text-muted">
                          {row.code || "—"}
                        </p>
                      </div>
                    </div>
                    <ArrowLeft className="h-4 w-4 shrink-0 text-muted" />
                  </Link>
                ))
              )}
            </div>
          </Card>

          <Card title="الجلسات القادمة">
            <div className="space-y-2.5">
              {upcoming.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted">
                  لا توجد جلسات قادمة.
                </p>
              ) : (
                upcoming.map((session) => (
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
                          {session.topic || `جلسة رقم ${session.sessionNumber}`}
                        </p>
                        <p className="truncate text-xs text-muted">
                          {session.courseName || session.code || "—"} ·{" "}
                          {formatDate(session.sessionDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card
            title="أحدث النتائج"
            action={
              <Link to="/student/grades">
                <span className="text-xs font-medium text-brand-blue">
                  كل الدرجات
                </span>
              </Link>
            }
          >
            <div className="space-y-2.5">
              {myGrades.length === 0 ? (
                <p className="py-2 text-sm text-muted">لم تُنشر نتائج بعد.</p>
              ) : (
                myGrades
                  .slice()
                  .sort((a, b) =>
                    String(b.date || b.createdAt || "").localeCompare(
                      String(a.date || a.createdAt || ""),
                    ),
                  )
                  .slice(0, 4)
                  .map((result) => {
                    const pct = percentage(result.score, result.maxScore);
                    return (
                      <div
                        key={result.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">
                            {result.kind || result.cohortCode || "—"}
                          </p>
                          <p className="ltr text-xs text-muted">
                            {result.score}/{result.maxScore}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Badge tone="blue">{result.grade}</Badge>
                          <span className="ltr text-xs font-semibold text-success-600">
                            {pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </Card>

          <Card title="روابط سريعة">
            <div className="space-y-2">
              {[
                { to: "/student/attendance", label: "سجل الحضور", icon: ClipboardCheck, color: "text-success-600 bg-success-50" },
                { to: "/student/grades", label: "درجاتي", icon: TrendingUp, color: "text-brand-lavender bg-brand-lavender/15" },
                { to: "/student/profile", label: "ملفي الشخصي", icon: FileText, color: "text-brand-amber bg-brand-amber/15" },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center justify-between rounded-lg border border-border p-3 transition hover:bg-canvas/60"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-ink">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-md ${link.color}`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      {link.label}
                    </span>
                    <ArrowLeft className="h-4 w-4 text-muted" />
                  </Link>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
