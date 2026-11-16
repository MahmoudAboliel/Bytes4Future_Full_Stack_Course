import { Link } from "react-router-dom";
import {
  GraduationCap,
  Users,
  BookOpen,
  Layers,
  CalendarDays,
  NotebookPen,
  ArrowLeft,
} from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import StatCard from "../../components/common/StatCard";
import Spinner from "../../components/common/Spinner";
import { sessionStatusBadge } from "../../components/common/badges";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/auth";
import { secretaryApi } from "../../services/secretaryApi";
import {
  alive,
  courseForCohort,
  formatDate,
  levelForCohort,
  sessionTitle,
  toISODate,
  usersByRole,
} from "../../utils";

const SecretaryDashboard = () => {
  const { user } = useAuth();

  const usersResult = useFetch(() => secretaryApi.users.list(), []);
  const coursesResult = useFetch(() => secretaryApi.courses.list(), []);
  const cohortsResult = useFetch(() => secretaryApi.cohorts.list(), []);
  const sessionsResult = useFetch(() => secretaryApi.sessions.list(), []);
  const levelsResult = useFetch(() => secretaryApi.levels.list(), []);

  const loading =
    usersResult.loading ||
    coursesResult.loading ||
    cohortsResult.loading ||
    sessionsResult.loading ||
    levelsResult.loading;

  const users = usersResult.data.filter(alive);
  const courses = coursesResult.data.filter(alive);
  const cohorts = cohortsResult.data.filter(alive);
  const sessions = sessionsResult.data.filter(alive);
  const levels = levelsResult.data.filter(alive);

  const students = usersByRole(users, "student");
  const approvedTeachers = users.filter(
    (record) => record.role === "teacher" && record.isActive,
  );
  const activeCourses = courses.filter((course) => course.isActive);
  const activeCohorts = cohorts.filter((cohort) => cohort.status === "active");

  const today = toISODate(new Date());
  const upcoming = sessions
    .filter(
      (session) =>
        session.status === "scheduled" &&
        String(session.sessionDate || "").slice(0, 10) >= today,
    )
    .sort((a, b) =>
      String(a.sessionDate).localeCompare(String(b.sessionDate)),
    )
    .slice(0, 4);

  const plannedCohorts = cohorts.filter(
    (cohort) => cohort.status === "planned",
  );

  const shortcuts = [
    {
      to: "/secretary/students",
      label: "إضافة طالب",
      icon: GraduationCap,
      color: "text-success-600 bg-success-50",
    },
    {
      to: "/secretary/teachers",
      label: "إضافة مدرب",
      icon: Users,
      color: "text-brand-lavender bg-brand-lavender/15",
    },
    {
      to: "/secretary/courses",
      label: "إدارة الدورات",
      icon: BookOpen,
      color: "text-brand-blue bg-brand-blue/12",
    },
    {
      to: "/secretary/notes",
      label: "الملاحظات",
      icon: NotebookPen,
      color: "text-brand-amber bg-brand-amber/15",
    },
  ];

  if (loading) return <Spinner label="جارٍ تحميل لوحة التحكم…" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`مرحباً، ${user?.fullName || ""}`}
        description="نظرة عامة على العمليات اليومية."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="الطلاب"
          value={students.length}
          icon={<GraduationCap className="h-5 w-5" />}
          accent="success"
        />
        <StatCard
          label="المدربون المعتمدون"
          value={approvedTeachers.length}
          icon={<Users className="h-5 w-5" />}
          accent="lavender"
        />
        <StatCard
          label="الدورات المعتمدة"
          value={activeCourses.length}
          icon={<BookOpen className="h-5 w-5" />}
          accent="blue"
        />
        <StatCard
          label="الدفعات النشطة"
          value={activeCohorts.length}
          icon={<Layers className="h-5 w-5" />}
          accent="ink"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card
            title="الجلسات القادمة"
            subtitle="أقرب الجلسات المجدولة"
            action={
              <Link to="/secretary/sessions">
                <Button variant="ghost" size="sm">
                  عرض الكل
                </Button>
              </Link>
            }
          >
            <div className="space-y-2.5">
              {upcoming.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted">
                  لا توجد جلسات قادمة.
                </p>
              ) : (
                upcoming.map((session) => {
                  const cohort = cohorts.find(
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
                          <CalendarDays className="h-5 w-5" />
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
                      <div className="flex shrink-0 items-center gap-2">
                        {sessionStatusBadge(session.status)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
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

          <Card title="دفعات تحتاج انتباهاً">
            <div className="space-y-2.5">
              {plannedCohorts.length === 0 && (
                <p className="py-2 text-sm text-muted">لا يوجد.</p>
              )}
              {plannedCohorts.map((cohort) => {
                const level = levelForCohort(levels, cohort);
                return (
                  <Link
                    key={cohort.id}
                    to="/secretary/cohorts"
                    className="flex items-center justify-between gap-2 rounded-lg border border-border p-3 transition hover:bg-canvas/60"
                  >
                    <div className="min-w-0">
                      <p className="ltr truncate text-sm font-medium text-ink">
                        {cohort.code}
                      </p>
                      <p className="truncate text-xs text-muted">
                        {level?.title || "—"}
                      </p>
                    </div>
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

export default SecretaryDashboard;
