import { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  CheckCircle,
  XCircle,
  CalendarDays,
  ClipboardCheck,
} from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Form from "../../components/common/Form";
import Modal from "../../components/common/Modal";
import Table from "../../components/common/Table";
import Filter from "../../components/common/Filter";
import EmptyState from "../../components/common/EmptyState";
import { sessionStatusBadge } from "../../components/common/badges";
import Badge from "../../components/common/Badge";
import Spinner from "../../components/common/Spinner";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/auth";
import { useToast } from "../../context/toast";
import { teacherApi } from "../../services/teacherApi";
import {
  alive,
  byId,
  cohortsByTeacher,
  courseForCohort,
  formatDate,
  sessionTitle,
} from "../../utils";

const STATUS_OPTIONS = [
  { value: "scheduled", label: "مجدول" },
  { value: "done", label: "منتهية" },
  { value: "cancelled", label: "ملغاة" },
];

const TeacherSessionsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const sessionsResult = useFetch(() => teacherApi.sessions.list(), []);
  const cohortsResult = useFetch(() => teacherApi.cohorts.list(), []);
  const catalogResult = useFetch(() => teacherApi.catalog.get(), []);

  const { data: sessions, loading, reload } = sessionsResult;
  const cohorts = cohortsResult.data.filter(alive);
  const levels = (catalogResult.single?.levels ?? []).filter(alive);
  const courses = (catalogResult.single?.courses ?? []).filter(alive);

  const [cohortFilter, setCohortFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState(null); // { mode: 'add' } | { mode: 'edit', session }
  const [formKey, setFormKey] = useState(0);
  const [confirmTarget, setConfirmTarget] = useState(null); // { session, nextStatus }

  const myCohorts = useMemo(
    () => cohortsByTeacher(cohorts, user?.id),
    [cohorts, user],
  );

  const mySessions = useMemo(
    () =>
      sessions
        .filter((session) =>
          myCohorts.some((cohort) => cohort.id === session.cohortId),
        )
        .filter((session) => {
          if (cohortFilter !== "all" && session.cohortId !== cohortFilter)
            return false;
          if (statusFilter !== "all" && session.status !== statusFilter)
            return false;
          return true;
        })
        .sort((a, b) =>
          String(b.sessionDate || "").localeCompare(String(a.sessionDate || "")),
        ),
    [sessions, myCohorts, cohortFilter, statusFilter],
  );

  const cohortOptions = useMemo(() => {
    const options = [{ value: "", label: "اختر الدفعة" }];
    myCohorts.forEach((cohort) => {
      const course = courseForCohort(courses, levels, cohort);
      options.push({
        value: cohort.id,
        label: `${cohort.code}${course ? ` — ${course.name}` : ""}`,
      });
    });
    return options;
  }, [myCohorts, courses, levels]);

  const nextSessionNumber = (cohortId) => {
    const numbers = sessions
      .filter((session) => session.cohortId === cohortId)
      .map((session) => Number(session.sessionNumber) || 0);
    return numbers.length ? Math.max(...numbers) + 1 : 1;
  };

  const buildSections = () => [
    {
      title: "تفاصيل الجلسة",
      description: "رقم الجلسة وموضوعها وحالتها.",
      icon: <CalendarDays className="h-4 w-4" />,
      fields: [
        {
          name: "cohortId",
          label: "الدفعة",
          options: cohortOptions,
          required: true,
        },
        {
          name: "sessionNumber",
          label: "رقم الجلسة",
          type: "number",
          required: true,
          validate: (value) =>
            Number(value) > 0 ? undefined : "رقم الجلسة يجب أن يكون موجباً.",
        },
        {
          name: "topic",
          label: "موضوع الجلسة",
          required: true,
          placeholder: "مثال: مقدمة في المكوّنات",
          colSpan: 2,
        },
      ],
    },
    {
      title: "التوقيت والحالة",
      description: "تاريخ الجلسة وحالتها في الجدول.",
      icon: <ClipboardCheck className="h-4 w-4" />,
      fields: [
        {
          name: "sessionDate",
          label: "تاريخ الجلسة",
          type: "date",
          required: true,
        },
        {
          name: "status",
          label: "الحالة",
          options: STATUS_OPTIONS,
          required: true,
        },
      ],
    },
  ];

  const submit = async (values) => {
    try {
      const payload = {
        cohortId: values.cohortId,
        sessionNumber: Number(values.sessionNumber),
        sessionDate: values.sessionDate,
        topic: String(values.topic).trim(),
        status: values.status,
      };
      if (modal?.mode === "edit") {
        await teacherApi.sessions.update(modal.session.id, payload);
        toast("success", "تم تحديث الجلسة.");
      } else {
        await teacherApi.sessions.create(payload);
        toast("success", "تمت إضافة الجلسة.");
      }
      setModal(null);
      setFormKey((key) => key + 1);
      reload();
    } catch (error) {
      toast("error", error.message);
    }
  };

  const changeStatus = async () => {
    if (!confirmTarget) return;
    try {
      await teacherApi.sessions.update(confirmTarget.session.id, {
        status: confirmTarget.nextStatus,
      });
      toast(
        confirmTarget.nextStatus === "done" ? "success" : "warning",
        confirmTarget.nextStatus === "done"
          ? "تم إنهاء الجلسة."
          : "تم إلغاء الجلسة.",
      );
      reload();
    } catch (error) {
      toast("error", error.message);
    }
  };

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
        const cohort = byId(myCohorts, session.cohortId);
        const course = cohort
          ? courseForCohort(courses, levels, cohort)
          : undefined;
        return (
          <div>
            <p className="ltr text-sm text-ink">{cohort?.code || "—"}</p>
            <p className="text-xs text-muted">{course?.name || "—"}</p>
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
    {
      key: "actions",
      header: "",
      className: "text-left",
      render: (_, session) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(event) => {
              event.stopPropagation();
              setFormKey((key) => key + 1);
              setModal({ mode: "edit", session });
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
            تعديل
          </Button>
          {session.status !== "done" && (
            <Button
              size="sm"
              variant="ghost"
              className="text-success-600 hover:bg-success-50"
              onClick={(event) => {
                event.stopPropagation();
                setConfirmTarget({ session, nextStatus: "done" });
              }}
            >
              <CheckCircle className="h-3.5 w-3.5" />
              إنهاء
            </Button>
          )}
          {session.status !== "cancelled" && (
            <Button
              size="sm"
              variant="ghost"
              className="text-error-600 hover:bg-error-50"
              onClick={(event) => {
                event.stopPropagation();
                setConfirmTarget({ session, nextStatus: "cancelled" });
              }}
            >
              <XCircle className="h-3.5 w-3.5" />
              إلغاء
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="جلساتي"
        description="إدارة جلسات دفعاتك — الإضافة والتعديل والإنهاء"
        action={
          myCohorts.length > 0 ? (
            <Button
              onClick={() => {
                setFormKey((key) => key + 1);
                setModal({ mode: "add" });
              }}
            >
              <Plus className="h-4 w-4" />
              إضافة جلسة
            </Button>
          ) : null
        }
      />

      {myCohorts.length === 0 ? (
        <EmptyState
          title="لا توجد دفعات مرتبطة بك"
          description="عند تعيينك على دفعة ستظهر جلساتها هنا."
        />
      ) : (
        <>
          <Card padding="sm">
            <Filter
              search=""
              onSearchChange={() => {}}
              searchPlaceholder=""
              filters={[
                {
                  name: "cohort",
                  label: "الدفعة",
                  options: cohortOptions.filter((option) => option.value !== ""),
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
                setCohortFilter("all");
                setStatusFilter("all");
              }}
            />
          </Card>

          <Card padding="none">
            {loading ? (
              <Spinner label="جارٍ تحميل الجلسات…" />
            ) : (
              <Table
                columns={columns}
                data={mySessions}
                rowKey="id"
                caption="قائمة جلساتي"
                loadingState="جارٍ التحميل…"
                emptyMessage="لا توجد جلسات مطابقة."
                previousLabel="السابق"
                nextLabel="التالي"
              />
            )}
          </Card>
        </>
      )}

      <Modal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal?.mode === "edit" ? "تعديل الجلسة" : "إضافة جلسة"}
        size="lg"
      >
        {modal && (
          <Form
            key={`session-${formKey}-${modal.session?.id || "new"}`}
            initialValues={
              modal.mode === "edit"
                ? {
                    cohortId: modal.session.cohortId,
                    sessionNumber: modal.session.sessionNumber,
                    sessionDate: String(
                      modal.session.sessionDate || "",
                    ).slice(0, 10),
                    topic: modal.session.topic || "",
                    status: modal.session.status,
                  }
                : {
                    cohortId: cohortFilter !== "all" ? cohortFilter : "",
                    sessionNumber: nextSessionNumber(
                      cohortFilter !== "all" ? cohortFilter : "",
                    ),
                    status: "scheduled",
                  }
            }
            sections={buildSections()}
            columns={2}
            submitLabel={modal.mode === "edit" ? "حفظ" : "إضافة الجلسة"}
            cancelLabel="إلغاء"
            onCancel={() => setModal(null)}
            onSubmit={submit}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        onConfirm={changeStatus}
        title={
          confirmTarget?.nextStatus === "done"
            ? "إنهاء الجلسة"
            : "إلغاء الجلسة"
        }
        description={
          confirmTarget?.nextStatus === "done"
            ? "سيُسجَّل قيد إنهاء الجلسة ويمكنك بعدها تسجيل الحضور والدرجات."
            : "ستظهر الجلسة كملغاة ولن تُحتسب ضمن الجلسات المجدولة."
        }
        confirmLabel="تأكيد"
        tone={confirmTarget?.nextStatus === "done" ? "primary" : "danger"}
      />
    </div>
  );
};

export default TeacherSessionsPage;
