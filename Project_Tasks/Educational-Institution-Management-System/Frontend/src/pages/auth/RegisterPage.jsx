import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, CheckCircle2, Lock, Mail, Phone, UserRound } from "lucide-react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Logo from "../../components/common/Logo";
import { authApi } from "../../services/api";
import { useAuth } from "../../context/auth";

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const maximumBirthDate = today.toISOString().slice(0, 10);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    study: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (error) setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!event.currentTarget.reportValidity()) return;

    if (form.password !== form.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }

    setLoading(true);
    try {
      const session = await authApi.register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        birthDate: form.birthDate,
        study: form.study.trim(),
        password: form.password,
        role: "student",
      });

      if (session?.user?.isActive) {
        login(session);
        navigate("/student", { replace: true });
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError(err?.message || "تعذّر إنشاء الحساب. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-canvas px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link to="/" aria-label="الصفحة الرئيسية">
            <Logo />
          </Link>
          <Link
            to="/login"
            className="text-sm font-semibold text-brand-blue transition hover:text-ink"
          >
            تسجيل الدخول
          </Link>
        </div>

        <section className="rounded-card border border-border bg-white p-5 shadow-card sm:p-8">
          {submitted ? (
            <div className="py-8 text-center" role="status">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-50 text-success-600">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <h1 className="mt-5 text-2xl font-extrabold text-ink">
                تم إنشاء حسابك بنجاح
              </h1>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-muted">
                حسابك بانتظار اعتماد المؤسسة التعليمية. ستتمكن من تسجيل الدخول
                بعد تفعيل الحساب.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-btn bg-brand-blue px-5 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                العودة إلى تسجيل الدخول
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <p className="text-sm font-semibold text-brand-blue">انضم إلى EDUMS</p>
                <h1 className="mt-2 text-2xl font-extrabold text-ink">
                  إنشاء حساب طالب
                </h1>
                <p className="mt-2 text-sm leading-6 text-muted">
                  أدخل بياناتك لإنشاء حسابك ومتابعة مسارك الدراسي.
                </p>
              </div>

              <form onSubmit={submit} className="space-y-4" noValidate>
                <Input
                  label="الاسم الكامل"
                  name="fullName"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={100}
                  value={form.fullName}
                  onChange={updateField}
                  prefix={<UserRound className="h-4 w-4" />}
                />
                <Input
                  label="البريد الإلكتروني"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={updateField}
                  prefix={<Mail className="h-4 w-4" />}
                  className="ltr"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="رقم الجوال"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    required
                    minLength={6}
                    maxLength={20}
                    value={form.phone}
                    onChange={updateField}
                    prefix={<Phone className="h-4 w-4" />}
                    className="ltr"
                  />
                  <Input
                    label="تاريخ الميلاد"
                    type="date"
                    name="birthDate"
                    autoComplete="bday"
                    required
                    max={maximumBirthDate}
                    value={form.birthDate}
                    onChange={updateField}
                    prefix={<CalendarDays className="h-4 w-4" />}
                    className="ltr"
                  />
                </div>
                <Input
                  label="المسار الدراسي"
                  name="study"
                  required
                  value={form.study}
                  onChange={updateField}
                  placeholder="مثال: إدارة الأعمال"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="كلمة المرور"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    maxLength={64}
                    value={form.password}
                    onChange={updateField}
                    prefix={<Lock className="h-4 w-4" />}
                    hint="ستة أحرف على الأقل"
                  />
                  <Input
                    label="تأكيد كلمة المرور"
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    maxLength={64}
                    value={form.confirmPassword}
                    onChange={updateField}
                    prefix={<Lock className="h-4 w-4" />}
                  />
                </div>
                {error && (
                  <p className="ui-field-error" role="alert">
                    {error}
                  </p>
                )}
                <Button type="submit" size="lg" loading={loading} fullWidth>
                  إنشاء الحساب
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </form>

              <p className="mt-5 text-center text-xs leading-6 text-muted">
                بإنشاء حساب، ستُرسل بياناتك إلى المؤسسة لاعتماد الحساب قبل
                تفعيله.
              </p>
            </>
          )}
        </section>

        <p className="mt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} EDUMS
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;
