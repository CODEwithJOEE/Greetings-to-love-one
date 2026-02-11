const config = {
  babyName: "Baby",
  startDate: "2022-03-11", // YYYY-MM-DD
  heroLine: "Another month with you feels like a soft sunrise warm, calm, and something I always want to wake up to.",
  letter: `Baby, happy monthssary. Thank you for being my safe place, my favorite person, my best friend, my companion.
I love the way you make ordinary moments feel special. I’m proud of us of how we keep choosing each other. This month, I’m wishing for more laughs, more hugs, more “I miss you” moments that end in “I’m here now.”
Always remember: I’m with you, I’m for you, and I’m grateful for you. 💗`,
  copyLines: [
    "Happy monthssary, baby. You’re my favorite person. 💗",
    "I’ll keep choosing you—every day, every month.",
    "You feel like home to me.",
    "Thank you for loving me softly and truly."
  ],
  surprises: [
    {
      title: "I choose you—again and again.",
      body: "No matter how busy the days get, you’re my favorite part of life. Happy monthssary, my baby. 💗",
      tags: ["more dates", "more kisses", "more us", "forever energy"]
    },
    {
      title: "Still my favorite hello.",
      body: "Even after all this time, you’re the one I want to tell everything to. Happy monthssary, baby. 💗",
      tags: ["soft love", "safe home", "always you", "steady hearts"]
    },
    {
      title: "You’re my calm.",
      body: "Thank you for being the peace I didn’t know I needed. I love you. 💗",
      tags: ["gentle days", "warm hugs", "deep talks", "us always"]
    }
  ]
};

function ordinal(n){
  const s = ["th","st","nd","rd"];
  const v = n % 100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
}

function monthsSinceStart(start, now){
  const startY = start.getFullYear();
  const startM = start.getMonth();
  const nowY = now.getFullYear();
  const nowM = now.getMonth();

  let months = (nowY - startY) * 12 + (nowM - startM);

  const anniversaryDay = start.getDate();
  if (now.getDate() < anniversaryDay) months -= 1;

  return Math.max(0, months);
}

function formatLongDate(d){
  return new Intl.DateTimeFormat(undefined, { year:"numeric", month:"long", day:"numeric" }).format(d);
}

// Apply config + auto dates/count
const start = new Date(config.startDate + "T00:00:00");
const now = new Date();

const monthCount = monthsSinceStart(start, now);
document.getElementById("monthsOrdinal").textContent = ordinal(monthCount);
document.getElementById("sinceText").textContent = "Since " + formatLongDate(start);
document.getElementById("dateText").textContent = formatLongDate(now);

document.getElementById("babyName").textContent = config.babyName;
document.getElementById("heroLine").textContent = config.heroLine;

// Keep line breaks in the letter:
document.getElementById("letter").innerHTML = config.letter.replace(/\n/g, "<br>");

// Floating hearts generator
const hearts = document.getElementById("hearts");
const HEART_COUNT = 26;

function rand(min, max){ return Math.random() * (max - min) + min; }

for(let i=0;i<HEART_COUNT;i++){
  const h = document.createElement("div");
  h.className = "heart";
  const size = rand(10, 18);
  h.style.width = size + "px";
  h.style.height = size + "px";
  h.style.left = rand(0, 100) + "vw";
  h.style.animationDuration = rand(8, 18) + "s";
  h.style.animationDelay = rand(-18, 0) + "s";

  const tint = Math.random();
  if(tint < 0.33) h.style.background = "rgba(255,90,165,.75)";
  else if(tint < 0.66) h.style.background = "rgba(138,125,255,.55)";
  else h.style.background = "rgba(255,143,195,.65)";

  hearts.appendChild(h);
}

// Modal logic + focus restore + scroll lock
const overlay = document.getElementById("overlay");
const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");
let lastFocus = null;
let lastSurpriseIndex = -1;

function renderTags(tags){
  const gift = document.querySelector(".gift");
  gift.innerHTML = "";
  tags.forEach(t=>{
    const s = document.createElement("span");
    s.className = "tag";
    s.textContent = t;
    gift.appendChild(s);
  });
}

function pickNewSurprise(){
  const list = config.surprises || [];
  if(!list.length) return null;

  let i = Math.floor(Math.random() * list.length);
  if(list.length > 1){
    while(i === lastSurpriseIndex) i = Math.floor(Math.random() * list.length);
  }
  lastSurpriseIndex = i;
  return list[i];
}

// Burst canvas
const burstCanvas = document.getElementById("burst");
const btx = burstCanvas.getContext("2d");

function resizeBurst(){
  const rect = burstCanvas.getBoundingClientRect();
  burstCanvas.width = Math.floor(rect.width * devicePixelRatio);
  burstCanvas.height = Math.floor(rect.height * devicePixelRatio);
  btx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
window.addEventListener("resize", resizeBurst);

function burstHearts(){
  resizeBurst();
  const rect = burstCanvas.getBoundingClientRect();
  const W = rect.width, H = rect.height;

  const parts = Array.from({length: 24}, ()=>({
    x: W/2,
    y: H*0.75,
    vx: (Math.random()-0.5)*6,
    vy: -Math.random()*6 - 2,
    r: Math.random()*5 + 3,
    life: 60 + Math.random()*20
  }));

  let t = 0;
  function frame(){
    t++;
    btx.clearRect(0,0,W,H);

    // alternating pink/lav look (without setting many styles)
    parts.forEach((p, idx)=>{
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.10;
      p.life -= 1;

      btx.globalAlpha = Math.max(0, p.life/80);
      btx.fillStyle = (idx % 2 === 0) ? "rgba(255,90,165,.9)" : "rgba(138,125,255,.75)";
      btx.beginPath();
      btx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      btx.fill();
    });

    if(t < 90) requestAnimationFrame(frame);
    else btx.clearRect(0,0,W,H);
  }
  requestAnimationFrame(frame);
}

function openModal(){
  lastFocus = document.activeElement;
  document.body.style.overflow = "hidden";

  const s = pickNewSurprise();
  if(s){
    document.getElementById("surpriseTitle").textContent = s.title;
    document.getElementById("surpriseBody").textContent = s.body;
    renderTags(s.tags || []);
  }

  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");

  closeBtn.focus();
  burstHearts();
}

function closeModal(){
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if(lastFocus) lastFocus.focus();
}

openBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", (e)=>{ if(e.target === overlay) closeModal(); });
document.addEventListener("keydown", (e)=>{ if(e.key === "Escape") closeModal(); });

// Copy sweet line
const toast = document.getElementById("toast");
const copyBtn = document.getElementById("copyBtn");

function showToast(){
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"), 1200);
}

copyBtn.addEventListener("click", async ()=>{
  const line = config.copyLines[Math.floor(Math.random() * config.copyLines.length)];
  try{
    await navigator.clipboard.writeText(line);
    showToast();
  }catch{
    const temp = document.createElement("textarea");
    temp.value = line;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    showToast();
  }
});

// Share button (mobile-friendly)
document.getElementById("shareBtn").addEventListener("click", async ()=>{
  const text =
    `${document.getElementById("surpriseTitle").textContent}\n\n` +
    `${document.getElementById("surpriseBody").textContent}`;

  if(navigator.share){
    try{
      await navigator.share({ title: "For you 💗", text });
    }catch{}
  }else{
    try{
      await navigator.clipboard.writeText(text);
      showToast();
    }catch{
      // fallback
      const temp = document.createElement("textarea");
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
      showToast();
    }
  }
});

// Initial tags render
renderTags(config.surprises?.[0]?.tags || []);