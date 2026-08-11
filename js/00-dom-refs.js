/* ============================================================
   DOM REFS - shared element handles used across modules

   Loaded after utils and before data/render modules so every
   script can reference the same nodes without re-querying.
============================================================ */
const solar = document.getElementById('solarSystem');
const dotnav = document.getElementById('dotnav');
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
