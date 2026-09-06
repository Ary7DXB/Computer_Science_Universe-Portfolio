/* ============================================================
   PANEL / PLANET FOCUS

   Handles zoom transition: clones the clicked planet, animates it
   to a fixed target, and slides in the glass detail panel. Phase
   sync on close prevents texture jumps when the real planet reappears.
============================================================ */
const panel=document.getElementById('panel'),panelTitle=document.getElementById('panelTitle'),panelEyebrow=document.getElementById('panelEyebrow'),panelBody=document.getElementById('panelBody');
const closeBtn=document.getElementById('closeBtn'),clone=document.getElementById('zoomClone'),zoomTarget=document.getElementById('zoomTarget'),heroCopy=document.getElementById('heroCopy');
let activeId=null,isFocusTransitioning=false;
function setAccent(p){document.documentElement.style.setProperty('--section-accent',p.glow);document.documentElement.style.setProperty('--section-accent-2',p.data.accent2||p.glow)}
function resetAccent(){document.documentElement.style.setProperty('--section-accent','#7c8cff');document.documentElement.style.setProperty('--section-accent-2','#72ead9')}
function normalizeTexturePhase(value){
  let n=((value%50)+50)%50;
  if(n>0)n-=50;
  return Math.abs(n)<.0001?0:n;
}
function getFocusTexturePhase(p){
  if(!p)return 0;
  const start=Number.isFinite(p.texturePhase)?p.texturePhase:-Math.min(20,parseFloat(p.textureOffset)||0);
  const track=clone.querySelector('.focus-track');
  if(!track)return normalizeTexturePhase(start);
  const anim=track.getAnimations?track.getAnimations()[0]:null;
  if(!anim||!anim.effect)return normalizeTexturePhase(start);
  const timing=anim.effect.getComputedTiming();
  const progress=Number.isFinite(timing.progress)?timing.progress:0;
  const delta=(p.spinDir||1)<0?50:-50;
  return normalizeTexturePhase(start+delta*progress);
}
function syncFocusPhaseToPlanet(id){
  const p=PLANETS.find(x=>x.id===id);if(!p)return;
  const phase=getFocusTexturePhase(p);p.texturePhase=phase;
  const track=document.querySelector(`#planet-${id} .texture-track`);
  if(track)track.style.setProperty('--texture-start',`${phase}%`);
}
function cloneTransformForRect(rect,baseW){
  const scale=baseW?rect.width/baseW:1;
  return `translate3d(${rect.left}px,${rect.top}px,0) scale(${scale})`;
}
function restorePlanet(id){const e=id&&document.getElementById('planet-'+id);if(e)e.style.visibility='visible'}
function clearPlanetFocus(){
  document.querySelectorAll('.planet-anchor').forEach(a=>a.classList.remove('active-anchor'));
  positionPlanets();
}
function setFocusLightingFromTarget(){
  const sun=document.getElementById('sunEl');
  if(!sun)return;
  const sr=sun.getBoundingClientRect(),tr=zoomTarget.getBoundingClientRect();
  const sx=sr.left+sr.width/2,sy=sr.top+sr.height/2,tx=tr.left+tr.width/2,ty=tr.top+tr.height/2;
  const vx=sx-tx,vy=sy-ty,mag=Math.hypot(vx,vy)||1,nx=vx/mag,ny=vy/mag;
  clone.style.setProperty('--focus-light-x',(50+nx*36).toFixed(2)+'%');
  clone.style.setProperty('--focus-light-y',(50+ny*36).toFixed(2)+'%');
  clone.style.setProperty('--focus-dark-x',(50-nx*42).toFixed(2)+'%');
  clone.style.setProperty('--focus-dark-y',(50-ny*42).toFixed(2)+'%');
}
function buildFocusClone(p){
  clone.classList.toggle('earth-focus',p.id==='earth');
  clone.classList.toggle('reverse-spin',(p.spinDir||1)<0);
  const rings=p.hasRing?'<div class="focus-ring-back"></div>':'';
  const frontRing=p.hasRing?'<div class="focus-ring-front"></div>':'';
  const clouds=(p.clouds||p.id==='venus')?'<div class="focus-clouds"></div>':'';
  clone.innerHTML=`${rings}<div class="focus-glow"></div><div class="focus-sphere"><div class="focus-track"><img src="${p.texture}" alt="" draggable="false"><img src="${p.texture}" alt="" draggable="false"></div>${clouds}<div class="focus-grade"></div><div class="focus-light"></div><div class="focus-atmosphere"></div></div>${frontRing}`;
  if((p.spinDir||1)<0){
    const track=clone.querySelector('.focus-track'),texture=track.firstElementChild.cloneNode(true);
    track.appendChild(texture);
  }
  clone.style.setProperty('--focus-glow',p.glow);
  clone.style.setProperty('--focus-rotation',p.focusRotation||p.rotation||'24s');
  clone.style.setProperty('--focus-start',`${Number.isFinite(p.texturePhase)?p.texturePhase:-Math.min(20,parseFloat(p.textureOffset)||0)}%`);
  clone.style.setProperty('--focus-filter',p.activeFilter||'saturate(1.02) contrast(1.15) brightness(.96)');
  const anchor=document.getElementById('anchor-'+p.id);
  if(anchor){
    clone.style.setProperty('--focus-light-x',anchor.dataset.lightX||'28%');
    clone.style.setProperty('--focus-light-y',anchor.dataset.lightY||'24%');
    clone.style.setProperty('--focus-dark-x',anchor.dataset.darkX||'76%');
    clone.style.setProperty('--focus-dark-y',anchor.dataset.darkY||'74%');
  }
}
/** Open focus view: clone planet, animate to target, populate panel. */
function openPlanet(id){
  if(activeId===id){document.body.classList.add('zoomed');positionPlanets();return}
  if(isFocusTransitioning)return;
  isFocusTransitioning=true;document.body.style.pointerEvents='none';
  if(activeId){syncFocusPhaseToPlanet(activeId);restorePlanet(activeId)}
  document.querySelectorAll('.planet-anchor').forEach(a=>a.classList.remove('active-anchor'));
  const p=PLANETS.find(x=>x.id===id),el=document.getElementById('planet-'+id),anchor=document.getElementById('anchor-'+id);
  if(!p||!el||!anchor){isFocusTransitioning=false;document.body.style.pointerEvents='';return}
  activeId=id;paused=true;setAccent(p);panelEyebrow.textContent=p.data.eyebrow;panelTitle.textContent=p.data.title;panelBody.innerHTML=p.data.body;panelBody.scrollTop=0;
  anchor.classList.add('active-anchor');
  const rect=el.getBoundingClientRect(),tr=zoomTarget.getBoundingClientRect();
  buildFocusClone(p);
  clone.style.display='block';clone.style.width=tr.width+'px';clone.style.height=tr.height+'px';clone.style.transition='none';clone.style.transform=cloneTransformForRect(rect,tr.width);
  void clone.offsetWidth;
  el.style.visibility='hidden';document.body.classList.add('zoomed');positionPlanets();
  setFocusLightingFromTarget();
  clone.style.transition='';
  requestAnimationFrame(()=>{clone.style.transform=`translate3d(${tr.left}px,${tr.top}px,0) scale(1)`});
  setTimeout(()=>{isFocusTransitioning=false;document.body.style.pointerEvents=''},600);
}
let closeSwapToken=0;
/** Animate clone back to orbit, sync texture phase, restore revolution. */
function closePanel({showHero=false}={}){
  if(isFocusTransitioning)return;
  isFocusTransitioning=true;document.body.style.pointerEvents='none';
  const old=activeId,oldPlanet=old&&document.getElementById('planet-'+old);
  // Keep the solar-system revolution frozen until the zoomed planet has fully
  // landed. Otherwise the hidden orbital planet moves away from the clone's
  // destination during the return animation, which causes the stutter.
  paused=true;
  document.body.classList.remove('zoomed');activeId=null;clearPlanetFocus();
  const token=++closeSwapToken;
  function finishSwap(){
    if(token!==closeSwapToken)return; // a newer open/close cycle has already taken over
    // Copy the clone's exact axial-rotation phase to the real planet at the
    // handoff frame so the texture does not jump when visibility switches.
    syncFocusPhaseToPlanet(old);
    restorePlanet(old);
    clone.style.display='none';clone.innerHTML='';clone.style.transform='';clone.style.width='';clone.style.height='';clone.classList.remove('earth-focus','reverse-spin');
    last=performance.now();orbitLastFrame=last;paused=false;
    isFocusTransitioning=false;document.body.style.pointerEvents='';
  }
  if(oldPlanet&&clone.style.display!=='none'){
    const target=oldPlanet.getBoundingClientRect(),baseW=parseFloat(clone.style.width)||zoomTarget.getBoundingClientRect().width||1;
    clone.style.transition='';
    clone.style.transform=cloneTransformForRect(target,baseW);
    let landed=false;
    const onLanded=e=>{
      if(e&&(e.target!==clone||e.propertyName!=='transform'))return;
      if(landed)return;landed=true;
      clone.removeEventListener('transitionend',onLanded);
      finishSwap();
    };
    clone.addEventListener('transitionend',onLanded);
    // Safety net: if the transition never fires an end event (e.g. the clone
    // was already at its target, or a browser drops the event), swap anyway
    // shortly after the animation should have finished, so nothing gets stuck.
    setTimeout(onLanded,900);
  }else{
    finishSwap();
  }
  resetAccent();if(showHero)heroCopy.classList.remove('is-hidden')
}
closeBtn.addEventListener('click',(e)=>{e.preventDefault();e.stopPropagation();scrollToSection('home')});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.body.classList.contains('mission-open'))scrollToSection('home')});
document.getElementById('brandHome').addEventListener('click',(e)=>{e.preventDefault();e.stopPropagation();scrollToSection('home')});
