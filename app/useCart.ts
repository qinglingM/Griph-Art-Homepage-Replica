"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, type Product } from "./products";

export type CartLine = Product & { qty: number };

const STORAGE_KEY = "plyform:cart";
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let listeners: Array<() => void> = [];
let loaded = false;

function readStoredCart(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    const valid = parsed.filter(
      (line): line is CartLine =>
        typeof line === "object" && line !== null && "slug" in line && "qty" in line,
    );
    return valid.length ? valid : EMPTY;
  } catch {
    return EMPTY;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function commit(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable (private mode) - cart simply won't persist
  }
  emit();
}

function subscribe(listener: () => void) {
  if (!loaded) {
    loaded = true;
    lines = readStoredCart();
  }
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((entry) => entry !== listener);
  };
}

const getSnapshot = () => lines;
const getServerSnapshot = () => EMPTY;

export function useCart() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const add = useCallback((product: Product) => {
    const existing = lines.find((line) => line.slug === product.slug);
    commit(
      existing
        ? lines.map((line) => (line.slug === product.slug ? { ...line, qty: line.qty + 1 } : line))
        : [...lines, { ...product, qty: 1 }],
    );
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    commit(
      qty <= 0
        ? lines.filter((line) => line.slug !== slug)
        : lines.map((line) => (line.slug === slug ? { ...line, qty } : line)),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    commit(lines.filter((line) => line.slug !== slug));
  }, []);

  const clear = useCallback(() => commit(EMPTY), []);

  const totals = useMemo(() => {
    const count = current.reduce((sum, line) => sum + line.qty, 0);
    const subtotal = current.reduce((sum, line) => sum + line.price * line.qty, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    return { count, subtotal, shipping, total: subtotal + shipping };
  }, [current]);

  return { lines: current, add, setQty, remove, clear, ...totals };
}
