"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  catalogueProducts,
  productCollections,
  productHref,
} from "@/lib/products";

const STORAGE_KEY = "glanheim-product-shortlist-v1";
const LIMIT = 40;
const EMPTY: string[] = [];
const validIds = new Set(catalogueProducts.map((product) => product.id));
let savedIds: string[] = EMPTY;
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
function normalise(value: unknown): string[] {
  return Array.isArray(value)
    ? [
        ...new Set(
          value.filter(
            (id): id is string => typeof id === "string" && validIds.has(id),
          ),
        ),
      ].slice(0, LIMIT)
    : [];
}
function readSavedIds() {
  try {
    return normalise(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  } catch {
    return [];
  }
}
function updateStore(ids: string[], persist = true) {
  savedIds = normalise(ids);
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
    } catch {
      // A private browser can still keep this session's selections in memory.
    }
  }
  listeners.forEach((notify) => notify());
}

type Selection = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
};
const SelectionContext = createContext<Selection | null>(null);

export function ProductSelectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const ids = useSyncExternalStore(
    subscribe,
    () => savedIds,
    () => EMPTY,
  );
  const [notice, setNotice] = useState("");
  const [open, setOpen] = useState(false);
  const reviewButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    updateStore(readSavedIds(), false);
    function sync(event: StorageEvent) {
      if (event.key === STORAGE_KEY || event.key === null) {
        updateStore(readSavedIds(), false);
      }
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (!open) return;
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        reviewButton.current?.focus();
      }
    }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);

  function toggle(id: string) {
    if (!validIds.has(id)) return;
    if (savedIds.includes(id)) {
      updateStore(savedIds.filter((selected) => selected !== id));
      setNotice("");
    } else if (savedIds.length >= LIMIT) {
      setNotice(
        "Your enquiry holds up to 40 selections. Send this package first, or remove a selection to add another.",
      );
      setOpen(true);
    } else {
      updateStore([...savedIds, id]);
      setNotice("");
    }
  }
  function clear() {
    updateStore([]);
    setOpen(false);
    setNotice("");
  }
  const selections = ids
    .map((id) => catalogueProducts.find((product) => product.id === id))
    .filter((product) => product !== undefined);
  const enquiryHref = `/request-pricing?selection=${encodeURIComponent(ids.join(","))}`;

  return (
    <SelectionContext.Provider
      value={{ ids, toggle, has: (id) => ids.includes(id), clear }}
    >
      {children}
      {ids.length > 0 && (
        <aside
          className={`ps-tray${open ? " ps-open" : ""}`}
          aria-label="Your product enquiry shortlist"
        >
          <div className="ps-bar">
            <span className="ps-count" role="status" aria-live="polite">
              {ids.length} {ids.length === 1 ? "selection" : "selections"} in
              your package
            </span>
            <button
              ref={reviewButton}
              className="ps-review"
              type="button"
              aria-expanded={open}
              aria-controls="product-shortlist-review"
              onClick={() => setOpen(!open)}
            >
              {open ? "Close selection list" : "Review selections"}
              <span aria-hidden="true">{open ? " −" : " +"}</span>
            </button>
            <Link
              className="ps-enquire"
              href={enquiryHref}
              onClick={() => setOpen(false)}
            >
              Enquire about selections <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div
            id="product-shortlist-review"
            className="ps-panel"
            hidden={!open}
          >
            <div className="ps-panel-heading">
              <h2>Your project selections</h2>
              <button className="ps-clear" type="button" onClick={clear}>
                Clear all
              </button>
            </div>
            {notice && (
              <p className="ps-notice" role="alert">
                {notice}
              </p>
            )}
            <ul className="ps-list">
              {selections.map((product) => (
                <li key={product.id}>
                  <div>
                    <Link
                      href={productHref(product)}
                      onClick={() => setOpen(false)}
                    >
                      {product.name}
                    </Link>
                    <span>
                      {
                        productCollections.find(
                          (collection) => collection.id === product.collection,
                        )?.name
                      }
                      {product.code ? ` · ${product.code}` : ""}
                      {product.variant ? ` · ${product.variant}` : ""}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggle(product.id)}
                    aria-label={`Remove ${product.name}${product.code ? ` ${product.code}` : ""} from enquiry`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <p className="ps-help">
              Your references carry into the project enquiry. Final
              specifications and supply scope are confirmed with your brief.
            </p>
          </div>
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
