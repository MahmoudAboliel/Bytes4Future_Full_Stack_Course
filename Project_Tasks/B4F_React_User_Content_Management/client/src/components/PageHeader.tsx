import { useUser } from "@/context/UserContext";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  AddButton: ReactNode;
}

const PageHeader = ({ title, description, AddButton }: PageHeaderProps) => {
  const { user } = useUser();

  return (
    <header className="mb-4 border-b pb-4 flex justify-between items-end">
      <div className="flex flex-col gap-1">
        {user && (
          <span className="text-sm font-medium text-primary">
            Welcome back, {user.name} 👋
          </span>
        )}

        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>

        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {AddButton}
    </header>
  );
};

export default PageHeader;
