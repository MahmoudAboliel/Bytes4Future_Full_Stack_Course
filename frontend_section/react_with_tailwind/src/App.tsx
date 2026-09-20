import Header from "./components/Header/Header";
import UserCard from "./components/UserCard";
const App = () => {
  const users = [
    {
      title: "سارة الأحمد",
      description: "مهندسة واجهات أمامية",
      image: "https://i.pravatar.cc/80?img=47",
      tag: "React",
    },
    {
      title: "محمد الخطيب",
      description: "مطور باك-إند",
      image: "https://i.pravatar.cc/80?img=12",
      tag: "Node.js",
    },
    {
      title: "ليان حسن",
      description: "مصممة تجربة مستخدم",
      image: "https://i.pravatar.cc/80?img=32",
    },
  ];
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <div className="p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <UserCard {...user} />
        ))}
      </div>
    </main>
  );
};

export default App;
