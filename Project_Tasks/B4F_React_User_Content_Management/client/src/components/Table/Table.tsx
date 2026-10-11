import type { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string;
  id: string;
}

const Table = ({ children, className = "", id }: TableProps) => {
  return (
    <div className="overflow-x-auto w-full">
      <table
        id={id}
        className={`w-full text-left text-sm border-collapse  min-w-200 ${className}`}
      >
        {children}
      </table>
    </div>
  );
};

export default Table;
