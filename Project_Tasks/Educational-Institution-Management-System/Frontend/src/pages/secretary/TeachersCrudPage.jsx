import { useMemo, useState } from "react";
import { UserPlus, Mail, UserRound, KeyRound, GraduationCap } from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Form from "../../components/common/Form";
import Modal from "../../components/common/Modal";
import Table from "../../components/common/Table";
import Filter from "../../components/common/Filter";
import Avatar from "../../components/common/Avatar";
import { accountStatusBadge, approvalBadge } from "../../components/common/badges";
import Badge from "../../components/common/Badge";
import Spinner from "../../components/common/Spinner";
import useFetch from "../../hooks/useFetch";
import { useToast } from "../../context/toast";
import { secretaryApi } from "../../services/secretaryApi";
import {
  alive,
  cohortsByTeacher,
  usersByRole,
} from "../../utils";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TeachersCrudPage = () => {
  const { toast } = useToast();

  const usersResult = useFetch(() => secretaryApi.users.list(), []);
  const cohortsResult = useFetch(() => secretaryApi.cohorts.list(), []);

  const { data: allUsers, loading, reload } = usersResult;
  const cohorts = cohortsResult.data.filter(alive);

  const [search, setSearch] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const teachers = useMemo(
    () => usersByRole(allUsers, "teacher"),
    [allUsers],
  );

  const approvalState = (teacher) => {
    if (teacher.deletedAt) return "rejected";
    if (teacher.isActive) return "approved";
    return "pending";
  };

  const filtered = useMemo(
    () =>
      teachers.filter((teacher) => {
        if (approvalFilter !== "all" && approvalState(teacher) !== approvalFilter)
          return false;
        if (search) {
          const query = search.toLowerCase();
          return (
            String(teacher.fullName).toLowerCase().includes(query) ||
            String(teacher.email).toLowerCase().includes(query) ||
            String(teacher.specialization || "").toLowerCase().includes(query)
          );
        }
        return true;
      }),
    [teachers, search, approvalFilter],
  );

  const sections = [
    {
      title: "بيانات المدرب",
      description: "الاسم والبريد الإلكتروني ورقم التواصل.",
      icon: <UserRound className="h-4 w-4" />,
      fields: [
        {
          name: "fullName",
          label: "الاسم الكامل",
          required: true,
          placeholder: "مثال: أ. منى الزهراني",
        },
        {
          name: "email",
          label: "البريد الإلكتروني",
          type: "email",
          required: true,
          placeholder: "name@edums.edu",
          className: "ltr",
          validate: (value) => {
            if (!emailPattern.test(String(value || "").trim()))
              return "صيغة بريد غير صحيحة.";
            if (
              allUsers.some(
                (record) =>
                  String(record.email).toLowerCase() ===
                  String(value).trim().toLowerCase(),
              )
            )
              return "البريد مستخدم بالفعل.";
            return undefined;
          },
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
        {
          name: "birthDate",
          label: "تاريخ الميلاد",
          type: "date",
          required: true,
        },
      ],
    },
    {
      title: "الملف التدريبي",
      description: "يظهر في بطاقة المدرب وصفحات الدورات.",
      icon: <GraduationCap className="h-4 w-4" />,
      fields: [
        {
          name: "specialization",
          label: "التخصص",
          required: true,
          placeholder: "مثال: تطوير الواجهات الأمامية",
          colSpan: 2,
        },
        {
          name: "bio",
          label: "نبذة تعريفية",
          type: "textarea",
          required: true,
          fullWidth: true,
          placeholder: "خبرة المدرب وأسلوبه في التدريس…",
        },
      ],
    },
    {
      title: "حساب الدخول",
      description: "كلمة مرور مؤقتة يغيّرها المدرب بعد أول دخول.",
      icon: <KeyRound className="h-4 w-4" />,
      fields: [
        {
          name: "password",
          label: "كلمة المرور المؤقتة",
          type: "password",
          required: true,
          hint: "لا تقل عن 6 أحرف.",
          colSpan: 2,
          validate: (value) =>
            String(value || "").length < 6
              ? "كلمة المرور يجب ألا تقل عن 6 أحرف."
              : undefined,
        },
      ],
    },
  ];

  const submitCreate = async (values) => {
    try {
      await secretaryApi.teachers.create({
        fullName: String(values.fullName).trim(),
        email: String(values.email).trim().toLowerCase(),
        phone: String(values.phone || "").trim(),
        password: values.password,
        birthDate: values.birthDate,
        specialization: String(values.specialization).trim(),
        bio: String(values.bio).trim(),
        role: "teacher",
        // New teachers await admin approval (schema: isActive=false).
        isActive: false,
      });
      toast("info", "تم إنشاء طلب مدرب جديد بانتظار موافقة الإدارة.");
      setAddOpen(false);
      setFormKey((key) => key + 1);
      reload();
    } catch (error) {
      toast("error", error.message);
    }
  };

  const columns = [
    {
      key: "fullName",
      header: "المدرب",
      render: (_, teacher) => (
        <div className="flex items-center gap-3">
          <Avatar name={teacher.fullName} seed={teacher.id} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">
              {teacher.fullName}
            </p>
            <p className="ltr truncate text-xs text-muted">{teacher.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "specialization",
      header: "التخصص",
      render: (_, teacher) => (
        <span className="text-sm text-ink/80">{teacher.specialization}</span>
      ),
    },
    {
      key: "cohorts",
      header: "الدفعات",
      render: (_, teacher) => (
        <Badge tone="lavender">
          {cohortsByTeacher(cohorts, teacher.id).length} دفعة
        </Badge>
      ),
    },
    {
      key: "approval",
      header: "الاعتماد",
      render: (_, teacher) => approvalBadge(teacher),
    },
    {
      key: "isActive",
      header: "الحساب",
      render: (_, teacher) => accountStatusBadge(teacher.isActive),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="المدربون"
        description="إدارة المدربين وطلبات الاعتماد"
        action={
          <Button
            onClick={() => {
              setFormKey((key) => key + 1);
              setAddOpen(true);
            }}
          >
            <UserPlus className="h-4 w-4" />
            إضافة مدرب
          </Button>
        }
      />

      <Card padding="sm">
        <Filter
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="ابحث بالاسم أو التخصص..."
          filters={[
            {
              name: "approval",
              label: "الاعتماد",
              options: [
                { value: "approved", label: "معتمد" },
                { value: "pending", label: "قيد المراجعة" },
                { value: "rejected", label: "مرفوض" },
              ],
              placeholder: "كل حالات الاعتماد",
            },
          ]}
          values={{ approval: approvalFilter }}
          onFilterChange={(_, value) => setApprovalFilter(value)}
          onReset={() => {
            setSearch("");
            setApprovalFilter("all");
          }}
          searchInputProps={{ prefix: <Mail className="h-4 w-4" /> }}
        />
      </Card>

      <Card padding="none">
        {loading ? (
          <Spinner label="جارٍ تحميل المدربين…" />
        ) : (
          <Table
            columns={columns}
            data={filtered}
            rowKey="id"
            caption="قائمة المدربين"
            loadingState="جارٍ التحميل…"
            emptyMessage="لا يوجد مدربون مطابقون."
            previousLabel="السابق"
            nextLabel="التالي"
          />
        )}
      </Card>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="إضافة مدرب"
        description="سيتم إنشاء طلب مدرب جديد بانتظار موافقة الإدارة."
        size="lg"
      >
        <Form
          key={`create-${formKey}`}
          sections={sections}
          columns={2}
          submitLabel="إنشاء الطلب"
          cancelLabel="إلغاء"
          onCancel={() => setAddOpen(false)}
          onSubmit={submitCreate}
        />
      </Modal>
    </div>
  );
};

export default TeachersCrudPage;
