import type { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
}
const TasksPageWrapper = ({ children }: CardProps) => {
  return (
    <div className="overflow-x-auto h-[calc(100dvh-49px)]">
      <div className="flex gap-3 p-4 h-full w-[1486px]">
        {children}
      </div>
    </div>
  );
};

export default TasksPageWrapper;
