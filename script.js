const body=document.body;
const loader=document.getElementById("loader");
const header=document.getElementById("header");
const navbar=document.getElementById("navbar");
const menuBtn=document.getElementById("menuBtn");
const cursorGlow=document.getElementById("cursorGlow");

window.addEventListener("load",()=>{setTimeout(()=>loader.classList.add("hide"),500);setTimeout(()=>body.classList.remove("loading"),900)});
document.addEventListener("DOMContentLoaded",()=>{body.classList.add("loading");document.getElementById("year").textContent=`© ${new Date().getFullYear()} Marwan Mohamed`});

menuBtn.addEventListener("click",()=>{navbar.classList.toggle("active");menuBtn.classList.toggle("active")});
document.querySelectorAll(".navbar a").forEach(a=>a.addEventListener("click",()=>{navbar.classList.remove("active");menuBtn.classList.remove("active")}));

window.addEventListener("scroll",()=>{header.classList.toggle("scrolled",window.scrollY>30);document.documentElement.style.setProperty("--parallax",`${window.scrollY*.08}px`)},{passive:true});

const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}})},{threshold:.12,rootMargin:"0px 0px -45px 0px"});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const sections=[...document.querySelectorAll("main section[id]")];
const navItems=[...document.querySelectorAll(".navbar a")];
const navObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)navItems.forEach(a=>a.classList.toggle("active",a.getAttribute("href")===`#${entry.target.id}`))})},{threshold:.35});
sections.forEach(s=>navObserver.observe(s));

window.addEventListener("mousemove",e=>{cursorGlow.style.left=`${e.clientX}px`;cursorGlow.style.top=`${e.clientY}px`;cursorGlow.style.opacity="1"},{passive:true});
document.addEventListener("mouseleave",()=>cursorGlow.style.opacity="0");

document.querySelectorAll(".tilt-card").forEach(card=>{
  card.addEventListener("mousemove",e=>{
    if(innerWidth<900)return;
    const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(900px) rotateX(${y*-5}deg) rotateY(${x*7}deg) translateY(-5px)`;
  });
  card.addEventListener("mouseleave",()=>card.style.transform="");
});

document.querySelectorAll(".magnetic").forEach(el=>{
  el.addEventListener("mousemove",e=>{
    if(innerWidth<900)return;
    const r=el.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)*.12,y=(e.clientY-r.top-r.height/2)*.12;
    el.style.transform=`translate(${x}px,${y}px)`;
  });
  el.addEventListener("mouseleave",()=>el.style.transform="");
});

document.querySelectorAll(".stack-card").forEach(card=>card.addEventListener("mousemove",e=>{
  const r=card.getBoundingClientRect();
  card.style.setProperty("--mx",`${((e.clientX-r.left)/r.width)*100}%`);
  card.style.setProperty("--my",`${((e.clientY-r.top)/r.height)*100}%`);
}));

document.querySelectorAll(".project-card").forEach(card=>{
  card.addEventListener("mousemove",e=>{const r=card.getBoundingClientRect();card.style.background=`radial-gradient(circle at ${e.clientX-r.left}px ${e.clientY-r.top}px,rgba(183,255,60,.035),transparent 32%),var(--card)`});
  card.addEventListener("mouseleave",()=>card.style.background="var(--card)");
});

document.addEventListener("keydown",e=>{if(e.key==="Escape"){navbar.classList.remove("active");menuBtn.classList.remove("active")}});



/* ===== SCROLL ANIMATION V4 ===== */
(() => {
  const items = [...document.querySelectorAll(".scroll-motion")];
  const reactive = [...document.querySelectorAll(".scroll-react")];
  const clamp = (n,a=0,b=1) => Math.max(a,Math.min(b,n));
  let raf = 0;
  let lastY = window.scrollY;

  items.forEach((el,i) => {
    el.dataset.motionIndex = i;
    el.style.setProperty("--sm-opacity","0");
    el.style.setProperty("--sm-y","55px");
    el.style.setProperty("--sm-x","0px");
    el.style.setProperty("--sm-scale",".94");
    el.style.setProperty("--sm-rotate","0deg");
  });

  function update(){
    raf=0;
    const vh=window.innerHeight;
    const currentY=window.scrollY;
    const direction=currentY>=lastY ? 1 : -1;
    document.documentElement.dataset.scrollDirection=direction>0 ? "down" : "up";

    items.forEach((el,index)=>{
      const r=el.getBoundingClientRect();
      const center=r.top+r.height/2;

      // 0 before entering, 1 when centered, 0 after leaving.
      const enter=clamp((vh-r.top)/(vh*.72));
      const leave=clamp((vh*.95-center)/(vh*.62));
      const progress=clamp(Math.min(enter,leave));

      const motion=el.dataset.motion || "up";
      const distance=(1-progress);

      let x=0, y=55*distance, rotate=0;
      if(motion==="left"){x=-70*distance; y=20*distance; rotate=-2.5*distance}
      if(motion==="right"){x=70*distance; y=20*distance; rotate=2.5*distance}
      if(motion==="down"){y=-55*distance}
      if(motion==="scale"){y=28*distance}
      if(motion==="tilt"){y=55*distance; rotate=4*distance}

      // Slight stagger for cards, while remaining fully reversible.
      const isCard=el.matches(".stack-card,.project-card,.timeline-item");
      const stagger=isCard ? Math.min(index%4,3)*.025 : 0;
      const p=clamp(progress-stagger);

      el.style.setProperty("--sm-opacity",p.toFixed(3));
      el.style.setProperty("--sm-x",`${(x*(1-p))}px`);
      el.style.setProperty("--sm-y",`${(y*(1-p))}px`);
      el.style.setProperty("--sm-scale",(0.94 + p*.06).toFixed(3));
      el.style.setProperty("--sm-rotate",`${rotate*(1-p)}deg`);
    });

    reactive.forEach((el,i)=>{
      const r=el.getBoundingClientRect();
      const center=r.top+r.height/2;
      const offset=clamp((center-vh/2)/(vh/2),-1,1);
      const amount=window.innerWidth<700 ? 5 : 11;
      el.style.setProperty("--react-y",`${-offset*amount}px`);
      el.style.setProperty("--react-scale",(1 + (1-Math.abs(offset))*.018).toFixed(3));
    });

    lastY=currentY;
  }

  function requestUpdate(){
    if(!raf) raf=requestAnimationFrame(update);
  }

  window.addEventListener("scroll",requestUpdate,{passive:true});
  window.addEventListener("resize",requestUpdate);
  window.addEventListener("load",requestUpdate);

  // Make it visible immediately on first paint, then animate continuously with scroll.
  requestUpdate();
})();
