import { ArrowLeft, BookOpen, CalendarCheck2, ChartNoAxesCombined } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";

const features = [
  {
    icon: BookOpen,
    title: "تعلم منظم",
    description: "تابع المقررات والدفعات والمستويات التعليمية من مساحة واحدة.",
  },
  {
    icon: CalendarCheck2,
    title: "متابعة الحضور",
    description: "اطّلع على الجلسات وسجل الحضور لتعرف تقدمك أولاً بأول.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "إنجاز أوضح",
    description: "راجع درجاتك ونتائجك وتابع مسارك الدراسي بسهولة.",
  },
];

const HomePage = () => (
  <div className="min-h-screen overflow-hidden bg-canvas">
    <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
      <Link to="/" aria-label="الصفحة الرئيسية">
        <Logo />
      </Link>
      <nav className="flex items-center gap-2 sm:gap-3" aria-label="التنقل الرئيسي">
        <a
          href="https://ahmed333.mintlify.site/"
          target="_blank"
          rel="noreferrer"
          className="rounded-btn px-3 py-2 text-sm font-semibold text-ink transition hover:bg-border/60 sm:px-4"
        >
          التوثيق التقني
        </a>
        <Link
          to="/login"
          className="rounded-btn px-3 py-2 text-sm font-semibold text-ink transition hover:bg-border/60 sm:px-4"
        >
          تسجيل الدخول
        </Link>
        <Link
          to="/register"
          className="rounded-btn bg-brand-blue px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 sm:px-4"
        >
          إنشاء حساب
        </Link>
      </nav>
    </header>

    <main>
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-2 lg:gap-16">
        <div className="pointer-events-none absolute -end-36 -top-28 h-96 w-96 rounded-full bg-brand-blue/5 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-blue/15 bg-brand-blue/5 px-3 py-1.5 text-xs font-semibold text-brand-blue">
            <BookOpen className="h-3.5 w-3.5" />
            منصة تعليمية متكاملة
          </span>
          <h1 className="mt-6 max-w-xl font-kufi text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
            تعلّمك وإدارتك
            <span className="text-brand-blue"> في مكان واحد</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted sm:text-lg">
            EDUMS تجمع المقررات والدفعات والجلسات والنتائج في تجربة واضحة
            وسهلة، لتتمكن من التركيز على ما يهم: التعلّم والتقدم.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-btn bg-brand-blue px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
            >
              ابدأ رحلتك
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex h-12 items-center justify-center rounded-btn border border-border bg-white px-6 text-sm font-semibold text-ink transition hover:bg-canvas"
            >
              لدي حساب بالفعل
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted">
            الحسابات الجديدة متاحة للطلاب وتُفعّل بعد اعتماد المؤسسة.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-4 rounded-[2rem] bg-brand-blue/5 blur-2xl" />
          <div className="relative rounded-[1.5rem] border border-border bg-white p-5 shadow-pop sm:p-7">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
              <div>
                <p className="text-xs font-medium text-muted">مساحة التعلّم</p>
                <h2 className="mt-1 text-lg font-bold text-ink">خطتك الدراسية</h2>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                <BookOpen className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-border bg-canvas/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-ink">المقررات والدفعات</p>
                    <p className="mt-1 text-xs text-muted">كل تفاصيل دراستك في متناولك</p>
                  </div>
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-blue" />
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-border">
                  <div className="h-full w-2/3 rounded-full bg-brand-blue" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border p-4">
                  <CalendarCheck2 className="h-5 w-5 text-brand-amber" />
                  <p className="mt-3 text-xs text-muted">الجلسات القادمة</p>
                  <p className="mt-1 text-sm font-bold text-ink">ابقَ على اطلاع</p>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <ChartNoAxesCombined className="h-5 w-5 text-brand-lavender" />
                  <p className="mt-3 text-xs text-muted">النتائج والتقدم</p>
                  <p className="mt-1 text-sm font-bold text-ink">تابع إنجازك</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-brand-blue">كل ما تحتاجه للدراسة</p>
            <h2 className="mt-2 font-kufi text-2xl font-bold text-ink sm:text-3xl">
              تجربة تعليمية أكثر وضوحاً
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              أدوات بسيطة تساعدك على متابعة رحلتك التعليمية بثقة.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5">
            {features.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-card border border-border bg-canvas/40 p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-card sm:p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>

    <footer className="border-t border-border px-5 py-5 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-muted sm:flex-row">
        <Link to="/" aria-label="EDUMS - الصفحة الرئيسية">
          <Logo />
        </Link>
        <p>© {new Date().getFullYear()} EDUMS — منصة إدارة المؤسسة التعليمية</p>
      </div>
    </footer>
  </div>
);

export default HomePage;
