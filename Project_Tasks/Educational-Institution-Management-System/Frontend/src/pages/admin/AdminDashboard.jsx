import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  Layers,
  Clock,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import StatCard from "../../components/common/StatCard";
import EmptyState from "../../components/common/EmptyState";
import Avatar from "../../components/common/Avatar";
import Spinner from "../../components/common/Spinner";
import { approvalBadge, accountStatusBadge } from "../../components/common/badges";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/auth";
import { useToast } from "../../context/toast";
import { adminApi } from "../../services/adminApi";
import { alive, formatDate, usersByRole } from "../../utils";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const usersResult = useFetch(() => adminApi.users.list(), []);
  const coursesResult = useFetch(() => adminApi.courses.list(), []);
  const cohortsResult = useFetch(() => adminApi.cohorts.list(), []);

  const loading =
    usersResult.loading || coursesResult.loading || cohortsResult.loading;
  const users = usersResult.data.filter(alive);
  const courses = coursesResult.data.filter(alive);
  const cohorts = cohortsResult.data.filter(alive);

  const activeUsers = users.filter((u) => u.isActive).length;
  const approvedCourses = courses.filter((c) => c.isActive).length;
  const activeCohorts = cohorts.filter((c) => c.status === "active").length;

  const pendingCourses = courses.filter((c) => !c.isActive);
  const pendingTeachers = users.filter(
    (u) => u.role === "teacher" && !u.isActive,
  );
  const pendingCount = pendingCourses.length + pendingTeachers.length;

  const secretaries = usersByRole(users, "secretary");

  const decide = async (kind, record, approve) => {
    try {
      // Approval uses the dedicated approval endpoint; rejection closes the
      // request with a soft delete so it leaves the pending list.
      if (kind === "course") {
        if (approve) await adminApi.approvals.approve("courses", record.id);
        else await adminApi.courses.remove(record.id);
      } else {
        if (approve) await adminApi.approvals.approve("users", record.id);
        else await adminApi.users.remove(record.id);
      }
      toast(
        approve ? "success" : "warning",
        approve
          ? "تم اعتماد الطلب."
          : "تم رفض الطلب وإغلاقه.",
      );
      usersResult.reload();
      coursesResult.reload();
    } catch (error) {
      toast("error", error.message);
    }
  };

  if (loading) return <Spinner label="جارٍ تحميل لوحة التحكم…" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`مرحباً، ${user?.fullName || ""}`}
        description="نظرة عامة على حالة النظام والطلبات بانتظار الاعتماد."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="المستخدمون النشطون"
          value={activeUsers}
          icon={<Users className="h-5 w-5" />}
          accent="ink"
        />
        <StatCard
          label="الدورات المعتمدة"
          value={approvedCourses}
          icon={<BookOpen className="h-5 w-5" />}
          accent="blue"
        />
        <StatCard
          label="الدفعات النشطة"
          value={activeCohorts}
          icon={<Layers className="h-5 w-5" />}
          accent="lavender"
        />
        <StatCard
          label="طلبات بانتظار الاعتماد"
          value={pendingCount}
          icon={<Clock className="h-5 w-5" />}
          accent="amber"
          hint={pendingCount > 0 ? "بحاجة إلى مراجعة" : "لا يوجد"}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Pending approvals */}
        <div className="space-y-5 lg:col-span-2">
          <Card
            title="طلبات الاعتماد"
            subtitle="راجع واعتمد أو ارفض الطلبات الجديدة"
            action={
              <Link to="/admin/approvals">
                <Button variant="ghost" size="sm">
                  المركز الكامل
                </Button>
              </Link>
            }
          >
            <div className="space-y-3">
              {pendingCount === 0 && (
                <EmptyState
                  title="لا توجد طلبات معلّقة"
                  description="جميع الطلبات تمت معالجتها."
                />
              )}

              {pendingCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-ink">
                        {course.name}
                      </span>
                      {approvalBadge(course)}
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-muted">
                      {course.description}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      تاريخ الطلب: {formatDate(course.createdAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => decide("course", course, true)}
                    >
                      اعتماد
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => decide("course", course, false)}
                    >
                      رفض
                    </Button>
                  </div>
                </div>
              ))}

              {pendingTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar
                      name={teacher.fullName}
                      seed={teacher.id}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ink">
                          {teacher.fullName}
                        </span>
                        {approvalBadge(teacher)}
                      </div>
                      <p className="mt-0.5 text-xs text-muted">
                        التخصص: {teacher.specialization || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => decide("teacher", teacher, true)}
                    >
                      اعتماد
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => decide("teacher", teacher, false)}
                    >
                      رفض
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick actions + accounts */}
        <div className="space-y-5">
          <Card title="إجراءات سريعة">
            <div className="space-y-2">
              <Link
                to="/admin/approvals"
                className="flex items-center justify-between rounded-lg border border-border p-3 transition hover:border-brand-blue/40 hover:bg-canvas/60"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-ink">
                  <CheckCircle2 className="h-4 w-4 text-brand-amber" />
                  مراجعة الطلبات
                </span>
                <ArrowLeft className="h-4 w-4 text-muted" />
              </Link>
              <Link
                to="/admin/secretaries"
                className="flex items-center justify-between rounded-lg border border-border p-3 transition hover:border-brand-blue/40 hover:bg-canvas/60"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-ink">
                  <Users className="h-4 w-4 text-brand-blue" />
                  إدارة الحسابات الإدارية
                </span>
                <ArrowLeft className="h-4 w-4 text-muted" />
              </Link>
            </div>
          </Card>

          <Card title="الحسابات الإدارية">
            <div className="space-y-2.5">
              {secretaries.length === 0 && (
                <p className="py-2 text-sm text-muted">لا يوجد حسابات بعد.</p>
              )}
              {secretaries.map((secretary) => (
                <div
                  key={secretary.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Avatar
                      name={secretary.fullName}
                      seed={secretary.id}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">
                        {secretary.fullName}
                      </p>
                      <p className="ltr truncate text-xs text-muted">
                        {secretary.email}
                      </p>
                    </div>
                  </div>
                  {accountStatusBadge(secretary.isActive)}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
