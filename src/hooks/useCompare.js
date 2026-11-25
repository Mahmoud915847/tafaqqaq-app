import { useSyncExternalStore } from 'react';

// Shared "compare offices" selection (G7).
// Saved in localStorage so the Companies page, the navbar badge and the compare page
// all see the same list, also after a refresh. Only office ids (GUIDs) are stored.

const KEY = 'tafaqqad_compare';
const EVENT = 'tafaqqad-compare-change';
export const MAX_COMPARE = 4;   // the backend compares 2 to 4 offices
export const MIN_COMPARE = 2;

const EMPTY = [];
let cachedRaw = null;
let cachedIds = EMPTY;

function read() {
  let raw;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cachedRaw) return cachedIds;          // same text -> same array (no extra renders)
  cachedRaw = raw;
  try {
    const parsed = JSON.parse(raw);
    cachedIds = Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string').slice(0, MAX_COMPARE) : EMPTY;
  } catch {
    cachedIds = EMPTY;
  }
  return cachedIds;
}

function write(ids) {
  try {
    if (ids.length === 0) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, JSON.stringify(ids));
  } catch { /* storage full or blocked: ignore */ }
  window.dispatchEvent(new Event(EVENT));            // tell the other components in this tab
}

function subscribe(callback) {
  window.addEventListener(EVENT, callback);
  window.addEventListener('storage', callback);      // other tabs
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

// ---------- actions (usable outside components too) ----------

// Returns false when the list is already full
export function addToCompare(id) {
  const ids = read();
  if (ids.includes(id)) return true;
  if (ids.length >= MAX_COMPARE) return false;
  write([...ids, id]);
  return true;
}

export function removeFromCompare(id) {
  write(read().filter((x) => x !== id));
}

// Used by the compare page to drop offices that are no longer available (missingIds)
export function removeManyFromCompare(idsToRemove) {
  if (!idsToRemove?.length) return;
  write(read().filter((x) => !idsToRemove.includes(x)));
}

export function clearCompare() {
  write([]);
}

// ---------- hook ----------

export function useCompare() {
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY);
  return {
    ids,
    count: ids.length,
    isFull: ids.length >= MAX_COMPARE,
    has: (id) => ids.includes(id),
    add: addToCompare,
    remove: removeFromCompare,
    toggle: (id) => (ids.includes(id) ? (removeFromCompare(id), true) : addToCompare(id)),
    clear: clearCompare,
  };
}