/* ============================================================
   SOLAR SYSTEM - orbit build and per-frame positioning

   PERF NOTE: positionPlanets() and tick() run up to 60x/sec, so this
   module keeps a cached planetState array (built once in buildSystem)
   instead of re-querying the DOM and re-parsing dataset strings every
   single animation frame. Visual output is identical to a live query;
   only the bookkeeping changed.
============================================================ */
let planetState = [];

/** Build orbit rings, sun, and all planet DOM nodes from PLANETS config. */
function buildSystem(){
  const previous=new Map(planetState.map(s=>[s.id,s]));
  PLANETS.forEach(p=>{
    const old=previous.get(p.id);
    if(old&&old.planetEl.style.visibility!=='hidden')p.texturePhase=getOrbitTexturePhase(p,old.planetEl.querySelector('.texture-track'));
  });
  solar.innerHTML='';
  const rect=solar.getBoundingClientRect();
  const R=rect.width/2;
  PLANETS.forEach(p=>{
    const ring=document.createElement('div'); ring.className='orbit-ring';
    const d=p.orbit*2*R; ring.style.width=d+'px'; ring.style.height=(d*.57)+'px'; solar.appendChild(ring);
  });
  const sun=document.createElement('div'); sun.className='sun'; sun.id='sunEl'; sun.title='Return home'; solar.appendChild(sun);

  planetState=[];
  PLANETS.forEach(p=>{
    const anchor=document.createElement('div');
    anchor.className='planet-anchor'; anchor.id='anchor-'+p.id;
    anchor.dataset.orbit=p.orbit; anchor.dataset.speed=p.speed; anchor.dataset.angle=p.start;

    const el=document.createElement('div'); el.className='planet planet-'+p.id; el.id='planet-'+p.id; el.classList.toggle('reverse-spin',(p.spinDir||1)<0); el.tabIndex=0; el.setAttribute('role','button'); el.setAttribute('aria-label',`Open ${p.data.title}`);
    const minPx=innerWidth<=820?22:28; const px=Math.max(minPx,p.size*2*R); el.style.width=px+'px'; el.style.height=px+'px';
    const glow=document.createElement('div'); glow.className='glow';

    if(p.hasRing){
      ['ring-back','ring-front'].forEach(cls=>{const ring=document.createElement('div');ring.className=cls;ring.style.width=(px*2.70)+'px';ring.style.height=(px*.78)+'px';el.appendChild(ring)});
    }
    const core=document.createElement('div'); core.className='core core-'+p.id;
    const textureTrack=document.createElement('div'); textureTrack.className='texture-track'; textureTrack.style.setProperty('--rotation',p.rotation||'38s'); const texturePhase=Number.isFinite(p.texturePhase)?p.texturePhase:-Math.min(20,parseFloat(p.textureOffset)||0); p.texturePhase=texturePhase; textureTrack.style.setProperty('--texture-start',`${texturePhase}%`);
    for(let copy=0;copy<3;copy++){
      const img=document.createElement('img'); img.src=p.texture; img.alt=''; img.decoding='async'; img.draggable=false; img.setAttribute('aria-hidden','true');
      // Give the two nearest, most-likely-to-be-opened-first planets fetch
      // priority over the outer ones; pure network scheduling hint, no
      // visual/behavioural change.
      img.fetchPriority=(p.id==='venus'||p.id==='earth')?'high':'auto';
      textureTrack.appendChild(img);
    }
    core.appendChild(textureTrack);
    if(p.clouds||p.id==='venus'){const clouds=document.createElement('div');clouds.className='clouds';core.appendChild(clouds)}
    const atmosphere=document.createElement('div');atmosphere.className='atmosphere';
    el.style.setProperty('--planet-glow',p.glow);
    el.style.setProperty('--surface-filter',p.activeFilter||'none');
    el.appendChild(glow); el.appendChild(core); el.appendChild(atmosphere);

    if(p.hasMoon){
      const moon=document.createElement('div'); moon.className='moon'; const ms=Math.max(4,px*(p.id==='jupiter'?.11:.17));
      moon.style.width=ms+'px';moon.style.height=ms+'px';moon.style.left=(px*.75)+'px';moon.style.top=(-px*.20)+'px';moon.style.zIndex='5';el.appendChild(moon);
    }
    const label=document.createElement('div');label.className='label';label.textContent=p.data.title;el.appendChild(label);
    
    let touchStartTime=0, touchStartX=0, touchStartY=0;
    const activate=e=>{
      if(e){e.preventDefault();e.stopPropagation()}
      if(typeof isFocusTransitioning!=='undefined'&&isFocusTransitioning)return;
      scrollToSection(p.id);
    };
    el.addEventListener('touchstart',e=>{
      touchStartTime=performance.now();
      touchStartX=e.touches[0].clientX;
      touchStartY=e.touches[0].clientY;
    },{passive:true});
    el.addEventListener('touchend',e=>{
      const dt=performance.now()-touchStartTime;
      const dist=e.changedTouches[0]?Math.hypot(e.changedTouches[0].clientX-touchStartX,e.changedTouches[0].clientY-touchStartY):0;
      if(dt<300&&dist<10){activate(e)}
    });
    el.addEventListener('click',activate);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')activate(e)});
    el.addEventListener('mouseenter',()=>cursorRing?.classList.add('hover'));el.addEventListener('mouseleave',()=>cursorRing?.classList.remove('hover'));
    anchor.appendChild(el);solar.appendChild(anchor);

    const old=previous.get(p.id);
    if(old){
      el.style.visibility=old.planetEl.style.visibility;
      anchor.classList.toggle('active-anchor',old.anchor.classList.contains('active-anchor'));
    }
    planetState.push({id:p.id,anchor,planetEl:el,orbit:p.orbit,speed:p.speed,angle:old?old.angle:p.start});
  });
  const handleSunTap=e=>{if(e){e.preventDefault();e.stopPropagation()}scrollToSection('home')};
  sun.addEventListener('touchend',handleSunTap);
  sun.addEventListener('click',handleSunTap);
  positionPlanets();
}

/** Place each anchor on its elliptical orbit and update sun-facing lighting. */
function positionPlanets(){
  const R=solar.getBoundingClientRect().width/2;
  const focused=document.body.classList.contains('zoomed');
  for(const s of planetState){
    const {anchor,planetEl,orbit,angle}=s;
    const x=Math.cos(angle)*orbit*R, y=Math.sin(angle)*orbit*R*.57;
    const isActive=anchor.classList.contains('active-anchor');
    const drift=(focused&&!isActive)?1.30:1;
    const scale=(focused&&!isActive)?.18:1;
    anchor.style.transform=`translate(${x*drift}px,${y*drift}px) scale(${scale})`;
    // Depth-sort: this view is a 2D projection of an orbit, so the planet
    // currently further "down" its ellipse (larger y) should render in front
    // of ones further "up" it, instead of always stacking in DOM order.
    anchor.style.zIndex=isActive?500:Math.round(200+y);

    // Dynamic solar lighting: the sheen always faces the Sun at the centre.
    if(planetEl){
      const mag=Math.hypot(x,y)||1,dx=-x/mag,dy=-y/mag;
      const lightX=50+dx*35,lightY=50+dy*35,darkX=50-dx*40,darkY=50-dy*40;
      planetEl.style.setProperty('--light-x',lightX.toFixed(2)+'%');
      planetEl.style.setProperty('--light-y',lightY.toFixed(2)+'%');
      planetEl.style.setProperty('--dark-x',darkX.toFixed(2)+'%');
      planetEl.style.setProperty('--dark-y',darkY.toFixed(2)+'%');
      planetEl.style.setProperty('--sun-alpha',Math.max(.50,Math.min(.86,.92-orbit*.34)).toFixed(2));
      anchor.dataset.lightX=lightX.toFixed(2)+'%';anchor.dataset.lightY=lightY.toFixed(2)+'%';
      anchor.dataset.darkX=darkX.toFixed(2)+'%';anchor.dataset.darkY=darkY.toFixed(2)+'%';
    }
  }
}
buildSystem();window.addEventListener('resize',debounce(buildSystem,180));

const MOTION_FPS=60;
const MOTION_FRAME=1000/MOTION_FPS;
let paused=false,last=performance.now(),orbitLastFrame=0;
function tick(now){
  if(document.hidden){requestAnimationFrame(tick);return}
  if(now-orbitLastFrame<MOTION_FRAME*.82){requestAnimationFrame(tick);return}
  const dt=Math.min(.05,(now-last)/1000);last=now;orbitLastFrame=now;
  // Revolution pauses while a planet is focused. Axial rotation is handled by
  // compositor-friendly CSS transforms on the visible texture tracks.
  if(!paused){
    // Angle lives in planetState (a number), not on the DOM via dataset.
    // Nothing else reads anchor.dataset.angle after initial build, so
    // skipping that per-frame string write avoids needless conversions.
    for(const s of planetState){s.angle+=s.speed*dt}
    positionPlanets();
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
