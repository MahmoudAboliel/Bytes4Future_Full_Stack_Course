import type { ReactNode } from "react";

interface TableRowProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

const TableRow = ({ children, className = "", id }: TableRowProps) => {
  return (
    <tr key={id} className={`hover:bg-gray-50 transition-colors ${className}`}>
      {children}
    </tr>
  );
};

export default TableRow;
