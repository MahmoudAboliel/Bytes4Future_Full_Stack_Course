type TableHeadProps = {
  cols: string[];
  className?: string;
  id?: string;
};

const TableHead = ({ cols, className = "", id }: TableHeadProps) => {
  return (
    <thead id={id} className={`bg-gray-100 border-b ${className}`}>
      <tr>
        {cols.map((col, index) => (
          <th key={index} className="px-4 py-3 font-semibold text-gray-700">
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHead;
