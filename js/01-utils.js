/* ============================================================
   UTILS - shared helpers
============================================================ */

/** Debounce: coalesce rapid calls (e.g. resize) into one delayed execution. */
function debounce(fn, ms) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}
