import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/common/Table";
import Filter from "../../components/common/Filter";
import Modal from "../../components/common/Modal";
import Avatar from "../../components/common/Avatar";
import { sessionStatusBadge } from "../../components/common/badges";
import Badge from "../../components/common/Badge";
import Spinner from "../../components/common/Spinner";
import useFetch from "../../hooks/useFetch";
import { secretaryApi } from "../../services/secretaryApi";
import {
  alive,
  byId,
  courseForCohort,
  formatDate,
  sessionTitle,
} from "../../utils";

const STATUS_OPTIONS = [
  { value: "scheduled", label: "مجدول" },
  { value: "done", label: "منتهية" },
  { value: "cancelled", label: "ملغاة" },
];

const SecretarySessionsPage = () => {
  const sessionsResult = useFetch(() => secretaryApi.sessions.list(), []);
  const cohortsResult = useFetch(() => secretaryApi.cohorts.list(), []);
  const levelsResult = useFetch(() => secretaryApi.levels.list(), []);
  const coursesResult = useFetch(() => secretaryApi.courses.list(), []);
  const usersResult = useFetch(() => secretaryApi.users.list(), []);

  const { data: sessions, loading } = sessionsResult;
  const cohorts = cohortsResult.data.filter(alive);
  const levels = levelsResult.data.filter(alive);
  const courses = coursesResult.data.filter(alive);
  const allUsers = usersResult.data;

  const [search, setSearch] = useState("");
  const [cohortFilter, setCohortFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detail, setDetail] = useState(null);

  const cohortOptions = useMemo(
    () =>
      cohorts.map((cohort) => ({
        value: cohort.id,
        label: `${cohort.code}${
          courseForCohort(courses, levels, cohort)
            ? ` — ${courseForCohort(courses, levels, cohort).name}`
            : ""
        }`,
      })),
    [cohorts, courses, levels],
  );

  const filtered = useMemo(
    () =>
      sessions
        .filter((session) => {
          if (cohortFilter !== "all" && session.cohortId !== cohortFilter)
            return false;
          if (statusFilter !== "all" && session.status !== statusFilter)
            return false;
          if (search) {
            const query = search.toLowerCase();
            const cohort = byId(cohorts, session.cohortId);
            const course = cohort
              ? courseForCohort(courses, levels, cohort)
              : undefined;
            return (
              String(sessionTitle(session)).toLowerCase().includes(query) ||
              String(cohort?.code || "").toLowerCase().includes(query) ||
              String(course?.name || "").toLowerCase().includes(query)
            );
          }
          return true;
        })
        .sort((a, b) =>
          String(b.sessionDate || "").localeCompare(String(a.sessionDate || "")),
        ),
    [sessions, cohortFilter, statusFilter, search, cohorts, courses, levels],
  );

  const columns = [
    {
      key: "sessionNumber",
      header: "#",
      render: (_, session) => (
        <Badge tone="neutral">{session.sessionNumber}</Badge>
      ),
    },
    {
      key: "topic",
      header: "الجلسة",
      render: (_, session) => (
        <span className="font-medium text-ink">{sessionTitle(session)}</span>
      ),
    },
    {
      key: "cohortId",
      header: "الدفعة",
      render: (_, session) => {
        const cohort = byId(cohorts, session.cohortId);
        const course = cohort
          ? courseForCohort(courses, levels, cohort)
          : undefined;
        const teacher = cohort ? byId(allUsers, cohort.teacherId) : undefined;
        return (
          <div>
            <p className="ltr text-sm text-ink">{cohort?.code || "—"}</p>
            <p className="text-xs text-muted">{course?.name || "—"}</p>
            {teacher && (
              <div className="mt-1 flex items-center gap-1.5">
                <Avatar
                  name={teacher.fullName}
                  seed={teacher.id}
                  size="sm"
                  className="h-5 w-5 text-[9px]"
                />
                <span className="text-xs text-muted">{teacher.fullName}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "sessionDate",
      header: "التاريخ",
      render: (_, session) => (
        <span className="text-sm text-muted">
          {formatDate(session.sessionDate)}
        </span>
      ),
    },
    {
      key: "status",
      header: "الحالة",
      render: (_, session) => sessionStatusBadge(session.status),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="الجلسات"
        description="عرض جميع الجلسات عبر الدفعات"
      />

      <Card padding="sm">
        <Filter
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="ابحث في موضوع الجلسة أو الدفعة..."
          filters={[
            {
              name: "cohort",
              label: "الدفعة",
              options: cohortOptions,
              placeholder: "كل الدفعات",
            },
            {
              name: "status",
              label: "الحالة",
              options: STATUS_OPTIONS,
              placeholder: "كل الحالات",
            },
          ]}
          values={{ cohort: cohortFilter, status: statusFilter }}
          onFilterChange={(name, value) => {
            if (name === "cohort") setCohortFilter(value);
            else setStatusFilter(value);
          }}
          onReset={() => {
            setSearch("");
            setCohortFilter("all");
            setStatusFilter("all");
          }}
          searchInputProps={{ prefix: <CalendarDays className="h-4 w-4" /> }}
        />
      </Card>

      <Card padding="none">
        {loading ? (
          <Spinner label="جارٍ تحميل الجلسات…" />
        ) : (
          <Table
            columns={columns}
            data={filtered}
            rowKey="id"
            caption="قائمة الجلسات"
            onRowClick={(session) => setDetail(session)}
            loadingState="جارٍ التحميل…"
            emptyMessage="لا توجد جلسات مطابقة."
            previousLabel="السابق"
            nextLabel="التالي"
          />
        )}
      </Card>

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail ? sessionTitle(detail) : ""}
      >
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {sessionStatusBadge(detail.status)}
              <Badge tone="neutral">جلسة رقم {detail.sessionNumber}</Badge>
            </div>
            <div className="rounded-lg border border-border p-3.5">
              <p className="text-xs text-muted">التاريخ</p>
              <p className="mt-1 text-sm font-medium text-ink">
                {formatDate(detail.sessionDate)}
              </p>
            </div>
            <div className="rounded-lg border border-border p-3.5">
              <p className="text-xs text-muted">الدفعة</p>
              {(() => {
                const cohort = byId(cohorts, detail.cohortId);
                const course = cohort
                  ? courseForCohort(courses, levels, cohort)
                  : undefined;
                const teacher = cohort ? byId(allUsers, cohort.teacherId) : undefined;
                return (
                  <div className="mt-1.5 space-y-1">
                    <p className="ltr text-sm font-semibold text-ink">
                      {cohort?.code || "—"}
                    </p>
                    <p className="text-sm text-ink/80">
                      {course?.name || "—"}
                    </p>
                    {teacher && (
                      <p className="text-sm text-muted">
                        المدرب: {teacher.fullName}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SecretarySessionsPage;
