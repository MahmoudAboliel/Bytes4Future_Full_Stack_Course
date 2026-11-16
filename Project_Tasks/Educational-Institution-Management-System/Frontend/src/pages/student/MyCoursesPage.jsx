import { useMemo, useState } from "react";
import { BookOpen, Compass, CalendarDays, Users } from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import Spinner from "../../components/common/Spinner";
import Avatar from "../../components/common/Avatar";
import { cohortStatusBadge, sessionStatusBadge } from "../../components/common/badges";
import Badge from "../../components/common/Badge";
import useFetch from "../../hooks/useFetch";
import { studentApi } from "../../services/studentApi";
import { formatDate, levelsByCourse } from "../../utils";

const MyCoursesPage = () => {
  // GET /api/student/cohorts -> one row per enrollment with the cohort info.
  const cohortsResult = useFetch(() => studentApi.cohorts.list(), []);
  // GET /api/student/catalog -> the approved courses and their levels.
  const catalogResult = useFetch(() => studentApi.catalog.get(), []);

  const { data: myEnrollments, loading: enrollmentsLoading } = cohortsResult;
  const catalogLoading = catalogResult.loading;

  const courses = useMemo(
    () => catalogResult.single?.courses ?? [],
    [catalogResult.single],
  );
  const levels = useMemo(
    () => catalogResult.single?.levels ?? [],
    [catalogResult.single],
  );

  const [tab, setTab] = useState("learning");
  const [detailCourse, setDetailCourse] = useState(null);

  const activeEnrollments = useMemo(
    () => myEnrollments.filter((row) => row.status !== "withdrawn"),
    [myEnrollments],
  );

  const approvedCourses = useMemo(
    () => courses.filter((course) => course.isActive !== false),
    [courses],
  );

  const tabClass = (active) =>
    `flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
      active ? "bg-brand-blue text-white" : "text-muted hover:text-ink"
    }`;

  const CourseCardBody = ({ course, enrollment }) => {
    const courseLevels = levelsByCourse(levels, course.id);
    const teacherName = enrollment?.teacherName;
    const levelTitle =
      enrollment?.levelTitle ||
      courseLevels.find((level) => level.id === enrollment?.levelId)?.title;

    return (
      <>
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
            <BookOpen className="h-5 w-5" />
          </div>
          <Badge tone="blue">{courseLevels.length} مستوى</Badge>
        </div>
        <h3 className="mt-3 text-base font-bold text-ink">{course.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {course.description}
        </p>

        {enrollment ? (
          <div className="mt-3 space-y-1.5 border-t border-border pt-3 text-xs text-muted">
            <div className="flex items-center justify-between">
              <span>الدفعة</span>
              <span className="ltr font-medium text-ink">
                {enrollment.code || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>المستوى</span>
              <span className="font-medium text-ink">{levelTitle || "—"}</span>
            </div>
            {teacherName && (
              <div className="flex items-center justify-between">
                <span>المدرب</span>
                <span className="flex items-center gap-1.5 font-medium text-ink">
                  <Avatar
                    name={teacherName}
                    seed={enrollment.teacherId || teacherName}
                    size="sm"
                    className="h-5 w-5 text-[9px]"
                  />
                  {teacherName}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span>الجلسات</span>
              <span className="font-medium text-ink">
                {enrollment.sessionsDone}/{enrollment.sessionsTotal}
              </span>
            </div>
          </div>
        ) : (
          <p className="mt-3 border-t border-border pt-3 text-xs text-muted">
            للتسجيل تواصل مع الإدارة
          </p>
        )}
      </>
    );
  };

  if (enrollmentsLoading || catalogLoading)
    return <Spinner label="جارٍ تحميل الدورات…" />;

  return (
    <div className="space-y-6">
      <PageHeader title="دوراتي" description="دوراتك المسجّل فيها والدورات المتاحة" />

      <div className="w-fit rounded-card border border-border bg-white p-1">
        <button onClick={() => setTab("learning")} className={tabClass(tab === "learning")}>
          <BookOpen className="h-4 w-4" /> دوراتي
        </button>
        <button onClick={() => setTab("explore")} className={tabClass(tab === "explore")}>
          <Compass className="h-4 w-4" /> استكشاف الدورات
        </button>
      </div>

      {tab === "learning" ? (
        activeEnrollments.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="h-7 w-7" />}
            title="لا توجد تسجيلات نشطة"
            description="انتقل إلى تبويب استكشاف الدورات لتعرف على البرامج المتاحة."
            action={
              <Button onClick={() => setTab("explore")}>
                <Compass className="h-4 w-4" />
                استكشاف الدورات
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeEnrollments.map((enrollment) => {
              const course = courses.find(
                (record) => record.id === enrollment.courseId,
              );
              const fallback = {
                id: enrollment.courseId,
                name: enrollment.courseName || "دورة",
                description: "",
                isActive: true,
              };
              return (
                <Card
                  key={enrollment.enrollmentId}
                  className="transition hover:shadow-card-lg hover:border-muted/30"
                >
                  <CourseCardBody
                    course={course || fallback}
                    enrollment={enrollment}
                  />
                </Card>
              );
            })}
          </div>
        )
      ) : approvedCourses.length === 0 ? (
        <EmptyState
          icon={<Compass className="h-7 w-7" />}
          title="لا توجد دورات متاحة حالياً"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {approvedCourses.map((course) => (
            <Card
              key={course.id}
              className="cursor-pointer transition hover:shadow-card-lg hover:border-muted/30"
              onClick={() => setDetailCourse(course)}
            >
              <CourseCardBody course={course} enrollment={null} />
            </Card>
          ))}
        </div>
      )}

      {/* Course detail */}
      <Modal
        open={Boolean(detailCourse)}
        onClose={() => setDetailCourse(null)}
        title={detailCourse?.name || ""}
        description={detailCourse?.description || ""}
        size="lg"
      >
        {detailCourse && (
          <CourseDetailBody
            course={detailCourse}
            levels={levels}
            enrollments={activeEnrollments}
          />
        )}
      </Modal>
    </div>
  );
};

const CourseDetailBody = ({ course, levels, enrollments }) => {
  const courseLevels = levelsByCourse(levels, course.id);
  const myCohorts = enrollments.filter(
    (row) => row.courseId === course.id,
  );

  return (
    <div className="space-y-5">
      <div>
        <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
          <Users className="h-4 w-4 text-muted" /> المستويات
        </h4>
        {courseLevels.length === 0 ? (
          <p className="text-sm text-muted">لا توجد مستويات معلنة.</p>
        ) : (
          <div className="space-y-1.5">
            {courseLevels.map((level, index) => (
              <div
                key={level.id}
                className="flex items-center justify-between rounded-lg border border-border p-2.5 text-sm"
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-lavender/15 text-xs font-bold text-[#8b4fb8]">
                    {index + 1}
                  </span>
                  {level.title}
                </span>
                <span className="text-xs text-muted">
                  {
                    myCohorts.filter((row) => row.levelId === level.id).length
                  }{" "}
                  دفعة
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
          <CalendarDays className="h-4 w-4 text-muted" /> دفعاتي في هذه الدورة
        </h4>
        {myCohorts.length === 0 ? (
          <p className="text-sm text-muted">لا توجد دفعات مسجّل بها بعد.</p>
        ) : (
          <div className="space-y-2">
            {myCohorts.map((row) => (
              <div
                key={row.enrollmentId}
                className="rounded-lg border border-border p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="ltr text-sm font-semibold text-ink">
                    {row.code}
                  </span>
                  {cohortStatusBadge(row.status)}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                  {row.startDate && (
                    <span>
                      {formatDate(row.startDate)} — {formatDate(row.endDate)}
                    </span>
                  )}
                  <span>
                    الجلسات: {row.sessionsDone}/{row.sessionsTotal}
                  </span>
                  {row.teacherName && (
                    <span>المدرب: {row.teacherName}</span>
                  )}
                </div>
                {row.nextSession && (
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-canvas/70 px-3 py-2 text-xs">
                    <span className="text-muted">
                      الجلسة القادمة: {row.nextSession.topic || "—"}
                    </span>
                    {sessionStatusBadge("scheduled")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
