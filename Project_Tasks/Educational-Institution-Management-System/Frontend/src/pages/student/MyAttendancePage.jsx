import { useMemo } from "react";
import { ClipboardCheck, CheckCircle2, XCircle, Clock, FileText } from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import EmptyState from "../../components/common/EmptyState";
import Spinner from "../../components/common/Spinner";
import { attendanceBadge } from "../../components/common/badges";
import useFetch from "../../hooks/useFetch";
import { studentApi } from "../../services/studentApi";
import { formatDate, percentage } from "../../utils";

const MyAttendancePage = () => {
  // GET /api/student/attendance returns one ready-made row per record:
  // { sessionId, cohortCode, sessionNumber, sessionDate, topic, status }
  const attendanceResult = useFetch(() => studentApi.attendance.list(), []);
  const { data: myAttendance, loading } = attendanceResult;

  const rows = useMemo(
    () =>
      [...myAttendance].sort((a, b) =>
        String(b.sessionDate || b.createdAt || "").localeCompare(
          String(a.sessionDate || a.createdAt || ""),
        ),
      ),
    [myAttendance],
  );

  const counts = {
    present: myAttendance.filter((r) => r.status === "present").length,
    late: myAttendance.filter((r) => r.status === "late").length,
    absent: myAttendance.filter((r) => r.status === "absent").length,
    excused: myAttendance.filter((r) => r.status === "excused").length,
  };
  const attended = counts.present + counts.late + counts.excused;
  const rate = myAttendance.length
    ? percentage(attended, myAttendance.length)
    : 0;

  if (loading) return <Spinner label="جارٍ تحميل سجل الحضور…" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="حضوري"
        description="سجل حضورك في جميع جلسات دوراتك."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="نسبة الحضور"
          value={myAttendance.length ? `${rate}%` : "—"}
          icon={<ClipboardCheck className="h-5 w-5" />}
          accent="success"
          hint={`${attended} من ${myAttendance.length}`}
        />
        <StatCard
          label="حاضر"
          value={counts.present}
          icon={<CheckCircle2 className="h-5 w-5" />}
          accent="success"
        />
        <StatCard
          label="متأخر / بعذر"
          value={counts.late + counts.excused}
          icon={<Clock className="h-5 w-5" />}
          accent="amber"
        />
        <StatCard
          label="غائب"
          value={counts.absent}
          icon={<XCircle className="h-5 w-5" />}
          accent="warning"
        />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-7 w-7" />}
          title="لا يوجد سجل حضور"
          description="لم تُسجَّل أي حضور بعد — سيظهر السجل بعد أول جلسة."
        />
      ) : (
        <Card title="سجل الحضور" padding="none">
          <div className="divide-y divide-border/60">
            {rows.map((record) => (
              <div
                key={`${record.sessionId}-${record.status}`}
                className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {record.topic || `جلسة رقم ${record.sessionNumber}`}
                  </p>
                  <p className="text-xs text-muted">
                    {record.cohortCode || "—"}
                    {record.sessionDate
                      ? ` · ${formatDate(record.sessionDate)}`
                      : ""}
                  </p>
                </div>
                {attendanceBadge(record.status)}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MyAttendancePage;
