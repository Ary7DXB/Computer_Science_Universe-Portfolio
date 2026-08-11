/* ============================================================
   MISSION CONTROL - deterministic resume assistant UI

   Local Q&A interface: fuzzy match against MISSION_QA, typewriter
   replies, autocomplete, and modal lifecycle. No network calls.
============================================================ */
const missionControl=document.getElementById('missionControl');
const missionInput=document.getElementById('missionInput');
const missionTranscript=document.getElementById('missionTranscript');
const missionList=document.getElementById('missionQuestionList');
const missionCategories=document.getElementById('missionCategories');
const missionAutocomplete=document.getElementById('missionAutocomplete');
const missionForm=document.getElementById('missionForm');
const missionSend=document.getElementById('missionSend');
const missionClear=document.getElementById('missionClear');
let mcCategory='All',mcSuggestions=[],mcSuggestionIndex=0,mcTypingToken=0;

/** Normalize user input for alias matching (lowercase, strip punctuation). */
function normalizeMC(s){return String(s||'').toLowerCase().replace(/[^a-z0-9+.# ]/g,' ').replace(/\s+/g,' ').trim()}
function renderMissionCategories(){missionCategories.innerHTML=MC_CATEGORIES.map(c=>`<button class="mission-category${c===mcCategory?' active':''}" type="button" data-category="${c}">${c}</button>`).join('');missionCategories.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{mcCategory=b.dataset.category;renderMissionCategories();renderMissionQuestions()}))}
function renderMissionQuestions(){const items=MISSION_QA.filter(x=>mcCategory==='All'||x.category===mcCategory);missionList.innerHTML=items.map((x,i)=>`<button class="mission-question" type="button" data-id="${x.id}"><span class="mission-q-index">${String(i+1).padStart(2,'0')}</span><span class="mission-q-text">${x.q}</span><span class="mission-q-arrow">↗</span></button>`).join('');missionList.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{askMission(MISSION_QA.find(x=>x.id===b.dataset.id));if(innerWidth<=720)requestAnimationFrame(()=>{missionTranscript.scrollTop=missionTranscript.scrollHeight})}))}
/** Score how well a query matches a Q&A item via exact, prefix, and token overlap. */
function scoreMission(query,item){const q=normalizeMC(query);if(!q)return 0;const stop=new Set(['what','how','did','does','tell','give','please','about','aryan','aryans','his','him','the','with','and','from','have','has','can','could','would','who','where','when','why','quick','know']);const hay=[item.q,...item.aliases].map(normalizeMC);let score=0;for(const h of hay){if(h===q)score=Math.max(score,100);else if(h.startsWith(q))score=Math.max(score,80);else if(h.includes(q))score=Math.max(score,65);const tokens=q.split(' ').filter(x=>x.length>1&&!stop.has(x));if(tokens.length){const matches=tokens.filter(tok=>h.includes(tok)).length;score=Math.max(score,(matches/tokens.length)*60)}}return score}
function getMissionMatches(query,limit=6){return MISSION_QA.map(x=>({x,score:scoreMission(query,x)})).filter(v=>v.score>14).sort((a,b)=>b.score-a.score).slice(0,limit).map(v=>v.x)}
function updateMissionAutocomplete(){const value=missionInput.value.trim();if(!value){missionAutocomplete.hidden=true;mcSuggestions=[];return}mcSuggestions=getMissionMatches(value,6);mcSuggestionIndex=0;if(!mcSuggestions.length){missionAutocomplete.hidden=true;return}missionAutocomplete.innerHTML=mcSuggestions.map((x,i)=>`<button class="mission-suggestion${i===0?' active':''}" type="button" role="option" data-id="${x.id}">${x.q}</button>`).join('');missionAutocomplete.hidden=false;missionAutocomplete.querySelectorAll('button').forEach(b=>b.addEventListener('mousedown',e=>e.preventDefault()));missionAutocomplete.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{const item=MISSION_QA.find(x=>x.id===b.dataset.id);missionInput.value=item.q;missionAutocomplete.hidden=true;askMission(item)}))}
function setSuggestionIndex(next){if(!mcSuggestions.length)return;mcSuggestionIndex=(next+mcSuggestions.length)%mcSuggestions.length;missionAutocomplete.querySelectorAll('.mission-suggestion').forEach((el,i)=>el.classList.toggle('active',i===mcSuggestionIndex))}
function addMissionMessage(role,text,{source=false,thinking=false}={}){const wrap=document.createElement('div');wrap.className='mission-message '+role;const avatar=document.createElement('div');avatar.className='mission-avatar';avatar.textContent=role==='user'?'YOU':'MC';const body=document.createElement('div');body.className='mission-message-body';const meta=document.createElement('div');meta.className='mission-message-meta';meta.innerHTML=role==='user'?'<span>VISITOR</span><span>TRANSMITTED</span>':'<span>MISSION CONTROL</span><span>RESUME CORE</span>';const bubble=document.createElement('div');bubble.className='mission-bubble';if(thinking){bubble.innerHTML='<span class="mission-thinking">Retrieving resume signal <i></i><i></i><i></i></span>'}else bubble.textContent=text;body.append(meta,bubble);if(source){const src=document.createElement('div');src.className='mission-source';src.textContent='SOURCE · ARYAN SATGHARE RESUME';body.appendChild(src)}wrap.append(avatar,body);missionTranscript.appendChild(wrap);missionTranscript.scrollTop=missionTranscript.scrollHeight;return{wrap,bubble,body}}
async function typeMissionAnswer(text,bubble,token){bubble.textContent='';bubble.classList.add('typing');const words=text.split(/(\s+)/);for(let i=0;i<words.length;i++){if(token!==mcTypingToken)return;bubble.textContent+=words[i];if(i%5===0)missionTranscript.scrollTop=missionTranscript.scrollHeight;const isBreak=/[.!?]$/.test(words[i]);await new Promise(r=>setTimeout(r,isBreak?82:16))}bubble.classList.remove('typing');missionTranscript.scrollTop=missionTranscript.scrollHeight}
async function askMission(item,rawQuestion){if(!item&&rawQuestion){const matches=getMissionMatches(rawQuestion,1);item=matches[0];if(!item||scoreMission(rawQuestion,item)<22)item=null}const question=item?item.q:rawQuestion;if(!question)return;mcTypingToken++;const token=mcTypingToken;missionTranscript.querySelectorAll('.mission-bubble.typing').forEach(b=>b.classList.remove('typing'));missionTranscript.querySelectorAll('.mission-thinking').forEach(t=>t.closest('.mission-message')?.remove());missionAutocomplete.hidden=true;missionInput.value='';addMissionMessage('user',question);missionSend.disabled=true;const thinking=addMissionMessage('bot','',{thinking:true});await new Promise(r=>setTimeout(r,430));if(token!==mcTypingToken)return;thinking.wrap.remove();const answer=item?item.a:"I’m a preloaded resume interface rather than a general AI model, so I only answer questions mapped to Aryan’s resume. Try asking about his education, LivSync, the CPU Scheduler, the Sudoku Solver, technical skills, leadership, or contact details.";const bot=addMissionMessage('bot','',{source:!!item});await typeMissionAnswer(answer,bot.bubble,token);if(token===mcTypingToken)missionSend.disabled=false}
function resetMissionTranscript(){mcTypingToken++;missionSend.disabled=false;missionTranscript.innerHTML=`<div class="mission-message bot welcome-message"><div class="mission-avatar">MC</div><div class="mission-message-body"><div class="mission-message-meta"><span>MISSION CONTROL</span><span>READY</span></div><div class="mission-bubble">Resume telemetry loaded. Ask about Aryan's education, projects, technical skills, leadership, or contact details. You can type naturally or choose a signal from the question library.</div><div class="mission-source">PRELOADED RESUME KNOWLEDGE · LOCAL / NO API</div></div></div>`}
let mcPageScrollY=0;
function syncMissionViewport(){
  const vv=window.visualViewport;
  const h=vv?vv.height:window.innerHeight;
  document.documentElement.style.setProperty('--mc-vvh',Math.max(320,h)+'px');
  
  if(innerWidth<=720&&document.body.classList.contains('mission-open')){
    const isKeyboardOpen=vv&&(window.innerHeight-vv.height>120);
    document.body.classList.toggle('mission-keyboard-open',Boolean(isKeyboardOpen));
  }
  
  if(document.body.classList.contains('mission-open')){
    requestAnimationFrame(()=>{missionTranscript.scrollTop=missionTranscript.scrollHeight})
  }
}
window.visualViewport?.addEventListener('resize',syncMissionViewport,{passive:true});window.visualViewport?.addEventListener('scroll',syncMissionViewport,{passive:true});window.addEventListener('orientationchange',()=>setTimeout(syncMissionViewport,120),{passive:true});syncMissionViewport();
function openMissionControl(){mcPageScrollY=window.scrollY;syncMissionViewport();document.body.classList.add('mission-open');missionControl.setAttribute('aria-hidden','false');paused=true;const touch=matchMedia('(pointer:coarse)').matches||innerWidth<=720;if(!touch)setTimeout(()=>missionInput.focus({preventScroll:true}),180);requestAnimationFrame(()=>{missionTranscript.scrollTop=missionTranscript.scrollHeight})}
function closeMissionControl(){document.body.classList.remove('mission-open');document.body.classList.remove('mission-keyboard-open');missionControl.setAttribute('aria-hidden','true');missionAutocomplete.hidden=true;missionInput.blur();paused=!!activeId;requestAnimationFrame(()=>window.scrollTo(0,mcPageScrollY))}
// Mission Control is hidden until the user opens it, so its (larger) question
// library DOM doesn't need to compete with the solar system / starfield for
// the main thread during initial load. Build it once the browser is idle.
(window.requestIdleCallback||(fn=>setTimeout(fn,200)))(()=>{renderMissionCategories();renderMissionQuestions()});
['missionControlBtn','missionControlTop','footerMissionControl'].forEach(id=>document.getElementById(id)?.addEventListener('click',openMissionControl));
document.getElementById('missionClose').addEventListener('click',closeMissionControl);document.getElementById('missionBackdrop').addEventListener('click',closeMissionControl);missionClear.addEventListener('click',resetMissionTranscript);
missionInput.addEventListener('input',updateMissionAutocomplete);
missionInput.addEventListener('focus',()=>{
  updateMissionAutocomplete();
  if(innerWidth<=720){
    document.body.classList.add('mission-keyboard-open');
    setTimeout(()=>requestAnimationFrame(()=>{missionTranscript.scrollTop=missionTranscript.scrollHeight}),300);
  }
});
missionInput.addEventListener('blur',()=>{
  setTimeout(()=>missionAutocomplete.hidden=true,120);
  if(innerWidth<=720){
    document.body.classList.remove('mission-keyboard-open');
  }
});
missionInput.addEventListener('keydown',e=>{if(e.key==='ArrowDown'&&!missionAutocomplete.hidden){e.preventDefault();setSuggestionIndex(mcSuggestionIndex+1)}else if(e.key==='ArrowUp'&&!missionAutocomplete.hidden){e.preventDefault();setSuggestionIndex(mcSuggestionIndex-1)}else if(e.key==='Tab'&&!missionAutocomplete.hidden&&mcSuggestions.length){e.preventDefault();missionInput.value=mcSuggestions[mcSuggestionIndex].q;missionAutocomplete.hidden=true}else if(e.key==='Enter'&&!missionAutocomplete.hidden&&mcSuggestions.length){e.preventDefault();askMission(mcSuggestions[mcSuggestionIndex])}else if(e.key==='Escape'){missionAutocomplete.hidden=true}});
missionForm.addEventListener('submit',e=>{e.preventDefault();const raw=missionInput.value.trim();if(!raw||missionSend.disabled)return;const best=getMissionMatches(raw,1)[0];askMission(best&&scoreMission(raw,best)>=22?best:null,raw)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('mission-open')){e.preventDefault();closeMissionControl()}});
