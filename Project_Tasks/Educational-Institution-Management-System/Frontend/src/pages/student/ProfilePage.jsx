import { useState } from "react";
import {
  Mail,
  Phone,
  Pencil,
  CalendarDays,
  BookOpen,
  UserRound,
} from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Form from "../../components/common/Form";
import Modal from "../../components/common/Modal";
import Avatar from "../../components/common/Avatar";
import { accountStatusBadge } from "../../components/common/badges";
import Badge from "../../components/common/Badge";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/auth";
import { useToast } from "../../context/toast";
import { studentApi } from "../../services/studentApi";
import { formatDate, roleLabel } from "../../utils";

/** Row of a labelled piece of information (module scope for fast refresh). */
const InfoRow = ({ icon: Icon, label, value, ltr }) => (
  <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas text-muted">
      <Icon className="h-4 w-4" />
    </span>
    <div className="min-w-0">
      <p className="text-xs text-muted">{label}</p>
      <p className={`truncate text-sm font-medium text-ink ${ltr ? "ltr" : ""}`}>
        {value}
      </p>
    </div>
  </div>
);

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
  });

  // GET /api/student/me holds the full profile of the signed-in student.
  const profileResult = useFetch(() => studentApi.me(), []);
  const profile = profileResult.single;

  // Active enrollment count for the profile card.
  const enrollmentsResult = useFetch(() => studentApi.cohorts.list(), []);
  const enrollmentCount = enrollmentsResult.data.filter(
    (record) => record.status !== "withdrawn",
  ).length;

  if (!user) return null;

  const displayName = profile?.fullName || user.fullName;
  const email = profile?.email || user.email;
  const phone = profile?.phone || user.phone;
  const study = profile?.study || user.study;
  const birthDate = profile?.birthDate || user.birthDate;

  const openEdit = () => {
    setForm({
      fullName: profile?.fullName || user.fullName || "",
      phone: profile?.phone || user.phone || "",
    });
    setEditOpen(true);
  };

  const submit = async (values) => {
    const fullName = String(values.fullName || "").trim();
    const phone = String(values.phone || "").trim();
    if (!fullName) {
      toast("error", "الاسم الكامل مطلوب.");
      return;
    }
    if (phone.length < 6) {
      toast("error", "رقم الجوال يجب ألا يقل عن 6 أحرف.");
      return;
    }
    try {
      await studentApi.updateMe({ fullName, phone });
      updateUser({ fullName, phone });
      toast("success", "تم تحديث الملف الشخصي.");
      setEditOpen(false);
      profileResult.reload();
    } catch (err) {
      toast("error", err.message);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="ملفي الشخصي"
        description="بيانات حسابك والمسار الدراسي."
        action={
          <Button variant="outline" onClick={openEdit}>
            <Pencil className="h-4 w-4" />
            تعديل البيانات
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <div className="flex flex-col items-center text-center">
            <Avatar name={displayName} seed={user.id} size="lg" />
            <h2 className="mt-3 text-lg font-extrabold text-ink">
              {displayName}
            </h2>
            <p className="ltr mt-1 text-sm text-muted">{email}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <Badge tone="blue">{roleLabel[user.role] || user.role}</Badge>
              {accountStatusBadge(user.isActive)}
            </div>
            <div className="mt-5 w-full space-y-2 border-t border-border pt-4 text-right">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">التسجيلات النشطة</span>
                <span className="font-semibold text-ink">{enrollmentCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">نسبة الحضور</span>
                <span className="font-semibold text-ink">
                  {profile?.attendance ?? 0}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">متوسط الدرجات</span>
                <span className="font-semibold text-ink">
                  {profile?.average ?? 0}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-5 lg:col-span-2">
          <Card title="البيانات الأساسية">
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow
                icon={Mail}
                label="البريد الإلكتروني"
                value={email}
                ltr
              />
              <InfoRow icon={Phone} label="رقم الجوال" value={phone || "—"} ltr />
              <InfoRow
                icon={CalendarDays}
                label="تاريخ الميلاد"
                value={formatDate(birthDate)}
              />
              <InfoRow
                icon={BookOpen}
                label="المسار الدراسي"
                value={study || "—"}
              />
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="تعديل البيانات"
        description="البريد الإلكتروني لا يمكن تغييره."
        size="sm"
      >
        <Form
          key={editOpen ? "edit-open" : "edit-closed"}
          sections={[
            {
              title: "البيانات الشخصية",
              description: "حدّث اسمك أو رقم جوالك.",
              icon: <UserRound className="h-4 w-4" />,
              fields: [
                {
                  name: "fullName",
                  label: "الاسم الكامل",
                  required: true,
                },
                {
                  name: "phone",
                  label: "رقم الجوال",
                  type: "tel",
                  required: true,
                  placeholder: "05xxxxxxxx",
                  className: "ltr",
                  validate: (value) =>
                    String(value || "").trim().length >= 6
                      ? undefined
                      : "رقم الجوال يجب ألا يقل عن 6 أحرف.",
                },
              ],
            },
          ]}
          initialValues={{ fullName: form.fullName, phone: form.phone }}
          columns={1}
          submitLabel="حفظ التعديلات"
          cancelLabel="إلغاء"
          onCancel={() => setEditOpen(false)}
          onSubmit={submit}
        />
      </Modal>
    </div>
  );
};

export default ProfilePage;
