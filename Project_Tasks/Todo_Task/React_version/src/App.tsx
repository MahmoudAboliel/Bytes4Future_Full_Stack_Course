import Header from "@/components/Header";
import TasksPageWrapper from "./components/layout/TasksPageWrapper";
import TaskSectionWrapper from "./components/layout/TaskSectionWrapper";
import { sections } from "./utils/constance";
import { getTasks } from "./services/task.service";
import TaskCard from "./components/TaskCard";
import { useEffect, useState } from "react";
import type { Task } from "./utils/types";
import { initializeTask } from "./utils/lib";

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getTasks();
      const initializedTasks = await Promise.all(
        (data?.data ?? []).map((task) => initializeTask(task)),
      );

      setTasks(initializedTasks);
    };

    fetchData();
  }, []);
  return (
    <main className="">
      <Header />
      <TasksPageWrapper>
        {sections.map((section) => (
          <TaskSectionWrapper key={section.id} title={section.label}>
            {tasks.map((task) => {
              if (task.status === section.id) {
                return <TaskCard key={task.id} {...task} />;
              }
            })}
          </TaskSectionWrapper>
        ))}
      </TasksPageWrapper>
    </main>
  );
};

export default App;
