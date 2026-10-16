import { useCallback, useEffect, useMemo, useState } from "react";
import Form from "./Components/Form.tsx";
import DataTable from "../../../lib/DataTable/DataTable";
import type { Column } from "../../../lib/DataTable/types";
import type { Movement, Product } from "../../../lib/types";
import { getAllMovements, addMovement } from "../services/Movements";
import { getAllProducts } from "../../products/services/Products";

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadMovements = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAllMovements();
      setMovements(data);
    } catch {
      setError("Failed to load movements. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);
  const handleSubmit = async (data: {
    productId: string;
    type: "in" | "out";
    amount: number;
    date: string;
    note: string;
  }) => {
    try {
      console.log('data: =>', data)
      await addMovement(data);

      setShowForm(false);
      await loadMovements();
    } catch {
      setError("Failed to add movement. Please try again.");
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadMovements();
  }, [loadMovements]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch {
        setError("Failed to load products. Please try again.");
      }
    };

    void loadProducts();
  }, []);

  const columns = useMemo<Column<Movement>[]>(
    () => [
      {
        key: "product",
        header: "Product",
        accessor: (movement) => movement.productId.name,
        sortable: true,
        render: (movement) => (
          <span className="font-medium text-slate-800 dark:text-slate-100">
            {movement.productId.name}
          </span>
        ),
      },
      {
        key: "type",
        header: "Type",
        sortable: true,
        render: (movement) => {
          const isIn = movement.type === "in";

          return (
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                isIn
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
              }`}
            >
              {isIn ? "In 🡫" : "Out 🡩"}
            </span>
          );
        },
      },
      {
        key: "amount",
        header: "Amount",
        sortable: true,
        align: "center",
        render: (movement) => (
          <span className="font-semibold tabular-nums">{movement.amount}</span>
        ),
      },
      {
        key: "note",
        header: "Note",
        sortable: true,
        align: "center",
        render: (movement) => (
          <span className="font-semibold tabular-nums">{movement.note || "--"}</span>
        ),
      },
      {
        key: "date",
        header: "Date",
        sortable: true,
        sortAccessor: (movement) => new Date(movement.date),
        render: (movement) => new Date(movement.date).toLocaleDateString(),
      },
    ],
    [],
  );

  return (
    <section className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Movements
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track product stock movements and quantities.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void loadMovements()}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      <DataTable<Movement>
        title="All movements"
        subtitle={`${movements.length} movements`}
        columns={columns}
        data={movements}
        rowKey="id"
        loading={loading}
        emptyMessage="No movements found."
        searchPlaceholder="Search movements"
        searchable
        pagination
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
        toolbar={
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              onClick={() => setShowForm(true)}
            >
              + Add Movement
            </button>

            <button
              type="button"
              onClick={() => void loadMovements()}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>
        }
      />

      {showForm && (
        <Form
          products={products}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
}
