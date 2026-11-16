# Portfolio — محمود أبو الليل

موقع شخصي (Portfolio) مبني بـ **React + Vite + Tailwind CSS** مع **SSR** حقيقي (HTML كامل يصل لمحركات البحث)، ووضعين ليلي/نهاري، ولغتين عربية وإنكليزية بمسارات مستقلة، وسيرة ذاتية PDF تُولَّد من نفس بيانات الموقع.

- الإنكليزية: `/`
- العربية: `/ar`
- السيرة: `/cv` و `/ar/cv`

---

## التشغيل السريع

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # بناء الإنتاج (SSR)
npm run start      # تشغيل نسخة الإنتاج على المنفذ 3000
npm run typecheck  # فحص الأنواع
```

> على Windows استخدم `npm.cmd` إن كانت سياسة التنفيذ تمنع `npm.ps1`.

---

## أين أعدّل المحتوى؟

كل المحتوى في مكان واحد: **`app/data/`**. لا تحتاج لمس أي مكوّن أو مسار.

| الملف | ماذا يحتوي |
| --- | --- |
| `app/data/site.ts` | النطاق، روابط التواصل، الهاتف/الإيميل، مسارات ملفات السيرة، رمز تحقق Google |
| `app/data/profile.ts` | الاسم، المسمّى، النبذة، الإحصائيات، اللغات، الخدمات |
| `app/data/projects.ts` | كل المشاريع + صفحات دراسة الحالة |
| `app/data/resume.ts` | المهارات، الخبرات، التعليم، الشهادات |
| `app/i18n/ui.ts` | نصوص الواجهة (أزرار، عناوين الأقسام، تذييل الصفحة) |

### إضافة مشروع جديد

أضف كائناً إلى مصفوفة `projects` في `app/data/projects.ts`:

```ts
{
  slug: "my-project",              // يصبح /work/my-project و /ar/work/my-project
  year: "2026",
  art: "panels",                   // seats | map | cloud | school | panels
  stack: ["React", "Node.js"],
  links: [{ kind: "live", href: "https://example.com" }],
  title:    { en: "My Project", ar: "مشروعي" },
  category: { en: "Web app", ar: "تطبيق ويب" },
  tagline:  { en: "One line.", ar: "سطر واحد." },
  summary:  { en: "…", ar: "…" },
  role:     { en: "…", ar: "…" },
  timeline: { en: "2026", ar: "2026" },
  metrics:  [{ value: "3", label: { en: "Roles", ar: "أدوار" } }],
  challenge:    { en: "…", ar: "…" },
  features:     { en: ["…"], ar: ["…"] },
  architecture: { en: ["…"], ar: ["…"] },
  outcomes:     { en: ["…"], ar: ["…"] },
  keywords:     { en: ["…"], ar: ["…"] },
}
```

بمجرد الحفظ: تظهر بطاقة في الصفحة الرئيسية، وتُولَّد صفحة دراسة حالة باللغتين، ويُضاف الرابط إلى `sitemap.xml` تلقائياً. المشاريع كلها متساوية في العرض — الترتيب هو ترتيب المصفوفة.

### إضافة خبرة أو شهادة

نفس الفكرة: أضف عنصراً إلى `experience` أو `certifications` في `app/data/resume.ts`، وسيظهر في الصفحة الرئيسية وفي السيرة `/cv` وفي ملف PDF.

### نصوص الواجهة

`app/i18n/ui.ts` يحتوي قاموسين متطابقين `en` و `ar`. أي مفتاح جديد يجب إضافته للاثنين (TypeScript سينبّهك).

---

## توليد السيرة الذاتية والصور

```bash
npm run build      # مطلوب مرة واحدة على الأقل
npm run assets     # يولّد كل الملفات أدناه
```

| الأمر | المخرجات |
| --- | --- |
| `npm run assets -- --only=cv` | `public/files/Mahmoud-Abulail-CV-EN.pdf` و `-AR.pdf` (A4) |
| `npm run assets -- --only=og` | `public/og.png` (1200×630) |
| `npm run assets -- --only=icon` | `public/icon-512.png` و `public/apple-touch-icon.png` |
| `npm run assets -- --only=photo` | `public/images/portrait*` و `avatar*` (‏WebP + JPEG) |

- السيرة تُطبع من صفحتي `/cv` و `/ar/cv` نفسيهما، فلا يمكن أن تختلف عن الموقع.
- السكربت يشغّل خادم الإنتاج مؤقتاً على المنفذ `4317`، أو استخدم خادماً جاهزاً: `npm run assets -- --url=http://localhost:3000`.
- يحتاج **Chrome** أو **Edge** مثبتاً (أو متغير البيئة `CHROME_PATH`).
- بعد أي تعديل على المحتوى: `npm run build && npm run assets`. السكربت ينسخ الملفات المولّدة إلى `build/client` أيضاً، فيعرضها `npm run start` فوراً دون إعادة بناء.

### الصورة الشخصية

1. ضع الصورة الأصلية باسم `assets/portrait-source.png`.
2. شغّل `npm run assets -- --only=photo` — يستخرج WebP + JPEG بمقاسين لكل نسخة عبر Chrome نفسه (بدون اعتماديات إضافية).
3. `npm run build && npm run assets` لتوليد السيرة و`og.png` بالصورة الجديدة.

| المخرجات | المقاس | الاستخدام |
| --- | --- | --- |
| `portrait.webp` / `portrait.jpg` | 1000×667 (‏3:2) | بطاقة الهيرو |
| `portrait-640.*` | 640×427 | نسخة `srcset` للأجهزة الأصغر |
| `avatar.webp` / `avatar.jpg` | 400×400 مربّعة | رأس السيرة + بطاقة OG |
| `avatar-240.*` | 240×240 | نسخة `srcset` |

الصورة تظهر في: بطاقة الهيرو، رأس `/cv`، بطاقة المشاركة `og.png`، وبيانات `Person` في JSON-LD. لتعديل موضع القص نحو الوجه أعلى/أسفل، غيّر `heroCrop` و`faceCrop` في `scripts/make-assets.mjs` ثم أعد تشغيل `--only=photo`.

---

## النطاق وتحقيق Google Search Console

1. افتح `app/data/site.ts` وعدّل:
   ```ts
   export const SITE_URL = "https://your-domain.com";
   ```
   (أو اتركه واضبط `SITE_URL` في متغيرات بيئة Vercel — له الأولوية.)
2. للتحقق من الملكية في Search Console:
   - **HTML tag**: ضع قيمة `content` فقط في `site.googleVerification`.
   - أو **ملف HTML**: حمّل الملف إلى `public/` وضع اسمه في `site.googleVerificationFile`.
3. أرسل `https://your-domain.com/sitemap.xml` في Search Console.

الموقع يولّد تلقائياً: `canonical`، وروابط `hreflang` (en / ar / x-default)، وبيانات منظّمة JSON-LD (Person / ProfilePage / CreativeWork)، و`robots.txt`، و`og:image`.

---

## النشر على Vercel

1. ارفع المشروع إلى GitHub.
2. في Vercel: **Add New → Project** واختر المستودع.
3. Framework Preset: **React Router** (يُكتشف تلقائياً). لا تحتاج Build Command مخصصاً.
4. أضف متغير البيئة `SITE_URL` = نطاقك النهائي (اختياري لكن مستحسن).
5. Deploy. بعد أول نشر: أضف النطاق المخصص من **Settings → Domains**، ثم أعد التحقق في Search Console وأرسل الـ sitemap.

> إعداد Vercel يعمل فقط أثناء البناء على Vercel (`process.env.VERCEL`) كما في `react-router.config.ts`، فلا يتأثر التشغيل المحلي.

---

## البنية

```
app/
  data/          ← المحتوى (المكان الوحيد الذي تعدّله عادةً)
  i18n/          ← القواميس ومساعدات اللغة (en على /، ar على /ar)
  components/    ← Header, Footer, الأقسام، مكوّنات واجهة
  routes/        ← home, project, cv, og, sitemap, robots, not-found
  lib/           ← seo.ts (الميتا وJSON-LD)، theme.ts، utils.ts
  app.css        ← رموز الألوان، الوضع الليلي، الحركات، أنماط الطباعة
scripts/
  make-assets.mjs     ← توليد PDF والصور بـ Chrome بلا واجهة
  icon-source.html    ← مصدر أيقونة التطبيق
public/               ← favicon، og.png، الأيقونات، وملفات السيرة في files/
```

### ملاحظات تقنية

- **SSR**: كل مسار يُعرض على الخادم؛ `lang` و`dir` مضبوطان في HTML.
- **الوضع الليلي**: يُحسم قبل أول رسم (سكربت صغير في `<head>`) اعتماداً على تفضيل النظام.
- **الحركة**: `prefers-reduced-motion` مُحترم.
- **الطباعة**: أنماط `@media print` تعرض `/cv` بتصميم العمودين على صفحة A4 واحدة. يُضبط الحجم بـ`zoom` على ورقة السيرة وحدها (لا توسيع للعرض) فلا يُقطع أي نص، وهي نفسها المصدر لملف PDF. على الشاشة تبقى الخطوط بحجم مقروء (‏12px فأكثر)، و`zoom` يعوّض ذلك في الطباعة.

## نتائج Lighthouse (محلي)

| الصفحة | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- |
| `/` | 100 | 100 | 100 |
| `/ar` | 100 | 100 | 100 |
| `/cv` | 100 | 100 | 100 |
| `/work/go-bus` | 100 | 100 | 100 |
| `/work/my-car` | 100 | 100 | 100 |
