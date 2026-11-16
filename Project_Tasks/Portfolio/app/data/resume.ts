import type { Certification, EducationItem, Experience, SkillGroup } from "./types";

export const skills: SkillGroup[] = [
  {
    key: "frontend",
    icon: "code",
    title: { en: "Frontend", ar: "الواجهات" },
    items: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript (ES2022)",
      "Tailwind CSS",
      "Material UI",
      "shadcn/ui",
      "Emotion",
      "Component architecture",
      "State management",
    ],
  },
  {
    key: "backend",
    icon: "server",
    title: { en: "Backend", ar: "الخلفية" },
    items: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "JWT authentication",
      "Socket.IO",
      "Role-based access control",
      "Flask",
    ],
  },
  {
    key: "mobile",
    icon: "phone",
    title: { en: "Mobile", ar: "الجوال" },
    items: [
      "React Native",
      "Expo",
      "Expo Router",
      "NativeWind",
      "Expo SecureStore",
      "Responsive & RTL layouts",
    ],
  },
  {
    key: "data",
    icon: "database",
    title: { en: "Data & Databases", ar: "البيانات وقواعد البيانات" },
    items: [
      "MongoDB",
      "Mongoose",
      "PostgreSQL",
      "PostGIS",
      "Prisma",
      "Database design",
      "Indexing",
    ],
  },
  {
    key: "scripting",
    icon: "sparkles",
    title: { en: "Python & Scripting", ar: "Python والأتمتة" },
    items: ["Python", "Data processing", "Streamlit", "Pandas", "NumPy", "Web scraping"],
  },
  {
    key: "gis",
    icon: "map",
    title: { en: "Mapping & GIS", ar: "الخرائط وGIS" },
    items: ["Leaflet", "OpenStreetMap", "GeoJSON", "PostGIS queries"],
  },
  {
    key: "practice",
    icon: "compass",
    title: { en: "Engineering practice", ar: "الممارسة الهندسية" },
    items: [
      "Requirements analysis",
      "Use-case modelling",
      "SRS documentation",
      "System decomposition",
      "Git / GitHub / GitLab",
      "Agile teamwork",
    ],
  },
];

export const experience: Experience[] = [
  {
    company: { en: "United Company", ar: "الشركة المتحدة" },
    role: { en: "Full-Stack Developer", ar: "مطوّر Full-Stack" },
    period: { en: "2025", ar: "2025" },
    location: { en: "Damascus, Syria", ar: "دمشق، سوريا" },
    summary: {
      en: "Built My Car, a car marketplace on Next.js and TypeScript — server-rendered public pages, role-based dashboards for vendors and admins, and a search-first browsing experience.",
      ar: "طوّرت My Car، منصة سيارات بـ Next.js وTypeScript: صفحات عامة تُعرض من الخادم، ولوحات تحكم حسب الدور للتجار والمدراء، وتجربة تصفّح تقوم على البحث.",
    },
    highlights: {
      en: [
        "Built a responsive marketplace with Next.js App Router, using SSR and ISR for search-friendly, fast-loading pages.",
        "Implemented secure JWT role-based authentication tailored for vendors, buyers and administrators.",
        "Engineered an advanced multi-criteria search and filtering system across the listings catalogue.",
        "Delivered a full CRUD admin dashboard for user and product management.",
      ],
      ar: [
        "بنيت منصة متجاوبة باستخدام Next.js App Router مع SSR وISR لصفحات سريعة التحميل وصديقة لمحركات البحث.",
        "نفّذت مصادقة آمنة بـ JWT وتوزيع صلاحيات حسب الدور للتجار والمشترين والمدراء.",
        "هندست نظام بحث وتصفية متقدّماً متعدد المعايير على كتالوج الإعلانات.",
        "سلّمت لوحة إدارة كاملة بـ CRUD لإدارة المستخدمين والمنتجات.",
      ],
    },
    stack: ["Next.js", "TypeScript", "App Router", "JWT", "REST APIs"],
  },
  {
    company: { en: "IT Land Company", ar: "شركة IT Land" },
    role: { en: "Front-End Developer", ar: "مطوّر واجهات أمامية" },
    period: { en: "Jul 2025 — Sep 2025", ar: "يوليو 2025 — سبتمبر 2025" },
    location: { en: "Damascus, Syria", ar: "دمشق، سوريا" },
    summary: {
      en: "Built responsive product interfaces with React and Next.js, and helped shape a reusable component layer the team could build on.",
      ar: "بنيت واجهات منتجات متجاوبة باستخدام React وNext.js، وساهمت في بناء طبقة مكوّنات قابلة لإعادة الاستخدام يعتمد عليها الفريق.",
    },
    highlights: {
      en: [
        "Delivered responsive interfaces in React.js and Next.js across desktop and mobile breakpoints.",
        "Designed reusable UI components that reduced duplicated markup and sped up new screens.",
        "Applied mobile-first UI/UX principles so layouts held up on small screens first.",
        "Introduced clearer state-management patterns for maintainable, predictable data flow.",
      ],
      ar: [
        "سلّمت واجهات متجاوبة بـ React.js وNext.js على مقاسات سطح المكتب والجوال.",
        "صمّمت مكوّنات واجهة قابلة لإعادة الاستخدام قلّلت تكرار الشيفرة وسرّعت بناء الشاشات الجديدة.",
        "طبّقت مبادئ UI/UX للجوال أولاً فصمدت التخطيطات على الشاشات الصغيرة.",
        "أدخلت أنماط إدارة حالة أوضح لتدفّق بيانات متوقّع وقابل للصيانة.",
      ],
    },
    stack: ["React.js", "Next.js", "Tailwind CSS", "JavaScript"],
  },
  {
    company: { en: "Programming for Community", ar: "Programming for Community" },
    role: { en: "Systems Analyst", ar: "محلّل نظم" },
    period: { en: "Feb 2025", ar: "فبراير 2025" },
    location: { en: "Remote", ar: "عن بُعد" },
    summary: {
      en: "Documented an assistance platform from requirements to structured specification, giving the build team a single reference to work from.",
      ar: "وثّقت منصة مساعدة من المتطلبات إلى مواصفة منظّمة، فمنحت فريق التطوير مرجعاً واحداً يعمل عليه.",
    },
    highlights: {
      en: [
        "Authored SRS documents covering functional and non-functional requirements.",
        "Decomposed the architecture into modular subsystems with clear boundaries.",
        "Mapped user actors' workflows into use cases, including alternate and exception paths.",
      ],
      ar: [
        "كتبت وثائق SRS تغطي المتطلبات الوظيفية وغير الوظيفية.",
        "فكّكت المعمارية إلى أنظمة فرعية معيارية بحدود واضحة.",
        "حوّلت مسارات المستخدمين إلى حالات استخدام تشمل المسارات البديلة والاستثناءات.",
      ],
    },
    stack: ["Requirements analysis", "Use cases", "SRS", "UML"],
  },
];

export const education: EducationItem[] = [
  {
    degree: {
      en: "B.Sc. in Computer Engineering and Automation",
      ar: "بكالوريوس في هندسة الحاسبات والأتمتة",
    },
    school: { en: "University of Damascus", ar: "جامعة دمشق" },
    period: { en: "2017 — 2025", ar: "2017 — 2025" },
    summary: {
      en: "Computer engineering fundamentals — systems, automation, software engineering and data — with a final focus on software systems analysis and web engineering.",
      ar: "أساسيات هندسة الحاسبات — الأنظمة والأتمتة وهندسة البرمجيات والبيانات — مع تركيز نهائي على تحليل نظم البرمجيات وهندسة الويب.",
    },
  },
];

export const certifications: Certification[] = [
  {
    title: { en: "Full-Stack Developer Trainee", ar: "متدرّب مطوّر Full-Stack" },
    issuer: { en: "Bytes4Future — Full-Stack Bootcamp", ar: "Bytes4Future — معسكر Full-Stack" },
    year: "2026",
    summary: {
      en: "TypeScript, React, Next.js, React Native, Node.js, Express, NestJS, MongoDB and PostgreSQL, with Agile hackathon teamwork and solution presentations.",
      ar: "TypeScript وReact وNext.js وReact Native وNode.js وExpress وNestJS وMongoDB وPostgreSQL، مع عمل جماعي بأسلوب Agile وعروض حلول.",
    },
  },
  {
    title: { en: "Python Mastery Bootcamp", ar: "معسكر إتقان Python" },
    issuer: { en: "Online bootcamp", ar: "معسكر عن بُعد" },
    year: "2026",
    summary: {
      en: "Python, OOP, Pandas, NumPy, data visualisation, APIs, web scraping, Streamlit, SQLite ORM and Git/GitHub.",
      ar: "Python والبرمجة الكائنية وPandas وNumPy وتصوير البيانات وواجهات API وكشط الويب وStreamlit وSQLite ORM وGit/GitHub.",
    },
  },
];
