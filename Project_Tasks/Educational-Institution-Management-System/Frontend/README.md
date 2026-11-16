# Front-End Structure

```text
Frontend/
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── vite.config.js
├── public/
│ ├── favicon.svg
│ └── icons.svg
└── src/
├── App.css
├── App.jsx
├── index.css
├── main.jsx
├── assets/
│ ├── hero.png
│ ├── react.svg
│ ├── vite.svg
│ └── css/
│ └── tailwind.css
├── components/
│ ├── common/
│ │ ├── Button.jsx
│ │ ├── Card.jsx
│ │ ├── Filter.jsx
│ │ ├── Form.jsx
│ │ ├── Input.jsx
│ │ ├── Modal.jsx
│ │ ├── Table.jsx
│ │ └── ToastNotification.jsx
│ └── layout/
│ ├── Footer.jsx
│ ├── Layout.jsx
│ ├── Navbar.jsx
│ └── Sidebar.jsx
├── context/
│ └── AuthContext.jsx
├── pages/
│ ├── admin/
│ │ ├── AdminDashboard.jsx
│ │ ├── ApprovalsPage.jsx
│ │ └── UsersControlPage.jsx
│ ├── auth/
│ │ └── LoginPage.jsx
│ ├── secretary/
│ │ ├── CoursesPage.jsx
│ │ ├── SecretaryDashboard.jsx
│ │ ├── SecretaryNotesPage.jsx
│ │ ├── StudentsCrudPage.jsx
│ │ └── TeachersCrudPage.jsx
│ ├── student/
│ │ ├── MyAttendancePage.jsx
│ │ ├── MyCoursesPage.jsx
│ │ ├── MyGradesPage.jsx
│ │ └── StudentDashboard.jsx
│ └── teacher/
│ ├── AttendancePage.jsx
│ ├── GradesPage.jsx
│ ├── SessionsPage.jsx
│ └── TeacherDashboard.jsx
├── services/
│ └── api.js
└── utils/
```
