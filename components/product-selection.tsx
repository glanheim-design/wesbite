"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { catalogueProducts } from "@/lib/products";

const STORAGE_KEY = "glanheim-product-shortlist-v2";
const LEGACY_STORAGE_KEY = "glanheim-product-shortlist-v1";
const LIMIT = 40;
const FIELD_LIMITS = { quantity: 60, measurements: 1200, notes: 1200 } as const;
export type EnquiryLineItem = {
  id: string;
  quantity: string;
  measurements: string;
  notes: string;
};
type ItemPatch = Partial<
  Pick<EnquiryLineItem, "quantity" | "measurements" | "notes">
>;
type Snapshot = { items: EnquiryLineItem[]; ready: boolean };
const EMPTY: Snapshot = { items: [], ready: false };
const validIds = new Set(catalogueProducts.map((product) => product.id));
let saved: Snapshot = EMPTY;
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function boundedText(value: unknown, maximum: number) {
  return typeof value === "string"
    ? value
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
        .slice(0, maximum)
    : "";
}
function normalise(value: unknown): EnquiryLineItem[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const result: EnquiryLineItem[] = [];
  for (const raw of value) {
    if (result.length >= LIMIT) break;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const item = raw as Record<string, unknown>;
    if (
      typeof item.id !== "string" ||
      !validIds.has(item.id) ||
      seen.has(item.id)
    )
      continue;
    seen.add(item.id);
    result.push({
      id: item.id,
      quantity: boundedText(item.quantity, FIELD_LIMITS.quantity),
      measurements: boundedText(item.measurements, FIELD_LIMITS.measurements),
      notes: boundedText(item.notes, FIELD_LIMITS.notes),
    });
  }
  return result;
}
function readSavedItems(): EnquiryLineItem[] {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    if (current !== null) {
      const parsed: unknown = JSON.parse(current);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
        return [];
      const value = parsed as Record<string, unknown>;
      return value.version === 2 ? normalise(value.items) : [];
    }
    const legacy: unknown = JSON.parse(
      localStorage.getItem(LEGACY_STORAGE_KEY) || "[]",
    );
    return normalise(Array.isArray(legacy) ? legacy.map((id) => ({ id })) : []);
  } catch {
    return [];
  }
}
function updateStore(items: EnquiryLineItem[], persist = true) {
  saved = { items: normalise(items), ready: true };
  if (persist) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 2, items: saved.items }),
      );
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // Browsers that block storage can still keep this session's enquiry in memory.
    }
  }
  listeners.forEach((notify) => notify());
}

type Selection = {
  ids: string[];
  items: EnquiryLineItem[];
  ready: boolean;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  remove: (id: string) => void;
  updateItem: (id: string, patch: ItemPatch) => void;
  clear: () => void;
  enquiryHref: string;
};
const SelectionContext = createContext<Selection | null>(null);

export function ProductSelectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => saved,
    () => EMPTY,
  );
  const [notice, setNotice] = useState("");
  useEffect(() => {
    // Restore before writing so a reload never replaces a saved draft with an empty one.
    updateStore(readSavedItems());
    function sync(event: StorageEvent) {
      if (event.key === STORAGE_KEY || event.key === null)
        updateStore(readSavedItems(), false);
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  function remove(id: string) {
    updateStore(saved.items.filter((item) => item.id !== id));
    setNotice("");
  }
  function toggle(id: string) {
    if (!validIds.has(id)) return;
    if (saved.items.some((item) => item.id === id)) {
      remove(id);
    } else if (saved.items.length >= LIMIT) {
      setNotice(
        "Your enquiry holds up to 40 selections. Continue with this package first, or remove a selection to add another.",
      );
    } else {
      updateStore([
        ...saved.items,
        { id, quantity: "", measurements: "", notes: "" },
      ]);
      setNotice("");
    }
  }
  function updateItem(id: string, patch: ItemPatch) {
    if (!saved.items.some((item) => item.id === id)) return;
    updateStore(
      saved.items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                patch.quantity === undefined
                  ? item.quantity
                  : boundedText(patch.quantity, FIELD_LIMITS.quantity),
              measurements:
                patch.measurements === undefined
                  ? item.measurements
                  : boundedText(patch.measurements, FIELD_LIMITS.measurements),
              notes:
                patch.notes === undefined
                  ? item.notes
                  : boundedText(patch.notes, FIELD_LIMITS.notes),
            }
          : item,
      ),
    );
  }
  function clear() {
    updateStore([]);
    setNotice("");
  }
  const ids = snapshot.items.map((item) => item.id);
  const enquiryHref = `/request-pricing?selection=${encodeURIComponent(ids.join(","))}&from=basket`;
  return (
    <SelectionContext.Provider
      value={{
        ids,
        items: snapshot.items,
        ready: snapshot.ready,
        toggle,
        has: (id) => ids.includes(id),
        remove,
        updateItem,
        clear,
        enquiryHref,
      }}
    >
      {children}
      {ids.length > 0 && (
        <aside className="ps-tray" aria-label="Your product enquiry shortlist">
          <div className="ps-bar">
            <span className="ps-count" role="status" aria-live="polite">
              {ids.length} {ids.length === 1 ? "selection" : "selections"} in
              your enquiry
            </span>
            <Link className="ps-review" href="/enquiry">
              View enquiry <span aria-hidden="true">↗</span>
            </Link>
            <Link className="ps-enquire" href={enquiryHref}>
              Continue enquiry <span aria-hidden="true">↗</span>
            </Link>
          </div>
          {notice && (
            <p className="ps-notice" role="alert">
              {notice}
            </p>
          )}
        </aside>
      )}
    </SelectionContext.Provider>
  );
}

export function useProductSelection() {
  const context = useContext(SelectionContext);
  if (!context)
    throw new Error("Product selections require ProductSelectionProvider");
  return context;
}

export function ProductSelectButton({
  productId,
  className = "ps-select",
}: {
  productId: string;
  className?: string;
}) {
  const selection = useProductSelection();
  const selected = selection.has(productId);
  const product = catalogueProducts.find((item) => item.id === productId);
  const label = product
    ? `${product.name}${product.code ? ` ${product.code}` : ""}`
    : "product";
  return (
    <button
      type="button"
      className={className}
      aria-pressed={selected}
      aria-label={`${selected ? "Remove" : "Add"} ${label} ${selected ? "from" : "to"} enquiry`}
      onClick={() => selection.toggle(productId)}
    >
      <span>{selected ? "Added to enquiry" : "Add to enquiry"}</span>
      <span aria-hidden="true">{selected ? "✓" : "+"}</span>
    </button>
  );
}
