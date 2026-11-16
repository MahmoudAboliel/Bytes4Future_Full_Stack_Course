import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, AlertCircle } from "lucide-react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Logo from "../../components/common/Logo";
import { authApi } from "../../services/api";
import { useAuth } from "../../context/auth";
import { useToast } from "../../context/toast";

const LoginPage = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("يرجى إدخال البريد وكلمة المرور.");
      return;
    }

    setLoading(true);
    try {
      const session = await authApi.login(email.trim(), password);
      login(session);
      toast("success", `مرحباً بك ${session?.user?.fullName || ""}`.trim());
      navigate(`/${session?.user?.role || "student"}`, { replace: true });
    } catch (err) {
      setError(err?.message || "البريد أو كلمة المرور غير صحيحة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #1572FE 0, transparent 40%), radial-gradient(circle at 80% 70%, #C08CEE 0, transparent 40%)",
          }}
        />
        <svg
          className="absolute -bottom-20 -left-20 opacity-[0.04]"
          width="400"
          height="400"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="28" stroke="white" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="16" stroke="white" strokeWidth="0.5" />
        </svg>

        <div className="relative">
          <Logo variant="full" onLight />
        </div>

        <div className="relative max-w-md">
          <h1 className="font-kufi text-3xl font-bold leading-snug">
            منصة إدارة المؤسسة التعليمية
          </h1>
          <p className="mt-4 leading-relaxed text-white/70">
            نظام متكامل لإدارة العمليات التعليمية — من الدورات والدفعات إلى
            الحضور والدرجات. مصمّم ليمنح كل دور وضوحاً وفعالية.
          </p>
        </div>

        <p className="relative text-xs text-white/40">
          إديومس — نظام إدارة المؤسسة التعليمية
        </p>
      </div>

      {/* Form panel */}
      <div className="flex min-h-screen items-center justify-center bg-canvas p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink">
              تسجيل الدخول
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              أدخل بياناتك للوصول إلى مساحة العمل
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-field border border-error-500/25 bg-error-50 px-3.5 py-3 text-sm text-error-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4" noValidate>
            <Input
              label="البريد الإلكتروني"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="name@edums.edu"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              prefix={<Mail className="h-4 w-4" />}
              className="ltr"
              error={error || undefined}
            />
            <Input
              label="كلمة المرور"
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              prefix={<Lock className="h-4 w-4" />}
            />
            <Button
              type="submit"
              size="lg"
              loading={loading}
              fullWidth
              className="mt-2"
            >
              <ArrowLeft className="h-4 w-4" />
              دخول
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted">
            ليس لديك حساب؟{" "}
            <Link
              to="/register"
              className="font-semibold text-brand-blue transition hover:text-ink"
            >
              أنشئ حساباً جديداً
            </Link>
          </p>
          <Link
            to="/"
            className="mt-4 block text-center text-xs text-muted transition hover:text-ink"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
