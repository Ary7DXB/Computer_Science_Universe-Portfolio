/* ============================================================
   CUSTOM CURSOR

   Pointer-fine devices only: dot, lagging ring, and particle trail.
   Disabled on touch/coarse pointers via matchMedia gate.
============================================================ */
if(matchMedia('(pointer:fine)').matches){
  document.body.classList.add('custom-cursor');
  let cx=innerWidth/2,cy=innerHeight/2,rx=cx,ry=cy,lastX=cx,lastY=cy,hasMoved=false,pointerSpeed=0,phase=0,hovering=false;
  const trail=Array.from({length:11},(_,i)=>{const el=document.createElement('span');el.className='cursor-trail-dot';document.body.appendChild(el);return{el,x:cx,y:cy,scale:1-i/18,seed:Math.random()*Math.PI*2}});
  addEventListener('mousemove',e=>{
    const dx=e.clientX-lastX,dy=e.clientY-lastY;
    pointerSpeed=Math.min(1.35,Math.max(pointerSpeed,Math.hypot(dx,dy)/24));
    lastX=e.clientX;lastY=e.clientY;cx=e.clientX;cy=e.clientY;hasMoved=true;
    cursorDot.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;
  },{passive:true});
  addEventListener('mouseleave',()=>{hasMoved=false;trail.forEach(t=>t.el.style.opacity='0')});
  addEventListener('mouseenter',()=>{hasMoved=true});
  const CURSOR_FPS=60;
  const CURSOR_FRAME=1000/CURSOR_FPS;
  let cursorLastFrame=0;
  (function follow(now=0){
    requestAnimationFrame(follow);
    if(document.hidden||now-cursorLastFrame<CURSOR_FRAME*.82)return;
    cursorLastFrame=now;
    pointerSpeed*=.91;phase+=.042+pointerSpeed*.08;
    rx+=(cx-rx)*.17;ry+=(cy-ry)*.17;
    const ringWobble=(hovering?2.8:1.0)*(0.3+Math.min(1,pointerSpeed));
    const ringX=Math.sin(phase*.78)*ringWobble,ringY=Math.cos(phase*.64)*ringWobble*.72;
    cursorRing.style.transform=`translate(${rx+ringX}px,${ry+ringY}px) translate(-50%,-50%)`;

    const vx=cx-rx,vy=cy-ry,vmag=Math.hypot(vx,vy)||1,nx=-vy/vmag,ny=vx/vmag;
    let leadX=cx,leadY=cy;
    trail.forEach((t,i)=>{
      const ease=Math.max(.14,.40-i*.013);
      t.x+=(leadX-t.x)*ease;t.y+=(leadY-t.y)*ease;leadX=t.x;leadY=t.y;
      const fade=1-i/(trail.length+1);
      const wave=Math.sin(phase*1.35-i*.58+t.seed)*(hovering?4.1:2.0)*(0.24+pointerSpeed*.76)*fade;
      const shimmer=.72+.28*Math.sin(now*.007+i*.73+t.seed);
      const px=t.x+nx*wave,py=t.y+ny*wave;
      const opacity=hasMoved?Math.max(0,(.48-i*.028)*(hovering?1.08:1)*shimmer):0;
      const pulseScale=t.scale*(.88+shimmer*.24)*(1+Math.min(.12,pointerSpeed*.08));
      t.el.style.opacity=opacity.toFixed(3);
      t.el.style.transform=`translate3d(${px}px,${py}px,0) translate(-50%,-50%) scale(${pulseScale})`;
    });
  })();
  document.addEventListener('mouseover',e=>{if(e.target.closest('a,button,.brand,.planet,.sun')){hovering=true;cursorRing.classList.add('hover')}});
  document.addEventListener('mouseout',e=>{if(e.target.closest('a,button,.brand,.planet,.sun')){hovering=false;cursorRing.classList.remove('hover')}})
}
