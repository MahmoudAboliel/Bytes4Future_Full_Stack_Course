import type {ReactNode} from "react";

interface TableCellProps {
  children: ReactNode;
  className?: string;
  id: string;
}

const TableCell = ({ children, className = "", id }: TableCellProps) => {
  return (
    <td key={id} className={`px-4 py-3 align-middle ${className}`}>
      {children}
    </td>
  );
};

export default TableCell;
