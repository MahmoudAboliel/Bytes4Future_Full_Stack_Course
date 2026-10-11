import type { ReactNode } from "react";
interface AlbumGridProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

const AlbumGrid = ({ children, className = "", id }: AlbumGridProps) => {
  return (
    <div
      id={id}
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default AlbumGrid;
