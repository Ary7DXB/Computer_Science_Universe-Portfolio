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

/** Texture phases repeat every 50% of the four-sphere-wide track. */
function normalizeTexturePhase(value){
  let n=((value%50)+50)%50;
  if(n>0)n-=50;
  return Math.abs(n)<.0001?0:n;
}
function getOrbitTexturePhase(p,track){
  const start=Number.isFinite(p.texturePhase)?p.texturePhase:-Math.min(20,parseFloat(p.textureOffset)||0);
  const anim=track&&track.getAnimations?track.getAnimations()[0]:null;
  const progress=anim&&anim.effect?anim.effect.getComputedTiming().progress:0;
  return normalizeTexturePhase(start+((p.spinDir||1)<0?50:-50)*(Number.isFinite(progress)?progress:0));
}
function setOrbitTexturePhase(p,track,phase){
  p.texturePhase=normalizeTexturePhase(phase);
  if(!track)return;
  track.style.setProperty('--texture-start',`${p.texturePhase}%`);
  // Restart the timeline at the handed-off phase, not its old elapsed time.
  if(track.getAnimations)track.getAnimations().forEach(anim=>{anim.currentTime=0});
}
