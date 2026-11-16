import type { Project } from "./types";

/**
 * ─────────────────────────────────────────────────────────────
 *  PROJECTS — add a project by pushing a new object here.
 *  It automatically appears on the home page, gets a case-study
 *  page at /work/<slug> (and /ar/work/<slug>), and joins the sitemap.
 * ─────────────────────────────────────────────────────────────
 */
export const projects: Project[] = [
  {
    slug: "go-bus",
    year: "2026",
    art: "seats",
    stack: [
      "React Native",
      "Expo",
      "NativeWind",
      "TypeScript",
      "Expo SecureStore",
      "Node.js",
      "Express",
      "MongoDB",
      "Mongoose",
      "JWT",
    ],
    links: [
      {
        kind: "repo",
        href: "https://github.com/MahmoudAboliel",
      },
    ],
    title: {
      en: "Go Bus — Bus Booking Platform",
      ar: "Go Bus — منصة حجز رحلات الباصات",
    },
    category: {
      en: "Mobile app · Booking system",
      ar: "تطبيق جوال · نظام حجز",
    },
    tagline: {
      en: "A bilingual booking app with a real seat map, live availability and a secure mobile session.",
      ar: "تطبيق حجز بلغتين مع مخطط مقاعد حقيقي، وتوافر لحظي، وجلسة آمنة على الجوال.",
    },
    summary: {
      en: "Go Bus is an end-to-end booking system for intercity bus travel: customers reserve seats from a mobile app while an admin and a secretary manage fleet models, schedules, cash confirmation and rescheduling from a dashboard. I built the customer mobile app with React Native and Expo, and took part in the system analysis and data modelling behind it.",
      ar: "Go Bus نظام حجز متكامل لرحلات الباصات بين المدن: يحجز الزبون مقاعده من تطبيق الجوال، بينما يدير المدير والسكرتيرة طرازات الأسطول والجداول وتأكيد الدفع النقدي وإعادة الجدولة من لوحة تحكم. طوّرت تطبيق الزبون باستخدام React Native وExpo، وشاركت في تحليل النظام ونمذجة البيانات التي يقوم عليها.",
    },
    role: {
      en: "Mobile app developer · System analysis & data model",
      ar: "مطوّر تطبيق الجوال · تحليل النظام ونموذج البيانات",
    },
    timeline: {
      en: "2026 · Personal / graduation project",
      ar: "2026 · مشروع شخصي / مشروع تخرج",
    },
    metrics: [
      {
        value: "6",
        label: { en: "Bus layouts supported", ar: "طرازات باص مدعومة" },
      },
      {
        value: "18–45",
        label: { en: "Seats per vehicle", ar: "مقعداً لكل مركبة" },
      },
      {
        value: "3",
        label: { en: "Distinct roles", ar: "أدوار مستخدمين" },
      },
      {
        value: "0",
        label: { en: "Double-booked seats", ar: "حجز مزدوج للمقعد" },
      },
    ],
    challenge: {
      en: "A seat is a finite resource shared by everyone, and the booking flow mixes an app, a cash desk and a rolling schedule. The hard part was not the UI — it was keeping one source of truth: a seat can never be sold twice, a confirmed booking cannot silently disappear, and when a trip is rescheduled every affected passenger has to be followed up with before the new departure.",
      ar: "المقعد مورد محدود يتشاركه الجميع، وتدفّق الحجز يمزج بين تطبيق ومكتب دفع نقدي وجدول متغيّر. الجزء الصعب لم يكن الواجهة، بل الحفاظ على مصدر حقيقة واحد: لا يمكن بيع المقعد مرتين، ولا يجوز أن يختفي حجز مؤكد بصمت، وعند إعادة جدولة رحلة يجب متابعة كل راكب متأثر قبل المغادرة الجديدة.",
    },
    features: {
      en: [
        "Interactive seat map rendered from each bus model (1+1 and 2+1 layouts) with available and taken seats.",
        "Multi-seat booking in a single request — no need to repeat passenger data for every seat.",
        "Atomic seat validation on the server before a booking is written, so two customers can never claim the same seat.",
        "Booking lifecycle: reserved → confirmed at the cash desk, with the cancellation rules enforced by role and timing.",
        "Rescheduling flow that flips affected confirmed bookings to reserved and creates a follow-up record for the secretary.",
        "Secure session storage on device with Expo SecureStore instead of plain AsyncStorage.",
        "Arabic and English interface with right-to-left layout, built on NativeWind design tokens.",
        "In-app notifications for schedule changes and booking updates.",
      ],
      ar: [
        "مخطط مقاعد تفاعلي يُبنى من طراز الباص (توزيع 1+1 و2+1) ويوضّح المقاعد المتاحة والمحجوزة.",
        "حجز عدة مقاعد في طلب واحد — دون تكرار بيانات المسافر لكل مقعد.",
        "تحقق ذرّي من المقاعد على الخادم قبل كتابة الحجز، فلا يمكن لزبونين حجز المقعد نفسه.",
        "دورة حياة الحجز: محجوز ← مؤكّد لدى السكرتيرة، مع تطبيق قواعد الإلغاء حسب الدور والتوقيت.",
        "مسار إعادة الجدولة يحوّل الحجوزات المؤكدة المتأثرة إلى محجوزة وينشئ سجل متابعة للسكرتيرة.",
        "تخزين آمن لجلسة المستخدم على الجهاز باستخدام Expo SecureStore بدلاً من AsyncStorage العادي.",
        "واجهة عربية وإنكليزية بتوزيع من اليمين إلى اليسار، مبنية على رموز تصميم NativeWind.",
        "إشعارات داخل التطبيق عند تغيّر موعد الرحلة أو تحديث حالة الحجز.",
      ],
    },
    architecture: {
      en: [
        "Client: React Native + Expo with typed screens, a shared API client and NativeWind utility classes for consistent spacing, colour and RTL behaviour.",
        "Auth: JWT issued by the API, stored in Expo SecureStore (encrypted keystore / keychain) and attached to requests through a single interceptor.",
        "API: Express REST endpoints with role guards for admin, secretary and customer — the mobile app only exposes what the customer role is allowed to call.",
        "Data: MongoDB with Mongoose models for users, bus models, trips, bookings, schedule changes, follow-ups and notifications.",
        "Seat integrity: availability is computed from stored bookings and re-validated inside the write path, so the check and the insert are not separated by a race.",
        "Seat layouts are data, not hard-coded UI: the same seat-map component renders 18, 22, 27, 33, 37 or 45-seat vehicles.",
      ],
      ar: [
        "العميل: React Native وExpo مع شاشات مُعرّفة الأنواع، وعميل API مشترك، وأصناف NativeWind لتوحيد المسافات والألوان وسلوك RTL.",
        "المصادقة: JWT يصدره الخادم ويُخزَّن في Expo SecureStore (keystore/keychain مشفّر) ويُرفق بالطلبات عبر interceptor واحد.",
        "الواجهة البرمجية: مسارات REST في Express مع حماية حسب الدور (مدير، سكرتيرة، زبون) — والتطبيق لا يعرض إلا ما يملك الزبون صلاحيته.",
        "البيانات: MongoDB مع نماذج Mongoose للمستخدمين وطرازات الباصات والرحلات والحجوزات وتغييرات المواعيد والمتابعات والإشعارات.",
        "سلامة المقاعد: يُحسب التوافر من الحجوزات المخزنة ويُعاد التحقق منه داخل مسار الكتابة، فلا يفصل بين التحقق والإدخال أي سباق.",
        "توزيعات المقاعد بيانات لا واجهة ثابتة: نفس مكوّن المخطط يعرض مركبات بسعة 18 أو 22 أو 27 أو 33 أو 37 أو 45 مقعداً.",
      ],
    },
    outcomes: {
      en: [
        "A single seat-map component now serves every vehicle in the fleet, which removed per-model UI code.",
        "The reserved/confirmed split mirrors how the business actually works: customers reserve online, staff confirm cash in person.",
        "Rescheduling became a tracked workflow with follow-ups instead of ad-hoc phone calls and spreadsheet edits.",
        "The mobile session survives app restarts without ever storing a token in plain text.",
      ],
      ar: [
        "مكوّن مخطط مقاعد واحد يخدم كل مركبات الأسطول، ما ألغى كتابة واجهة منفصلة لكل طراز.",
        "فصل حالتي «محجوز» و«مؤكّد» يعكس طريقة العمل الفعلية: الزبون يحجز إلكترونياً والموظف يؤكد الدفع النقدي حضورياً.",
        "أصبحت إعادة الجدولة عملية موثّقة بسجلات متابعة بدل مكالمات عشوائية وتعديلات على ملفات الجداول.",
        "جلسة التطبيق تبقى صالحة بعد إعادة تشغيله دون تخزين التوكن كنص صريح أبداً.",
      ],
    },
    keywords: {
      en: [
        "bus booking system",
        "React Native booking app",
        "seat selection app",
        "Expo SecureStore auth",
        "NativeWind",
        "MongoDB booking schema",
      ],
      ar: [
        "نظام حجز باصات",
        "تطبيق حجز React Native",
        "اختيار المقاعد",
        "مصادقة Expo SecureStore",
        "NativeWind",
        "قاعدة بيانات الحجوزات",
      ],
    },
  },

  {
    slug: "my-car",
    year: "2025",
    art: "panels",
    stack: [
      "Next.js",
      "TypeScript",
      "App Router",
      "SSR / ISR",
      "JWT",
      "Role-based auth",
      "REST APIs",
      "Tailwind CSS",
    ],
    links: [],
    title: {
      en: "My Car — Car Marketplace",
      ar: "My Car — منصة سيارات",
    },
    category: {
      en: "Web marketplace · Next.js",
      ar: "منصة ويب · Next.js",
    },
    tagline: {
      en: "Buyers search and compare, vendors list their cars, and admins run the whole catalogue.",
      ar: "المشتري يبحث ويقارن، والتاجر يعرض سياراته، والمدير يدير الكتالوج بالكامل.",
    },
    summary: {
      en: "A car marketplace built with Next.js App Router and TypeScript at United Company. Buyers browse and compare listings through a multi-criteria search, vendors manage their own inventory, and administrators control users and products from a full CRUD dashboard — all behind JWT role-based authentication, with SSR and ISR keeping the pages fast and indexable.",
      ar: "منصة سيارات بُنيت بـ Next.js App Router وTypeScript في الشركة المتحدة. يتصفّح المشتري الإعلانات ويقارن بينها عبر بحث متعدد المعايير، ويدير التاجر مخزونه الخاص، ويتحكّم المدير بالمستخدمين والمنتجات من لوحة CRUD كاملة — خلف مصادقة JWT وصلاحيات حسب الدور، مع SSR وISR لإبقاء الصفحات سريعة وقابلة للفهرسة.",
    },
    role: {
      en: "Full-Stack Developer · United Company",
      ar: "مطوّر Full-Stack · الشركة المتحدة",
    },
    timeline: { en: "2025 · United Company", ar: "2025 · الشركة المتحدة" },
    metrics: [
      { value: "3", label: { en: "Account roles", ar: "أدوار حسابات" } },
      {
        value: "SSR + ISR",
        label: { en: "Rendering strategy", ar: "استراتيجية العرض" },
      },
      { value: "CRUD", label: { en: "Admin dashboard", ar: "لوحة إدارة" } },
      {
        value: "SEO",
        label: { en: "Indexable listings", ar: "إعلانات قابلة للفهرسة" },
      },
    ],
    challenge: {
      en: "A marketplace has to be instant for visitors who never log in, private and write-heavy for vendors, and fully controllable for admins — inside one Next.js codebase. Public listing pages must stay crawlable while prices and inventory change constantly, and each role has to reach only the routes and mutations it owns.",
      ar: "المنصة يجب أن تكون فورية للزائر الذي لا يسجّل الدخول، وخاصة وكثيفة الكتابة للتاجر، وقابلة للتحكّم الكامل من المدير — داخل قاعدة شيفرة واحدة بـ Next.js. ويجب أن تبقى صفحات الإعلانات العامة قابلة للفهرسة مع تغيّر الأسعار والمخزون باستمرار، وأن يصل كل دور إلى المسارات والعمليات التي يملكها فقط.",
    },
    features: {
      en: [
        "Multi-criteria search and filtering across brand, model, year, price, mileage and location, with combinable filters and shareable URLs.",
        "JWT authentication with role-based guards for buyers, vendors and administrators.",
        "Vendor workspace for creating, editing and retiring their own listings.",
        "Full CRUD admin dashboard for user and product management, with search, pagination and status control.",
        "Server-rendered listing pages with incremental regeneration, so content stays fresh without losing SEO.",
        "Responsive, RTL-aware interface that works from small phones to desktop.",
      ],
      ar: [
        "بحث وتصفية متعدد المعايير حسب الماركة والطراز والسنة والسعر والمسافة المقطوعة والموقع، بمرشّحات قابلة للتركيب وروابط قابلة للمشاركة.",
        "مصادقة JWT مع حماية حسب الدور للمشتري والتاجر والمدير.",
        "مساحة عمل للتاجر لإنشاء إعلاناته وتعديلها وإيقافها.",
        "لوحة إدارة كاملة بـ CRUD للمستخدمين والمنتجات، مع بحث وترقيم صفحات وتحكّم بالحالة.",
        "صفحات إعلانات تُعرض من الخادم مع تحديث تدريجي (ISR)، فيبقى المحتوى حديثاً دون خسارة الفهرسة.",
        "واجهة متجاوبة تراعي RTL وتعمل من الهواتف الصغيرة حتى سطح المكتب.",
      ],
    },
    architecture: {
      en: [
        "Next.js App Router with server components for data-heavy pages and client components only where interaction is needed.",
        "SSR for request-time pages, and ISR with revalidation for listing and detail pages that change less often.",
        "JWT sessions verified in the server layer, with role guards applied in layouts, route handlers and mutations.",
        "A single typed search layer turns URL parameters into the filter query, so the same state is shareable and crawlable.",
        "Vendor and admin mutations are validated on the server, never trusted from the browser.",
      ],
      ar: [
        "Next.js App Router مع مكوّنات خادم للصفحات كثيفة البيانات، ومكوّنات عميل فقط حيث تلزم التفاعلية.",
        "SSR للصفحات المرتبطة بالطلب، وISR مع إعادة تحقق لصفحات الإعلانات والتفاصيل التي تتغيّر أقل.",
        "جلسات JWT تُتحقَّق في طبقة الخادم، مع تطبيق حماية الأدوار في التخطيطات ومسارات الـ API والعمليات.",
        "طبقة بحث واحدة مُعرّفة الأنواع تحوّل معاملات الرابط إلى استعلام تصفية، فتصبح الحالة نفسها قابلة للمشاركة والفهرسة.",
        "عمليات التاجر والمدير تُتحقَّق على الخادم ولا يُوثق بها من المتصفح.",
      ],
    },
    outcomes: {
      en: [
        "Public pages ship complete HTML, so listings are indexable and fast on first load.",
        "One role model covers buyers, vendors and admins without duplicating screens.",
        "The admin dashboard replaced manual product and user edits with a single CRUD surface.",
        "ISR keeps popular listing pages fresh without rebuilding the whole catalogue.",
      ],
      ar: [
        "الصفحات العامة تُطلق HTML كاملاً، فتكون الإعلانات قابلة للفهرسة وسريعة عند أول تحميل.",
        "نموذج أدوار واحد يغطي المشتري والتاجر والمدير دون تكرار الشاشات.",
        "لوحة الإدارة استبدلت التعديل اليدوي للمنتجات والمستخدمين بواجهة CRUD واحدة.",
        "‏ISR يبقي صفحات الإعلانات الشائعة حديثة دون إعادة بناء الكتالوج كله.",
      ],
    },
    keywords: {
      en: [
        "Next.js car marketplace",
        "App Router SSR ISR",
        "JWT role-based auth",
        "admin CRUD dashboard",
      ],
      ar: [
        "منصة سيارات Next.js",
        "App Router مع SSR وISR",
        "مصادقة JWT بالأدوار",
        "لوحة إدارة CRUD",
      ],
    },
  },

  {
    slug: "education-management",
    year: "2025",
    art: "school",
    stack: ["React", "Node.js", "Express", "MongoDB", "Mongoose", "JWT"],
    links: [{ kind: "repo", href: "https://github.com/MahmoudAboliel" }],
    title: {
      en: "Educational Institution Management System",
      ar: "نظام إدارة مؤسسة تعليمية",
    },
    category: { en: "Full-stack web app", ar: "تطبيق ويب متكامل" },
    tagline: {
      en: "Students, teachers, courses, attendance and grades — in one role-aware admin platform.",
      ar: "الطلاب والأساتذة والمواد والحضور والعلامات — في منصة إدارة واحدة تراعي الأدوار.",
    },
    summary: {
      en: "A full-stack management system built during the Bytes4Future bootcamp. It covers the academic core: enrolment, attendance and grades, with JWT authentication and role-based authorisation on every write path.",
      ar: "نظام إدارة متكامل بُني خلال معسكر Bytes4Future، يغطي جوهر العمل الأكاديمي: التسجيل والحضور والعلامات، مع مصادقة JWT وصلاحيات مبنية على الدور في كل عمليات الكتابة.",
    },
    role: { en: "Full-stack developer", ar: "مطوّر Full-Stack" },
    timeline: { en: "2025 · Bootcamp project", ar: "2025 · مشروع معسكر" },
    metrics: [
      {
        value: "6",
        label: { en: "Core domains modelled", ar: "مجالات أساسية" },
      },
      { value: "3", label: { en: "User roles", ar: "أدوار مستخدمين" } },
      { value: "REST", label: { en: "API style", ar: "نمط الواجهة" } },
      {
        value: "100%",
        label: { en: "Validated write paths", ar: "مسارات كتابة محققة" },
      },
    ],
    challenge: {
      en: "Academic data is highly relational: a student enrols in a course, a teacher owns it, attendance and grades hang off that enrolment. The design had to make those relationships explicit in MongoDB, and keep teachers from editing records outside their own courses.",
      ar: "البيانات الأكاديمية شديدة الترابط: الطالب يسجّل في مادة، والأستاذ يدرّسها، والحضور والعلامات مرتبطة بذلك التسجيل. كان التحدي في تمثيل هذه العلاقات بوضوح داخل MongoDB، ومنع الأستاذ من تعديل سجلات خارج مواده.",
    },
    features: {
      en: [
        "Authentication with hashed passwords, JWT sessions and role-based access control.",
        "Management screens for students, teachers, courses and enrolments.",
        "Attendance records per session and grade entry per enrolment.",
        "Request validation on every endpoint before data reaches the database.",
        "Reusable React components for tables, forms and modal workflows.",
      ],
      ar: [
        "مصادقة بكلمات مرور مشفّرة، وجلسات JWT، وصلاحيات حسب الدور.",
        "شاشات إدارة للطلاب والأساتذة والمواد والتسجيلات.",
        "سجلات حضور لكل محاضرة وإدخال علامات لكل تسجيل.",
        "تحقق من صحة الطلبات في كل نقطة نهاية قبل وصول البيانات لقاعدة البيانات.",
        "مكوّنات React قابلة لإعادة الاستخدام للجداول والنماذج وتدفقات النوافذ المنبثقة.",
      ],
    },
    architecture: {
      en: [
        "Mongoose schemas for User, Student, Teacher, Course, Enrolment and Attendance, with references instead of duplicated data.",
        "Express routers split by domain, each protected by an auth middleware and a role guard.",
        "Consistent JSON error shape so the React client can render field-level validation messages.",
      ],
      ar: [
        "نماذج Mongoose للمستخدم والطالب والأستاذ والمادة والتسجيل والحضور، بمراجع بدل تكرار البيانات.",
        "موجّهات Express مقسّمة حسب المجال، يحمي كل منها middleware للمصادقة وحارس للدور.",
        "شكل موحّد لأخطاء JSON بحيث تعرض واجهة React رسائل تحقق على مستوى الحقل.",
      ],
    },
    outcomes: {
      en: [
        "The data model stayed readable as features were added, because relationships were explicit from day one.",
        "Role guards removed the whole category of 'teacher edits another course' bugs.",
      ],
      ar: [
        "ظل نموذج البيانات مقروءاً مع إضافة الميزات، لأن العلاقات كانت صريحة من اليوم الأول.",
        "ألغت حراسات الأدوار فئة كاملة من الأخطاء: «أستاذ يعدّل مادة أخرى».",
      ],
    },
    keywords: {
      en: [
        "education management system",
        "MERN stack",
        "JWT role-based access",
        "school admin panel",
      ],
      ar: ["نظام إدارة تعليمية", "MERN", "صلاحيات JWT", "لوحة إدارة مدرسة"],
    },
  },

  {
    slug: "medical-gis",
    year: "2025",
    art: "map",
    stack: [
      "React",
      "Node.js",
      "Socket.IO",
      "PostgreSQL",
      "PostGIS",
      "Leaflet",
    ],
    links: [{ kind: "repo", href: "https://github.com/MahmoudAboliel" }],
    title: {
      en: "Medical GIS & Emergency Response Dashboard",
      ar: "لوحة GIS طبية واستجابة للطوارئ",
    },
    category: { en: "Real-time geospatial dashboard", ar: "لوحة خرائط فورية" },
    tagline: {
      en: "Live ambulance tracking and dispatch, drawn on top of real geospatial queries.",
      ar: "تتبّع وتوزيع الإسعافات لحظياً، فوق استعلامات جغرافية حقيقية.",
    },
    summary: {
      en: "A real-time emergency dashboard: ambulances stream their position over Socket.IO, incidents are plotted on a Leaflet map, and available resources are matched to the nearest need using PostGIS distance queries.",
      ar: "لوحة طوارئ فورية: ترسل سيارات الإسعاف موقعها عبر Socket.IO، وتُعرض الحوادث على خريطة Leaflet، وتُطابق الموارد المتاحة مع أقرب احتياج باستخدام استعلامات المسافة في PostGIS.",
    },
    role: { en: "Full-stack developer", ar: "مطوّر Full-Stack" },
    timeline: { en: "2025 · Personal project", ar: "2025 · مشروع شخصي" },
    metrics: [
      { value: "Live", label: { en: "Position updates", ar: "تحديث المواقع" } },
      { value: "PostGIS", label: { en: "Spatial engine", ar: "محرك مكاني" } },
      {
        value: "1",
        label: { en: "Map, zero reloads", ar: "خريطة دون إعادة تحميل" },
      },
      { value: "2-way", label: { en: "Dispatch channel", ar: "قناة توزيع" } },
    ],
    challenge: {
      en: "Maps get slow as soon as you treat them as a list of points in JavaScript. The interesting part was pushing the geometry into the database — nearest-ambulance queries, distance ordering and clustering — while the UI kept receiving live positions without full re-renders.",
      ar: "تصبح الخرائط بطيئة حين تتعامل معها كقائمة نقاط في JavaScript. الجزء المثير كان نقل الحسابات الهندسية إلى قاعدة البيانات — استعلامات أقرب إسعاف وترتيب المسافات والتجميع — بينما تستمر الواجهة باستقبال المواقع الحيّة دون إعادة رسم كاملة.",
    },
    features: {
      en: [
        "Live ambulance positions broadcast over a Socket.IO channel and painted on a Leaflet map.",
        "Incident intake with severity and required resources.",
        "Nearest-available-unit matching using PostGIS distance functions.",
        "Resource monitoring view: idle, en route and on-scene status.",
        "Interactive layers, filters and popups for hospitals and incidents.",
      ],
      ar: [
        "بث مواقع سيارات الإسعاف عبر قناة Socket.IO وعرضها على خريطة Leaflet.",
        "تسجيل الحوادث مع درجة الخطورة والموارد المطلوبة.",
        "مطابقة أقرب وحدة متاحة باستخدام دوال المسافة في PostGIS.",
        "واجهة مراقبة الموارد: متاحة، في الطريق، وفي الموقع.",
        "طبقات تفاعلية وفلاتر ونوافذ معلومات للمشافي والحوادث.",
      ],
    },
    architecture: {
      en: [
        "PostgreSQL with the PostGIS extension stores geometries (points and routes) next to ordinary relational columns.",
        "Socket.IO rooms per dispatch region keep position traffic scoped to the clients that need it.",
        "Leaflet layers are updated incrementally from socket events instead of rebuilding the map.",
        "REST handles persistent actions (create incident, assign unit); sockets handle continuous state.",
      ],
      ar: [
        "PostgreSQL مع امتداد PostGIS يخزّن الأشكال الهندسية (نقاط ومسارات) إلى جانب الأعمدة العلائقية العادية.",
        "غرف Socket.IO لكل منطقة توزيع تحصر حركة المواقع في العملاء الذين يحتاجونها.",
        "تُحدَّث طبقات Leaflet تدريجياً من أحداث الـ socket بدل إعادة بناء الخريطة.",
        "REST يتولى الإجراءات الدائمة (إنشاء حادث، إسناد وحدة)، والـ sockets تتولى الحالة المستمرة.",
      ],
    },
    outcomes: {
      en: [
        "Nearest-unit queries moved from O(n) client loops to indexed spatial queries.",
        "The map stayed responsive while multiple vehicles streamed updates simultaneously.",
      ],
      ar: [
        "انتقلت استعلامات أقرب وحدة من حلقات O(n) في العميل إلى استعلامات مكانية مفهرسة.",
        "بقيت الخريطة سريعة الاستجابة أثناء بث عدة مركبات لتحديثاتها في الوقت نفسه.",
      ],
    },
    keywords: {
      en: [
        "PostGIS dashboard",
        "real-time ambulance tracking",
        "Socket.IO geospatial",
        "Leaflet React",
      ],
      ar: [
        "لوحة PostGIS",
        "تتبع إسعاف فوري",
        "Socket.IO وخرائط",
        "Leaflet مع React",
      ],
    },
  },

  {
    slug: "cloud-hosting",
    year: "2024",
    art: "cloud",
    stack: ["Next.js", "Prisma", "MongoDB", "Tailwind CSS", "JWT", "SSR"],
    links: [{ kind: "repo", href: "https://github.com/MahmoudAboliel" }],
    title: {
      en: "Cloud Hosting Platform",
      ar: "منصة استضافة سحابية",
    },
    category: {
      en: "Server-rendered web platform",
      ar: "منصة ويب بعرض من الخادم",
    },
    tagline: {
      en: "A content-driven hosting site where SEO and load speed were the design constraints.",
      ar: "موقع استضافة يعتمد على المحتوى، وكانت سرعة التحميل وتحسين محركات البحث قيود التصميم.",
    },
    summary: {
      en: "A dynamic hosting platform built with Next.js server-side rendering, JWT-protected APIs for accounts and comments, and Prisma models over MongoDB.",
      ar: "منصة استضافة ديناميكية بُنيت بعرض من الخادم عبر Next.js، وواجهات API محمية بـ JWT للحسابات والتعليقات، ونماذج Prisma فوق MongoDB.",
    },
    role: { en: "Full-stack developer", ar: "مطوّر Full-Stack" },
    timeline: { en: "2024 · Personal project", ar: "2024 · مشروع شخصي" },
    metrics: [
      { value: "SSR", label: { en: "Rendered HTML", ar: "HTML من الخادم" } },
      { value: "JWT", label: { en: "Protected routes", ar: "مسارات محمية" } },
      { value: "Prisma", label: { en: "Data layer", ar: "طبقة البيانات" } },
      {
        value: "100",
        label: { en: "Lighthouse-oriented build", ar: "بناء موجّه للأداء" },
      },
    ],
    challenge: {
      en: "Marketing pages and authenticated dashboard views have opposite needs: one must be crawlable and instant, the other private and dynamic. Separating the two rendering paths early kept both simple.",
      ar: "صفحات التسويق ولوحات المستخدم المحمية لهما احتياجات متعاكسة: الأولى يجب أن تكون قابلة للفهرسة وفورية، والثانية خاصة وديناميكية. فصل مساري العرض مبكراً أبقى كليهما بسيطاً.",
    },
    features: {
      en: [
        "Server-side rendered marketing pages with per-page metadata.",
        "JWT authentication with protected account routes.",
        "Comment threads with server-side validation.",
        "Content management for plans and site sections.",
        "Responsive Tailwind UI with a small, consistent component set.",
      ],
      ar: [
        "صفحات تسويقية بعرض من الخادم مع بيانات وصفية لكل صفحة.",
        "مصادقة JWT ومسارات حساب محمية.",
        "سلاسل تعليقات مع تحقق على الخادم.",
        "إدارة محتوى للخطط وأقسام الموقع.",
        "واجهة Tailwind متجاوبة بمجموعة مكوّنات صغيرة ومتسقة.",
      ],
    },
    architecture: {
      en: [
        "Next.js renders public pages on the server and hydrates only the interactive islands.",
        "Prisma models describe users, comments and content records with typed queries.",
        "API routes mirror resource boundaries so the same logic serves pages and client actions.",
      ],
      ar: [
        "يعرض Next.js الصفحات العامة على الخادم ولا يُفعّل إلا الأجزاء التفاعلية.",
        "تصف نماذج Prisma المستخدمين والتعليقات وسجلات المحتوى باستعلامات مُعرّفة الأنواع.",
        "مسارات API تعكس حدود الموارد بحيث يخدم المنطق نفسه الصفحات وإجراءات العميل.",
      ],
    },
    outcomes: {
      en: [
        "Public pages shipped complete HTML, so crawlers saw the full content immediately.",
        "A single Prisma schema kept the API and the pages in sync as content types grew.",
      ],
      ar: [
        "أطلقت الصفحات العامة HTML كاملاً، فرأت محركات البحث المحتوى فوراً.",
        "أبقى مخطط Prisma واحد الـ API والصفحات متزامنة مع نمو أنواع المحتوى.",
      ],
    },
    keywords: {
      en: [
        "Next.js hosting platform",
        "Prisma MongoDB",
        "SSR SEO",
        "JWT authentication",
      ],
      ar: [
        "منصة استضافة Next.js",
        "Prisma مع MongoDB",
        "SSR وتحسين محركات البحث",
        "مصادقة JWT",
      ],
    },
  },

  {
    slug: "portfolio",
    year: "2026",
    art: "panels",
    stack: [
      "React Router 7",
      "Vite",
      "TypeScript",
      "Tailwind CSS v4",
      "Node.js",
      "Vercel",
    ],
    links: [
      { kind: "live", href: "https://mahmoudabulail.vercel.app" },
      { kind: "repo", href: "https://github.com/MahmoudAboliel" },
    ],
    title: {
      en: "This Portfolio",
      ar: "هذا الموقع الشخصي",
    },
    category: {
      en: "Server-rendered personal site",
      ar: "موقع شخصي بعرض من الخادم",
    },
    tagline: {
      en: "One data file feeds the pages, the case studies, the sitemap and a generated CV.",
      ar: "ملف بيانات واحد يغذّي الصفحات ودراسات الحالة وملف الـ sitemap والسيرة الذاتية.",
    },
    summary: {
      en: "The site you are reading. Server-rendered with React Router 7 on top of Vite, typed end to end, bilingual with true RTL, and generated from a single content layer so a new project or a new job is a small data edit — including the downloadable CV.",
      ar: "الموقع الذي تقرأه الآن. يُعرض من الخادم باستخدام React Router 7 فوق Vite، ومكتوب بـ TypeScript من الطرف إلى الطرف، وبلغتين مع دعم RTL حقيقي، ومبني من طبقة محتوى واحدة بحيث تكون إضافة مشروع أو وظيفة تعديلاً صغيراً على البيانات — بما في ذلك السيرة الذاتية القابلة للتحميل.",
    },
    role: { en: "Design & development", ar: "التصميم والتطوير" },
    timeline: { en: "2026", ar: "2026" },
    metrics: [
      {
        value: "100",
        label: { en: "Server-rendered routes", ar: "مسارات معروضة من الخادم" },
      },
      {
        value: "2",
        label: { en: "Languages, real URLs", ar: "لغتان بروابط مستقلة" },
      },
      {
        value: "0",
        label: { en: "Runtime CSS-in-JS", ar: "CSS-in-JS وقت التشغيل" },
      },
      {
        value: "PDF",
        label: { en: "CV generated from data", ar: "سيرة تُبنى من البيانات" },
      },
    ],
    challenge: {
      en: "A portfolio is a small product with production constraints: it has to be crawlable, fast on a mid-range phone, readable in Arabic without a mirrored hack, and maintainable months later when the only thing I remember is 'add a project'.",
      ar: "الموقع الشخصي منتج صغير بقيود إنتاجية: يجب أن يكون قابلاً للفهرسة، وسريعاً على هاتف متوسط، ومقروءاً بالعربية دون حلول معكوسة مرتجلة، وقابلاً للصيانة بعد أشهر حين لا أتذكّر سوى «أضف مشروعاً».",
    },
    features: {
      en: [
        "Full SSR with per-route titles, descriptions, canonical URLs and hreflang alternates.",
        "English at / and Arabic at /ar, with <html lang dir> set on the server — no client-only language switch.",
        "Dark and light themes resolved before first paint, with system preference as the default.",
        "Structured data (Person, ProfilePage, CreativeWork) and a generated sitemap.",
        "Case-study pages generated from the project data, one route per project per language.",
        "The CV page and the downloadable PDF are rendered from the same data as the site.",
        "Scroll reveals and hover effects that respect prefers-reduced-motion.",
      ],
      ar: [
        "عرض كامل من الخادم مع عناوين وأوصاف وروابط canonical بديلة hreflang لكل مسار.",
        "الإنكليزية على / والعربية على /ar، مع ضبط lang وdir على الخادم — لا تبديل لغة في العميل فقط.",
        "وضعان ليلي ونهاري يُحسمان قبل أول رسم، مع تفضيل النظام كافتراضي.",
        "بيانات منظّمة (Person وProfilePage وCreativeWork) وملف sitemap مُولّد.",
        "صفحات دراسات حالة تُبنى من بيانات المشاريع، مسار لكل مشروع لكل لغة.",
        "صفحة السيرة وملف PDF القابل للتحميل يُبنيان من البيانات نفسها التي يقرأها الموقع.",
        "حركات ظهور عند التمرير وتأثيرات hover تحترم تفضيل تقليل الحركة.",
      ],
    },
    architecture: {
      en: [
        "app/data/* is the content layer: profile, skills, experience, projects, education — each string an { en, ar } pair.",
        "Routes are derived from that data; adding an entry produces a page, a card, a sitemap URL and a CV line.",
        "Tailwind CSS v4 with semantic colour tokens, so light and dark are one set of variables.",
        "A headless-Chrome script prints the CV route to PDF, so the download never drifts from the site.",
      ],
      ar: [
        "‏app/data/* هي طبقة المحتوى: الملف الشخصي والمهارات والخبرات والمشاريع والتعليم — كل نص مزدوج { en, ar }.",
        "تُشتق المسارات من هذه البيانات؛ إضافة عنصر تُنتج صفحة وبطاقة ورابط sitemap وسطراً في السيرة.",
        "Tailwind CSS v4 برموز ألوان دلالية، فيكون الوضعان الليلي والنهاري مجموعة متغيرات واحدة.",
        "سكربت Chrome بلا واجهة يطبع مسار السيرة إلى PDF، فلا يبتعد الملف القابل للتحميل عن الموقع أبداً.",
      ],
    },
    outcomes: {
      en: [
        "Adding a project or a role is now a single-file edit with no route or layout work.",
        "Search engines receive complete HTML and a matching sitemap for both languages.",
        "The CV and the site can never disagree, because they share one source.",
      ],
      ar: [
        "إضافة مشروع أو وظيفة أصبحت تعديلاً في ملف واحد دون أي عمل على المسارات أو التصميم.",
        "تتلقى محركات البحث HTML كاملاً وsitemap مطابقاً للغتين.",
        "لا يمكن أن تختلف السيرة عن الموقع، لأنهما يشتركان في مصدر واحد.",
      ],
    },
    keywords: {
      en: [
        "React Router SSR portfolio",
        "bilingual portfolio",
        "Tailwind CSS v4",
        "SEO portfolio",
      ],
      ar: [
        "بورتفوليو React Router",
        "موقع شخصي بلغتين",
        "Tailwind CSS v4",
        "تحسين محركات البحث",
      ],
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
