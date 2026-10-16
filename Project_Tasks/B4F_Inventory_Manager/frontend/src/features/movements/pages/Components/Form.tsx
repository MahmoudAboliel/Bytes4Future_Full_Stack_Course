import { useState } from "react";
import type { Product } from "../../../../lib/types";

interface FormProps {
  products: Product[];
  onClose: () => void;
  onSubmit: (movement: {
    productId: string;
    type: "in" | "out";
    amount: number;
    date: string;
    note: string;
  }) => void;
}

export default function Form({ products, onClose, onSubmit }: FormProps) {
  const [productId, setProductId] = useState("");
  const [type, setType] = useState<"in" | "out">("in");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");

  const inputClassName =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-950";

  const labelClassName =
    "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200";

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!productId || !amount || Number(amount) <= 0 || !date) {
      return;
    }

    const selectedProduct = products.find(
      (product) => product.id === productId,
    );
    console.log({productId, amount, date})
    console.log(selectedProduct)
    if (
      type === "out" &&
      selectedProduct &&
      Number(amount) > selectedProduct.quantity
    ) {
      alert(
        `Insufficient stock! Available quantity: ${selectedProduct.quantity}`,
      );
      return;
    }

    onSubmit({
      productId,
      type,
      amount: Number(amount),
      date,
      note: note.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg- p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg  max-h-[90dvh] overflow-y-auto no-scrollbar rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/40"
      >
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Add Movement
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Record a stock movement
          </p>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <label htmlFor="productId" className={labelClassName}>
              Product
            </label>
            <select
              id="productId"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
              className={inputClassName}
            >
              <option value="">Select a product</option>
              {products.map((product) => {
                console.log(product);
                return (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label htmlFor="movementType" className={labelClassName}>
              Movement Type
            </label>
            <select
              id="movementType"
              value={type}
              onChange={(e) => setType(e.target.value as "in" | "out")}
              className={inputClassName}
            >
              <option value="in">Stock In</option>
              <option value="out">Stock Out</option>
            </select>
          </div>

          <div>
            <label htmlFor="amount" className={labelClassName}>
              Amount
            </label>
            <input
              id="amount"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter quantity"
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="movementDate" className={labelClassName}>
              Date
            </label>
            <input
              id="movementDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="note" className={labelClassName}>
              Note <span className="text-slate-400">(Optional)</span>
            </label>

            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional)"
              rows={3}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            Add Movement
          </button>
        </div>
      </form>
    </div>
  );
}
