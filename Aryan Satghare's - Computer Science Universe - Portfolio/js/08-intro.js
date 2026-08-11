/* ============================================================
   INTRO / CRT BOOT SEQUENCE - video controls the full duration

   Startup overlay: syncs progress bar and boot lines to the intro
   video, with skip/fallback paths for autoplay and load errors.
============================================================ */
(function boot(){
  const intro=document.getElementById('intro');
  const bar=document.getElementById('bar');
  const pct=document.getElementById('barPct');
  const timeEl=document.getElementById('videoTime');
  const bootLine=document.getElementById('bootLine');
  const skip=document.getElementById('skipBtn');
  const playBtn=document.getElementById('introPlayBtn');
  const video=document.getElementById('startupVideo');
  document.body.classList.add('intro-active');

  const lines=[
    '> acquiring launch telemetry',
    '> synchronizing guidance computer',
    '> verifying orbital navigation',
    '> loading project constellation',
    '> calibrating interface systems',
    '> establishing uplink — Dubai, UAE',
    '> portfolio systems nominal',
    '> launch sequence complete'
  ];
  let finished=false,lastLine=-1;
  const fmt=s=>{if(!Number.isFinite(s))return '--:--';const m=Math.floor(s/60),sec=Math.floor(s%60);return String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0')};
  function renderProgress(){
    const dur=video.duration; const current=video.currentTime||0; const progress=Number.isFinite(dur)&&dur>0?Math.min(1,current/dur):0;
    bar.style.width=(progress*100).toFixed(2)+'%'; pct.textContent=String(Math.floor(progress*100)).padStart(2,'0')+'%'; timeEl.textContent=fmt(current)+' / '+fmt(dur);
    const idx=Math.min(lines.length-1,Math.floor(progress*lines.length));
    if(idx!==lastLine){lastLine=idx;bootLine.innerHTML=lines[idx]+'<span class="cursor-blink"></span>'}
  }
  function finish(){
    if(finished)return;finished=true;video.pause();bar.style.width='100%';pct.textContent='100%';bootLine.innerHTML='> transmission complete<span class="cursor-blink"></span>';
    document.body.classList.remove('intro-active');setTimeout(()=>intro.classList.add('hide'),180);
  }
  function showPlayFallback(){playBtn.hidden=false;bootLine.innerHTML='> tap to begin launch archive<span class="cursor-blink"></span>'}
  async function tryPlay(){try{await video.play();playBtn.hidden=true}catch(e){showPlayFallback()}}

  video.addEventListener('loadedmetadata',()=>{renderProgress();tryPlay()},{once:true});
  video.addEventListener('timeupdate',renderProgress);
  video.addEventListener('durationchange',renderProgress);
  video.addEventListener('ended',finish);
  video.addEventListener('error',()=>{video.style.display='none';bar.style.width='100%';pct.textContent='100%';timeEl.textContent='ARCHIVE UNAVAILABLE';bootLine.innerHTML='> startup archive unavailable — entering portfolio<span class="cursor-blink"></span>';setTimeout(finish,1100)},{once:true});
  skip.addEventListener('click',finish);
  playBtn.addEventListener('click',tryPlay);
  document.addEventListener('visibilitychange',()=>{if(!finished&&document.visibilityState==='visible'&&video.paused&&video.currentTime<video.duration)tryPlay()});
  if(video.readyState>=1){renderProgress();tryPlay()}
})();

document.addEventListener('visibilitychange',()=>{document.documentElement.classList.toggle('page-hidden',document.hidden)});
