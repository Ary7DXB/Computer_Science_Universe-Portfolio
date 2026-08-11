/* ============================================================
   PORTFOLIO DATA - content for each planet section

   Single source of truth for panel copy, accent colors, and
   planet orbit/texture configuration. HTML strings are built
   here so presentation modules stay free of resume content.
============================================================ */
const DATA = {
  venus: {
    key:'venus', eyebrow:'01 · Education', title:'Education',
    accent:'#e8b76a', accent2:'#ffd9a0',
    body:`
      <p class="blurb">A First-Class trajectory through Heriot-Watt's Computer Science programme — built on consistent top-grade performance and a broad core curriculum.</p>
      <div class="stat-strip">
        <div class="stat"><b>4.0</b><span>US GPA equiv.</span></div>
        <div class="stat"><b>2027</b><span>Expected grad.</span></div>
        <div class="stat"><b>8/8</b><span>Year 3 straight A's</span></div>
      </div>
      <div class="entry">
        <div class="entry-top">
          <div><div class="entry-title">Heriot-Watt University</div><div class="entry-sub">BSc (Honors), Computer Science</div></div>
          <div class="entry-date">Expected 2027</div>
        </div>
        <ul>
          <li>Maintained a <b>straight-A record</b> across all 8 courses in Year 3, reaching up to <b>90%</b> in technical coursework.</li>
          <li>Secured a continuous <b>First-Class profile</b> with grade-A marks across the majority of core CS modules in Years 1 and 2.</li>
        </ul>
        <div class="tagrow">
          ${['AI & Intelligent Agents','Database Systems','Data Comms & Networking','Data Structures & Algorithms','Hardware-Software Interface','Language Processors','OS & Concurrency','Software Development','User-Centered Design','Web Programming'].map(t=>`<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="entry">
        <div class="entry-top">
          <div><div class="entry-title">Deputy Principal's Award</div><div class="entry-sub">for Academic Excellence</div></div>
          <div class="entry-date">2023–2024</div>
        </div>
        <ul><li>Awarded for securing First-Class / Grade A marks across <b>six distinct core computing modules</b> in the 2023–2024 academic session.</li></ul>
      </div>
    `
  },
  earth: {
    key:'earth', eyebrow:'02 · Projects', title:'Projects',
    accent:'#4fb2e8', accent2:'#7de8c8',
    body:`
      <p class="blurb">Three shipped systems spanning full-stack product engineering, low-level concurrency, and constraint-satisfaction AI.</p>
      <div class="entry">
        <div class="entry-top"><div><div class="entry-title">LivSync</div><div class="entry-sub">Full-Stack Health Companion Application</div></div><div class="entry-date">Sep 2025 – Apr 2026</div></div>
        <ul>
          <li>Built a modular <b>Next.js 14 / React 18 / Tailwind</b> frontend on a relational <b>PostgreSQL + Prisma</b> backend.</li>
          <li>Engineered auth with <b>Bcrypt</b> hashing, route middleware, session cookies and a <b>2FA</b> flow via Speakeasy.</li>
          <li>Integrated <b>Recharts</b> biometrics dashboards with client-side <b>jsPDF / html2canvas</b> export pipelines.</li>
          <li>Delivered across 5 modules using <b>Agile/Scrum</b> in a cross-functional team.</li>
        </ul>
        <div class="tagrow">${['Next.js 14','React 18','Tailwind CSS','PostgreSQL','Prisma ORM'].map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      </div>
      <div class="entry">
        <div class="entry-top"><div><div class="entry-title">CPUScheduler</div><div class="entry-sub">Concurrent CPU Scheduler</div></div><div class="entry-date">Mar – Apr 2026</div></div>
        <ul>
          <li>Implemented the <b>Monitor Pattern</b> with ReentrantLock &amp; per-core Condition variables to eliminate race conditions.</li>
          <li>Designed multi-burst scheduling across heterogeneous compute resources.</li>
          <li>Built modular <b>FCFS</b> (with head-of-line mitigation) and <b>SJF</b> scheduling policies.</li>
          <li>Formulated a concurrent test suite covering thread lifecycle and lock-safety assertions.</li>
        </ul>
        <div class="tagrow">${['Java','Locks','Conditions','Multi-threading'].map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      </div>
      <div class="entry">
        <div class="entry-top"><div><div class="entry-title">Sudoku Solver</div><div class="entry-sub">AI Constraint Satisfaction Engine</div></div><div class="entry-date">Oct 2025</div></div>
        <ul>
          <li>Engineered a <b>DFS backtracking</b> engine with Forward Checking heuristics to prune search branches.</li>
          <li>Architected a thread-safe <b>Java Swing</b> GUI running heavy search off the UI thread.</li>
          <li>Enforced clean separation of algorithm, presentation and I/O for standalone headless testing.</li>
          <li>Built telemetry tracking recursive calls, backtracks and wall-clock runtime.</li>
        </ul>
        <div class="tagrow">${['Java','Swing','Backtracking','CSP Heuristics'].map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      </div>
    `
  },
  mars: {
    key:'mars', eyebrow:'03 · Leadership & Experience', title:'Leadership & Experience',
    accent:'#ff8b5c', accent2:'#ffbf8a',
    body:`
      <p class="blurb">Design leadership, technical communication, and team leadership across student organizations and group projects.</p>
      <div class="entry">
        <div class="entry-top"><div><div class="entry-title">Principal UI/UX Designer</div><div class="entry-sub">LAIRR @ Heriot-Watt University</div></div><div class="entry-date">Jan 2025 – Jan 2026</div></div>
        <ul><li>Engineered the end-to-end design system, wireframes and aesthetic vision for a student-led project site featuring an AI-powered chatbot utility.</li></ul>
      </div>
      <div class="entry">
        <div class="entry-top"><div><div class="entry-title">Workshop Host</div><div class="entry-sub">BCS Student Chapter @ Heriot-Watt University</div></div><div class="entry-date">Jan 2026</div></div>
        <ul><li>Prepared and delivered a technical seminar, <b>"The Predominant AI Tools Available Beyond ChatGPT,"</b> for the BCS Breakout Initiative.</li></ul>
      </div>
      <div class="entry">
        <div class="entry-top"><div><div class="entry-title">Team Lead</div><div class="entry-sub">DormDash E-Commerce Website (Group Project)</div></div><div class="entry-date">Sep – Dec 2024</div></div>
        <ul><li>Spearheaded a 5-member engineering team through the full development lifecycle, frontend to backend.</li></ul>
      </div>
    `
  },
  jupiter: {
    key:'jupiter', eyebrow:'04 · Technical Skills', title:'Technical Skills',
    accent:'#d9a15c', accent2:'#f0c98a',
    body:`
      <p class="blurb">The largest planet for the largest section — the full toolkit across languages, frameworks, infrastructure and backend utilities.</p>
      <div class="skill-group"><h3>Languages</h3><div class="tagrow">${['C','Java','JavaScript','OCaml','PDDL','Python','SQL','TypeScript','ARM Assembly','HTML5','CSS3'].map(t=>`<span class="tag">${t}</span>`).join('')}</div></div>
      <div class="skill-group"><h3>Frameworks & Libraries</h3><div class="tagrow">${['Next.js 14','React 18','Express','Tailwind CSS','Prisma ORM','Recharts','Axios','PostCSS'].map(t=>`<span class="tag">${t}</span>`).join('')}</div></div>
      <div class="skill-group"><h3>Databases & Tools</h3><div class="tagrow">${['Docker','MySQL','PostgreSQL','Figma','Git','GitHub','GNS3','Linux','Node.js'].map(t=>`<span class="tag">${t}</span>`).join('')}</div></div>
      <div class="skill-group"><h3>Backend Utilities</h3><div class="tagrow">${['Bcrypt','Speakeasy','Nodemailer','jsPDF','html2canvas'].map(t=>`<span class="tag">${t}</span>`).join('')}</div></div>
    `
  },
  saturn: {
    key:'saturn', eyebrow:'05 · Contact', title:'Get in Touch',
    accent:'#b6a6ff', accent2:'#e6dcff',
    body:`
      <p class="blurb">Broadcasting from Dubai, UAE. Open to conversations about internships, collaborations, and interesting problems.</p>
      <div class="contact-row"><div class="ic">✉</div><div><span class="k">Email</span><a href="mailto:aryansatghare@hotmail.com">aryansatghare@hotmail.com</a></div></div>
      <div class="contact-row"><div class="ic">⌥</div><div><span class="k">Github</span><a href="#" id="githubLink" target="_blank" rel="noopener">Github Profile</a></div></div>
      <div class="contact-row"><div class="ic">◎</div><div><span class="k">Location</span><span>Dubai, United Arab Emirates</span></div></div>
    `
  }
};
/* Planet render config: NASA/JPL textures, elliptical orbits, spin direction. */
const PLANETS = [
  {id:'venus',size:.038,orbit:.19,speed:.090,start:-.38,data:DATA.venus,glow:'#e1b273',texture:'assets/venus.webp',rotation:'52s',focusRotation:'30s',spinDir:-1,activeFilter:'saturate(.78) sepia(.075) contrast(1.14) brightness(.95)',textureOffset:'12%'},
  {id:'earth',size:.042,orbit:.31,speed:.070,start:2.18,data:DATA.earth,glow:'#67c8ff',texture:'assets/earth-realistic.webp',rotation:'34s',focusRotation:'20s',spinDir:1,activeFilter:'saturate(.88) contrast(1.13) brightness(.94)',textureOffset:'8%',hasMoon:true,clouds:false},
  {id:'mars',size:.031,orbit:.43,speed:.057,start:-1.93,data:DATA.mars,glow:'#d87555',texture:'assets/mars.webp',rotation:'38s',focusRotation:'24s',spinDir:1,activeFilter:'saturate(.96) contrast(1.18) brightness(.91)',textureOffset:'22%'},
  {id:'jupiter',size:.087,orbit:.60,speed:.035,start:.67,data:DATA.jupiter,glow:'#d5ad82',texture:'assets/jupiter.jpg',rotation:'25s',focusRotation:'18s',spinDir:1,activeFilter:'saturate(.91) contrast(1.14) brightness(.95)',textureOffset:'5%',hasMoon:true},
  {id:'saturn',size:.074,orbit:.82,speed:.025,start:3.53,data:DATA.saturn,glow:'#d4bd96',texture:'assets/saturn-cassini.webp',rotation:'42s',focusRotation:'24s',spinDir:1,activeFilter:'saturate(.84) sepia(.045) contrast(1.12) brightness(.96)',textureOffset:'15%',hasRing:true}
];
