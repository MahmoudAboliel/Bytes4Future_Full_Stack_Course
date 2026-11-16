import { useMemo, useState } from "react";
import { UserPlus, Mail, Pencil, Power, PowerOff, UserRound, KeyRound } from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Form from "../../components/common/Form";
import Modal from "../../components/common/Modal";
import Table from "../../components/common/Table";
import Filter from "../../components/common/Filter";
import Avatar from "../../components/common/Avatar";
import Spinner from "../../components/common/Spinner";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { accountStatusBadge } from "../../components/common/badges";
import useFetch from "../../hooks/useFetch";
import { useToast } from "../../context/toast";
import { adminApi } from "../../services/adminApi";
import { formatDate, usersByRole } from "../../utils";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UsersControlPage = () => {
  const { toast } = useToast();
  const usersResult = useFetch(() => adminApi.users.list(), []);
  const { data: allUsers, loading, reload } = usersResult;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [editTarget, setEditTarget] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const secretaries = useMemo(
    () => usersByRole(allUsers, "secretary"),
    [allUsers],
  );

  const filtered = useMemo(
    () =>
      secretaries.filter((secretary) => {
        if (statusFilter !== "all") {
          const expected = statusFilter === "active";
          if (Boolean(secretary.isActive) !== expected) return false;
        }
        if (search) {
          const query = search.toLowerCase();
          return (
            String(secretary.fullName).toLowerCase().includes(query) ||
            String(secretary.email).toLowerCase().includes(query)
          );
        }
        return true;
      }),
    [secretaries, search, statusFilter],
  );

  const createSections = [
    {
      title: "بيانات الحساب",
      description: "الاسم والبريد الإلكتروني ورقم التواصل.",
      icon: <UserRound className="h-4 w-4" />,
      fields: [
        {
          name: "fullName",
          label: "الاسم الكامل",
          required: true,
          placeholder: "مثال: سارة المطيري",
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
              return "صيغة البريد غير صحيحة.";
            if (
              allUsers.some(
                (record) =>
                  record.id !== editTarget?.id &&
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
      title: "كلمة المرور المؤقتة",
      description: "يغيّرها المستخدم بعد أول دخول.",
      icon: <KeyRound className="h-4 w-4" />,
      fields: [
        {
          name: "password",
          label: "كلمة المرور المؤقتة",
          type: "password",
          required: true,
          hint: "يُغيَّر الحساب كلمة المرور لاحقاً من الملف الشخصي.",
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
      await adminApi.users.create({
        fullName: String(values.fullName).trim(),
        email: String(values.email).trim().toLowerCase(),
        phone: String(values.phone || "").trim(),
        password: values.password,
        birthDate: values.birthDate,
        role: "secretary",
        isActive: true,
      });
      toast("success", "تمت إضافة الحساب الإداري بنجاح.");
      setAddOpen(false);
      setFormKey((key) => key + 1);
      reload();
    } catch (error) {
      toast("error", error.message);
    }
  };

  const submitEdit = async (values) => {
    try {
      await adminApi.users.update(editTarget.id, {
        fullName: String(values.fullName).trim(),
        email: String(values.email).trim().toLowerCase(),
        phone: String(values.phone || "").trim(),
        birthDate: values.birthDate,
      });
      toast("success", "تم تحديث الحساب.");
      setEditTarget(null);
      reload();
    } catch (error) {
      toast("error", error.message);
    }
  };

  const toggleStatus = async () => {
    if (!confirmTarget) return;
    try {
      await adminApi.users.setActive(confirmTarget.id, confirmTarget.nextStatus);
      toast(
        confirmTarget.nextStatus ? "success" : "warning",
        confirmTarget.nextStatus
          ? "تمت إعادة تفعيل الحساب."
          : "تم تعطيل الحساب مع الحفاظ على السجلات.",
      );
      reload();
    } catch (error) {
      toast("error", error.message);
    }
  };

  const columns = [
    {
      key: "fullName",
      header: "الاسم",
      render: (_, secretary) => (
        <div className="flex items-center gap-3">
          <Avatar name={secretary.fullName} seed={secretary.id} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">
              {secretary.fullName}
            </p>
            <p className="ltr truncate text-xs text-muted">
              {secretary.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "الجوال",
      render: (_, secretary) => (
        <span className="ltr text-muted">{secretary.phone || "—"}</span>
      ),
    },
    {
      key: "createdAt",
      header: "تاريخ الإنشاء",
      render: (_, secretary) => (
        <span className="text-xs text-muted">
          {formatDate(secretary.createdAt)}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "الحالة",
      render: (_, secretary) => accountStatusBadge(secretary.isActive),
    },
    {
      key: "actions",
      header: "",
      className: "text-left",
      render: (_, secretary) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditTarget(secretary)}
          >
            <Pencil className="h-3.5 w-3.5" />
            تعديل
          </Button>
          {secretary.isActive ? (
            <Button
              size="sm"
              variant="ghost"
              className="text-error-600 hover:bg-error-50"
              onClick={() =>
                setConfirmTarget({ ...secretary, nextStatus: false })
              }
            >
              <PowerOff className="h-3.5 w-3.5" />
              تعطيل
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="text-success-600 hover:bg-success-50"
              onClick={() =>
                setConfirmTarget({ ...secretary, nextStatus: true })
              }
            >
              <Power className="h-3.5 w-3.5" />
              تفعيل
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="الحسابات الإدارية"
        description="إدارة حسابات السكرتيرة ومسؤولي العمليات"
        action={
          <Button
            onClick={() => {
              setFormKey((key) => key + 1);
              setAddOpen(true);
            }}
          >
            <UserPlus className="h-4 w-4" />
            إضافة حساب
          </Button>
        }
      />

      <Card padding="sm">
        <Filter
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="ابحث بالاسم أو البريد..."
          filters={[
            {
              name: "status",
              label: "الحالة",
              options: [
                { value: "active", label: "نشط" },
                { value: "disabled", label: "معطّل" },
              ],
              placeholder: "كل الحالات",
            },
          ]}
          values={{ status: statusFilter }}
          onFilterChange={(_, value) => setStatusFilter(value)}
          onReset={() => {
            setSearch("");
            setStatusFilter("all");
          }}
          searchInputProps={{
            prefix: <Mail className="h-4 w-4" />,
          }}
        />
      </Card>

      <Card padding="none">
        {loading ? (
          <Spinner label="جارٍ تحميل الحسابات…" />
        ) : (
          <Table
            columns={columns}
            data={filtered}
            rowKey="id"
            caption="الحسابات الإدارية"
            loadingState="جارٍ التحميل…"
            emptyMessage="لا توجد حسابات مطابقة. أضف حساباً إدارياً جديداً للبدء."
            previousLabel="السابق"
            nextLabel="التالي"
          />
        )}
      </Card>

      {/* Add */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="إضافة حساب إداري"
        description="سيتمكن هذا الحساب من إدارة الطلاب والدورات والدفعات."
      >
        <Form
          key={`create-${formKey}`}
          sections={createSections}
          columns={2}
          submitLabel="حفظ الحساب"
          cancelLabel="إلغاء"
          onCancel={() => setAddOpen(false)}
          onSubmit={submitCreate}
        />
      </Modal>

      {/* Edit */}
      <Modal
        open={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        title="تعديل الحساب"
        description="حدّث بيانات الحساب الأساسية."
        size="md"
      >
        {editTarget && (
          <Form
            key={`edit-${editTarget.id}`}
            initialValues={{
              fullName: editTarget.fullName,
              email: editTarget.email,
              phone: editTarget.phone || "",
              birthDate: editTarget.birthDate
                ? String(editTarget.birthDate).slice(0, 10)
                : "",
            }}
            sections={[createSections[0]]}
            columns={2}
            submitLabel="حفظ التعديلات"
            cancelLabel="إلغاء"
            onCancel={() => setEditTarget(null)}
            onSubmit={submitEdit}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        onConfirm={toggleStatus}
        title={
          confirmTarget?.nextStatus
            ? "إعادة تفعيل الحساب"
            : "تعطيل الحساب"
        }
        description={
          confirmTarget?.nextStatus
            ? "سيتمكن الحساب من تسجيل الدخول والوصول إلى لوحة التحكم مرة أخرى."
            : "سيتم منع تسجيل الدخول بهذا الحساب مع الحفاظ على كافة السجلات المرتبطة به. يمكن إعادة التفعيل لاحقاً."
        }
        confirmLabel={
          confirmTarget?.nextStatus ? "تأكيد التفعيل" : "تأكيد التعطيل"
        }
        tone={confirmTarget?.nextStatus ? "primary" : "danger"}
      />
    </div>
  );
};

export default UsersControlPage;
