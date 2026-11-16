import { useMemo, useState } from "react";
import { Plus, NotebookPen } from "lucide-react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import NoteComposer from "../../components/common/NoteComposer";
import Filter from "../../components/common/Filter";
import Avatar from "../../components/common/Avatar";
import EmptyState from "../../components/common/EmptyState";
import Badge from "../../components/common/Badge";
import Spinner from "../../components/common/Spinner";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/auth";
import { useToast } from "../../context/toast";
import { secretaryApi } from "../../services/secretaryApi";
import {
  canSeeNote,
  formatDate,
  usersByRole,
  visibilityLabel,
} from "../../utils";

const VISIBILITY_OPTIONS = [
  { value: "admin", label: "للإدارة" },
  { value: "teacherOnly", label: "خاص بالمدرب" },
  { value: "student", label: "مرئي للطالب" },
];

const visibilityTone = (visibility) =>
  visibility === "admin"
    ? "ink"
    : visibility === "teacherOnly"
      ? "lavender"
      : "blue";

const SecretaryNotesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const notesResult = useFetch(() => secretaryApi.notes.list(), []);
  const usersResult = useFetch(() => secretaryApi.users.list(), []);

  const { data: notes, loading, reload } = notesResult;
  const allUsers = usersResult.data;

  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const students = useMemo(
    () => usersByRole(allUsers, "student"),
    [allUsers],
  );

  const visibleNotes = useMemo(
    () =>
      notes
        .filter((note) => canSeeNote(note, "secretary", user?.id))
        .filter((note) => {
          if (!search) return true;
          const query = search.toLowerCase();
          const student = allUsers.find((record) => record.id === note.studentId);
          return (
            String(note.note).toLowerCase().includes(query) ||
            String(student?.fullName || "").toLowerCase().includes(query)
          );
        })
        .sort((a, b) =>
          String(b.createdAt || "").localeCompare(String(a.createdAt || "")),
        ),
    [notes, search, allUsers, user],
  );

  const submitCreate = async (values) => {
    try {
      await secretaryApi.notes.create({
        studentId: values.studentId,
        // The schema references the note author through `teacherId` (ref: User).
        teacherId: user.id,
        visibility: values.visibility || "admin",
        note: String(values.note).trim(),
      });
      toast("success", "تم حفظ الملاحظة بنجاح.");
      setAddOpen(false);
      reload();
    } catch (error) {
      toast("error", error.message);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="الملاحظات الإدارية"
        description="ملاحظات الطلاب المرئية للإدارة"
        action={
          <Button
            onClick={() => {
              setAddOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            إضافة ملاحظة
          </Button>
        }
      />

      <Card padding="sm">
        <Filter
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="ابحث في نص الملاحظة أو اسم الطالب..."
          filters={[]}
          values={{}}
          onFilterChange={() => {}}
          onReset={() => setSearch("")}
          searchInputProps={{ prefix: <NotebookPen className="h-4 w-4" /> }}
        />
      </Card>

      {loading ? (
        <Spinner label="جارٍ تحميل الملاحظات…" />
      ) : visibleNotes.length === 0 ? (
        <EmptyState
          icon={<NotebookPen className="h-7 w-7" />}
          title="لا توجد ملاحظات"
          description="أضف أول ملاحظة إدارية على أحد الطلاب."
        />
      ) : (
        <div className="space-y-3">
          {visibleNotes.map((note) => {
            const student = allUsers.find(
              (record) => record.id === note.studentId,
            );
            const author = allUsers.find(
              (record) => record.id === note.teacherId,
            );
            return (
              <Card key={note.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <Avatar
                      name={student?.fullName || "؟"}
                      seed={note.studentId}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-ink">
                          {student?.fullName || "—"}
                        </span>
                        <Badge tone={visibilityTone(note.visibility)}>
                          {visibilityLabel[note.visibility] || note.visibility}
                        </Badge>
                      </div>
                      <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
                        {note.note}
                      </p>
                      <p className="mt-2 text-xs text-muted">
                        {formatDate(note.createdAt)}
                        {author ? ` · بواسطة ${author.fullName}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <NoteComposer
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={submitCreate}
        students={students}
        visibilityOptions={VISIBILITY_OPTIONS}
        defaultVisibility="admin"
      />
    </div>
  );
};

export default SecretaryNotesPage;
