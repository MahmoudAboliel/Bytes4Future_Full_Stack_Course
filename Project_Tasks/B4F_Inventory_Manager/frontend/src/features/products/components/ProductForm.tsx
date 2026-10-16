import { useEffect, useState, type FormEvent } from "react";
import type { Product } from "../../../lib/types";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: {
    name: string;
    minimumQuantity: number;
    imageUrl?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({
  product,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? "");
  const [minimumQuantity, setMinimumQuantity] = useState(
    String(product?.minimumQuantity ?? 0),
  );
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(product?.name ?? "");
    setMinimumQuantity(String(product?.minimumQuantity ?? 0));
    setImageUrl(product?.imageUrl ?? "");
    setError("");
  }, [product]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const minimum = Number(minimumQuantity);

    if (!trimmedName) {
      setError("Product name is required.");
      return;
    }

    if (
      minimumQuantity.trim() === "" ||
      !Number.isInteger(minimum) ||
      minimum < 0
    ) {
      setError("Minimum stock must be a non-negative whole number.");
      return;
    }

    setSaving(true);

    try {
      await onSubmit({
        name: trimmedName,
        minimumQuantity: minimum,
        imageUrl: imageUrl.trim(),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save the product.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-5 rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900"
      >
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {product ? "Edit product" : "Add a product"}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {product
              ? "Update the product details below."
              : "New products start with zero stock."}
          </p>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="product-name"
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Product name
          </label>
          <input
            id="product-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={120}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            placeholder="Enter product name"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="minimum-quantity"
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Minimum stock
          </label>
          <input
            id="minimum-quantity"
            type="number"
            min="0"
            step="1"
            value={minimumQuantity}
            onChange={(event) => setMinimumQuantity(event.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="image-url"
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Image URL{" "}
            <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            id="image-url"
            type="url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            placeholder="https://example.com/product.jpg"
          />
        </div>

        {product && (
          <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Current quantity: <strong>{product.quantity}</strong>. Change stock
            using the Stock In / Stock Out actions.
          </div>
        )}

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : product ? "Save changes" : "Add product"}
          </button>
        </div>
      </form>
    </div>
  );
}
