import { useMemo, useState } from "react";
import { ClipboardCheck, Save, CheckCircle2, CalendarDays } from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Avatar from "../../components/common/Avatar";
import EmptyState from "../../components/common/EmptyState";
import Spinner from "../../components/common/Spinner";
import StatCard from "../../components/common/StatCard";
import Badge from "../../components/common/Badge";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/auth";
import { useToast } from "../../context/toast";
import { teacherApi } from "../../services/teacherApi";
import {
  attendanceBySession,
  alive,
  byId,
  cohortsByTeacher,
  courseForCohort,
  enrollmentsByCohort,
  formatDate,
  sessionTitle,
} from "../../utils";

const STATUSES = [
  { value: "present", label: "حاضر", active: "bg-success-500" },
  { value: "absent", label: "غائب", active: "bg-error-500" },
  { value: "late", label: "متأخر", active: "bg-warning-500" },
  { value: "excused", label: "بعذر", active: "bg-info-600" },
];

const AttendancePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [cohortId, setCohortId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [saving, setSaving] = useState(false);

  const cohortsResult = useFetch(() => teacherApi.cohorts.list(), []);
  const sessionsResult = useFetch(() => teacherApi.sessions.list(), []);
  const enrollmentsResult = useFetch(() => teacherApi.enrollments.list(), []);
  const catalogResult = useFetch(() => teacherApi.catalog.get(), []);
  const usersResult = useFetch(() => teacherApi.students.listAsUsers(), []);

  // The backend exposes attendance per session only.
  const attendanceResult = useFetch(
    () =>
      sessionId
        ? teacherApi.attendance.list(sessionId)
        : Promise.resolve([]),
    [sessionId],
  );

  const { reload: reloadAttendance } = attendanceResult;
  const cohorts = cohortsResult.data.filter(alive);
  const sessions = sessionsResult.data.filter(alive);
  const enrollments = enrollmentsResult.data.filter(alive);
  const attendance = attendanceResult.data;
  const levels = (catalogResult.single?.levels ?? []).filter(alive);
  const courses = (catalogResult.single?.courses ?? []).filter(alive);
  const allUsers = usersResult.data;

  const loading =
    cohortsResult.loading ||
    sessionsResult.loading ||
    enrollmentsResult.loading;

  const myCohorts = useMemo(
    () => cohortsByTeacher(cohorts, user?.id),
    [cohorts, user],
  );

  const cohortSessions = useMemo(
    () =>
      sessions
        .filter(
          (session) =>
            session.cohortId === cohortId && session.status !== "cancelled",
        )
        .sort((a, b) =>
          String(a.sessionDate || "").localeCompare(String(b.sessionDate || "")),
        ),
    [sessions, cohortId],
  );

  const enrolled = useMemo(
    () => (cohortId ? enrollmentsByCohort(enrollments, cohortId) : []),
    [enrollments, cohortId],
  );

  const existing = useMemo(
    () => (sessionId ? attendanceBySession(attendance, sessionId) : []),
    [attendance, sessionId],
  );

  // Pre-fill the marks from the stored records. Done during render (not in an
  // effect) so the form never shows a stale session's marks for a frame.
  const marksFromRecords = useMemo(() => {
    if (!sessionId) return {};
    const initial = {};
    existing.forEach((record) => {
      initial[record.enrollmentId] = record.status;
    });
    return initial;
  }, [sessionId, existing]);

  const [marksSource, setMarksSource] = useState(marksFromRecords);
  const [marks, setMarks] = useState(marksFromRecords);
  if (marksSource !== marksFromRecords) {
    setMarksSource(marksFromRecords);
    setMarks(marksFromRecords);
  }

  const currentSession = sessions.find((record) => record.id === sessionId);
  const currentCohort = myCohorts.find((record) => record.id === cohortId);

  const counts = useMemo(() => {
    const totals = { present: 0, absent: 0, late: 0, excused: 0 };
    Object.values(marks).forEach((status) => {
      if (totals[status] != null) totals[status] += 1;
    });
    return totals;
  }, [marks]);

  const markedCount = Object.keys(marks).length;

  const save = async () => {
    if (!sessionId || enrolled.length === 0) return;
    setSaving(true);
    try {
      // The backend upserts one Attendance document per enrollment/session.
      for (const enrollment of enrolled) {
        const status = marks[enrollment.id];
        if (!status) continue;
        await teacherApi.attendance.upsert({
          sessionId,
          enrollmentId: enrollment.id,
          status,
        });
      }
      toast("success", "تم حفظ سجل الحضور بنجاح.");
      reloadAttendance();
    } catch (error) {
      toast("error", error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="الحضور والغياب"
        description="اختر الدفعة والجلسة ثم سجّل حضور الطلاب."
      />

      {loading ? (
        <Spinner label="جارٍ تحميل البيانات…" />
      ) : myCohorts.length === 0 ? (
        <EmptyState
          icon={<ClipboardCheck className="h-7 w-7" />}
          title="لا توجد دفعات مرتبطة بك"
          description="عند تعيينك على دفعة ستتمكن من تسجيل حضور جلساتها هنا."
        />
      ) : (
        <>
          <Card padding="sm">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-[220px] flex-1">
                <label className="ui-label" htmlFor="cohort-select">
                  الدفعة
                </label>
                <select
                  id="cohort-select"
                  className="ui-input"
                  value={cohortId}
                  onChange={(event) => {
                    setCohortId(event.target.value);
                    setSessionId("");
                    setMarks({});
                  }}
                >
                  <option value="">اختر الدفعة</option>
                  {myCohorts.map((cohort) => (
                    <option key={cohort.id} value={cohort.id}>
                      {cohort.code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-[220px] flex-1">
                <label className="ui-label" htmlFor="session-select">
                  الجلسة
                </label>
                <select
                  id="session-select"
                  className="ui-input"
                  value={sessionId}
                  disabled={!cohortId}
                  onChange={(event) => setSessionId(event.target.value)}
                >
                  <option value="">
                    {cohortId ? "اختر الجلسة" : "اختر الدفعة أولاً"}
                  </option>
                  {cohortSessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.sessionNumber} — {sessionTitle(session)} (
                      {formatDate(session.sessionDate)})
                    </option>
                  ))}
                </select>
              </div>
              {sessionId && (
                <Button
                  variant="primary"
                  loading={saving}
                  disabled={markedCount === 0}
                  onClick={save}
                >
                  <Save className="h-4 w-4" />
                  حفظ السجل
                </Button>
              )}
            </div>
          </Card>

          {cohortId && cohortSessions.length === 0 && (
            <EmptyState
              icon={<CalendarDays className="h-7 w-7" />}
              title="لا توجد جلسات في هذه الدفعة"
              description="أنشئ الجلسات من صفحة جلساتي أولاً."
            />
          )}

          {sessionId && currentSession && (
            <>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard
                  label="حاضر"
                  value={counts.present}
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  accent="success"
                />
                <StatCard
                  label="غائب"
                  value={counts.absent}
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  accent="warning"
                />
                <StatCard
                  label="متأخر"
                  value={counts.late}
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  accent="amber"
                />
                <StatCard
                  label="بعذر"
                  value={counts.excused}
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  accent="blue"
                />
              </div>

              <Card
                title={sessionTitle(currentSession)}
                subtitle={`دفعة ${currentCohort?.code || "—"} — ${formatDate(currentSession.sessionDate)}${
                  currentCohort
                    ? ` · ${
                        courseForCohort(courses, levels, currentCohort)?.name ||
                        ""
                      }`
                    : ""
                }`}
                action={
                  <Badge tone="blue">
                    {markedCount}/{enrolled.length} مسجّل
                  </Badge>
                }
                padding="none"
              >
                {enrolled.length === 0 ? (
                  <EmptyState title="لا يوجد طلاب مسجّلون في هذه الدفعة" />
                ) : (
                  <div className="divide-y divide-border/60">
                    {enrolled.map((enrollment) => {
                      const student = byId(allUsers, enrollment.studentId);
                      const mark = marks[enrollment.id];
                      return (
                        <div
                          key={enrollment.id}
                          className="flex flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
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
                                سُجِّل في{" "}
                                {formatDate(
                                  enrollment.enrolledAt || enrollment.createdAt,
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex shrink-0 rounded-lg border border-border bg-canvas/60 p-1">
                            {STATUSES.map((status) => (
                              <button
                                key={status.value}
                                type="button"
                                onClick={() =>
                                  setMarks((current) => ({
                                    ...current,
                                    [enrollment.id]: status.value,
                                  }))
                                }
                                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                                  mark === status.value
                                    ? `${status.active} text-white shadow-sm`
                                    : "text-muted hover:text-ink"
                                }`}
                              >
                                {status.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AttendancePage;
