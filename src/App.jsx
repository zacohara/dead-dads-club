import{useState,useEffect,useRef}from"react";

// ─── BRAND TOKENS ───
const G="#C8A951",GL="#E8D5A0",GD="rgba(200,169,81,0.1)",D="#0A0A0A",DC="#111",DB="#222",CR="#F5F0E8",RD="#C0392B";
const CG="'Cormorant Garamond',serif",OF="'Outfit',sans-serif";
const isTouch=typeof window!=='undefined'&&('ontouchstart'in window);

function useInView(t=0.1){const r=useRef(null);const[v,s]=useState(false);
useEffect(()=>{const e=r.current;if(!e)return;const o=new IntersectionObserver(([x])=>{if(x.isIntersecting){s(true);o.disconnect()}},{threshold:t});o.observe(e);return()=>o.disconnect()},[]);return[r,v]}

function Logo({size=120,full=false,style={}}){
return full?<img src="/ddc-logo-full.jpg" alt="The Dead Dads Club" style={{width:size,height:"auto",display:"block",...style}} loading="lazy"/>:
<img src="/ddc-logo-icon.jpg" alt="DDC" style={{width:size,height:size,objectFit:"cover",display:"block",...style}} loading="lazy"/>}

function GDiv(){return<div style={{width:80,height:2,background:`linear-gradient(90deg,transparent,${G},transparent)`,margin:"0 auto"}}/>}
function SL({text}){return(<div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,justifyContent:"center"}}>
<div style={{width:28,height:1,background:`${G}50`}}/><span style={{fontFamily:OF,fontSize:14,fontWeight:600,letterSpacing:5,color:G,textTransform:"uppercase"}}>{text}</span>
<div style={{width:28,height:1,background:`${G}50`}}/></div>)}
function SW({children,bg=D,id}){return<section id={id} style={{padding:"120px 24px",background:bg,position:"relative"}}>{children}</section>}

// ━━━ INTRO (skips for return visitors) ━━━
function Intro({onDone}){const[p,setP]=useState(0);const timers=useRef([]);
const finish=()=>{timers.current.forEach(t=>clearTimeout(t));try{sessionStorage.setItem('ddc-seen','1')}catch(e){}onDone()};
useEffect(()=>{
// Skip for return visitors
try{if(sessionStorage.getItem('ddc-seen')){onDone();return}}catch(e){}
timers.current=[setTimeout(()=>setP(1),200),setTimeout(()=>setP(2),1200),setTimeout(()=>setP(3),2400),setTimeout(finish,3200)];
return()=>timers.current.forEach(t=>clearTimeout(t))},[]);
return(<div onClick={finish} style={{position:"fixed",inset:0,zIndex:9999,background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",
opacity:p>=3?0:1,transition:"opacity 0.8s ease",pointerEvents:p>=3?"none":"all"}}>
{p>=1&&<div style={{animation:"fadeIn 0.8s ease",position:"relative",textAlign:"center"}}>
<Logo size={140} style={{margin:"0 auto"}}/>
<div style={{position:"absolute",inset:-30,borderRadius:8,boxShadow:`0 0 ${p>=2?120:30}px ${p>=2?60:15}px rgba(200,169,81,${p>=2?0.2:0.06})`,transition:"all 1s ease"}}/>
</div>}
{p>=2&&<div style={{animation:"fadeUp 0.8s ease",textAlign:"center",marginTop:28}}>
<h1 style={{fontFamily:CG,fontSize:"clamp(32px,8vw,56px)",fontWeight:700,color:CR,lineHeight:1,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>The Dead Dads Club</h1>
<p style={{fontFamily:CG,fontSize:"clamp(16px,3vw,22px)",color:CR,fontStyle:"italic",letterSpacing:2,opacity:0.85}}>
The only club you never wanted to join.</p></div>}
{p>=1&&<p style={{position:"absolute",bottom:32,fontSize:14,color:"#666",letterSpacing:2,animation:"fadeIn 1s ease"}}>{isTouch?"tap":"click"} anywhere to skip</p>}
</div>)}

function Nav(){const[s,setS]=useState(false);
useEffect(()=>{const h=()=>setS(window.scrollY>80);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
return(<nav role="navigation" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",
background:s?"rgba(8,8,8,0.95)":"transparent",borderBottom:s?`1px solid ${DB}`:"1px solid transparent",backdropFilter:s?"blur(16px)":"none",transition:"all 0.4s ease"}}>
<a href="#top" style={{display:"flex",alignItems:"center",gap:12,textDecoration:"none"}}><Logo size={34}/>
<span style={{fontFamily:CG,fontSize:17,fontWeight:700,color:CR,letterSpacing:2}}>DDC</span></a>
<div style={{display:"flex",gap:24,alignItems:"center"}}>
<a href="#memorial-wall" className="hide-mobile" style={{color:"#999",fontSize:14,textDecoration:"none",letterSpacing:2,textTransform:"uppercase"}}>Wall</a>
<a href="#the-box" className="hide-mobile" style={{color:"#999",fontSize:14,textDecoration:"none",letterSpacing:2,textTransform:"uppercase"}}>Box</a>
<a href="#quiz" className="hide-mobile" style={{color:"#999",fontSize:14,textDecoration:"none",letterSpacing:2,textTransform:"uppercase"}}>Quiz</a>
<a href="#top" style={{padding:"10px 24px",border:`1px solid ${G}`,color:G,fontSize:14,textDecoration:"none",letterSpacing:3,textTransform:"uppercase",borderRadius:3,fontWeight:600}}>Join</a>
</div></nav>)}

// ━━━ STICKY BAR ━━━
function StickyBar({count}){const[show,setShow]=useState(false);const[email,setEmail]=useState("");const[done,setDone]=useState(false);const[sub,setSub]=useState(false);
useEffect(()=>{const h=()=>setShow(window.scrollY>window.innerHeight);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
const go=async()=>{if(!email||!email.includes("@")||sub)return;setSub(true);try{await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})})}catch(e){}setDone(true);setSub(false)};
if(!show||done)return null;
return(<div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:99,background:"rgba(8,8,8,0.96)",borderTop:`1px solid ${G}30`,padding:"12px 16px",backdropFilter:"blur(16px)"}}>
<div style={{maxWidth:500,margin:"0 auto",display:"flex",gap:8,alignItems:"center"}}>
<span style={{fontSize:14,color:G,fontWeight:600,whiteSpace:"nowrap",letterSpacing:1}}>{Math.max(100-(count||0),0)} left</span>
<input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}
style={{flex:1,padding:"12px 14px",background:"#0D0D0D",border:`1px solid ${DB}`,borderRadius:3,color:CR,fontFamily:OF,fontSize:15,outline:"none",minWidth:0}}/>
<button onClick={go} disabled={sub} style={{padding:"12px 20px",background:G,color:D,border:"none",borderRadius:3,fontFamily:OF,fontSize:14,fontWeight:700,letterSpacing:2,textTransform:"uppercase",cursor:"pointer"}}>
{sub?"...":"Join"}</button></div></div>)}

// ━━━ HERO ━━━
function Hero({onCount}){const[email,setEmail]=useState("");const[submitted,setSub]=useState(false);const[submitting,setIng]=useState(false);
const[wc,setWc]=useState(null);const[rj,setRj]=useState([]);const[ti,setTi]=useState(0);const[err,setErr]=useState("");const[myNum,setMyNum]=useState(null);
const[ref,vis]=useInView(0.05);const CAP=100;
useEffect(()=>{fetch("/api/waitlist-count").then(r=>r.json()).then(d=>{setWc(d.count||0);setRj(d.recent||[]);onCount(d.count||0)}).catch(()=>setWc(0))},[submitted]);
useEffect(()=>{if(!rj.length)return;const t=setInterval(()=>setTi(i=>(i+1)%rj.length),4000);return()=>clearInterval(t)},[rj]);
const submit=async()=>{const e=email.trim().toLowerCase();if(!e||!e.includes("@")||!e.split("@")[1]?.includes(".")){setErr("Enter a valid email");return}
if(submitting)return;setErr("");setIng(true);
try{const r=await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e})});
if(!r.ok){setErr("Something went wrong");setIng(false);return}}catch(x){setErr("Network error");setIng(false);return}
setMyNum((wc||0)+1);setSub(true);setIng(false);setEmail("")};
const pct=wc===null?0:Math.min((wc/CAP)*100,100);const left=wc===null?null:Math.max(CAP-wc,0);
function ago(d){const m=Math.floor((Date.now()-new Date(d).getTime())/60000);if(m<1)return"just now";if(m<60)return m+"m ago";const h=Math.floor(m/60);return h<24?h+"h ago":Math.floor(h/24)+"d ago"}

return(<section id="top" ref={ref} style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"80px 20px 80px",position:"relative",overflow:"hidden",textAlign:"center"}}>
<div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 35%,#18120a 0%,${D} 70%)`,zIndex:0}}/>
<div style={{position:"relative",zIndex:1,maxWidth:700,width:"100%",opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(30px)",transition:"all 1.2s ease"}}>

{/* Logo icon (skeleton only — no baked text) + title as real HTML */}
<div style={{marginBottom:20}}><Logo size={160} style={{margin:"0 auto",maxWidth:"45vw"}}/></div>
<h1 style={{fontFamily:CG,fontSize:"clamp(40px,10vw,72px)",fontWeight:700,color:CR,lineHeight:1,letterSpacing:2,marginBottom:8,textTransform:"uppercase"}}>
The Dead<br/>Dads Club</h1>
<GDiv/>
<p style={{fontFamily:CG,fontSize:"clamp(20px,4vw,28px)",color:CR,fontStyle:"italic",marginTop:20,marginBottom:44,letterSpacing:1,opacity:0.85}}>
The only club you never wanted to join.</p>

{!submitted?(<div><div style={{display:"flex",gap:0,maxWidth:460,margin:"0 auto",borderRadius:3,overflow:"hidden",border:`1px solid ${err?RD:DB}`}}>
<input type="email" placeholder="Your email" value={email} onChange={e=>{setEmail(e.target.value);if(err)setErr("")}}
onKeyDown={e=>e.key==="Enter"&&submit()}
style={{flex:1,padding:"18px 20px",background:"#0D0D0D",border:"none",color:CR,fontFamily:OF,fontSize:17,outline:"none"}}/>
<button onClick={submit} disabled={submitting}
style={{padding:"18px 32px",background:G,color:D,border:"none",cursor:"pointer",fontFamily:OF,fontSize:14,fontWeight:700,letterSpacing:3,textTransform:"uppercase",opacity:submitting?0.5:1,whiteSpace:"nowrap"}}>
{submitting?"...":"Join"}</button></div>
{err&&<p style={{color:RD,fontSize:14,marginTop:10}}>{err}</p>}</div>):

(<div style={{padding:"28px 36px",border:`1px solid ${G}`,borderRadius:4,background:GD,animation:"fadeUp 0.6s ease"}}>
<p style={{fontFamily:CG,fontSize:40,color:G,fontWeight:700,lineHeight:1.2}}>Brother #{myNum}</p>
<p style={{color:CR,fontSize:16,marginTop:6,letterSpacing:1}}>Founding Member · Est. MMXXVI</p>
<p style={{color:"#aaa",fontSize:14,marginTop:12}}>Screenshot this. You earned your place.</p></div>)}

<div style={{maxWidth:400,margin:"32px auto 0"}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
<span style={{fontSize:14,color:G,fontWeight:600,letterSpacing:1}}>{wc===null?"—":wc} of {CAP} Founding Spots</span>
{left!==null&&<span style={{fontSize:14,color:left<=15?RD:"#666",fontWeight:left<=15?600:400}}>{left<=0?"SOLD OUT":`${left} left`}</span>}
</div>
<div style={{height:5,background:"#1a1a1a",borderRadius:3,overflow:"hidden"}}>
<div style={{height:"100%",background:`linear-gradient(90deg,${G},${GL})`,borderRadius:3,width:`${pct}%`,transition:"width 2s ease",boxShadow:`0 0 8px ${G}30`}}/></div></div>

{rj.length>0&&<div style={{marginTop:20,height:24,overflow:"hidden"}} aria-live="polite"><div key={ti} style={{fontSize:14,color:"#888",animation:"fadeUp 0.5s ease"}}>
<span style={{color:`${GL}99`}}>{rj[ti]?.name}</span> joined · {ago(rj[ti]?.time)}</div></div>}
<p style={{marginTop:14,fontSize:14,color:"#777"}}>Founding Members lock in their rate for life.</p>
</div>
<div style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",animation:"pulse 2.5s infinite"}} aria-hidden="true">
<svg width="18" height="28" viewBox="0 0 20 30" fill="none"><rect x="1" y="1" width="18" height="28" rx="9" stroke={G} strokeWidth="1" opacity="0.3"/>
<circle cx="10" cy="10" r="1.5" fill={G} opacity="0.5"><animate attributeName="cy" values="10;20;10" dur="2.5s" repeatCount="indefinite"/></circle></svg></div>
</section>)}

function TQ({quote,who}){const[r,v]=useInView();
return(<div ref={r} style={{padding:"72px 24px",background:D,textAlign:"center",opacity:v?1:0,transform:v?"translateY(0)":"translateY(16px)",transition:"all 1s ease"}}>
<div style={{maxWidth:560,margin:"0 auto"}}><div style={{color:`${G}40`,fontSize:32,fontFamily:CG,marginBottom:12}}>"</div>
<p style={{fontFamily:CG,fontSize:"clamp(20px,3vw,26px)",color:"#ccc",fontStyle:"italic",lineHeight:1.7}}>{quote}</p>
<p style={{color:"#888",fontSize:14,marginTop:20,letterSpacing:3,textTransform:"uppercase"}}>— {who}</p></div></div>)}

function Stats(){const[r,v]=useInView();const st=[{n:"51.7M",l:"American men with a deceased father"},{n:"25%",l:"of children grow up fatherless"},{n:"85%",l:"of youth in prison — fatherless homes"},{n:"0",l:"premium communities serving them"}];
return(<SW bg="#0D0D0D"><div ref={r} style={{maxWidth:900,margin:"0 auto",textAlign:"center"}}><SL text="The Crisis"/>
<h2 style={{fontFamily:CG,fontSize:"clamp(36px,6vw,56px)",fontWeight:700,color:CR,marginBottom:16,lineHeight:1.1}}>Nobody's Coming to Save Us.</h2>
<p style={{color:"#999",fontSize:17,maxWidth:520,margin:"0 auto 56px",lineHeight:1.8}}>America has a fatherlessness crisis. The Surgeon General declared loneliness a public health epidemic. Yet no premium, secular brotherhood exists for these men.</p>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:16}}>{st.map((s,i)=>(<div key={i} style={{padding:"40px 20px",background:DC,border:`1px solid ${DB}`,borderRadius:3,
opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:`all 0.7s ease ${i*0.1}s`}}>
<div style={{fontFamily:CG,fontSize:48,fontWeight:700,color:G,marginBottom:10,lineHeight:1}}>{s.n}</div>
<div style={{fontSize:15,color:"#aaa",lineHeight:1.5}}>{s.l}</div></div>))}</div></div></SW>)}

function Pillars(){const[r,v]=useInView();const ps=[{i:"🤝",t:"The Brotherhood",d:"Private digital community. Weekly calls, accountability pods, and men who show up for each other."},{i:"📦",t:"The Box",d:"Monthly curated box. Dog tags, knives, letter kits. Every item answers one question."},{i:"📖",t:"The Vault",d:"Everything your dad should've taught you. Money, fitness, relationships, fatherhood."},{i:"🪦",t:"The Memorial Wall",d:"A permanent tribute to your father. On his anniversary, we call you."}];
return(<SW><div ref={r} style={{maxWidth:960,margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:64}}><SL text="What We Built"/>
<h2 style={{fontFamily:CG,fontSize:"clamp(36px,6vw,52px)",fontWeight:700,color:CR,lineHeight:1.1}}>Four Pillars. One Brotherhood.</h2></div>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:16}}>{ps.map((p,i)=>(<div key={i} style={{padding:"36px 24px",background:DC,border:`1px solid ${DB}`,borderRadius:3,
opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:`all 0.7s ease ${i*0.12}s`,position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",top:0,left:0,width:40,height:2,background:G}}/>
<div style={{fontSize:32,marginBottom:14}} aria-hidden="true">{p.i}</div>
<h3 style={{fontFamily:CG,fontSize:24,fontWeight:700,color:CR,marginBottom:10}}>{p.t}</h3>
<p style={{fontSize:15,color:"#aaa",lineHeight:1.7}}>{p.d}</p></div>))}</div></div></SW>)}

function BoxReveal(){const[r,v]=useInView();const[opened,setO]=useState(false);const[rc,setRc]=useState(0);
const items=[{icon:"🏷️",name:"Personalized Dog Tags",story:"Your father's name. Your name. Connected forever in steel."},{icon:"🔪",name:"EDC Pocket Knife",story:"The one he would've handed you and said 'Take care of this.'"},{icon:"🪙",name:"DDC Challenge Coin",story:"Carry it daily. You earned your place."},{icon:"✉️",name:"Letter-Writing Kit",story:"Write the letter you never got to send."},{icon:"⏳",name:"Brass Hourglass",story:"Time is the one thing we can't get back."},{icon:"📘",name:"The Father's Blueprint",story:"The financial freedom guide he should've left you."}];
useEffect(()=>{if(!opened)return;const t=setInterval(()=>setRc(c=>{if(c>=items.length){clearInterval(t);return c}return c+1}),350);return()=>clearInterval(t)},[opened]);
return(<SW bg="#080808" id="the-box"><div ref={r} style={{maxWidth:780,margin:"0 auto",position:"relative",zIndex:1,textAlign:"center"}}><SL text="The Welcome Box"/>
<h2 style={{fontFamily:CG,fontSize:"clamp(32px,5vw,48px)",fontWeight:700,color:CR,marginBottom:10,lineHeight:1.1}}>What Would Your Old Man<br/>Have Given You?</h2>
<p style={{color:"#999",fontSize:16,maxWidth:440,margin:"0 auto 44px",lineHeight:1.7}}>Every new member receives a Welcome Box. It's not a product. It's an initiation.</p>
{!opened?(<div onClick={()=>setO(true)} onKeyDown={e=>(e.key==="Enter"||e.key===" ")&&setO(true)} tabIndex={0} role="button" aria-label="Open the Welcome Box"
style={{width:210,height:210,margin:"0 auto",cursor:"pointer",position:"relative",opacity:v?1:0,transform:v?"scale(1)":"scale(0.85)",transition:"all 0.8s ease"}}>
<div style={{width:"100%",height:"100%",background:"#0D0D0D",border:`2px solid ${G}50`,borderRadius:6,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,
animation:"glow 3s ease infinite"}}><Logo size={80}/>
<span style={{fontSize:13,color:G,letterSpacing:4,textTransform:"uppercase",fontWeight:600}}>Welcome Box</span></div>
<div style={{position:"absolute",bottom:-34,left:"50%",transform:"translateX(-50%)",fontSize:14,color:`${G}99`,whiteSpace:"nowrap",animation:"pulse 2s infinite"}}>
{isTouch?"tap":"click"} to open</div></div>):
(<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12}}>{items.map((item,i)=>(<div key={i} style={{padding:"24px 20px",background:DC,border:`1px solid ${DB}`,borderRadius:3,
opacity:i<rc?1:0,transform:i<rc?"translateY(0)":"translateY(24px) scale(0.95)",transition:"all 0.5s ease",position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",top:0,left:0,width:32,height:2,background:G}}/>
<div style={{fontSize:36,marginBottom:10}} aria-hidden="true">{item.icon}</div>
<h4 style={{fontFamily:CG,fontSize:19,fontWeight:700,color:CR,marginBottom:6}}>{item.name}</h4>
<p style={{fontSize:14,color:"#aaa",lineHeight:1.6,fontStyle:"italic"}}>{item.story}</p></div>))}</div>)}</div></SW>)}

function VaultPreview(){const[r,v]=useInView();const[email,setEmail]=useState("");const[unlocked,setU]=useState(false);const[sub,setSub]=useState(false);
const go=async()=>{if(!email||!email.includes("@")||sub)return;setSub(true);try{await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})})}catch(e){}setU(true);setSub(false)};
return(<SW bg="#0D0D0D" id="vault"><div ref={r} style={{maxWidth:620,margin:"0 auto",textAlign:"center",opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:"all 0.8s ease"}}>
<SL text="Free Preview"/><h2 style={{fontFamily:CG,fontSize:"clamp(32px,5vw,44px)",fontWeight:700,color:CR,marginBottom:14,lineHeight:1.1}}>The Father's Blueprint</h2>
<p style={{color:"#999",fontSize:16,maxWidth:440,margin:"0 auto 28px",lineHeight:1.7}}>Chapter 1 of the financial freedom guide your dad should've left you.</p>
{!unlocked?(<div>
<div style={{padding:"28px 24px",background:DC,border:`1px solid ${DB}`,borderRadius:3,marginBottom:20,position:"relative",overflow:"hidden",textAlign:"left"}}>
<div style={{filter:"blur(5px)",userSelect:"none",pointerEvents:"none"}}>
<h3 style={{fontFamily:CG,fontSize:22,color:CR,fontWeight:700,marginBottom:12}}>Chapter 1: The Money Talk Nobody Had With You</h3>
<p style={{color:"#aaa",fontSize:15,lineHeight:1.9}}>Most men learn about money the hard way — through debt, through shame, through silence. If your old man was anything like mine, the closest thing to financial advice you got was "we can't afford it" or nothing at all...</p></div>
<div style={{position:"absolute",inset:0,background:`linear-gradient(transparent 10%,${DC} 85%)`,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:16}}>
<span style={{fontSize:14,color:G,letterSpacing:3,textTransform:"uppercase",fontWeight:600}}>🔒 Unlock free</span></div></div>
<div style={{display:"flex",gap:0,maxWidth:400,margin:"0 auto",borderRadius:3,overflow:"hidden",border:`1px solid ${DB}`}}>
<input type="email" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}
style={{flex:1,padding:"16px",background:"#0D0D0D",border:"none",color:CR,fontFamily:OF,fontSize:16,outline:"none"}}/>
<button onClick={go} disabled={sub} style={{padding:"16px 24px",background:G,color:D,border:"none",cursor:"pointer",fontFamily:OF,fontSize:14,fontWeight:700,letterSpacing:3,textTransform:"uppercase"}}>
{sub?"...":"Unlock"}</button></div></div>):
(<div style={{padding:"32px 28px",background:DC,border:`1px solid ${G}30`,borderRadius:3,textAlign:"left",animation:"fadeUp 0.6s ease"}}>
<h3 style={{fontFamily:CG,fontSize:24,color:CR,fontWeight:700,marginBottom:16}}>Chapter 1: The Money Talk Nobody Had With You</h3>
<p style={{color:"#ddd",fontSize:16,lineHeight:2,marginBottom:14}}>Most men learn about money the hard way — through debt, through shame, through silence.</p>
<p style={{color:"#ddd",fontSize:16,lineHeight:2,marginBottom:14}}>Here's what I wish someone had told me at 18: the first $1,000 you save isn't about money. It's about proving to yourself that you can build something from nothing.</p>
<div style={{marginTop:24,padding:"16px 20px",background:GD,borderRadius:3,borderLeft:`2px solid ${G}`}}>
<p style={{color:G,fontSize:15,fontWeight:500,fontStyle:"italic"}}>All 6 chapters are inside the Brotherhood.</p></div></div>)}</div></SW>)}

function FDCountdown(){const[r,v]=useInView();const FD=new Date("2026-06-21T00:00:00");const[tl,setTl]=useState({});const[past,setPast]=useState(false);
useEffect(()=>{const c=()=>{const d=FD-new Date();if(d<=0){setPast(true);return{d:0,h:0,m:0,s:0}}
return{d:Math.floor(d/864e5),h:Math.floor((d%864e5)/36e5),m:Math.floor((d%36e5)/6e4),s:Math.floor((d%6e4)/1e3)}};setTl(c());const t=setInterval(()=>setTl(c()),1000);return()=>clearInterval(t)},[]);
const us=[{v:tl.d,l:"Days"},{v:tl.h,l:"Hours"},{v:tl.m,l:"Min"},{v:tl.s,l:"Sec"}];
return(<SW><div ref={r} style={{maxWidth:640,margin:"0 auto",textAlign:"center",opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:"all 0.8s ease"}}>
<SL text="June 21, 2026"/><h2 style={{fontFamily:CG,fontSize:"clamp(32px,5vw,48px)",fontWeight:700,color:CR,marginBottom:14,lineHeight:1.1}}>
{past?"We Showed Up.":"The Hardest Day on the Calendar."}</h2>
<p style={{color:"#999",fontSize:16,maxWidth:460,margin:"0 auto 40px",lineHeight:1.7}}>
{past?"Father's Day has passed, but the Brotherhood endures.":"Father's Day is coming. For millions of men, it's a day of silence while the world celebrates."}</p>
{!past&&<div style={{display:"flex",justifyContent:"center",gap:14,flexWrap:"wrap",marginBottom:44}}>{us.map((u,i)=>(<div key={i} style={{width:85,padding:"20px 0",background:DC,border:`1px solid ${DB}`,borderRadius:3}}>
<div style={{fontFamily:CG,fontSize:38,fontWeight:700,color:G,lineHeight:1}}>{String(u.v||0).padStart(2,"0")}</div>
<div style={{fontSize:13,color:"#aaa",letterSpacing:2,textTransform:"uppercase",marginTop:6}}>{u.l}</div></div>))}</div>}
<a href="#memorial-wall" style={{display:"inline-block",padding:"16px 32px",background:G,color:D,textDecoration:"none",fontFamily:OF,fontSize:14,fontWeight:700,letterSpacing:2,textTransform:"uppercase",borderRadius:3}}>
Honor Your Father</a></div></SW>)}

// ━━━ SHAREABLE MEMORIAL CARD GENERATOR ━━━
function generateShareCard(entry){
  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  // Background
  ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, 1080, 1080);
  // Gold top line
  ctx.fillStyle = '#C8A951'; ctx.fillRect(0, 0, 1080, 3);
  // DDC text top
  ctx.fillStyle = '#C8A95180'; ctx.font = '600 14px Outfit, sans-serif'; ctx.letterSpacing = '6px';
  ctx.textAlign = 'center'; ctx.fillText('THE DEAD DADS CLUB', 540, 80);
  // Gold divider
  ctx.fillStyle = '#C8A951';
  const grd = ctx.createLinearGradient(440, 110, 640, 110);
  grd.addColorStop(0, 'transparent'); grd.addColorStop(0.5, '#C8A951'); grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd; ctx.fillRect(440, 110, 200, 2);
  // Father's name
  ctx.fillStyle = '#F5F0E8'; ctx.font = '700 52px "Cormorant Garamond", serif';
  ctx.textAlign = 'center';
  // Word wrap name
  const name = entry.father_name || '';
  if (name.length > 20) { ctx.font = '700 42px "Cormorant Garamond", serif'; }
  ctx.fillText(name, 540, 220);
  // Years
  if (entry.years) { ctx.fillStyle = '#C8A951'; ctx.font = '500 20px Outfit, sans-serif'; ctx.fillText(entry.years, 540, 270); }
  // Message
  ctx.fillStyle = '#cccccc'; ctx.font = 'italic 24px "Cormorant Garamond", serif';
  const words = (entry.message || '').split(' ');
  let line = '"'; let y = 360; const maxW = 800;
  for (const word of words) {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxW) { ctx.fillText(line, 540, y); y += 40; line = word + ' '; }
    else { line = test; }
  }
  ctx.fillText(line.trim() + '"', 540, y);
  // Submitted by
  if (entry.submitted_by) {
    ctx.fillStyle = '#666666'; ctx.font = '400 18px Outfit, sans-serif';
    ctx.fillText('— ' + entry.submitted_by, 540, y + 70);
  }
  // Bottom branding
  ctx.fillStyle = '#C8A95140'; ctx.fillRect(0, 1020, 1080, 1);
  ctx.fillStyle = '#555555'; ctx.font = '300 13px Outfit, sans-serif';
  ctx.fillText('thedeaddadsclub.com · The only club you never wanted to join.', 540, 1055);
  return canvas.toDataURL('image/png');
}

// ━━━ MEMORIAL WALL ━━━
function MemorialWall(){const[r,v]=useInView();const[entries,setE]=useState([]);const[sf,setSf]=useState(false);
const[form,setF]=useState({name:"",years:"",message:"",by:"",anniversary:""});const[sub,setSub]=useState(false);const[loading,setL]=useState(true);const[apiErr,setApiErr]=useState("");
const[showFunnel,setSFunnel]=useState(false);const[fEmail,setFEmail]=useState("");const[fDone,setFDone]=useState(false);const[lastEntry,setLE]=useState(null);
const seed=[{id:"s1",father_name:"Robert James Grossi",years:"1955 – 2008",message:"His last words cut deep. But every man I help build is a brick laid on top of that sentence. I carry you, old man.",submitted_by:"Kent"}];
useEffect(()=>{fetch("/api/memorials").then(r=>r.json()).then(d=>{if(d.entries?.length>0)setE(d.entries);setL(false)}).catch(()=>setL(false))},[]);
const add=async()=>{if(!form.name.trim()||!form.message.trim()||sub)return;if(form.name.trim().length<2){setApiErr("Enter your father's full name");return}
setSub(true);setApiErr("");
try{const r=await fetch("/api/memorials",{method:"POST",headers:{"Content-Type":"application/json"},
body:JSON.stringify({father_name:form.name.trim(),years:form.years.trim(),message:form.message.trim(),submitted_by:form.by.trim()||"Anonymous",anniversary_date:form.anniversary||null})});
const d=await r.json();if(!r.ok){setApiErr(d.error||"Something went wrong");setSub(false);return}
if(d.entry){setE(p=>[d.entry,...p]);setLE(d.entry);setSFunnel(true)}}catch(e){setApiErr("Network error")}
setF({name:"",years:"",message:"",by:"",anniversary:""});setSf(false);setSub(false)};
const fGo=async()=>{if(!fEmail||!fEmail.includes("@"))return;try{await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:fEmail})})}catch(e){}setFDone(true);setTimeout(()=>setSFunnel(false),2500)};
const shareCard=(entry)=>{const dataUrl=generateShareCard(entry);const link=document.createElement('a');link.download=`${entry.father_name.replace(/\s+/g,'-')}-DDC.png`;link.href=dataUrl;link.click()};
const de=entries.length>0?entries:seed;
const is={width:"100%",padding:"16px",background:"#0D0D0D",border:`1px solid ${DB}`,borderRadius:3,color:CR,fontFamily:OF,fontSize:16,outline:"none",marginBottom:14};

return(<SW bg="#080808" id="memorial-wall">
{/* Funnel Modal */}
{showFunnel&&lastEntry&&(<div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,backdropFilter:"blur(12px)"}}>
<div style={{maxWidth:440,width:"100%",padding:32,background:DC,border:`1px solid ${G}`,borderRadius:4,textAlign:"center",animation:"fadeUp 0.5s ease"}}>
{!fDone?(<><Logo size={52} style={{margin:"0 auto"}}/>
<div style={{width:32,height:1,background:G,margin:"16px auto"}}/>
<h3 style={{fontFamily:CG,fontSize:26,color:CR,fontWeight:700,marginBottom:10}}>His tribute is live.</h3>
<div style={{padding:"14px 18px",background:`${G}08`,border:`1px solid ${DB}`,borderRadius:3,marginBottom:16,textAlign:"left"}}>
<p style={{fontFamily:CG,fontSize:18,color:CR,fontWeight:700}}>{lastEntry.father_name}</p>
<p style={{fontSize:15,color:"#bbb",fontStyle:"italic",marginTop:8,lineHeight:1.6}}>"{lastEntry.message?.substring(0,80)}..."</p></div>
<button onClick={()=>shareCard(lastEntry)} style={{width:"100%",padding:"14px",background:"transparent",border:`1px solid ${DB}`,borderRadius:3,color:"#aaa",fontFamily:OF,fontSize:14,cursor:"pointer",marginBottom:16,letterSpacing:1}}>
📱 Download Shareable Card</button>
<p style={{color:"#aaa",fontSize:15,lineHeight:1.6,marginBottom:16}}>Join so we can <span style={{color:G,fontWeight:600}}>call you on his anniversary</span>.</p>
<div style={{display:"flex",gap:0,borderRadius:3,overflow:"hidden",border:`1px solid ${DB}`}}>
<input type="email" placeholder="Your email" value={fEmail} onChange={e=>setFEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fGo()}
style={{flex:1,padding:"16px",background:"#0D0D0D",border:"none",color:CR,fontFamily:OF,fontSize:16,outline:"none"}}/>
<button onClick={fGo} style={{padding:"16px 24px",background:G,color:D,border:"none",cursor:"pointer",fontFamily:OF,fontSize:14,fontWeight:700,letterSpacing:3,textTransform:"uppercase"}}>Join</button></div>
<button onClick={()=>setSFunnel(false)} style={{marginTop:14,background:"transparent",border:"none",color:"#888",fontFamily:OF,fontSize:14,cursor:"pointer"}}>Maybe later</button></>):
(<><Logo size={52} style={{margin:"0 auto"}}/><p style={{fontFamily:CG,fontSize:24,color:G,fontWeight:700,marginTop:16}}>Welcome, brother.</p>
<p style={{color:"#aaa",fontSize:15,marginTop:8}}>We'll be in touch on the day that matters most.</p></>)}
</div></div>)}

<div ref={r} style={{maxWidth:960,margin:"0 auto",position:"relative",zIndex:1}}>
<div style={{textAlign:"center",marginBottom:56}}>
<SL text="Honor Them"/><h2 style={{fontFamily:CG,fontSize:"clamp(36px,6vw,56px)",fontWeight:700,color:CR,marginBottom:14,lineHeight:1.1}}>The Memorial Wall</h2>
<p style={{color:"#999",fontSize:16,maxWidth:480,margin:"0 auto 32px",lineHeight:1.7}}>A permanent tribute. Because every father deserves to be remembered.</p>
{!sf?(<button onClick={()=>setSf(true)} style={{padding:"16px 40px",background:"transparent",border:`1px solid ${G}`,color:G,fontFamily:OF,fontSize:14,fontWeight:600,letterSpacing:3,textTransform:"uppercase",cursor:"pointer",borderRadius:3}}>
✝ Honor Your Father</button>):
(<div style={{maxWidth:460,margin:"0 auto",padding:28,background:DC,border:`1px solid ${DB}`,borderRadius:4,textAlign:"left",animation:"fadeUp 0.4s ease"}}>
<h4 style={{fontFamily:CG,fontSize:22,color:CR,marginBottom:20}}>Create a Tribute</h4>
<input style={is} placeholder="Father's full name" value={form.name} onChange={e=>setF({...form,name:e.target.value.slice(0,200)})} maxLength={200}/>
<input style={is} placeholder="Years (e.g. 1955 – 2008)" value={form.years} onChange={e=>setF({...form,years:e.target.value.slice(0,50)})} maxLength={50}/>
<div style={{marginBottom:14}}><label style={{fontSize:14,color:`${G}99`,letterSpacing:2,textTransform:"uppercase",fontWeight:500,marginBottom:6,display:"block"}}>Date of passing</label>
<input type="date" style={{...is,marginBottom:0,colorScheme:"dark"}} value={form.anniversary} onChange={e=>setF({...form,anniversary:e.target.value})}/>
<p style={{fontSize:14,color:"#777",marginTop:4,fontStyle:"italic"}}>We'll remember him with you on this day each year.</p></div>
<div style={{position:"relative"}}><textarea style={{...is,minHeight:90,resize:"vertical"}} placeholder="Your message to him..." value={form.message}
onChange={e=>setF({...form,message:e.target.value.slice(0,2000)})} maxLength={2000}/>
<span style={{position:"absolute",bottom:20,right:10,fontSize:12,color:form.message.length>1800?RD:"#666"}}>{form.message.length}/2000</span></div>
<input style={is} placeholder="Your first name (optional)" value={form.by} onChange={e=>setF({...form,by:e.target.value.slice(0,100)})} maxLength={100}/>
{apiErr&&<p style={{color:RD,fontSize:14,marginBottom:8}}>{apiErr}</p>}
<div style={{display:"flex",gap:10,marginTop:4}}><button onClick={add} disabled={sub} style={{flex:1,padding:"16px",background:G,color:D,border:"none",borderRadius:3,fontFamily:OF,fontSize:14,fontWeight:700,letterSpacing:2,cursor:"pointer",textTransform:"uppercase",opacity:sub?0.5:1}}>
{sub?"Placing...":"Place on the Wall"}</button>
<button onClick={()=>{setSf(false);setApiErr("")}} style={{padding:"16px 20px",background:"transparent",color:"#666",border:`1px solid ${DB}`,borderRadius:3,fontFamily:OF,fontSize:14,cursor:"pointer"}}>Cancel</button></div></div>)}</div>

{loading?<div style={{textAlign:"center",padding:48}}><div style={{width:24,height:24,border:`2px solid ${DB}`,borderTopColor:G,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto"}}/>
<style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>:
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>{de.map((e,i)=>(<div key={e.id} style={{padding:"28px 24px",background:DC,border:`1px solid ${DB}`,borderRadius:3,position:"relative",overflow:"hidden",
opacity:v?1:0,transform:v?"translateY(0)":"translateY(20px)",transition:`all 0.7s ease ${i*0.08}s`}}>
<div style={{position:"absolute",top:0,left:0,width:36,height:2,background:G}}/>
<h4 style={{fontFamily:CG,fontSize:22,fontWeight:700,color:CR,marginBottom:4}}>{e.father_name}</h4>
{e.years&&<p style={{fontSize:14,color:G,letterSpacing:2,marginBottom:14,fontWeight:500}}>{e.years}</p>}
<p style={{fontSize:15,color:"#bbb",lineHeight:1.7,fontStyle:"italic"}}>"{e.message}"</p>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:16}}>
{e.submitted_by&&<span style={{fontSize:14,color:"#888"}}>— {e.submitted_by}</span>}
<button onClick={()=>shareCard(e)} title="Download shareable card" style={{background:"transparent",border:`1px solid ${DB}`,borderRadius:3,padding:"8px 14px",color:"#888",fontSize:14,cursor:"pointer",fontFamily:OF}}>
📱 Share</button></div></div>))}</div>}</div></SW>)}

function CallDemo(){const[r,v]=useInView();const[playing,setP]=useState(false);const[li,setLi]=useState(-1);const tr=useRef([]);
const lines=[{d:0,t:"📱  Your phone rings.",s:0},{d:1200,t:"It's March 15th — the day your father passed.",s:0},{d:3000,t:'"Hey brother, it\'s Kent."',s:1},{d:5000,t:'"I know what today is. I just wanted you to know — you\'re not alone today."',s:1},{d:7500,t:'"Your old man would be proud of the man you\'ve become."',s:1},{d:10000,t:'"The Brotherhood is here. We see you. We\'ve got you."',s:1},{d:12500,t:"This is the call that changes everything.",s:2}];
const start=()=>{tr.current.forEach(t=>clearTimeout(t));setP(true);setLi(0);tr.current=lines.map((l,i)=>setTimeout(()=>setLi(i),l.d))};
useEffect(()=>()=>tr.current.forEach(t=>clearTimeout(t)),[]);
return(<SW><div ref={r} style={{maxWidth:540,margin:"0 auto",textAlign:"center",opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:"all 0.8s ease"}}>
<SL text="The Moat"/><h2 style={{fontFamily:CG,fontSize:"clamp(32px,5vw,48px)",fontWeight:700,color:CR,marginBottom:14,lineHeight:1.1}}>The Call That Changes Everything</h2>
<p style={{color:"#999",fontSize:16,maxWidth:420,margin:"0 auto 36px",lineHeight:1.7}}>On the anniversary of your father's passing, your phone rings.</p>
{!playing?(<button onClick={start} aria-label="Play demo" style={{width:80,height:80,borderRadius:"50%",background:G,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",boxShadow:`0 0 24px ${G}30`,animation:"glow 3s ease infinite"}}>
<svg width="28" height="28" viewBox="0 0 24 24" fill={D}><path d="M8 5v14l11-7z"/></svg></button>):
(<div style={{maxWidth:480,margin:"0 auto",padding:"28px 24px",background:DC,border:`1px solid ${DB}`,borderRadius:6,textAlign:"left",minHeight:260}}>
<div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,paddingBottom:14,borderBottom:`1px solid ${DB}`}}>
<div style={{width:40,height:40,borderRadius:"50%",overflow:"hidden",flexShrink:0}}><Logo size={40}/></div>
<div><div style={{fontSize:15,color:CR,fontWeight:600}}>Dead Dads Club</div><div style={{fontSize:14,color:"#4CAF50",fontWeight:500}}>Incoming Call</div></div></div>
<div role="log" aria-live="polite" style={{display:"flex",flexDirection:"column",gap:14}}>{lines.map((l,i)=>{if(i>li)return null;
return(<div key={i} style={{animation:"fadeUp 0.4s ease",padding:l.s===1?"12px 16px":"0",background:l.s===1?`${G}08`:"transparent",borderLeft:l.s===1?`2px solid ${G}40`:"none",borderRadius:l.s===1?"0 3px 3px 0":0}}>
<p style={{fontSize:l.s===2?14:17,color:l.s===1?CR:l.s===2?G:"#aaa",fontFamily:l.s===1?CG:OF,fontStyle:l.s===1?"italic":"normal",fontWeight:l.s===2?600:300,lineHeight:1.6}}>{l.t}</p></div>)})}</div>
{li>=lines.length-1&&(<div style={{marginTop:24,display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
<a href="#top" style={{padding:"14px 28px",background:G,color:D,textDecoration:"none",fontFamily:OF,fontSize:14,fontWeight:700,letterSpacing:2,textTransform:"uppercase",borderRadius:3}}>Join</a>
<button onClick={()=>{setLi(-1);setP(false);setTimeout(start,100)}} style={{padding:"14px 20px",background:"transparent",border:`1px solid ${DB}`,color:"#aaa",borderRadius:3,fontFamily:OF,fontSize:14,cursor:"pointer"}}>↻ Replay</button></div>)}</div>)}</div></SW>)}

function Quiz(){const[r,v]=useInView();const[step,setS]=useState(0);const[ans,setA]=useState([]);const[email,setE]=useState("");const[sent,setSent]=useState(false);const[err,setErr]=useState("");const[myNum,setMyNum]=useState(null);
const qs=[{q:"Did you learn to shave from YouTube — or just figured it out?",y:"Figured it out alone",n:"Someone taught me"},{q:"Do you dread Father's Day every year?",y:"Every single year",n:"Not really"},{q:"Have you ever had to teach yourself something you knew a dad should've taught you?",y:"More times than I can count",n:"Not that I remember"},{q:"When something goes wrong, is your first instinct to handle it completely alone?",y:"Always",n:"I reach out"},{q:"Do you ever feel like you're performing 'being a man' instead of actually knowing how?",y:"That hits close",n:"I feel confident"}];
const score=ans.filter(a=>a==="y").length;
const msgs=[{mn:0,mx:1,m:"You had some guidance. But if you felt something reading these — the Brotherhood is open."},{mn:2,mx:3,m:"You've carried more than most people know. You figured out things no kid should have to alone."},{mn:4,mx:5,m:"You built yourself from scratch. No blueprint, no safety net. 51.7 million men know what that's like."}];
const rm=msgs.find(x=>score>=x.mn&&score<=x.mx)?.m||"";
const es=async()=>{if(!email||!email.includes("@")||!email.split("@")[1]?.includes(".")){setErr("Enter a valid email");return}
try{const c=await fetch("/api/waitlist-count").then(r=>r.json());setMyNum((c.count||0)+1)}catch(e){}
try{await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})})}catch(e){}setSent(true)};
const bs=(g)=>({flex:1,padding:"18px 20px",background:g?G:"transparent",color:g?D:CR,border:g?"none":`1px solid ${DB}`,borderRadius:3,fontFamily:OF,fontSize:16,fontWeight:500,cursor:"pointer"});
return(<SW bg="#080808" id="quiz"><div ref={r} style={{maxWidth:560,margin:"0 auto",textAlign:"center",opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:"all 0.8s ease"}}>
<SL text="Find Out"/><h2 style={{fontFamily:CG,fontSize:"clamp(32px,5vw,48px)",fontWeight:700,color:CR,marginBottom:14,lineHeight:1.1}}>Did You Figure It Out Alone?</h2>
{step===0&&(<div><p style={{color:"#999",fontSize:17,lineHeight:1.7,marginBottom:36}}>Five questions. No right answers. Just the truth.</p>
<button onClick={()=>setS(1)} style={{padding:"18px 48px",background:G,color:D,border:"none",borderRadius:3,fontFamily:OF,fontSize:15,fontWeight:700,letterSpacing:3,textTransform:"uppercase",cursor:"pointer"}}>Start</button></div>)}
{step>=1&&step<=5&&(<div key={step} style={{animation:"fadeUp 0.4s ease"}}>
<div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:36}}>{[1,2,3,4,5].map(i=>(<div key={i} style={{width:40,height:3,borderRadius:2,background:i<=step?G:DB}}/>))}</div>
<p style={{fontFamily:CG,fontSize:26,color:CR,lineHeight:1.5,fontStyle:"italic",marginBottom:40}}>"{qs[step-1].q}"</p>
<div style={{display:"flex",gap:12,flexWrap:"wrap"}}><button onClick={()=>{setA([...ans,"y"]);setS(step+1)}} style={bs(true)}>{qs[step-1].y}</button>
<button onClick={()=>{setA([...ans,"n"]);setS(step+1)}} style={bs(false)}>{qs[step-1].n}</button></div></div>)}
{step===6&&(<div style={{animation:"fadeUp 0.5s ease"}}><div style={{fontFamily:CG,fontSize:64,color:G,fontWeight:700,marginBottom:10,lineHeight:1}}>{score}/5</div>
<p style={{fontFamily:CG,fontSize:22,color:CR,lineHeight:1.7,fontStyle:"italic",maxWidth:440,margin:"0 auto 32px"}}>{rm}</p>
{!sent?(<div><div style={{display:"flex",gap:0,maxWidth:400,margin:"0 auto",borderRadius:3,overflow:"hidden",border:`1px solid ${err?RD:DB}`}}>
<input type="email" placeholder="Your email" value={email} onChange={e=>{setE(e.target.value);if(err)setErr("")}} onKeyDown={e=>e.key==="Enter"&&es()}
style={{flex:1,padding:"16px",background:"#0D0D0D",border:"none",color:CR,fontFamily:OF,fontSize:16,outline:"none"}}/>
<button onClick={es} style={{padding:"16px 24px",background:G,color:D,border:"none",cursor:"pointer",fontFamily:OF,fontSize:14,fontWeight:700,letterSpacing:3,textTransform:"uppercase"}}>Join</button></div>
{err&&<p style={{color:RD,fontSize:14,marginTop:8}}>{err}</p>}</div>):
(<div style={{padding:"24px",border:`1px solid ${G}`,borderRadius:3,background:GD}}>
{myNum&&<p style={{fontFamily:CG,fontSize:32,color:G,fontWeight:700}}>Brother #{myNum}</p>}
<p style={{color:CR,fontSize:16,marginTop:4}}>Welcome to the Brotherhood.</p></div>)}
<button onClick={()=>{setS(0);setA([]);setSent(false);setE("");setErr("");setMyNum(null)}} style={{marginTop:20,padding:"10px 20px",background:"transparent",border:`1px solid ${DB}`,color:"#aaa",borderRadius:3,fontFamily:OF,fontSize:14,cursor:"pointer"}}>↻ Retake</button>
</div>)}</div></SW>)}

function Pricing(){const[r,v]=useInView();const ts=[{name:"Brotherhood",price:39,feat:["Private community","Weekly live calls","Accountability pods","Full Vault access","Memorial Wall"],a:false},{name:"Brotherhood + Box",price:69,tag:"POPULAR",feat:["Everything in Brotherhood","Monthly curated DDC Box","Welcome Box on signup","Box-only content","Early event access"],a:true},{name:"Inner Circle",price:149,feat:["Everything in Tier 2","1:1 mentoring","Private IC calls","Event priority","Direct founder access"],a:false}];
return(<SW id="pricing"><div ref={r} style={{maxWidth:960,margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:56}}><SL text="Join"/>
<h2 style={{fontFamily:CG,fontSize:"clamp(36px,6vw,52px)",fontWeight:700,color:CR,marginBottom:14,lineHeight:1.1}}>Choose Your Brotherhood.</h2>
<p style={{color:"#999",fontSize:17}}>Founding members lock in their rate for life.</p></div>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16,alignItems:"start"}}>{ts.map((t,i)=>(<div key={i} style={{padding:"40px 28px",background:t.a?`${G}06`:DC,border:`1px solid ${t.a?`${G}40`:DB}`,borderRadius:3,position:"relative",overflow:"hidden",
opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:`all 0.7s ease ${i*0.1}s`}}>
{t.a&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:G}}/>}
{t.tag&&<div style={{position:"absolute",top:16,right:-28,background:G,color:D,fontSize:11,fontWeight:700,padding:"4px 32px",transform:"rotate(45deg)",letterSpacing:2}}>{t.tag}</div>}
<h3 style={{fontFamily:CG,fontSize:26,fontWeight:700,color:CR,marginBottom:10}}>{t.name}</h3>
<div style={{marginBottom:28}}><span style={{fontFamily:CG,fontSize:52,fontWeight:700,color:G}}>${t.price}</span><span style={{fontSize:16,color:"#666"}}>/mo</span></div>
{t.feat.map((f,j)=>(<div key={j} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
<div style={{width:5,height:5,borderRadius:"50%",background:G,flexShrink:0}}/>
<span style={{fontSize:16,color:"#bbb"}}>{f}</span></div>))}
<a href="#top" style={{display:"block",width:"100%",marginTop:28,padding:"16px",textAlign:"center",background:t.a?G:"transparent",color:t.a?D:G,border:t.a?"none":`1px solid ${G}50`,borderRadius:3,
fontFamily:OF,fontSize:14,fontWeight:700,letterSpacing:2,textTransform:"uppercase",textDecoration:"none"}}>Join the Waitlist</a></div>))}</div></div></SW>)}

function Founder(){const[r,v]=useInView();return(<SW bg="#080808"><div ref={r} style={{maxWidth:640,margin:"0 auto",textAlign:"center",opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:"all 0.8s ease"}}>
<Logo size={240} full={true} style={{margin:"0 auto",maxWidth:"70vw"}}/><div style={{margin:"28px auto",width:48,height:1,background:G}}/>
<blockquote style={{fontFamily:CG,fontSize:"clamp(22px,3.5vw,30px)",color:CR,lineHeight:1.7,fontStyle:"italic",marginBottom:24}}>
"DDC exists because nobody showed up for us. Nobody called. Nobody sent a box. Nobody said 'I know what this day feels like.'"</blockquote>
<p style={{color:G,fontSize:14,fontWeight:600,letterSpacing:3,textTransform:"uppercase"}}>Kent Grossi</p>
<p style={{color:"#666",fontSize:14,marginTop:4,letterSpacing:1}}>Founder & CEO</p>
<p style={{color:"#aaa",fontSize:16,lineHeight:1.9,marginTop:28,maxWidth:520,margin:"28px auto 0"}}>From homelessness to building a commercial roofing company in Southwest Florida. Self-made, self-taught, and intimately familiar with figuring out manhood without a roadmap.</p></div></SW>)}

function ExitIntent(){const[show,setShow]=useState(false);const[email,setEmail]=useState("");const[done,setDone]=useState(false);const fired=useRef(false);
useEffect(()=>{if(isTouch)return;const h=(e)=>{if(e.clientY<5&&!fired.current){fired.current=true;setShow(true)}};
document.addEventListener("mouseout",h);return()=>document.removeEventListener("mouseout",h)},[]);
const go=async()=>{if(!email||!email.includes("@"))return;try{await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})})}catch(e){}setDone(true);setTimeout(()=>setShow(false),2000)};
if(!show)return null;
return(<div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,backdropFilter:"blur(12px)"}}>
<div style={{maxWidth:420,width:"100%",padding:32,background:DC,border:`1px solid ${G}`,borderRadius:4,textAlign:"center",animation:"fadeUp 0.4s ease",position:"relative"}}>
<button onClick={()=>setShow(false)} style={{position:"absolute",top:10,right:14,background:"transparent",border:"none",color:"#999",fontSize:24,cursor:"pointer"}}>×</button>
<Logo size={52} style={{margin:"0 auto"}}/><div style={{width:32,height:1,background:G,margin:"16px auto"}}/>
<h3 style={{fontFamily:CG,fontSize:26,color:CR,fontWeight:700,marginBottom:10}}>Before you go.</h3>
<p style={{color:"#aaa",fontSize:16,lineHeight:1.6,marginBottom:20}}>51.7 million men share this. You don't have to carry it alone.</p>
{!done?(<div style={{display:"flex",gap:0,borderRadius:3,overflow:"hidden",border:`1px solid ${DB}`}}>
<input type="email" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}
style={{flex:1,padding:"16px",background:"#0D0D0D",border:"none",color:CR,fontFamily:OF,fontSize:16,outline:"none"}}/>
<button onClick={go} style={{padding:"16px 24px",background:G,color:D,border:"none",cursor:"pointer",fontFamily:OF,fontSize:14,fontWeight:700,letterSpacing:3,textTransform:"uppercase"}}>Join</button></div>):
(<p style={{color:G,fontWeight:500,fontSize:17}}>Welcome, brother.</p>)}</div></div>)}

function Footer(){return(<footer style={{padding:"56px 24px 120px",background:D,borderTop:`1px solid ${DB}`,textAlign:"center"}}>
<Logo size={180} full={true} style={{margin:"0 auto",maxWidth:"50vw"}}/>
<p style={{color:"#666",fontSize:14,marginTop:24,letterSpacing:3,textTransform:"uppercase"}}>The Dead Dads Club · {new Date().getFullYear()}</p>
<p style={{color:"#777",fontSize:14,marginTop:8,letterSpacing:1}}>The only club you never wanted to join.</p></footer>)}

// ━━━ ADMIN DASHBOARD (route: /admin) ━━━
function Admin(){const[data,setData]=useState(null);const[loading,setL]=useState(true);const[key,setKey]=useState("");const[authed,setA]=useState(false);
const load=async(k)=>{setL(true);try{const r=await fetch(`/api/admin?key=${k}`);const d=await r.json();if(r.ok){setData(d);setA(true)}else{alert("Wrong key")}}catch(e){alert("Error")}setL(false)};
if(!authed)return(<div style={{minHeight:"100vh",background:D,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
<div style={{maxWidth:360,width:"100%",textAlign:"center"}}><Logo size={60} style={{margin:"0 auto"}}/><h2 style={{fontFamily:CG,fontSize:28,color:CR,marginTop:20,marginBottom:20}}>Admin</h2>
<div style={{display:"flex",gap:0,borderRadius:3,overflow:"hidden",border:`1px solid ${DB}`}}>
<input type="password" placeholder="Admin key" value={key} onChange={e=>setKey(e.target.value)} onKeyDown={e=>e.key==="Enter"&&load(key)}
style={{flex:1,padding:"16px",background:"#0D0D0D",border:"none",color:CR,fontFamily:OF,fontSize:16,outline:"none"}}/>
<button onClick={()=>load(key)} style={{padding:"16px 24px",background:G,color:D,border:"none",cursor:"pointer",fontFamily:OF,fontSize:14,fontWeight:700,letterSpacing:2}}>Go</button>
</div></div></div>);
if(loading||!data)return(<div style={{minHeight:"100vh",background:D,display:"flex",alignItems:"center",justifyContent:"center"}}><p style={{color:G,fontSize:16}}>Loading...</p></div>);
const{stats,waitlist,memorials}=data;
return(<div style={{minHeight:"100vh",background:D,padding:"40px 24px",maxWidth:900,margin:"0 auto"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:40}}><div style={{display:"flex",alignItems:"center",gap:12}}>
<Logo size={36}/><h1 style={{fontFamily:CG,fontSize:28,color:CR}}>DDC Admin</h1></div>
<a href="/" style={{color:G,fontSize:14,textDecoration:"none",letterSpacing:2}}>← Site</a></div>
<div style={{display:"flex",gap:10,marginBottom:24}}>
<button onClick={()=>{const csv="email,joined\\n"+waitlist.map(w=>w.email+","+new Date(w.created_at).toLocaleDateString()).join("\\n");
const blob=new Blob([csv],{type:"text/csv"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="ddc-waitlist.csv";a.click()}}
style={{padding:"10px 20px",background:DC,border:`1px solid ${DB}`,borderRadius:3,color:"#aaa",fontFamily:OF,fontSize:14,cursor:"pointer"}}>📥 Export Waitlist CSV</button>
<button onClick={()=>{const csv="name,years,message,by,anniversary,created\\n"+memorials.map(m=>[m.father_name,m.years||"",m.message.replace(/,/g,";"),m.submitted_by,m.anniversary_date||"",new Date(m.created_at).toLocaleDateString()].join(",")).join("\\n");
const blob=new Blob([csv],{type:"text/csv"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="ddc-memorials.csv";a.click()}}
style={{padding:"10px 20px",background:DC,border:`1px solid ${DB}`,borderRadius:3,color:"#aaa",fontFamily:OF,fontSize:14,cursor:"pointer"}}>📥 Export Memorials CSV</button></div>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:16,marginBottom:40}}>
{[{n:stats.totalWaitlist,l:"Total Waitlist"},{n:stats.totalMemorials,l:"Total Memorials"},{n:stats.last24h,l:"Last 24h"},{n:stats.last7d,l:"Last 7 Days"}].map((s,i)=>(
<div key={i} style={{padding:"24px 20px",background:DC,border:`1px solid ${DB}`,borderRadius:3,textAlign:"center"}}>
<div style={{fontFamily:CG,fontSize:36,fontWeight:700,color:G}}>{s.n}</div><div style={{fontSize:14,color:"#aaa",marginTop:6}}>{s.l}</div></div>))}</div>
<h2 style={{fontFamily:CG,fontSize:24,color:CR,marginBottom:16}}>Waitlist ({waitlist.length})</h2>
<div style={{background:DC,border:`1px solid ${DB}`,borderRadius:3,overflow:"hidden",marginBottom:40}}>
<table style={{width:"100%",borderCollapse:"collapse"}}>
<thead><tr style={{borderBottom:`1px solid ${DB}`}}>
<th style={{padding:"14px 16px",textAlign:"left",color:G,fontSize:14,letterSpacing:2,fontWeight:600}}>Email</th>
<th style={{padding:"14px 16px",textAlign:"left",color:G,fontSize:14,letterSpacing:2,fontWeight:600}}>Joined</th>
</tr></thead>
<tbody>{waitlist.map(w=>(<tr key={w.id} style={{borderBottom:`1px solid ${DB}15`}}>
<td style={{padding:"12px 16px",color:CR,fontSize:15}}>{w.email}</td>
<td style={{padding:"12px 16px",color:"#888",fontSize:14}}>{new Date(w.created_at).toLocaleDateString()}</td>
</tr>))}</tbody></table></div>
<h2 style={{fontFamily:CG,fontSize:24,color:CR,marginBottom:16}}>Memorials ({memorials.length})</h2>
<div style={{display:"grid",gap:12}}>{memorials.map(m=>(<div key={m.id} style={{padding:"20px 24px",background:DC,border:`1px solid ${DB}`,borderRadius:3}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
<h4 style={{fontFamily:CG,fontSize:20,color:CR,fontWeight:700}}>{m.father_name}</h4>
<span style={{fontSize:14,color:"#888"}}>{new Date(m.created_at).toLocaleDateString()}</span></div>
{m.years&&<p style={{fontSize:14,color:G,marginBottom:6}}>{m.years}</p>}
{m.anniversary_date&&<p style={{fontSize:14,color:"#4CAF50",marginBottom:6}}>📅 Anniversary: {m.anniversary_date}</p>}
<p style={{fontSize:15,color:"#bbb",fontStyle:"italic",lineHeight:1.6}}>"{m.message}"</p>
<p style={{fontSize:14,color:"#888",marginTop:8}}>— {m.submitted_by}</p></div>))}</div></div>)}

export default function App(){
  const isAdmin=typeof window!=='undefined'&&window.location.pathname==='/admin';
  const[ic,setIC]=useState(isAdmin);const[wc,setWc]=useState(0);
  if(isAdmin)return<Admin/>;
  return(<div>{!ic&&<Intro onDone={()=>setIC(true)}/>}<Nav/><Hero onCount={setWc}/>
  <TQ quote="I've never told anyone this, but Father's Day is the worst day of my year. Every year I pretend I'm fine." who="Anonymous, 34, Chicago"/>
  <Stats/>
  <TQ quote="I learned to tie a tie from a YouTube video the morning of my wedding. I cried in the bathroom after." who="Anonymous, 29, Dallas"/>
  <Pillars/><BoxReveal/>
  <TQ quote="My son asked me 'what was grandpa like?' and I didn't have an answer. That's the day I knew I needed this." who="Anonymous, 41, Denver"/>
  <VaultPreview/><FDCountdown/><MemorialWall/><CallDemo/><Quiz/><Pricing/><Founder/><Footer/>
  <StickyBar count={wc}/><ExitIntent/></div>)}
