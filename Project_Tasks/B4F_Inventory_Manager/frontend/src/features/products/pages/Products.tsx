import { useCallback, useEffect, useMemo, useState } from "react";

import DataTable from "../../../lib/DataTable/DataTable.tsx";
import type { Column, RowAction } from "../../../lib/DataTable/types.ts";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "../../../lib/types";
import MoveForm from "../components/MoveForm.tsx";

import { addMovement } from "../../movements/services/Movements.ts";

import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/Products.ts";

import ProductForm from "../components/ProductForm.tsx";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | undefined>();
  const [movementFormOpen, setMovementFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAllProducts();
      setProducts(data.filter((product) => product.deletedAt == null));
    } catch {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadProducts();
  }, [loadProducts]);
  console.log(products)
  const handleOpenAdd = () => {
    setActiveProduct(undefined);
    setFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setActiveProduct(product);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setActiveProduct(undefined);
  };

  const handleSaveProduct = async (
    data: CreateProductInput | UpdateProductInput,
  ) => {
    if (activeProduct) {
      await updateProduct(activeProduct.id, data);
    } else {
      await addProduct(data);
    }

    handleCloseForm();
    await loadProducts();
  };

  const handleDeleteProduct = async (product: Product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`,
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteProduct(product.id);
      await loadProducts();
    } catch {
      setError(`Failed to delete "${product.name}". Please try again.`);
    }
  };
  const handleSaveMovement = async (movement: {
    productId: string;
    type: "in" | "out";
    amount: number;
    date: string;
    note: string;
  }) => {
    setError("");

    try {
      await addMovement(movement);

      setMovementFormOpen(false);
      setSelectedProduct(null);

      await loadProducts();
    } catch {
      setError("Failed to save movement. Please try again.");
    }
  };

  const columns = useMemo<Column<Product>[]>(
    () => [
      {
        key: "name",
        header: "Product",
        sortable: true,
        render: (product) => (
          <div className="flex items-center gap-3">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-10 w-10 rounded-lg border border-slate-200 object-cover"
              />
            ) : (
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-500">
                {product.name.charAt(0).toUpperCase()}
              </div>
            )}

            <span className="font-medium text-slate-800 dark:text-slate-100">
              {product.name}
            </span>
          </div>
        ),
      },
      {
        key: "quantity",
        header: "Quantity",
        sortable: true,
        align: "center",
        render: (product) => (
          <span className="font-semibold tabular-nums">{product.quantity}</span>
        ),
      },
      {
        key: "minimumQuantity",
        header: "Minimum stock",
        sortable: true,
        align: "center",
      },
      {
        key: "stockStatus",
        header: "Stock status",
        accessor: (product) =>
          product.quantity < product.minimumQuantity ? "Low stock" : "In stock",
        sortable: true,
        align: "center",
        render: (product) => {
          const isLow = product.quantity < product.minimumQuantity;

          return (
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                isLow
                  ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              }`}
            >
              {isLow ? "Low stock" : "In stock"}
            </span>
          );
        },
      },
      {
        key: "createdAt",
        header: "Created",
        sortable: true,
        sortAccessor: (product) => new Date(product.createdAt),
        render: (product) => new Date(product.createdAt).toLocaleDateString(),
      },
    ],
    [],
  );

  const rowActions = useMemo<RowAction<Product>[]>(
    () => [
      {
        label: "Add Movement",
        className:
          "text-indigo-600 hover:bg-indigo-100 dark:text-indigo-400 border-b border-indigo-500",
        onClick: (product) => {
          setSelectedProduct(product);
          setMovementFormOpen(true);
        },
      },
      {
        label: "Edit",
        className:
          "text-green-600 hover:bg-green-100 dark:text-green-400 border-b border-green-500",
        onClick: handleOpenEdit,
      },
      {
        label: "Delete",
        className:
          "text-red-600 hover:bg-red-100 dark:text-red-400 border-b border-red-500",
        onClick: (product) => void handleDeleteProduct(product),
      },
    ],
    [],
  );

  return (
    <section className="w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your inventory and monitor stock levels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void loadProducts()}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Refresh
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            + Add product
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void loadProducts()}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      <DataTable<Product>
        title="All products"
        subtitle={`${products.length} active products`}
        columns={columns}
        data={products}
        rowKey="id"
        loading={loading}
        emptyMessage="No active products found."
        searchPlaceholder="Search products"
        searchable
        pagination
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
        rowActions={rowActions}
      />

      {formOpen && (
        <ProductForm
          product={activeProduct}
          onSubmit={handleSaveProduct}
          onCancel={handleCloseForm}
        />
      )}

      {movementFormOpen && selectedProduct && (
        <MoveForm
          product={selectedProduct}
          onClose={() => {
            setMovementFormOpen(false);
            setSelectedProduct(null);
          }}
          onSubmit={handleSaveMovement}
        />
      )}
    </section>
  );
}
