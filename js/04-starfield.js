/* ============================================================
   ADAPTIVE STARFIELD + SHOOTING STARS - capped for battery/GPU

   Canvas backdrop with parallax stars and occasional meteors.
   Star count and DPR scale down when perf-lite is active.
============================================================ */
const canvas=document.getElementById('bg-canvas'),ctx=canvas.getContext('2d',{alpha:true});
let stars=[],meteors=[],W=innerWidth,H=innerHeight,DPR=1,nextMeteor=performance.now()+1400,mx=0,my=0,parX=0,parY=0,starPointerX=innerWidth/2,starPointerY=innerHeight/2,starPointerActive=false;
const STAR_FPS=60;
const STAR_FRAME=1000/STAR_FPS;
function resizeCanvas(){
  W=innerWidth;H=innerHeight;
  const lite=document.documentElement.classList.contains('perf-lite');
  DPR=Math.min(devicePixelRatio||1,lite?1:1.35);
  canvas.width=Math.max(1,Math.floor(W*DPR));canvas.height=Math.max(1,Math.floor(H*DPR));canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(DPR,0,0,DPR,0,0);
  const divisor=lite?14500:10500;
  const count=Math.max(70,Math.floor(W*H/divisor));
  stars=Array.from({length:count},()=>({x:Math.random()*W,y:Math.random()*H,r:.24+Math.random()*.98,phase:Math.random()*6.28,speed:.24+Math.random()*.72,depth:.12+Math.random()*.82,tint:Math.random()}));
}
window.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;mx=e.clientX/W-.5;my=e.clientY/H-.5;starPointerX=e.clientX;starPointerY=e.clientY;starPointerActive=true},{passive:true});
window.addEventListener('pointerleave',()=>{starPointerActive=false},{passive:true});window.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')starPointerActive=true},{passive:true});
resizeCanvas();window.addEventListener('resize',debounce(resizeCanvas,220));
function spawnMeteor(){
  const fromTop=Math.random()>.35,x=fromTop?W*(.22+Math.random()*.62):-60,y=fromTop?-24:H*(.08+Math.random()*.30),speed=500+Math.random()*220,angle=.40+Math.random()*.14;
  meteors.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,age:0,ttl:.68+Math.random()*.34,len:95+Math.random()*90});
}
let starLast=performance.now(),starLastFrame=0;
function drawStars(t){
  requestAnimationFrame(drawStars);
  if(document.hidden||t-starLastFrame<STAR_FRAME*.82)return;
  const dt=Math.min(.055,(t-starLast)/1000);starLast=t;starLastFrame=t;
  ctx.clearRect(0,0,W,H);parX+=(mx-parX)*.045;parY+=(my-parY)*.045;
  const radius=132,radius2=radius*radius;
  for(const s of stars){
    let tw=.30+(Math.sin(t*.001*s.speed+s.phase)+1)*.25;
    const baseX=s.x+parX*24*s.depth,baseY=s.y+parY*19*s.depth;
    let drawX=baseX,drawY=baseY,react=0;
    if(starPointerActive){
      const dx=baseX-starPointerX,dy=baseY-starPointerY,d2=dx*dx+dy*dy;
      if(d2<radius2){
        const dist=Math.sqrt(d2)||.001;react=1-dist/radius;const inv=1/dist,nx=dx*inv,ny=dy*inv;
        const repel=react*react*(6.2+4.0*s.depth),swirl=Math.sin(t*.0018+s.phase)*react*(1.0+1.2*s.depth);
        drawX+=nx*repel-ny*swirl;drawY+=ny*repel+nx*swirl;tw=Math.min(1,tw+react*.17);
      }
    }
    const blue=s.tint>.88;
    ctx.beginPath();ctx.arc(drawX,drawY,s.r*(1+react*.10),0,Math.PI*2);ctx.fillStyle=blue?`rgba(188,216,255,${tw})`:`rgba(245,247,255,${tw})`;ctx.fill();
  }
  if(t>nextMeteor&&meteors.length<1){spawnMeteor();nextMeteor=t+2900+Math.random()*4800}
  meteors=meteors.filter(m=>m.age<m.ttl);
  for(const m of meteors){
    m.age+=dt;m.x+=m.vx*dt;m.y+=m.vy*dt;const a=Math.sin(Math.min(1,m.age/m.ttl)*Math.PI),mag=Math.hypot(m.vx,m.vy),ux=m.vx/mag,uy=m.vy/mag,tx=m.x-ux*m.len,ty=m.y-uy*m.len;
    const g=ctx.createLinearGradient(tx,ty,m.x,m.y);g.addColorStop(0,'rgba(153,205,255,0)');g.addColorStop(.76,`rgba(188,225,255,${a*.18})`);g.addColorStop(1,`rgba(255,255,255,${a*.88})`);
    ctx.strokeStyle=g;ctx.lineWidth=1.15;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(m.x,m.y);ctx.stroke();ctx.fillStyle=`rgba(255,255,255,${a})`;ctx.beginPath();ctx.arc(m.x,m.y,1.35,0,Math.PI*2);ctx.fill();
  }
}
requestAnimationFrame(drawStars);
