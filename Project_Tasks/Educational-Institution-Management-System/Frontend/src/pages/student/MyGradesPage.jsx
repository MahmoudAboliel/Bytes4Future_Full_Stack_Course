import { useMemo } from "react";
import { FileText, TrendingUp, Award } from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import EmptyState from "../../components/common/EmptyState";
import Spinner from "../../components/common/Spinner";
import Badge from "../../components/common/Badge";
import useFetch from "../../hooks/useFetch";
import { studentApi } from "../../services/studentApi";
import { formatDate, percentage } from "../../utils";

const MyGradesPage = () => {
  // GET /api/student/grades returns one ready-made row per published result:
  // { id, enrollmentId, cohortCode, kind, score, maxScore, grade, notes, date }
  const resultsResult = useFetch(() => studentApi.grades.list(), []);
  const { data: results, loading } = resultsResult;

  const rows = useMemo(
    () =>
      results
        .map((result) => ({
          result,
          pct: percentage(result.score, result.maxScore),
        }))
        .sort((a, b) =>
          String(b.result.date || b.result.createdAt || "").localeCompare(
            String(a.result.date || a.result.createdAt || ""),
          ),
        ),
    [results],
  );

  const avg = rows.length
    ? Math.round(rows.reduce((sum, row) => sum + row.pct, 0) / rows.length)
    : 0;
  const best = rows.length ? Math.max(...rows.map((row) => row.pct)) : 0;
  const passed = rows.filter((row) => row.pct >= 60).length;

  if (loading) return <Spinner label="جارٍ تحميل الدرجات…" />;

  return (
    <div className="space-y-6">
      <PageHeader title="درجاتي" description="جميع النتائج المنشورة لدوراتك." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="عدد النتائج"
          value={rows.length}
          icon={<FileText className="h-5 w-5" />}
          accent="blue"
        />
        <StatCard
          label="متوسط الدرجات"
          value={rows.length ? `${avg}%` : "—"}
          icon={<TrendingUp className="h-5 w-5" />}
          accent="lavender"
        />
        <StatCard
          label="أعلى نتيجة"
          value={rows.length ? `${best}%` : "—"}
          icon={<Award className="h-5 w-5" />}
          accent="success"
        />
        <StatCard
          label="اجتياز"
          value={rows.length ? `${passed}/${rows.length}` : "—"}
          icon={<Award className="h-5 w-5" />}
          accent="amber"
        />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-7 w-7" />}
          title="لا توجد نتائج منشورة"
          description="ستظهر درجاتك هنا فور نشرها من المدرب."
        />
      ) : (
        <div className="space-y-3">
          {rows.map(({ result, pct }) => (
            <Card key={result.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-ink">
                      {result.kind || "الدورة"}
                    </h3>
                    <Badge tone="blue">{result.grade}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    الدفعة: <span className="ltr">{result.cohortCode || "—"}</span>
                    {result.date ? ` · ${formatDate(result.date)}` : ""}
                  </p>
                  {result.notes && (
                    <p className="mt-2 rounded-lg bg-canvas/70 px-3 py-2 text-sm leading-relaxed text-ink/80">
                      {result.notes}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <div className="text-left">
                    <p className="ltr text-lg font-extrabold text-ink">
                      {result.score}/{result.maxScore}
                    </p>
                    <p className="ltr text-xs text-muted">{pct}%</p>
                  </div>
                  <div className="h-16 w-2 overflow-hidden rounded-full bg-border/70">
                    <div
                      className={`w-full rounded-full ${
                        pct >= 60 ? "bg-success-500" : "bg-error-500"
                      }`}
                      style={{
                        height: `${Math.min(100, Math.max(4, pct))}%`,
                        marginTop: `${100 - Math.min(100, Math.max(4, pct))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGradesPage;
