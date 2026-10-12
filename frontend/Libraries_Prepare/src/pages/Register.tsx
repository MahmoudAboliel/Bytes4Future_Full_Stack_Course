import { DynamicForm } from "@/components/dynamic-form/DynamicForm";
import type { FormSection } from "@/components/dynamic-form/types";

const Register = () => {
  const sections: FormSection[] = [
    {
      title: "المعلومات الشخصية",
      description: "يرجى إدخال بياناتك الأساسية",
      fields: [
        {
          name: "fullName",
          label: "الاسم الكامل",
          type: "text",
          placeholder: "أدخل اسمك الكامل",
          required: true,
          minLength: 3,
        },
        {
          name: "email",
          label: "البريد الإلكتروني",
          type: "email",
          placeholder: "example@email.com",
          required: true,
        },
        {
          name: "phone",
          label: "رقم الجوال",
          type: "tel",
          placeholder: "+963 9xxxxxxxx",
          required: true,
        },
        {
          name: "birthDate",
          label: "تاريخ الميلاد",
          type: "date",
          required: true,
        },
        {
          name: "age",
          label: "العمر",
          type: "number",
          min: 18,
          max: 100,
          required: true,
        },
        {
          name: "bio",
          label: "نبذة عنك",
          type: "textarea",
          rows: 4,
          maxLength: 500,
          colSpan: 2,
        },
      ],
    },
    {
      title: "التفضيلات",
      fields: [
        {
          name: "country",
          label: "الدولة",
          type: "select",
          searchable: true, // ← تفعيل البحث
          searchPlaceholder: "ابحث عن دولة...", // ← تخصيص نص البحث
          emptyMessage: "لم يتم العثور على دولة.", // ← تخصيص رسالة الفراغ
          placeholder: "اختر الدولة",
          required: true,
          options: [
            { label: "سوريا", value: "sy" },
            { label: "السعودية", value: "sa" },
            { label: "الإمارات", value: "ae" },
            { label: "مصر", value: "eg" },
            { label: "الأردن", value: "jo" },
            { label: "لبنان", value: "lb" },
            { label: "العراق", value: "iq" },
            // ... مئات الخيارات
          ],
        },
        {
          name: "skills",
          label: "المهارات",
          type: "multiselect",
          searchable: true, // ← يعمل أيضًا مع المتعدد
          searchPlaceholder: "ابحث عن مهارة...",
          options: [
            { label: "React", value: "react" },
            { label: "TypeScript", value: "typescript" },
            { label: "Node.js", value: "nodejs" },
            // ...
          ],
        },
        {
          name: "gender",
          label: "الجنس",
          type: "radio",
          required: true,
          orientation: "horizontal",
          options: [
            { label: "ذكر", value: "male" },
            { label: "أنثى", value: "female" },
          ],
        },
        {
          name: "interests",
          label: "الاهتمامات",
          type: "checkbox",
          options: [
            { label: "الرياضة", value: "sports" },
            { label: "القراءة", value: "reading" },
            { label: "السفر", value: "travel" },
          ],
        },
        {
          name: "experience",
          label: "سنوات الخبرة",
          type: "slider",
          min: 0,
          max: 20,
          step: 1,
        },
        {
          name: "newsletter",
          label: "الاشتراك في النشرة البريدية",
          type: "switch",
          description: "سيتم إرسال آخر الأخبار إلى بريدك",
        },
        {
          name: "resume",
          label: "السيرة الذاتية",
          type: "file",
          accept: ".pdf,.doc,.docx",
          maxSize: 5 * 1024 * 1024,
          required: false,
        },
        {
          name: "terms",
          label: "أوافق على الشروط والأحكام",
          type: "checkbox",
          required: true,
        },
      ],
    },
  ];

  const handleSubmit = async (
    data: Record<string, any>,
  ) => {
    // console.log("Form Data:", typeof data);
    const formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }
    console.log(formData);
    await new Promise((r) => setTimeout(r, 1500)); // محاكاة API
  };

  return (
    <div>
      {/* <h1>Register</h1> */}
      <div className="p-4 shadow-lg border rounded-md my-3">
        <DynamicForm
          sections={sections}
          onSubmit={handleSubmit}
          submitLabel="حفظ البيانات"
          cancelLabel="إلغاء"
          onCancel={() => console.log("cancelled")}
          columns={3}
          onError={(errors) => console.log("Errors:", errors)}
        />
      </div>
    </div>
  );
};

export default Register;
