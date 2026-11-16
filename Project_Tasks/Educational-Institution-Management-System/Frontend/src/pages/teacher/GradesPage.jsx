import { useMemo, useState } from "react";
import { FileText, Pencil, NotebookPen } from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Form from "../../components/common/Form";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import Avatar from "../../components/common/Avatar";
import EmptyState from "../../components/common/EmptyState";
import Spinner from "../../components/common/Spinner";
import Badge from "../../components/common/Badge";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/auth";
import { useToast } from "../../context/toast";
import { teacherApi } from "../../services/teacherApi";
import {
  alive,
  byId,
  cohortsByTeacher,
  courseForCohort,
  enrollmentsByCohort,
  gradeFromPct,
  percentage,
  resultByEnrollment,
} from "../../utils";

const GradesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const cohortsResult = useFetch(() => teacherApi.cohorts.list(), []);
  const enrollmentsResult = useFetch(() => teacherApi.enrollments.list(), []);
  const resultsResult = useFetch(() => teacherApi.results.list(), []);
  const catalogResult = useFetch(() => teacherApi.catalog.get(), []);
  const usersResult = useFetch(() => teacherApi.students.listAsUsers(), []);

  const { reload: reloadResults } = resultsResult;
  const cohorts = cohortsResult.data.filter(alive);
  const enrollments = enrollmentsResult.data.filter(alive);
  const results = resultsResult.data.filter(alive);
  const levels = (catalogResult.single?.levels ?? []).filter(alive);
  const courses = (catalogResult.single?.courses ?? []).filter(alive);
  const allUsers = usersResult.data;

  const loading =
    cohortsResult.loading ||
    enrollmentsResult.loading ||
    resultsResult.loading;

  const [cohortId, setCohortId] = useState("");
  const [target, setTarget] = useState(null); // enrollment being graded
  const [form, setForm] = useState({ score: "", maxScore: "100", notes: "" });
  const [liveValues, setLiveValues] = useState({});

  const myCohorts = useMemo(
    () => cohortsByTeacher(cohorts, user?.id),
    [cohorts, user],
  );

  const enrolled = useMemo(
    () => (cohortId ? enrollmentsByCohort(enrollments, cohortId) : []),
    [enrollments, cohortId],
  );

  const openEditor = (enrollment) => {
    const existing = resultByEnrollment(results, enrollment.id);
    setTarget(enrollment);
    setForm({
      score: existing?.score != null ? String(existing.score) : "",
      maxScore: existing?.maxScore != null ? String(existing.maxScore) : "100",
      notes: existing?.notes || "",
    });
  };

  const submit = async (values) => {
    if (!target) return;
    const score = Number(values.score);
    const maxScore = Number(values.maxScore);
    if (values.score === "" || Number.isNaN(score)) {
      toast("error", "أدخل الدرجة المحصّلة.");
      return;
    }
    if (!maxScore || maxScore <= 0) {
      toast("error", "الدرجة العظمى يجب أن تكون موجبة.");
      return;
    }
    if (score < 0 || score > maxScore) {
      toast("error", "الدرجة يجب أن تكون بين صفر والدرجة العظمى.");
      return;
    }
    // The backend schema marks `notes` as required, so an empty string
    // would be rejected with a 500 — validate it before sending.
    const notes = String(values.notes || "").trim();
    if (!notes) {
      toast("error", "ملاحظات الدرجة مطلوبة.");
      return;
    }

    try {
      const payload = {
        enrollmentId: target.id,
        score,
        maxScore,
        grade: gradeFromPct(percentage(score, maxScore)),
        notes,
        isActive: true,
      };
      const existing = resultByEnrollment(results, target.id);
      if (existing) {
        await teacherApi.results.update(existing.id, payload);
      } else {
        await teacherApi.results.create(payload);
      }
      toast("success", "تم حفظ الدرجة بنجاح.");
      setTarget(null);
      reloadResults();
    } catch (error) {
      toast("error", error.message);
    }
  };

  const graded = enrolled.filter((enrollment) =>
    resultByEnrollment(results, enrollment.id),
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="الدرجات"
        description="إدخال وتعديل درجات طلاب دفعاتك."
      />

      {loading ? (
        <Spinner label="جارٍ تحميل البيانات…" />
      ) : myCohorts.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-7 w-7" />}
          title="لا توجد دفعات مرتبطة بك"
          description="عند تعيينك على دفعة ستظهر قائمة طلابها هنا."
        />
      ) : (
        <>
          <Card padding="sm">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-[260px] flex-1">
                <label className="ui-label" htmlFor="grades-cohort">
                  الدفعة
                </label>
                <select
                  id="grades-cohort"
                  className="ui-input"
                  value={cohortId}
                  onChange={(event) => setCohortId(event.target.value)}
                >
                  <option value="">اختر الدفعة</option>
                  {myCohorts.map((cohort) => {
                    const course = courseForCohort(courses, levels, cohort);
                    return (
                      <option key={cohort.id} value={cohort.id}>
                        {cohort.code}
                        {course ? ` — ${course.name}` : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
              {cohortId && (
                <Badge tone="blue">
                  {graded}/{enrolled.length} مُقيَّم
                </Badge>
              )}
            </div>
          </Card>

          {cohortId && (
            <Card padding="none">
              {enrolled.length === 0 ? (
                <EmptyState title="لا يوجد طلاب مسجّلون في هذه الدفعة" />
              ) : (
                <div className="divide-y divide-border/60">
                  {enrolled.map((enrollment) => {
                    const student = byId(allUsers, enrollment.studentId);
                    const result = resultByEnrollment(results, enrollment.id);
                    const pct = result
                      ? percentage(result.score, result.maxScore)
                      : null;
                    return (
                      <div
                        key={enrollment.id}
                        className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar
                            name={student?.fullName || "؟"}
                            seed={enrollment.studentId}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-ink">
                              {student?.fullName || "—"}
                            </p>
                            <p className="text-xs text-muted">
                              {student?.study || "—"}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          {result ? (
                            <>
                              <div className="text-left">
                                <p className="ltr text-sm font-semibold text-ink">
                                  {result.score}/{result.maxScore}
                                </p>
                                <p className="text-xs text-muted">{pct}%</p>
                              </div>
                              <Badge tone="blue">{result.grade}</Badge>
                            </>
                          ) : (
                            <Badge tone="neutral">لم تُدرج الدرجة</Badge>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditor(enrollment)}
                          >
                            {result ? (
                              <Pencil className="h-3.5 w-3.5" />
                            ) : (
                              <FileText className="h-3.5 w-3.5" />
                            )}
                            {result ? "تعديل" : "إدخال الدرجة"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          )}
        </>
      )}

      <Modal
        open={Boolean(target)}
        onClose={() => setTarget(null)}
        title="درجة الطالب"
        description={
          target
            ? byId(allUsers, target.studentId)?.fullName || ""
            : ""
        }
        size="md"
      >
        {target && (
          <Form
            key={target.id}
            sections={[
              {
                title: "الدرجة",
                description: "الدرجة المحصّلة من الدرجة العظمى.",
                icon: <FileText className="h-4 w-4" />,
                fields: [
                  {
                    name: "score",
                    label: "الدرجة المحصّلة",
                    type: "number",
                    min: 0,
                    required: true,
                    className: "ltr",
                    render: ({ value, error, onChange }) => {
                      const max = Number(
                        liveValues.maxScore ?? form.maxScore ?? 100,
                      );
                      const pct = percentage(value, max);
                      return (
                        <div>
                          <Input
                            type="number"
                            min={0}
                            required
                            className="ltr"
                            value={value}
                            onChange={(event) =>
                              onChange(event.target.value)
                            }
                            error={error}
                          />
                          {value !== "" && !error && (
                            <div className="mt-2 flex items-center justify-between rounded-lg bg-brand-blue-soft px-3 py-2 text-xs">
                              <span className="text-muted">
                                النسبة المئوية
                              </span>
                              <span className="ltr font-bold text-brand-blue">
                                {pct}%
                              </span>
                              <span className="font-semibold text-brand-blue">
                                {gradeFromPct(pct)}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    },
                  },
                  {
                    name: "maxScore",
                    label: "الدرجة العظمى",
                    type: "number",
                    min: 1,
                    required: true,
                    className: "ltr",
                  },
                ],
              },
              {
                title: "التغذية الراجعة",
                description: "ملاحظة تظهر للطالب مع النتيجة.",
                icon: <NotebookPen className="h-4 w-4" />,
                fields: [
                  {
                    name: "notes",
                    label: "ملاحظات وتغذية راجعة",
                    as: "textarea",
                    required: true,
                    colSpan: 2,
                    placeholder: "اكتب ملاحظة على الدرجة…",
                  },
                ],
              },
            ]}
            initialValues={{
              score: form.score,
              maxScore: form.maxScore,
              notes: form.notes,
            }}
            onValuesChange={setLiveValues}
            columns={2}
            submitLabel="حفظ الدرجة"
            cancelLabel="إلغاء"
            onCancel={() => setTarget(null)}
            onSubmit={submit}
          />
        )}
      </Modal>
    </div>
  );
};

export default GradesPage;
