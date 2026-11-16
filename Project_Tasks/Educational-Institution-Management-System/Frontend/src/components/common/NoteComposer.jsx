import { useMemo, useState } from "react";
import { NotebookPen, Eye } from "lucide-react";
import Form from "./Form";
import Modal from "./Modal";

/**
 * Shared "add note" composer used by the teacher and the secretary.
 * The only difference between them is the visibility vocabulary.
 */
const NoteComposer = ({
  open,
  onClose,
  onSubmit,
  students = [],
  visibilityOptions = [],
  defaultVisibility = "",
  submitLabel = "حفظ الملاحظة",
  title = "إضافة ملاحظة",
  description = "اختر الطالب وحدّد من يمكنه رؤية الملاحظة.",
}) => {
  const [formKey, setFormKey] = useState(0);

  const sections = useMemo(
    () => [
      {
        title: "الملاحظة",
        description: "اختر الطالب ثم اكتب نص الملاحظة.",
        icon: <NotebookPen className="h-4 w-4" />,
        fields: [
          {
            name: "studentId",
            label: "الطالب",
            options: [
              { value: "", label: "اختر الطالب" },
              ...students.map((student) => ({
                value: student.id,
                label: student.fullName,
              })),
            ],
            required: true,
          },
          {
            name: "note",
            label: "نص الملاحظة",
            type: "textarea",
            required: true,
            colSpan: 2,
            placeholder: "اكتب الملاحظة…",
            validate: (value) =>
              String(value || "").trim().length < 3
                ? "نص الملاحظة قصير جداً."
                : undefined,
          },
        ],
      },
      {
        title: "من يمكنه رؤيتها",
        description: "حدّد مستوى الظهور للملاحظة.",
        icon: <Eye className="h-4 w-4" />,
        fields: [
          {
            name: "visibility",
            label: "مستوى الظهور",
            options: visibilityOptions,
            required: true,
            colSpan: 2,
          },
        ],
      },
    ],
    [students, visibilityOptions],
  );

  const handleClose = () => {
    setFormKey((key) => key + 1);
    onClose?.();
  };

  return (
    <Modal open={open} onClose={handleClose} title={title} description={description} size="md">
      {open && (
        <Form
          key={`note-${formKey}`}
          sections={sections}
          initialValues={{ visibility: defaultVisibility }}
          columns={2}
          submitLabel={submitLabel}
          cancelLabel="إلغاء"
          onCancel={handleClose}
          onSubmit={async (values) => {
            await onSubmit?.(values);
            setFormKey((key) => key + 1);
          }}
        />
      )}
    </Modal>
  );
};

export default NoteComposer;
