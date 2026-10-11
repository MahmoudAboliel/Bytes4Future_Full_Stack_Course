import type { ReactNode } from "react";
type TableBodyProps = {
  children: ReactNode;
  className?: string;
  id: string;
};

const TableBody = ({ children, className = "", id }: TableBodyProps) => {
  return (
    <tbody id={id} className={`divide-y divide-gray-200 ${className}`}>
      {children}
    </tbody>
  );
};

export default TableBody;
