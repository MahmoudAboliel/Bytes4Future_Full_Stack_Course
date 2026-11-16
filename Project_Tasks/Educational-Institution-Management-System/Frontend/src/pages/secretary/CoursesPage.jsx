import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  BookOpen,
  Layers,
  ChevronLeft,
  Pencil,
  CalendarDays,
} from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Form from "../../components/common/Form";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import { approvalBadge, cohortStatusBadge } from "../../components/common/badges";
import Badge from "../../components/common/Badge";
import Avatar from "../../components/common/Avatar";
import Spinner from "../../components/common/Spinner";
import useFetch from "../../hooks/useFetch";
import { useToast } from "../../context/toast";
import { secretaryApi } from "../../services/secretaryApi";
import {
  alive,
  byId,
  cohortEnrollmentCount,
  cohortsByLevel,
  formatDate,
  levelsByCourse,
} from "../../utils";

const levelSections = [
  {
    title: "بيانات المستوى",
    description: "العنوان والترتيب داخل الدورة.",
    icon: <Layers className="h-4 w-4" />,
    fields: [
      {
        name: "title",
        label: "عنوان المستوى",
        required: true,
        placeholder: "مثال: المستوى المتوسط",
      },
      {
        name: "orderNumber",
        label: "الترتيب",
        type: "number",
        required: true,
        validate: (value) =>
          Number(value) > 0 ? undefined : "الترتيب يجب أن يكون موجباً.",
      },
    ],
  },
];

/** Modal used to create / edit a level (module scope to keep form state stable). */
const LevelModal = ({ open, target, formKey, onCancel, onSubmit }) => (
  <Modal
    open={open}
    onClose={onCancel}
    title={target?.level ? "تعديل مستوى" : "إضافة مستوى"}
    size="sm"
  >
    {open && (
      <Form
        key={`level-${formKey}`}
        initialValues={{
          title: target.level?.title || "",
          orderNumber: target.level?.orderNumber || target.order || 1,
        }}
        sections={levelSections}
        columns={1}
        submitLabel="حفظ"
        cancelLabel="إلغاء"
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
    )}
  </Modal>
);

const CoursesPage = () => {
  const { toast } = useToast();

  const coursesResult = useFetch(() => secretaryApi.courses.list(), []);
  const levelsResult = useFetch(() => secretaryApi.levels.list(), []);
  const cohortsResult = useFetch(() => secretaryApi.cohorts.list(), []);
  const enrollmentsResult = useFetch(() => secretaryApi.enrollments.list(), []);
  const usersResult = useFetch(() => secretaryApi.users.list(), []);

  const { data: courses, loading: coursesLoading, reload: reloadCourses } = coursesResult;
  const { data: levels, reload: reloadLevels } = levelsResult;
  const cohorts = cohortsResult.data.filter(alive);
  const enrollments = enrollmentsResult.data.filter(alive);
  const allUsers = usersResult.data;

  const [view, setView] = useState({ type: "list" });
  const [courseOpen, setCourseOpen] = useState(false);
  const [levelTarget, setLevelTarget] = useState(null); // { courseId, level? }
  const [formKey, setFormKey] = useState(0);

  const approvedCourses = useMemo(
    () => courses.filter((course) => course.isActive && !course.deletedAt),
    [courses],
  );
  const pendingCourses = useMemo(
    () => courses.filter((course) => !course.isActive),
    [courses],
  );

  const currentCourse =
    view.type !== "list"
      ? courses.find((course) => course.id === view.courseId)
      : undefined;
  const currentLevel =
    view.type === "level"
      ? levels.find((level) => level.id === view.levelId)
      : undefined;

  const submitCourse = async (values) => {
    try {
      await secretaryApi.courses.create({
        name: String(values.name).trim(),
        description: String(values.description || "").trim(),
        // New course requests await admin approval.
        isActive: false,
      });
      toast("info", "تم إرسال طلب الدورة إلى الإدارة للاعتماد.");
      setCourseOpen(false);
      setFormKey((key) => key + 1);
      reloadCourses();
    } catch (error) {
      toast("error", error.message);
    }
  };

  const submitLevel = async (values) => {
    if (!levelTarget) return;
    try {
      if (levelTarget.level) {
        await secretaryApi.levels.update(levelTarget.level.id, {
          title: String(values.title).trim(),
          orderNumber: Number(values.orderNumber) || 1,
        });
        toast("success", "تم تحديث المستوى.");
      } else {
        await secretaryApi.levels.create({
          courseId: levelTarget.courseId,
          title: String(values.title).trim(),
          orderNumber: Number(values.orderNumber) || 1,
          isActive: true,
        });
        toast("success", "تمت إضافة المستوى.");
      }
      setLevelTarget(null);
      setFormKey((key) => key + 1);
      reloadLevels();
    } catch (error) {
      toast("error", error.message);
    }
  };

  if (coursesLoading) return <Spinner label="جارٍ تحميل الدورات…" />;

  /* ------------------------------ LIST VIEW ------------------------------ */
  if (view.type === "list") {
    return (
      <div className="space-y-6">
        <PageHeader
          title="الدورات والمستويات"
          description="تصفّح الدورات المعتمدة وطلبات الدورات الجديدة"
          action={
            <Button
              onClick={() => {
                setFormKey((key) => key + 1);
                setCourseOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              طلب دورة جديدة
            </Button>
          }
        />

        <div>
          <h2 className="mb-3 text-sm font-bold text-ink">
            الدورات المعتمدة
          </h2>
          {approvedCourses.length === 0 ? (
            <EmptyState title="لا توجد دورات معتمدة" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {approvedCourses.map((course) => {
                const courseLevels = levelsByCourse(levels, course.id);
                return (
                  <Card
                    key={course.id}
                    className="cursor-pointer transition hover:shadow-card-lg hover:border-muted/30"
                    onClick={() =>
                      setView({ type: "course", courseId: course.id })
                    }
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <Badge tone="blue">{courseLevels.length} مستوى</Badge>
                    </div>
                    <h3 className="mt-3 text-base font-bold text-ink">
                      {course.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                      {course.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {pendingCourses.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-bold text-ink">
              طلبات قيد المراجعة
            </h2>
            <div className="space-y-2">
              {pendingCourses.map((course) => (
                <Card key={course.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {course.name}
                      </p>
                      <p className="text-xs text-muted">
                        {formatDate(course.createdAt)}
                      </p>
                    </div>
                    {approvalBadge(course)}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Modal
          open={courseOpen}
          onClose={() => setCourseOpen(false)}
          title="طلب دورة جديدة"
          description="سيتم إرسال الطلب إلى الإدارة للاعتماد قبل النشر."
          size="md"
        >
          <Form
            key={`course-${formKey}`}
            sections={[
              {
                title: "بيانات الدورة",
                description: "اسم الدورة ووصفها المختصر.",
                icon: <BookOpen className="h-4 w-4" />,
                fields: [
                  {
                    name: "name",
                    label: "اسم الدورة",
                    required: true,
                    placeholder: "مثال: أساسيات قواعد البيانات",
                    colSpan: 2,
                  },
                  {
                    name: "description",
                    label: "الوصف",
                    type: "textarea",
                    required: true,
                    colSpan: 2,
                    rows: 4,
                    placeholder: "اكتب وصفاً مختصراً يظهر للطلاب في صفحة الدورات…",
                  },
                ],
              },
            ]}
            columns={2}
            submitLabel="إرسال الطلب"
            cancelLabel="إلغاء"
            onCancel={() => setCourseOpen(false)}
            onSubmit={submitCourse}
          />
        </Modal>
      </div>
    );
  }

  /* ------------------------------ COURSE VIEW ------------------------------ */
  if (view.type === "course" && currentCourse) {
    const courseLevels = levelsByCourse(levels, currentCourse.id);

    return (
      <div className="space-y-6">
        <PageHeader
          breadcrumbs={[
            { label: "الدورات", to: "/secretary/courses" },
            { label: currentCourse.name },
          ]}
          title={currentCourse.name}
          description={currentCourse.description}
          action={
            <Button
              variant="outline"
              onClick={() => {
                setFormKey((key) => key + 1);
                setLevelTarget({
                  courseId: currentCourse.id,
                  order: courseLevels.length + 1,
                });
              }}
            >
              <Plus className="h-4 w-4" />
              إضافة مستوى
            </Button>
          }
        />

        <div className="flex items-center gap-3">
          {approvalBadge(currentCourse)}
          <span className="text-xs text-muted">
            {courseLevels.length} مستويات
          </span>
        </div>

        {courseLevels.length === 0 ? (
          <EmptyState
            title="لا توجد مستويات"
            description="أضف مستوى أول لهذه الدورة."
            action={
              <Button
                onClick={() => {
                  setFormKey((key) => key + 1);
                  setLevelTarget({ courseId: currentCourse.id, order: 1 });
                }}
              >
                إضافة مستوى
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {courseLevels.map((level, index) => {
              const levelCohorts = cohortsByLevel(cohorts, level.id);
              return (
                <Card
                  key={level.id}
                  className="cursor-pointer transition hover:shadow-card-lg hover:border-muted/30"
                  onClick={() =>
                    setView({
                      type: "level",
                      courseId: currentCourse.id,
                      levelId: level.id,
                    })
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-lavender/15 text-sm font-bold text-[#8b4fb8]">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {level.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          الترتيب: {level.orderNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone="lavender">{levelCohorts.length} دفعة</Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(event) => {
                          event.stopPropagation();
                          setFormKey((key) => key + 1);
                          setLevelTarget({
                            courseId: currentCourse.id,
                            level,
                          });
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        تعديل
                      </Button>
                      <ChevronLeft className="h-4 w-4 text-muted" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <LevelModal
          open={Boolean(levelTarget)}
          target={levelTarget}
          formKey={formKey}
          onCancel={() => setLevelTarget(null)}
          onSubmit={submitLevel}
        />
      </div>
    );
  }

  /* ------------------------------ LEVEL VIEW ------------------------------ */
  if (view.type === "level" && currentCourse && currentLevel) {
    const levelCohorts = cohortsByLevel(cohorts, currentLevel.id);

    return (
      <div className="space-y-6">
        <PageHeader
          breadcrumbs={[
            { label: "الدورات", to: "/secretary/courses" },
            { label: currentCourse.name, to: "/secretary/courses" },
            { label: currentLevel.title },
          ]}
          title={currentLevel.title}
          description={`ترتيب ${currentLevel.orderNumber} ضمن ${currentCourse.name}`}
          action={
            <Link to="/secretary/cohorts">
              <Button variant="outline">
                <Plus className="h-4 w-4" />
                إنشاء دفعة
              </Button>
            </Link>
          }
        />

        {levelCohorts.length === 0 ? (
          <EmptyState
            title="لا توجد دفعات لهذا المستوى"
            description="انتقل إلى صفحة الدفعات لإنشاء دفعة جديدة."
            action={
              <Link to="/secretary/cohorts">
                <Button>إنشاء دفعة</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {levelCohorts.map((cohort) => {
              const count = cohortEnrollmentCount(enrollments, cohort.id);
              return (
                <Card key={cohort.id}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-brand-lavender" />
                      <h3 className="text-base font-bold text-ink">
                        {cohort.code}
                      </h3>
                    </div>
                    {cohortStatusBadge(cohort.status)}
                  </div>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted">
                      <CalendarDays className="h-4 w-4" />
                      <span>
                        {formatDate(cohort.startDate)} —{" "}
                        {formatDate(cohort.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted">المدرب</span>
                      <span className="flex items-center gap-1.5 font-medium text-ink">
                        <Avatar
                          name={byId(allUsers, cohort.teacherId)?.fullName || "؟"}
                          seed={cohort.teacherId}
                          size="sm"
                          className="h-6 w-6 text-[10px]"
                        />
                        {byId(allUsers, cohort.teacherId)?.fullName || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted">المسجلون</span>
                      <Badge
                        tone={
                          count >= (cohort.capacity || Infinity)
                            ? "warning"
                            : "blue"
                        }
                      >
                        {count}/{cohort.capacity ?? "—"}
                      </Badge>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <LevelModal
          open={Boolean(levelTarget)}
          target={levelTarget}
          formKey={formKey}
          onCancel={() => setLevelTarget(null)}
          onSubmit={submitLevel}
        />
      </div>
    );
  }

  return null;
};

export default CoursesPage;
