/* ============================================================
   STAR HEADLINE - sampled typography, bounded cursor springs

   The original heading remains the accessible/layout fallback. Rasterize
   only on font/size changes; animate only while particles are disturbed.
============================================================ */
(()=>{
  const heading=document.querySelector('.hero-copy h1');if(!heading)return;
  const hero=heading.closest('.hero-copy'),surface=document.createElement('canvas');
  const ctx=surface.getContext('2d');if(!ctx)return;
  surface.className='heading-stars';surface.setAttribute('aria-hidden','true');heading.appendChild(surface);
  const reduced=matchMedia('(prefers-reduced-motion:reduce)'),fine=matchMedia('(pointer:fine)');
  const pad=48;
  let points=[],batches=[],raf=0,buildRAF=0,last=0,width=0,height=0,pointer=null;
  const glow=document.createElement('canvas');glow.width=glow.height=24;
  const gc=glow.getContext('2d');
  if(gc){const g=gc.createRadialGradient(12,12,0,12,12,12);g.addColorStop(0,'rgba(240,244,255,.65)');g.addColorStop(.3,'rgba(205,216,255,.16)');g.addColorStop(1,'rgba(205,216,255,0)');gc.fillStyle=g;gc.fillRect(0,0,24,24)}
  const visible=()=>!document.hidden&&!hero.classList.contains('is-hidden')&&!document.body.classList.contains('intro-active')&&!document.body.classList.contains('mission-open');
  const interactive=()=>fine.matches&&!reduced.matches&&innerWidth>820;
  function draw(){
    ctx.clearRect(0,0,width+pad*2,height+pad*2);
    for(const batch of batches){
      ctx.fillStyle=batch.color;ctx.beginPath();
      for(const p of batch.points){ctx.moveTo(p.x+p.r,p.y);ctx.arc(p.x,p.y,p.r,0,Math.PI*2)}
      ctx.fill();
    }
    if(gc){
      ctx.globalAlpha=.85;
      for(const p of points){if(p.spark)ctx.drawImage(glow,p.x-7,p.y-7,14,14)}
      ctx.globalAlpha=1;
    }
  }

  function reset(){
    if(raf)cancelAnimationFrame(raf);raf=0;pointer=null;
    for(const p of points){p.x=p.hx;p.y=p.hy;p.vx=p.vy=0}
    draw();
  }
  function animate(now){
    raf=0;if(!visible()||!interactive()){reset();return}
    const step=Math.min(.25,Math.max(.001,(now-last)/1000)),decay=Math.exp(-13*step);last=now;
    let moving=false;
    for(const p of points){
      let tx=p.hx,ty=p.hy;
      if(pointer){
        const dx=p.hx-pointer.x,dy=p.hy-pointer.y,d=Math.hypot(dx,dy);
        if(d<90){
          const a=d>.01?Math.atan2(dy,dx):p.seed;
          const force=(1-d/90)**2;
          tx+=Math.cos(a)*force*34-Math.sin(a)*force*9;
          ty+=Math.sin(a)*force*34+Math.cos(a)*force*9;
        }
      }
      // Closed-form damped springs keep settling time stable on slow frames.
      const dx=p.x-tx,dy=p.y-ty,sx=(p.vx+13*dx)*step,sy=(p.vy+13*dy)*step;
      p.x=tx+(dx+sx)*decay;p.y=ty+(dy+sy)*decay;
      p.vx=(p.vx-13*sx)*decay;p.vy=(p.vy-13*sy)*decay;
      if(Math.abs(tx-p.x)+Math.abs(ty-p.y)+Math.abs(p.vx)+Math.abs(p.vy)>.025)moving=true;
      else{p.x=tx;p.y=ty;p.vx=p.vy=0}
    }
    draw();if(moving)raf=requestAnimationFrame(animate);
  }
  function wake(){if(!raf&&points.length&&visible()&&interactive()){last=performance.now();raf=requestAnimationFrame(animate)}}
  function build(){
    buildRAF=0;reset();heading.classList.remove('star-heading-ready');
    try{
      const box=heading.getBoundingClientRect();width=box.width;height=box.height;
      if(!width||!height)return;
      const mask=document.createElement('canvas');mask.width=Math.ceil(width);mask.height=Math.ceil(height);
      const mc=mask.getContext('2d',{willReadFrequently:true});if(!mc)return;
      const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT),range=document.createRange();
      let node;
      while((node=walker.nextNode())){
        const parent=node.parentElement,style=getComputedStyle(parent),font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        mc.font=font;mc.textBaseline='alphabetic';
        let fill=style.color;
        const stops=[...style.backgroundImage.matchAll(/(rgba?\([^)]+\))\s+([\d.]+)%/g)];
        if(stops.length){
          const rect=parent.getBoundingClientRect(),angle=parseFloat(style.backgroundImage.match(/linear-gradient\(([\d.]+)deg/)?.[1]||90)*Math.PI/180;
          const dx=Math.sin(angle),dy=-Math.cos(angle),length=Math.abs(rect.width*dx)+Math.abs(rect.height*dy);
          const cx=rect.left-box.left+rect.width/2,cy=rect.top-box.top+rect.height/2;
          fill=mc.createLinearGradient(cx-dx*length/2,cy-dy*length/2,cx+dx*length/2,cy+dy*length/2);
          stops.forEach(s=>fill.addColorStop(Number(s[2])/100,s[1]));
        }
        mc.fillStyle=fill;
        for(let i=0;i<node.length;i++){
          if(!node.data[i].trim())continue;
          range.setStart(node,i);range.setEnd(node,i+1);const rect=range.getBoundingClientRect();
          const metrics=mc.measureText(node.data[i]),size=parseFloat(style.fontSize);
          const ascent=metrics.fontBoundingBoxAscent??size*.8,descent=metrics.fontBoundingBoxDescent??size*.2;
          mc.fillText(node.data[i],rect.left-box.left,rect.top-box.top+(rect.height-ascent-descent)/2+ascent);
        }
      }
      const pixels=mc.getImageData(0,0,mask.width,mask.height).data;
      let seed=93217;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
      const candidates=[],spacing=innerWidth<=820?1.95:2.2;
      for(let y=0;y<mask.height;y+=spacing){for(let x=0;x<mask.width;x+=spacing){
        const sx=Math.max(0,Math.min(mask.width-1,Math.floor(x+(random()-.5)*spacing))),sy=Math.max(0,Math.min(mask.height-1,Math.floor(y+(random()-.5)*spacing)));
        const i=(sy*mask.width+sx)*4;if(pixels[i+3]<100)continue;
        const spark=random()>.91,jitter=random()>.82?5.4:1.2;
        const hx=sx+pad+(random()-.5)*jitter,hy=sy+pad+(random()-.5)*jitter;
        candidates.push({hx,hy,x:hx,y:hy,vx:0,vy:0,r:spark?1.1+random()*.6:.35+random()*.65,spark,seed:random()*Math.PI*2,color:`rgba(${pixels[i]},${pixels[i+1]},${pixels[i+2]},${.72+Math.floor(random()*3)*.14})`});
      }}
      // Uniform shuffle prevents the particle cap from thinning only later lines.
      for(let i=candidates.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[candidates[i],candidates[j]]=[candidates[j],candidates[i]]}
      points=candidates.slice(0,innerWidth<=820?2200:3000);if(!points.length)return;
      // Group equal colours once, rather than issuing one fill per star.
      const palette=new Map();
      for(const p of points){if(!palette.has(p.color))palette.set(p.color,[]);palette.get(p.color).push(p)}
      batches=Array.from(palette,([color,points])=>({color,points}));
      const dpr=Math.min(devicePixelRatio||1,innerWidth<=820?1.5:2);
      surface.width=Math.ceil((width+pad*2)*dpr);surface.height=Math.ceil((height+pad*2)*dpr);
      Object.assign(surface.style,{left:`-${pad}px`,top:`-${pad}px`,width:`${width+pad*2}px`,height:`${height+pad*2}px`});
      ctx.setTransform(dpr,0,0,dpr,0,0);draw();heading.classList.add('star-heading-ready');
    }catch{points=[];batches=[];heading.classList.remove('star-heading-ready')}
  }
  function scheduleBuild(){if(!buildRAF)buildRAF=requestAnimationFrame(build)}
  window.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch'||!interactive()||!visible())return;
    const rect=heading.getBoundingClientRect(),x=e.clientX-rect.left+pad,y=e.clientY-rect.top+pad;
    const next=x>=0&&x<=width+pad*2&&y>=0&&y<=height+pad*2?{x,y}:null;
    if(!next&&!pointer)return;pointer=next;wake();
  },{passive:true});
  window.addEventListener('pointerleave',()=>{pointer=null;wake()},{passive:true});
  window.addEventListener('blur',reset);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)reset()});
  new MutationObserver(()=>{if(!visible())reset()}).observe(hero,{attributes:true,attributeFilter:['class']});
  new MutationObserver(()=>{if(!visible())reset()}).observe(document.body,{attributes:true,attributeFilter:['class']});
  reduced.addEventListener('change',reset);fine.addEventListener('change',reset);
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(scheduleBuild).observe(heading);
  window.addEventListener('resize',debounce(scheduleBuild,180));
  if(document.fonts){document.fonts.ready.then(scheduleBuild);document.fonts.addEventListener('loadingdone',scheduleBuild)}else scheduleBuild();
})();
