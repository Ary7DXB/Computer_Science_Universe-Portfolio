/* ============================================================
   SCROLL JOURNEY / COMPACT NAV / FOOTER

   Invisible scroll steps drive section changes. User scroll or nav
   clicks update the active planet, panel, hero visibility, and footer.
============================================================ */
const SECTION_ORDER=['home','venus','earth','mars','jupiter','saturn','footer'];
const labels={home:'Home',venus:'Education',earth:'Projects',mars:'Experience',jupiter:'Skills',saturn:'Contact',footer:'Finish'};
const floatingNav=document.getElementById('floatingNav');let scrollSection='home',scrollRAF=0,navLock=null,navLockUntil=0;
function buildFloatingNav(){floatingNav.innerHTML=SECTION_ORDER.map(id=>`<button data-section="${id}" aria-label="${labels[id]}"><span class="nav-dot"></span><span class="label">${labels[id]}</span></button>`).join('');floatingNav.querySelectorAll('button').forEach(b=>b.addEventListener('click',(e)=>{e.preventDefault();scrollToSection(b.dataset.section)}));updateFloatingNav('home')}
/** Scroll to a section: update nav state, hero/panel visibility, and planet focus. */
function scrollToSection(id){
  const step=document.querySelector(`.scroll-step[data-section="${id}"]`);if(!step)return;
  // Direct selections react immediately: freeze revolution and focus this planet first, then move the document.
  navLock=id;navLockUntil=performance.now()+2200;scrollSection=id;updateFloatingNav(id);
  document.body.classList.toggle('footer-visible',id==='footer');
  if(id==='home'){closePanel();heroCopy.classList.remove('is-hidden')}
  else if(id==='footer'){closePanel();heroCopy.classList.add('is-hidden')}
  else{heroCopy.classList.add('is-hidden');openPlanet(id)}
  const isTouch='ontouchstart'in window||navigator.maxTouchPoints>0;
  window.scrollTo({top:step.offsetTop,behavior:isTouch?'auto':'smooth'});
}
function updateFloatingNav(id){floatingNav.dataset.current=labels[id]||'';floatingNav.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.section===id))}
function applyScrollSection(id){
  if(scrollSection===id)return;scrollSection=id;updateFloatingNav(id);document.body.classList.toggle('footer-visible',id==='footer');
  if(id==='home'){closePanel();heroCopy.classList.remove('is-hidden')}
  else if(id==='footer'){closePanel();heroCopy.classList.add('is-hidden')}
  else{heroCopy.classList.add('is-hidden');openPlanet(id)}
}
function onScrollJourney(){
  scrollRAF=0;
  if(navLock){
    const target=document.querySelector(`.scroll-step[data-section="${navLock}"]`);
    const currentY=Math.max(0,window.scrollY||window.pageYOffset);
    const arrived=target&&Math.abs(currentY-target.offsetTop)<Math.max(60,innerHeight*.10);
    if(arrived||performance.now()>navLockUntil){navLock=null}
    else{return}
  }
  const probe=(Math.max(0,window.scrollY||window.pageYOffset))+innerHeight*.46;let best='home',dist=Infinity;
  document.querySelectorAll('.scroll-step').forEach(step=>{const d=Math.abs(step.offsetTop-probe);if(d<dist){dist=d;best=step.dataset.section}});
  applyScrollSection(best);
}
window.addEventListener('scroll',()=>{if(!scrollRAF)scrollRAF=requestAnimationFrame(onScrollJourney)},{passive:true});window.addEventListener('resize',debounce(onScrollJourney,100));buildFloatingNav();requestAnimationFrame(onScrollJourney);
document.getElementById('exploreBtn').addEventListener('click',()=>scrollToSection('venus'));document.getElementById('returnOrbit').addEventListener('click',()=>scrollToSection('home'));
