import { formatDate } from "../utils";

const Header = () => {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Inventory and warehouse movements overview — last updated{" "}
          {formatDate(new Date())}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 shadow-sm ring-1 ring-slate-700">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Synced
        </span>
      </div>
    </header>
  );
};

export default Header;
