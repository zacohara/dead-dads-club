import{useState,useEffect,useRef}from"react";

// ─── BRAND SYSTEM (from Kent's logo: black, cream skeleton, red heart, gold accent) ───
const G="#C8A951",GL="#E8D5A0",GD="rgba(200,169,81,0.1)";
const D="#0A0A0A",DC="#111111",DB="#222222",CR="#F5F0E8",RD="#C0392B";
const CG="'Cormorant Garamond',serif",OF="'Outfit',sans-serif";
const isTouch=typeof window!=='undefined'&&('ontouchstart'in window);

function useInView(t=0.12){const r=useRef(null);const[v,s]=useState(false);
useEffect(()=>{const e=r.current;if(!e)return;const o=new IntersectionObserver(([x])=>{if(x.isIntersecting){s(true);o.disconnect()}},{threshold:t});o.observe(e);return()=>o.disconnect()},[]);return[r,v]}

// Logo component — no border-radius (pirate flag, not a headshot)
function Logo({size=120,full=false,style={}}){
return full?
<img src="/ddc-logo-full.jpg" alt="The Dead Dads Club" style={{width:size,height:"auto",display:"block",...style}} loading="lazy"/>:
<img src="/ddc-logo-icon.jpg" alt="DDC" style={{width:size,height:size,objectFit:"cover",display:"block",...style}} loading="lazy"/>}

function GDiv({w=80}){return<div style={{width:w,height:2,background:`linear-gradient(90deg,transparent,${G},transparent)`,margin:"0 auto"}}/>}

function SL({text}){return(<div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16,justifyContent:"center"}}>
<div style={{width:28,height:1,background:`${G}60`}}/><span style={{fontFamily:OF,fontSize:10,fontWeight:600,letterSpacing:5,color:G,textTransform:"uppercase"}}>{text}</span>
<div style={{width:28,height:1,background:`${G}60`}}/></div>)}

function SW({children,bg=D,id}){return<section id={id} style={{padding:"120px 24px",background:bg,position:"relative"}}>{children}</section>}

// Testimonial quote between sections
function TQ({quote,who}){const[r,v]=useInView();
return(<div ref={r} style={{padding:"64px 24px",background:D,textAlign:"center",opacity:v?1:0,transform:v?"translateY(0)":"translateY(16px)",transition:"all 1s ease"}}>
<div style={{maxWidth:520,margin:"0 auto"}}>
<div style={{color:`${G}40`,fontSize:28,fontFamily:CG,marginBottom:12}}>"</div>
<p style={{fontFamily:CG,fontSize:"clamp(17px,2.5vw,22px)",color:"#bbb",fontStyle:"italic",lineHeight:1.7,fontWeight:400}}>{quote}</p>
<p style={{color:"#555",fontSize:11,marginTop:20,letterSpacing:3,fontWeight:400,textTransform:"uppercase"}}>— {who}</p></div></div>)}

// ━━━ INTRO (match-strike) ━━━
function Intro({onDone}){const[p,setP]=useState(0);
useEffect(()=>{const a=setTimeout(()=>setP(1),200);const b=setTimeout(()=>setP(2),1400);const c=setTimeout(()=>setP(3),2600);const d=setTimeout(()=>onDone(),3400);
return()=>{clearTimeout(a);clearTimeout(b);clearTimeout(c);clearTimeout(d)}},[]);
return(<div style={{position:"fixed",inset:0,zIndex:9999,background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
opacity:p>=3?0:1,transition:"opacity 0.8s ease",pointerEvents:p>=3?"none":"all"}}>
{p>=1&&<div style={{animation:"fadeIn 0.8s ease",position:"relative"}}>
<Logo size={160}/>
<div style={{position:"absolute",inset:-24,borderRadius:8,boxShadow:`0 0 ${p>=2?100:30}px ${p>=2?50:15}px rgba(200,169,81,${p>=2?0.25:0.08})`,transition:"all 1s ease"}}/>
</div>}
{p>=2&&<p style={{marginTop:36,fontFamily:CG,fontSize:"clamp(15px,2.5vw,20px)",color:`${GL}cc`,fontStyle:"italic",letterSpacing:2,animation:"fadeUp 0.8s ease",textAlign:"center",padding:"0 24px"}}>
The only club you never wanted to join.</p>}
</div>)}

// ━━━ NAV ━━━
function Nav(){const[s,setS]=useState(false);
useEffect(()=>{const h=()=>setS(window.scrollY>80);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
const ls={color:"#777",fontSize:11,textDecoration:"none",letterSpacing:3,textTransform:"uppercase",fontWeight:400,transition:"color 0.2s"};
return(<nav role="navigation" aria-label="Main" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",
background:s?"rgba(8,8,8,0.95)":"transparent",borderBottom:s?`1px solid ${DB}`:"1px solid transparent",backdropFilter:s?"blur(16px)":"none",transition:"all 0.4s ease"}}>
<a href="#top" style={{display:"flex",alignItems:"center",gap:12,textDecoration:"none"}}>
<Logo size={30}/><span style={{fontFamily:CG,fontSize:15,fontWeight:700,color:CR,letterSpacing:2}}>DDC</span></a>
<div style={{display:"flex",gap:24,alignItems:"center"}}>
<a href="#memorial-wall" className="hide-mobile" style={ls}>Wall</a>
<a href="#the-box" className="hide-mobile" style={ls}>Box</a>
<a href="#quiz" className="hide-mobile" style={ls}>Quiz</a>
<a href="#top" style={{padding:"8px 22px",border:`1px solid ${G}`,color:G,fontSize:10,textDecoration:"none",letterSpacing:3,textTransform:"uppercase",borderRadius:2,fontWeight:600,transition:"all 0.2s"}}>Join</a>
</div></nav>)}

// ━━━ STICKY BOTTOM CTA ━━━
function StickyBar({count}){const[show,setShow]=useState(false);const[email,setEmail]=useState("");const[done,setDone]=useState(false);const[sub,setSub]=useState(false);
useEffect(()=>{const h=()=>setShow(window.scrollY>window.innerHeight);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
const go=async()=>{if(!email||!email.includes("@")||sub)return;setSub(true);
try{await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})})}catch(e){}setDone(true);setSub(false)};
if(!show||done)return null;
return(<div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:99,background:"rgba(8,8,8,0.96)",borderTop:`1px solid ${G}30`,padding:"10px 16px",backdropFilter:"blur(16px)",
transform:show?"translateY(0)":"translateY(100%)",transition:"transform 0.4s ease"}}>
<div style={{maxWidth:480,margin:"0 auto",display:"flex",gap:8,alignItems:"center"}}>
<span style={{fontSize:10,color:G,fontWeight:600,whiteSpace:"nowrap",letterSpacing:2,textTransform:"uppercase"}}>{Math.max(100-(count||0),0)} left</span>
<input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}
style={{flex:1,padding:"10px 14px",background:"#0D0D0D",border:`1px solid ${DB}`,borderRadius:3,color:CR,fontFamily:OF,fontSize:13,outline:"none",minWidth:0}}/>
<button onClick={go} disabled={sub} style={{padding:"10px 18px",background:G,color:D,border:"none",borderRadius:3,fontFamily:OF,fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase",cursor:"pointer",whiteSpace:"nowrap"}}>
{sub?"...":"Join"}</button></div></div>)}

// ━━━ HERO + BROTHERHOOD NUMBER ━━━
function Hero({onCount}){const[email,setEmail]=useState("");const[submitted,setSub]=useState(false);const[submitting,setIng]=useState(false);
const[wc,setWc]=useState(null);const[rj,setRj]=useState([]);const[ti,setTi]=useState(0);const[err,setErr]=useState("");const[myNum,setMyNum]=useState(null);
const[ref,vis]=useInView(0.1);const CAP=100;
useEffect(()=>{fetch("/api/waitlist-count").then(r=>r.json()).then(d=>{setWc(d.count||0);setRj(d.recent||[]);onCount(d.count||0)}).catch(()=>setWc(0))},[submitted]);
useEffect(()=>{if(!rj.length)return;const t=setInterval(()=>setTi(i=>(i+1)%rj.length),4000);return()=>clearInterval(t)},[rj]);
const submit=async()=>{const e=email.trim().toLowerCase();if(!e||!e.includes("@")||!e.split("@")[1]?.includes(".")){setErr("Enter a valid email");return}
if(submitting)return;setErr("");setIng(true);
try{const r=await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e})});
if(!r.ok){setErr("Something went wrong");setIng(false);return}}catch(x){setErr("Network error");setIng(false);return}
setMyNum((wc||0)+1);setSub(true);setIng(false);setEmail("")};
const pct=wc===null?0:Math.min((wc/CAP)*100,100);const left=wc===null?null:Math.max(CAP-wc,0);
function ago(d){const m=Math.floor((Date.now()-new Date(d).getTime())/60000);if(m<1)return"just now";if(m<60)return m+"m ago";const h=Math.floor(m/60);return h<24?h+"h ago":Math.floor(h/24)+"d ago"}

return(<section id="top" ref={ref} style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"100px 24px 80px",position:"relative",overflow:"hidden",textAlign:"center"}}>
<div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 25%,#151008 0%,${D} 70%)`,zIndex:0}}/>
<div style={{position:"relative",zIndex:1,maxWidth:680,opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(30px)",transition:"all 1.2s ease"}}>

{/* Kent's full logo as hero */}
<div style={{marginBottom:32}}><Logo size={280} full={true} style={{margin:"0 auto",maxWidth:"80vw"}}/></div>

<p style={{fontFamily:CG,fontSize:"clamp(16px,2.5vw,21px)",color:`${GL}cc`,fontStyle:"italic",marginBottom:48,letterSpacing:1.5,fontWeight:400}}>
The only club you never wanted to join.</p>

{!submitted?(<div><div style={{display:"flex",gap:0,maxWidth:440,margin:"0 auto",borderRadius:3,overflow:"hidden",border:`1px solid ${err?RD:DB}`,transition:"border-color 0.3s"}}>
<input type="email" placeholder="Your email" value={email} onChange={e=>{setEmail(e.target.value);if(err)setErr("")}}
onKeyDown={e=>e.key==="Enter"&&submit()} aria-label="Email address"
style={{flex:1,padding:"16px 20px",background:"#0D0D0D",border:"none",color:CR,fontFamily:OF,fontSize:15,outline:"none",letterSpacing:0.3}}/>
<button onClick={submit} disabled={submitting}
style={{padding:"16px 32px",background:G,color:D,border:"none",cursor:"pointer",fontFamily:OF,fontSize:12,fontWeight:700,letterSpacing:3,textTransform:"uppercase",opacity:submitting?0.5:1,whiteSpace:"nowrap"}}>
{submitting?"...":"Join"}</button></div>
{err&&<p style={{color:RD,fontSize:12,marginTop:10,fontWeight:400}}>{err}</p>}</div>):

// Brotherhood number reveal
(<div style={{padding:"28px 36px",border:`1px solid ${G}`,borderRadius:4,background:GD,animation:"fadeUp 0.6s ease"}}>
<p style={{fontFamily:CG,fontSize:36,color:G,fontWeight:700,lineHeight:1.2}}>Brother #{myNum}</p>
<p style={{color:CR,fontWeight:400,fontSize:14,marginTop:4,letterSpacing:1}}>Founding Member · Est. MMXXVI</p>
<p style={{color:"#666",fontSize:11,marginTop:12,fontWeight:300}}>Screenshot this. You earned your place.</p></div>)}

{/* Progress bar */}
<div style={{maxWidth:380,margin:"32px auto 0"}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:8,alignItems:"baseline"}}>
<span style={{fontSize:12,color:G,fontWeight:600,letterSpacing:1}}>{wc===null?"—":wc} of {CAP} Founding Spots</span>
{left!==null&&<span style={{fontSize:11,color:left<=15?RD:"#555",fontWeight:left<=15?600:400}}>{left<=0?"SOLD OUT":`${left} left`}</span>}
</div>
<div style={{height:4,background:"#1a1a1a",borderRadius:2,overflow:"hidden"}}>
<div style={{height:"100%",background:`linear-gradient(90deg,${G},${GL})`,borderRadius:2,width:`${pct}%`,transition:"width 2s ease",boxShadow:`0 0 8px ${G}30`}}/></div></div>

{rj.length>0&&<div style={{marginTop:20,height:20,overflow:"hidden"}} aria-live="polite"><div key={ti} style={{fontSize:11,color:"#555",fontWeight:300,animation:"fadeUp 0.5s ease",letterSpacing:0.5}}>
<span style={{color:`${GL}99`}}>{rj[ti]?.name}</span> joined · {ago(rj[ti]?.time)}</div></div>}
<p style={{marginTop:14,fontSize:11,color:"#3a3a3a",fontWeight:300,letterSpacing:0.5}}>Founding Members lock in their rate for life.</p>
</div>
<div style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",animation:"pulse 2.5s infinite"}} aria-hidden="true">
<svg width="16" height="28" viewBox="0 0 20 30" fill="none"><rect x="1" y="1" width="18" height="28" rx="9" stroke={G} strokeWidth="1" opacity="0.4"/>
<circle cx="10" cy="10" r="1.5" fill={G} opacity="0.6"><animate attributeName="cy" values="10;20;10" dur="2.5s" repeatCount="indefinite"/></circle></svg></div>
</section>)}

// ━━━ STATS ━━━
function Stats(){const[r,v]=useInView();const st=[{n:"51.7M",l:"American men with a deceased father"},{n:"25%",l:"of children grow up fatherless"},{n:"85%",l:"of youth in prison — fatherless homes"},{n:"0",l:"premium communities serving them"}];
return(<SW bg="#0D0D0D"><div ref={r} style={{maxWidth:880,margin:"0 auto",textAlign:"center"}}><SL text="The Crisis"/>
<h2 style={{fontFamily:CG,fontSize:"clamp(32px,5vw,48px)",fontWeight:700,color:CR,marginBottom:16,lineHeight:1.1}}>Nobody's Coming to Save Us.</h2>
<p style={{color:"#777",fontSize:14,maxWidth:500,margin:"0 auto 56px",lineHeight:1.8,fontWeight:300}}>America has a fatherlessness crisis. The Surgeon General declared loneliness a public health epidemic. Yet no premium, secular brotherhood exists for these men.</p>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16}}>{st.map((s,i)=>(<div key={i} style={{padding:"40px 20px",background:DC,border:`1px solid ${DB}`,borderRadius:3,
opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:`all 0.7s ease ${i*0.1}s`}}>
<div style={{fontFamily:CG,fontSize:42,fontWeight:700,color:G,marginBottom:10,lineHeight:1}}>{s.n}</div>
<div style={{fontSize:12,color:"#888",lineHeight:1.5,fontWeight:300}}>{s.l}</div></div>))}</div></div></SW>)}

// ━━━ PILLARS ━━━
function Pillars(){const[r,v]=useInView();const ps=[{i:"🤝",t:"The Brotherhood",d:"Private digital community. Weekly live calls, accountability pods, and men who show up because they've been in the same dark room."},{i:"📦",t:"The Box",d:"Monthly curated box. Dog tags, pocket knives, letter-writing kits. Every item answers one question."},{i:"📖",t:"The Vault",d:"Everything your dad should've taught you. Money, relationships, fitness, mental toughness, practical skills, fatherhood."},{i:"🪦",t:"The Memorial Wall",d:"A permanent digital tribute to your father. On his anniversary, we call you. Because nobody should be alone on that day."}];
return(<SW><div ref={r} style={{maxWidth:960,margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:64}}><SL text="What We Built"/>
<h2 style={{fontFamily:CG,fontSize:"clamp(32px,5vw,48px)",fontWeight:700,color:CR,lineHeight:1.1}}>Four Pillars. One Brotherhood.</h2></div>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>{ps.map((p,i)=>(<div key={i} style={{padding:"36px 24px",background:DC,border:`1px solid ${DB}`,borderRadius:3,
opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:`all 0.7s ease ${i*0.12}s`,position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",top:0,left:0,width:40,height:2,background:G}}/>
<div style={{fontSize:28,marginBottom:14}} aria-hidden="true">{p.i}</div>
<h3 style={{fontFamily:CG,fontSize:21,fontWeight:700,color:CR,marginBottom:10}}>{p.t}</h3>
<p style={{fontSize:13,color:"#888",lineHeight:1.7,fontWeight:300}}>{p.d}</p></div>))}</div></div></SW>)}

// ━━━ BOX REVEAL ━━━
function BoxReveal(){const[r,v]=useInView();const[opened,setO]=useState(false);const[rc,setRc]=useState(0);
const items=[{icon:"🏷️",name:"Personalized Dog Tags",story:"Your father's name. Your name. Connected forever in steel."},{icon:"🔪",name:"EDC Pocket Knife",story:"The one he would've handed you and said 'Take care of this.'"},{icon:"🪙",name:"DDC Challenge Coin",story:"Carry it daily. You earned your place."},{icon:"✉️",name:"Letter-Writing Kit",story:"Write the letter you never got to send."},{icon:"⏳",name:"Brass Hourglass",story:"Time is the one thing we can't get back."},{icon:"📘",name:"The Father's Blueprint",story:"The financial freedom guide he should've left you."}];
useEffect(()=>{if(!opened)return;const t=setInterval(()=>setRc(c=>{if(c>=items.length){clearInterval(t);return c}return c+1}),350);return()=>clearInterval(t)},[opened]);
return(<SW bg="#080808" id="the-box"><div ref={r} style={{maxWidth:780,margin:"0 auto",position:"relative",zIndex:1,textAlign:"center"}}><SL text="The Welcome Box"/>
<h2 style={{fontFamily:CG,fontSize:"clamp(28px,5vw,44px)",fontWeight:700,color:CR,marginBottom:8,lineHeight:1.1}}>What Would Your Old Man<br/>Have Given You?</h2>
<p style={{color:"#777",fontSize:14,maxWidth:440,margin:"0 auto 44px",lineHeight:1.7,fontWeight:300}}>Every new member receives a Welcome Box. It's not a product. It's an initiation.</p>
{!opened?(<div onClick={()=>setO(true)} onKeyDown={e=>(e.key==="Enter"||e.key===" ")&&setO(true)} tabIndex={0} role="button" aria-label="Open the Welcome Box"
style={{width:200,height:200,margin:"0 auto",cursor:"pointer",position:"relative",opacity:v?1:0,transform:v?"scale(1)":"scale(0.85)",transition:"all 0.8s ease"}}>
<div style={{width:"100%",height:"100%",background:"#0D0D0D",border:`2px solid ${G}50`,borderRadius:6,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,
animation:"glow 3s ease infinite"}}>
<Logo size={72}/><div style={{width:40,height:1,background:`${G}60`}}/>
<span style={{fontSize:9,color:G,letterSpacing:4,textTransform:"uppercase",fontWeight:600}}>Welcome Box</span></div>
<div style={{position:"absolute",bottom:-32,left:"50%",transform:"translateX(-50%)",fontSize:12,color:`${G}99`,fontWeight:400,whiteSpace:"nowrap",animation:"pulse 2s infinite"}}>
{isTouch?"tap":"click"} to open</div></div>):
(<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>{items.map((item,i)=>(<div key={i} style={{padding:"24px 20px",background:DC,border:`1px solid ${DB}`,borderRadius:3,
opacity:i<rc?1:0,transform:i<rc?"translateY(0)":"translateY(24px) scale(0.95)",transition:"all 0.5s ease",position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",top:0,left:0,width:32,height:2,background:G}}/>
<div style={{fontSize:32,marginBottom:10}} aria-hidden="true">{item.icon}</div>
<h4 style={{fontFamily:CG,fontSize:17,fontWeight:700,color:CR,marginBottom:6}}>{item.name}</h4>
<p style={{fontSize:12,color:"#888",lineHeight:1.6,fontStyle:"italic",fontWeight:300}}>{item.story}</p></div>))}</div>)}</div></SW>)}

// ━━━ VAULT PREVIEW ━━━
function VaultPreview(){const[r,v]=useInView();const[email,setEmail]=useState("");const[unlocked,setU]=useState(false);const[sub,setSub]=useState(false);
const go=async()=>{if(!email||!email.includes("@")||sub)return;setSub(true);
try{await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})})}catch(e){}setU(true);setSub(false)};
return(<SW bg="#0D0D0D" id="vault"><div ref={r} style={{maxWidth:600,margin:"0 auto",textAlign:"center",opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:"all 0.8s ease"}}>
<SL text="Free Preview"/><h2 style={{fontFamily:CG,fontSize:"clamp(28px,5vw,40px)",fontWeight:700,color:CR,marginBottom:12,lineHeight:1.1}}>The Father's Blueprint</h2>
<p style={{color:"#777",fontSize:14,maxWidth:420,margin:"0 auto 28px",lineHeight:1.7,fontWeight:300}}>Chapter 1 of the financial freedom guide your dad should've left you. Free with your email.</p>
{!unlocked?(<div>
<div style={{padding:"28px 24px",background:DC,border:`1px solid ${DB}`,borderRadius:3,marginBottom:20,position:"relative",overflow:"hidden",textAlign:"left"}}>
<div style={{filter:"blur(5px)",userSelect:"none",pointerEvents:"none"}}>
<h3 style={{fontFamily:CG,fontSize:20,color:CR,fontWeight:700,marginBottom:10}}>Chapter 1: The Money Talk Nobody Had With You</h3>
<p style={{color:"#999",fontSize:13,lineHeight:1.9,fontWeight:300}}>Most men learn about money the hard way — through debt, through shame, through silence. If your old man was anything like mine, the closest thing to financial advice you got was "we can't afford it" or nothing at all. This chapter isn't about budgets and spreadsheets. It's about the conversation that never happened...</p></div>
<div style={{position:"absolute",inset:0,background:`linear-gradient(transparent 10%,${DC} 85%)`,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:16}}>
<span style={{fontSize:10,color:G,letterSpacing:3,textTransform:"uppercase",fontWeight:600}}>🔒 Unlock to read</span></div></div>
<div style={{display:"flex",gap:0,maxWidth:380,margin:"0 auto",borderRadius:3,overflow:"hidden",border:`1px solid ${DB}`}}>
<input type="email" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}
style={{flex:1,padding:"14px 16px",background:"#0D0D0D",border:"none",color:CR,fontFamily:OF,fontSize:13,outline:"none"}}/>
<button onClick={go} disabled={sub} style={{padding:"14px 22px",background:G,color:D,border:"none",cursor:"pointer",fontFamily:OF,fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase"}}>
{sub?"...":"Unlock"}</button></div></div>):
(<div style={{padding:"32px 28px",background:DC,border:`1px solid ${G}30`,borderRadius:3,textAlign:"left",animation:"fadeUp 0.6s ease"}}>
<h3 style={{fontFamily:CG,fontSize:22,color:CR,fontWeight:700,marginBottom:16}}>Chapter 1: The Money Talk Nobody Had With You</h3>
<p style={{color:"#ccc",fontSize:14,lineHeight:2,fontWeight:300,marginBottom:14}}>Most men learn about money the hard way — through debt, through shame, through silence. If your old man was anything like mine, the closest thing to financial advice you got was "we can't afford it" or nothing at all.</p>
<p style={{color:"#ccc",fontSize:14,lineHeight:2,fontWeight:300,marginBottom:14}}>This chapter isn't about budgets and spreadsheets. It's about the conversation that never happened and why it left a mark deeper than any bank statement ever could.</p>
<p style={{color:"#ccc",fontSize:14,lineHeight:2,fontWeight:300,marginBottom:14}}>Here's what I wish someone had told me at 18: the first $1,000 you save isn't about money. It's about proving to yourself that you can build something from nothing. And if you grew up without a dad showing you how — that proof matters more than you think.</p>
<div style={{marginTop:24,padding:"16px 20px",background:GD,borderRadius:3,borderLeft:`2px solid ${G}`}}>
<p style={{color:G,fontSize:13,fontWeight:500,fontStyle:"italic"}}>The full Father's Blueprint — all 6 chapters — is available inside the Brotherhood.</p></div>
</div>)}</div></SW>)}

// ━━━ FATHER'S DAY COUNTDOWN ━━━
function FDCountdown(){const[r,v]=useInView();const FD=new Date("2026-06-21T00:00:00");const[tl,setTl]=useState({});const[past,setPast]=useState(false);
useEffect(()=>{const c=()=>{const d=FD-new Date();if(d<=0){setPast(true);return{d:0,h:0,m:0,s:0}}
return{d:Math.floor(d/864e5),h:Math.floor((d%864e5)/36e5),m:Math.floor((d%36e5)/6e4),s:Math.floor((d%6e4)/1e3)}};setTl(c());const t=setInterval(()=>setTl(c()),1000);return()=>clearInterval(t)},[]);
const us=[{v:tl.d,l:"Days"},{v:tl.h,l:"Hours"},{v:tl.m,l:"Min"},{v:tl.s,l:"Sec"}];
return(<SW><div ref={r} style={{maxWidth:640,margin:"0 auto",textAlign:"center",opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:"all 0.8s ease"}}>
<SL text="June 21, 2026"/><h2 style={{fontFamily:CG,fontSize:"clamp(28px,5vw,44px)",fontWeight:700,color:CR,marginBottom:12,lineHeight:1.1}}>
{past?"We Showed Up. Together.":"The Hardest Day on the Calendar."}</h2>
<p style={{color:"#777",fontSize:14,maxWidth:440,margin:"0 auto 40px",lineHeight:1.7,fontWeight:300}}>
{past?"Father's Day has passed, but the Brotherhood endures.":"Father's Day is coming. For millions of men, it's a day of silence while the world celebrates."}</p>
{!past&&<div style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap",marginBottom:44}}>{us.map((u,i)=>(<div key={i} style={{width:80,padding:"18px 0",background:DC,border:`1px solid ${DB}`,borderRadius:3}}>
<div style={{fontFamily:CG,fontSize:32,fontWeight:700,color:G,lineHeight:1}}>{String(u.v||0).padStart(2,"0")}</div>
<div style={{fontSize:9,color:"#666",letterSpacing:3,textTransform:"uppercase",marginTop:6}}>{u.l}</div></div>))}</div>}
<div style={{padding:"24px 28px",background:GD,border:`1px solid ${G}20`,borderRadius:3,maxWidth:480,margin:"0 auto"}}>
<p style={{fontFamily:CG,fontSize:18,color:CR,fontStyle:"italic",lineHeight:1.7,marginBottom:16}}>
"On Father's Day, the Brotherhood gathers. We honor the men who made us and we show up for each other."</p>
<a href="#memorial-wall" style={{display:"inline-block",padding:"12px 28px",background:G,color:D,textDecoration:"none",fontFamily:OF,fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase",borderRadius:3}}>
Honor Your Father</a></div></div></SW>)}

// ━━━ MEMORIAL WALL + FUNNEL + ANNIVERSARY DATE ━━━
function MemorialWall(){const[r,v]=useInView();const[entries,setE]=useState([]);const[sf,setSf]=useState(false);
const[form,setF]=useState({name:"",years:"",message:"",by:"",anniversary:""});const[sub,setSub]=useState(false);const[loading,setL]=useState(true);const[apiErr,setApiErr]=useState("");
const[showFunnel,setSFunnel]=useState(false);const[fEmail,setFEmail]=useState("");const[fDone,setFDone]=useState(false);const[lastEntry,setLE]=useState(null);
const seed=[{id:"s1",father_name:"Robert James Grossi",years:"1955 – 2008",message:"His last words cut deep. But every man I help build is a brick laid on top of that sentence. I carry you, old man.",submitted_by:"Kent"}];
useEffect(()=>{fetch("/api/memorials").then(r=>r.json()).then(d=>{if(d.entries?.length>0)setE(d.entries);setL(false)}).catch(()=>setL(false))},[]);
const add=async()=>{if(!form.name.trim()||!form.message.trim()||sub)return;if(form.name.trim().length<2){setApiErr("Enter your father's full name");return}
setSub(true);setApiErr("");
try{const r=await fetch("/api/memorials",{method:"POST",headers:{"Content-Type":"application/json"},
body:JSON.stringify({father_name:form.name.trim(),years:form.years.trim(),message:form.message.trim(),submitted_by:form.by.trim()||"Anonymous"})});
const d=await r.json();if(!r.ok){setApiErr(d.error||"Something went wrong");setSub(false);return}
if(d.entry){setE(p=>[d.entry,...p]);setLE(d.entry);setSFunnel(true)}}catch(e){setApiErr("Network error")}
setF({name:"",years:"",message:"",by:"",anniversary:""});setSf(false);setSub(false)};
const fGo=async()=>{if(!fEmail||!fEmail.includes("@"))return;
try{await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:fEmail})})}catch(e){}setFDone(true);setTimeout(()=>setSFunnel(false),2500)};
const de=entries.length>0?entries:seed;
const is={width:"100%",padding:"14px 16px",background:"#0D0D0D",border:`1px solid ${DB}`,borderRadius:3,color:CR,fontFamily:OF,fontSize:14,outline:"none",marginBottom:12};

return(<SW bg="#080808" id="memorial-wall">
{/* Funnel Modal */}
{showFunnel&&lastEntry&&(<div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,backdropFilter:"blur(12px)"}}>
<div style={{maxWidth:420,width:"100%",padding:32,background:DC,border:`1px solid ${G}`,borderRadius:4,textAlign:"center",animation:"fadeUp 0.5s ease"}}>
{!fDone?(<><Logo size={48} style={{margin:"0 auto"}}/>
<div style={{width:32,height:1,background:G,margin:"16px auto"}}/>
<h3 style={{fontFamily:CG,fontSize:22,color:CR,fontWeight:700,marginBottom:8}}>His tribute is live.</h3>
<div style={{padding:"14px 18px",background:`${G}08`,border:`1px solid ${DB}`,borderRadius:3,marginBottom:20,textAlign:"left"}}>
<p style={{fontFamily:CG,fontSize:16,color:CR,fontWeight:700}}>{lastEntry.father_name}</p>
{lastEntry.years&&<p style={{fontSize:10,color:G,letterSpacing:2,marginTop:2}}>{lastEntry.years}</p>}
<p style={{fontSize:12,color:"#aaa",fontStyle:"italic",marginTop:8,lineHeight:1.6}}>"{lastEntry.message?.substring(0,100)}{lastEntry.message?.length>100?"...":""}"</p></div>
<p style={{color:"#888",fontSize:13,lineHeight:1.6,marginBottom:20}}>Join the Brotherhood so we can <span style={{color:G,fontWeight:500}}>call you on his anniversary</span>.</p>
<div style={{display:"flex",gap:0,borderRadius:3,overflow:"hidden",border:`1px solid ${DB}`}}>
<input type="email" placeholder="Your email" value={fEmail} onChange={e=>setFEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fGo()}
style={{flex:1,padding:"14px 16px",background:"#0D0D0D",border:"none",color:CR,fontFamily:OF,fontSize:13,outline:"none"}}/>
<button onClick={fGo} style={{padding:"14px 22px",background:G,color:D,border:"none",cursor:"pointer",fontFamily:OF,fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase"}}>Join</button></div>
<button onClick={()=>setSFunnel(false)} style={{marginTop:14,background:"transparent",border:"none",color:"#444",fontFamily:OF,fontSize:11,cursor:"pointer"}}>Maybe later</button></>):
(<><Logo size={48} style={{margin:"0 auto"}}/><p style={{fontFamily:CG,fontSize:22,color:G,fontWeight:700,marginTop:16}}>Welcome, brother.</p>
<p style={{color:"#888",fontSize:13,marginTop:8}}>We'll be in touch on the day that matters most.</p></>)}
</div></div>)}

<div ref={r} style={{maxWidth:960,margin:"0 auto",position:"relative",zIndex:1}}>
<div style={{textAlign:"center",marginBottom:56}}>
<SL text="Honor Them"/><h2 style={{fontFamily:CG,fontSize:"clamp(32px,5vw,52px)",fontWeight:700,color:CR,marginBottom:12,lineHeight:1.1}}>The Memorial Wall</h2>
<p style={{color:"#777",fontSize:14,maxWidth:460,margin:"0 auto 32px",lineHeight:1.7,fontWeight:300}}>A permanent tribute. Because every father deserves to be remembered.</p>
{!sf?(<button onClick={()=>setSf(true)} style={{padding:"14px 36px",background:"transparent",border:`1px solid ${G}`,color:G,fontFamily:OF,fontSize:12,fontWeight:600,letterSpacing:3,textTransform:"uppercase",cursor:"pointer",borderRadius:3}}>
✝ Honor Your Father</button>):
(<div style={{maxWidth:440,margin:"0 auto",padding:28,background:DC,border:`1px solid ${DB}`,borderRadius:4,textAlign:"left",animation:"fadeUp 0.4s ease"}}>
<h4 style={{fontFamily:CG,fontSize:20,color:CR,marginBottom:20}}>Create a Tribute</h4>
<input style={is} placeholder="Father's full name" value={form.name} onChange={e=>setF({...form,name:e.target.value.slice(0,200)})} maxLength={200}/>
<input style={is} placeholder="Years (e.g. 1955 – 2008)" value={form.years} onChange={e=>setF({...form,years:e.target.value.slice(0,50)})} maxLength={50}/>
<div style={{marginBottom:12}}><label style={{fontSize:10,color:`${G}99`,letterSpacing:3,textTransform:"uppercase",fontWeight:500,marginBottom:6,display:"block"}}>Date of passing</label>
<input type="date" style={{...is,marginBottom:0,colorScheme:"dark"}} value={form.anniversary} onChange={e=>setF({...form,anniversary:e.target.value})}/>
<p style={{fontSize:10,color:"#444",marginTop:4,fontStyle:"italic"}}>We'll remember him with you on this day each year.</p></div>
<div style={{position:"relative"}}><textarea style={{...is,minHeight:80,resize:"vertical"}} placeholder="Your message to him..." value={form.message}
onChange={e=>setF({...form,message:e.target.value.slice(0,2000)})} maxLength={2000}/>
<span style={{position:"absolute",bottom:18,right:10,fontSize:9,color:form.message.length>1800?RD:"#333"}}>{form.message.length}/2000</span></div>
<input style={is} placeholder="Your first name (optional)" value={form.by} onChange={e=>setF({...form,by:e.target.value.slice(0,100)})} maxLength={100}/>
{apiErr&&<p style={{color:RD,fontSize:12,marginBottom:8}}>{apiErr}</p>}
<div style={{display:"flex",gap:10,marginTop:4}}><button onClick={add} disabled={sub} style={{flex:1,padding:"14px",background:G,color:D,border:"none",borderRadius:3,fontFamily:OF,fontSize:12,fontWeight:700,letterSpacing:2,cursor:"pointer",textTransform:"uppercase",opacity:sub?0.5:1}}>
{sub?"Placing...":"Place on the Wall"}</button>
<button onClick={()=>{setSf(false);setApiErr("")}} style={{padding:"14px 18px",background:"transparent",color:"#555",border:`1px solid ${DB}`,borderRadius:3,fontFamily:OF,fontSize:12,cursor:"pointer"}}>Cancel</button></div></div>)}</div>

{loading?<div style={{textAlign:"center",padding:48}}><div style={{width:24,height:24,border:`2px solid ${DB}`,borderTopColor:G,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto"}}/>
<style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>:
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>{de.map((e,i)=>(<div key={e.id} style={{padding:"28px 24px",background:DC,border:`1px solid ${DB}`,borderRadius:3,position:"relative",overflow:"hidden",
opacity:v?1:0,transform:v?"translateY(0)":"translateY(20px)",transition:`all 0.7s ease ${i*0.08}s`}}>
<div style={{position:"absolute",top:0,left:0,width:36,height:2,background:G}}/>
<h4 style={{fontFamily:CG,fontSize:20,fontWeight:700,color:CR,marginBottom:4}}>{e.father_name}</h4>
{e.years&&<p style={{fontSize:11,color:G,letterSpacing:2,marginBottom:14,fontWeight:500}}>{e.years}</p>}
<p style={{fontSize:13,color:"#999",lineHeight:1.7,fontStyle:"italic",fontWeight:300}}>"{e.message}"</p>
{e.submitted_by&&<p style={{fontSize:11,color:"#555",marginTop:14,fontWeight:400,letterSpacing:0.5}}>— {e.submitted_by}</p>}</div>))}</div>}
</div></SW>)}

// ━━━ CALL DEMO ━━━
function CallDemo(){const[r,v]=useInView();const[playing,setP]=useState(false);const[li,setLi]=useState(-1);const tr=useRef([]);
const lines=[{d:0,t:"📱  Your phone rings.",s:0},{d:1200,t:"It's March 15th — the day your father passed.",s:0},{d:3000,t:'"Hey brother, it\'s Kent."',s:1},{d:5000,t:'"I know what today is. I just wanted you to know — you\'re not alone today."',s:1},{d:7500,t:'"Your old man would be proud of the man you\'ve become. And if nobody else tells you that today, I will."',s:1},{d:10000,t:'"The Brotherhood is here. We see you. We\'ve got you."',s:1},{d:12500,t:"This is the call that changes everything.",s:2},{d:14000,t:"No competitor can replicate this.",s:2}];
const start=()=>{tr.current.forEach(t=>clearTimeout(t));setP(true);setLi(0);tr.current=lines.map((l,i)=>setTimeout(()=>setLi(i),l.d))};
useEffect(()=>()=>tr.current.forEach(t=>clearTimeout(t)),[]);
return(<SW><div ref={r} style={{maxWidth:520,margin:"0 auto",textAlign:"center",opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:"all 0.8s ease"}}>
<SL text="The Moat"/><h2 style={{fontFamily:CG,fontSize:"clamp(28px,5vw,44px)",fontWeight:700,color:CR,marginBottom:12,lineHeight:1.1}}>The Call That Changes Everything</h2>
<p style={{color:"#777",fontSize:14,maxWidth:400,margin:"0 auto 36px",lineHeight:1.7,fontWeight:300}}>On the anniversary of your father's passing, your phone rings.</p>
{!playing?(<button onClick={start} aria-label="Play demo" style={{width:72,height:72,borderRadius:"50%",background:G,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",boxShadow:`0 0 24px ${G}30`,animation:"glow 3s ease infinite"}}>
<svg width="24" height="24" viewBox="0 0 24 24" fill={D}><path d="M8 5v14l11-7z"/></svg></button>):
(<div style={{maxWidth:460,margin:"0 auto",padding:"28px 24px",background:DC,border:`1px solid ${DB}`,borderRadius:6,textAlign:"left",minHeight:260}}>
<div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,paddingBottom:14,borderBottom:`1px solid ${DB}`}}>
<div style={{width:36,height:36,borderRadius:"50%",overflow:"hidden",flexShrink:0}}><Logo size={36}/></div>
<div><div style={{fontSize:13,color:CR,fontWeight:600}}>Dead Dads Club</div><div style={{fontSize:10,color:"#4CAF50",fontWeight:500,letterSpacing:1}}>Incoming Call</div></div></div>
<div role="log" aria-live="polite" style={{display:"flex",flexDirection:"column",gap:14}}>{lines.map((l,i)=>{if(i>li)return null;
return(<div key={i} style={{animation:"fadeUp 0.4s ease",padding:l.s===1?"10px 14px":"0",background:l.s===1?`${G}08`:"transparent",borderLeft:l.s===1?`2px solid ${G}40`:"none",borderRadius:l.s===1?"0 3px 3px 0":0}}>
<p style={{fontSize:l.s===2?12:14,color:l.s===1?CR:l.s===2?G:"#999",fontFamily:l.s===1?CG:OF,fontStyle:l.s===1?"italic":"normal",fontWeight:l.s===2?600:l.s===1?400:300,lineHeight:1.6,letterSpacing:l.s===2?1:0}}>{l.t}</p></div>)})}</div>
{li>=lines.length-1&&(<div style={{marginTop:24,display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
<a href="#top" style={{display:"inline-block",padding:"12px 24px",background:G,color:D,textDecoration:"none",fontFamily:OF,fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase",borderRadius:3}}>Join the Brotherhood</a>
<button onClick={()=>{setLi(-1);setP(false);setTimeout(start,100)}} style={{padding:"12px 18px",background:"transparent",border:`1px solid ${DB}`,color:"#666",borderRadius:3,fontFamily:OF,fontSize:11,cursor:"pointer"}}>↻ Replay</button></div>)}
</div>)}</div></SW>)}

// ━━━ QUIZ ━━━
function Quiz(){const[r,v]=useInView();const[step,setS]=useState(0);const[ans,setA]=useState([]);const[email,setE]=useState("");const[sent,setSent]=useState(false);const[err,setErr]=useState("");const[myNum,setMyNum]=useState(null);
const qs=[{q:"Did you learn to shave from YouTube — or just figured it out?",y:"Figured it out alone",n:"Someone taught me"},{q:"Do you dread Father's Day every year?",y:"Every single year",n:"Not really"},{q:"Have you ever had to teach yourself something you knew a dad should've taught you?",y:"More times than I can count",n:"Not that I remember"},{q:"When something goes wrong, is your first instinct to handle it completely alone?",y:"Always",n:"I reach out"},{q:"Do you ever feel like you're performing 'being a man' instead of actually knowing how?",y:"That hits close",n:"I feel confident"}];
const score=ans.filter(a=>a==="y").length;
const msgs=[{mn:0,mx:1,m:"You had some guidance along the way. But if you felt something reading these questions — that's enough."},{mn:2,mx:3,m:"You've carried more than most people know. You figured out things no kid should have to figure out alone."},{mn:4,mx:5,m:"You built yourself from scratch. No blueprint, no safety net. 51.7 million men know exactly what that feels like."}];
const rm=msgs.find(x=>score>=x.mn&&score<=x.mx)?.m||"";
const es=async()=>{if(!email||!email.includes("@")||!email.split("@")[1]?.includes(".")){setErr("Enter a valid email");return}
try{const c=await fetch("/api/waitlist-count").then(r=>r.json());setMyNum((c.count||0)+1)}catch(e){}
try{await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})})}catch(e){}setSent(true)};
const bs=(g)=>({flex:1,padding:"16px 20px",background:g?G:"transparent",color:g?D:CR,border:g?"none":`1px solid ${DB}`,borderRadius:3,fontFamily:OF,fontSize:13,fontWeight:500,cursor:"pointer"});
return(<SW bg="#080808" id="quiz"><div ref={r} style={{maxWidth:520,margin:"0 auto",textAlign:"center",opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:"all 0.8s ease"}}>
<SL text="Find Out"/><h2 style={{fontFamily:CG,fontSize:"clamp(28px,5vw,44px)",fontWeight:700,color:CR,marginBottom:12,lineHeight:1.1}}>Did You Figure It Out Alone?</h2>
{step===0&&(<div><p style={{color:"#777",fontSize:14,lineHeight:1.7,fontWeight:300,marginBottom:36}}>Five questions. No right answers. Just the truth.</p>
<button onClick={()=>setS(1)} style={{padding:"16px 44px",background:G,color:D,border:"none",borderRadius:3,fontFamily:OF,fontSize:12,fontWeight:700,letterSpacing:3,textTransform:"uppercase",cursor:"pointer"}}>Start</button></div>)}
{step>=1&&step<=5&&(<div key={step} style={{animation:"fadeUp 0.4s ease"}}>
<div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:36}}>{[1,2,3,4,5].map(i=>(<div key={i} style={{width:36,height:2,borderRadius:1,background:i<=step?G:`${DB}`,transition:"background 0.3s"}}/>))}</div>
<p style={{fontFamily:CG,fontSize:22,color:CR,lineHeight:1.5,fontStyle:"italic",marginBottom:40}}>"{qs[step-1].q}"</p>
<div style={{display:"flex",gap:12,flexWrap:"wrap"}}><button onClick={()=>{setA([...ans,"y"]);setS(step+1)}} style={bs(true)}>{qs[step-1].y}</button>
<button onClick={()=>{setA([...ans,"n"]);setS(step+1)}} style={bs(false)}>{qs[step-1].n}</button></div></div>)}
{step===6&&(<div style={{animation:"fadeUp 0.5s ease"}}><div style={{fontFamily:CG,fontSize:56,color:G,fontWeight:700,marginBottom:8,lineHeight:1}}>{score}/5</div>
<p style={{fontFamily:CG,fontSize:19,color:CR,lineHeight:1.7,fontStyle:"italic",maxWidth:420,margin:"0 auto 32px"}}>{rm}</p>
{!sent?(<div><div style={{display:"flex",gap:0,maxWidth:380,margin:"0 auto",borderRadius:3,overflow:"hidden",border:`1px solid ${err?RD:DB}`}}>
<input type="email" placeholder="Your email" value={email} onChange={e=>{setE(e.target.value);if(err)setErr("")}} onKeyDown={e=>e.key==="Enter"&&es()}
style={{flex:1,padding:"14px 16px",background:"#0D0D0D",border:"none",color:CR,fontFamily:OF,fontSize:13,outline:"none"}}/>
<button onClick={es} style={{padding:"14px 22px",background:G,color:D,border:"none",cursor:"pointer",fontFamily:OF,fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase"}}>Join</button></div>
{err&&<p style={{color:RD,fontSize:11,marginTop:8}}>{err}</p>}</div>):
(<div style={{padding:"24px",border:`1px solid ${G}`,borderRadius:3,background:GD}}>
{myNum&&<p style={{fontFamily:CG,fontSize:28,color:G,fontWeight:700}}>Brother #{myNum}</p>}
<p style={{color:CR,fontWeight:400,fontSize:13,marginTop:4}}>Welcome to the Brotherhood.</p></div>)}
<button onClick={()=>{setS(0);setA([]);setSent(false);setE("");setErr("");setMyNum(null)}} style={{marginTop:20,padding:"8px 16px",background:"transparent",border:`1px solid ${DB}`,color:"#555",borderRadius:3,fontFamily:OF,fontSize:10,cursor:"pointer",letterSpacing:2}}>↻ Retake</button>
</div>)}</div></SW>)}

// ━━━ PRICING ━━━
function Pricing(){const[r,v]=useInView();const ts=[{name:"Brotherhood",price:39,feat:["Private community","Weekly live calls","Accountability pods","Full Vault access","Memorial Wall"],a:false},{name:"Brotherhood + Box",price:69,tag:"POPULAR",feat:["Everything in Brotherhood","Monthly curated DDC Box","Welcome Box on signup","Box-only content","Early event access"],a:true},{name:"Inner Circle",price:149,feat:["Everything in Tier 2","1:1 mentoring","Private IC calls","Event priority","Direct founder access"],a:false}];
return(<SW id="pricing"><div ref={r} style={{maxWidth:960,margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:56}}><SL text="Join"/>
<h2 style={{fontFamily:CG,fontSize:"clamp(32px,5vw,48px)",fontWeight:700,color:CR,marginBottom:12,lineHeight:1.1}}>Choose Your Brotherhood.</h2>
<p style={{color:"#777",fontSize:14,fontWeight:300}}>Founding members lock in their rate for life.</p></div>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:16,alignItems:"start"}}>{ts.map((t,i)=>(<div key={i} style={{padding:"36px 24px",background:t.a?`${G}06`:DC,border:`1px solid ${t.a?`${G}40`:DB}`,borderRadius:3,position:"relative",overflow:"hidden",
opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:`all 0.7s ease ${i*0.1}s`}}>
{t.a&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:G}}/>}
{t.tag&&<div style={{position:"absolute",top:14,right:-28,background:G,color:D,fontSize:8,fontWeight:700,padding:"3px 32px",transform:"rotate(45deg)",letterSpacing:2}}>{t.tag}</div>}
<h3 style={{fontFamily:CG,fontSize:22,fontWeight:700,color:CR,marginBottom:8}}>{t.name}</h3>
<div style={{marginBottom:24}}><span style={{fontFamily:CG,fontSize:44,fontWeight:700,color:G}}>${t.price}</span><span style={{fontSize:13,color:"#555",fontWeight:300}}>/mo</span></div>
{t.feat.map((f,j)=>(<div key={j} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
<div style={{width:4,height:4,borderRadius:"50%",background:G,flexShrink:0}}/>
<span style={{fontSize:13,color:"#aaa",fontWeight:300}}>{f}</span></div>))}
<a href="#top" style={{display:"block",width:"100%",marginTop:24,padding:"13px",textAlign:"center",background:t.a?G:"transparent",color:t.a?D:G,border:t.a?"none":`1px solid ${G}50`,borderRadius:3,
fontFamily:OF,fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",textDecoration:"none"}}>Join the Waitlist</a></div>))}</div></div></SW>)}

function Founder(){const[r,v]=useInView();return(<SW bg="#080808"><div ref={r} style={{maxWidth:640,margin:"0 auto",textAlign:"center",opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:"all 0.8s ease"}}>
<Logo size={72} style={{margin:"0 auto"}}/><div style={{margin:"24px auto",width:48,height:1,background:G}}/>
<blockquote style={{fontFamily:CG,fontSize:"clamp(19px,3vw,26px)",color:CR,lineHeight:1.7,fontStyle:"italic",fontWeight:400,marginBottom:24}}>
"DDC exists because nobody showed up for us. Nobody called. Nobody sent a box. Nobody said 'I know what this day feels like.'"</blockquote>
<p style={{color:G,fontSize:12,fontWeight:600,letterSpacing:3,textTransform:"uppercase"}}>Kent Grossi</p>
<p style={{color:"#555",fontSize:12,fontWeight:300,marginTop:4,letterSpacing:1}}>Founder & CEO</p>
<p style={{color:"#777",fontSize:13,lineHeight:1.9,marginTop:28,fontWeight:300,maxWidth:500,margin:"28px auto 0"}}>From homelessness to building a commercial roofing company in Southwest Florida. Self-made, self-taught, and intimately familiar with the pain of figuring out manhood without a roadmap.</p></div></SW>)}

// ━━━ EXIT INTENT ━━━
function ExitIntent(){const[show,setShow]=useState(false);const[email,setEmail]=useState("");const[done,setDone]=useState(false);const fired=useRef(false);
useEffect(()=>{if(isTouch)return;const h=(e)=>{if(e.clientY<5&&!fired.current){fired.current=true;setShow(true)}};
document.addEventListener("mouseout",h);return()=>document.removeEventListener("mouseout",h)},[]);
const go=async()=>{if(!email||!email.includes("@"))return;
try{await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})})}catch(e){}setDone(true);setTimeout(()=>setShow(false),2000)};
if(!show)return null;
return(<div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,backdropFilter:"blur(12px)"}}>
<div style={{maxWidth:400,width:"100%",padding:32,background:DC,border:`1px solid ${G}`,borderRadius:4,textAlign:"center",animation:"fadeUp 0.4s ease",position:"relative"}}>
<button onClick={()=>setShow(false)} style={{position:"absolute",top:10,right:14,background:"transparent",border:"none",color:"#444",fontSize:18,cursor:"pointer",lineHeight:1}}>×</button>
<Logo size={48} style={{margin:"0 auto"}}/><div style={{width:32,height:1,background:G,margin:"16px auto"}}/>
<h3 style={{fontFamily:CG,fontSize:22,color:CR,fontWeight:700,marginBottom:8}}>Before you go.</h3>
<p style={{color:"#777",fontSize:13,lineHeight:1.6,marginBottom:20}}>51.7 million men share this. You don't have to carry it alone.</p>
{!done?(<div style={{display:"flex",gap:0,borderRadius:3,overflow:"hidden",border:`1px solid ${DB}`}}>
<input type="email" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}
style={{flex:1,padding:"14px 16px",background:"#0D0D0D",border:"none",color:CR,fontFamily:OF,fontSize:13,outline:"none"}}/>
<button onClick={go} style={{padding:"14px 22px",background:G,color:D,border:"none",cursor:"pointer",fontFamily:OF,fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase"}}>Join</button></div>):
(<p style={{color:G,fontWeight:500,fontSize:14}}>Welcome, brother.</p>)}
</div></div>)}

function Footer(){return(<footer style={{padding:"56px 24px 120px",background:D,borderTop:`1px solid ${DB}`,textAlign:"center"}}>
<Logo size={40} style={{margin:"0 auto"}}/>
<p style={{color:"#333",fontSize:11,marginTop:20,letterSpacing:3,fontWeight:300,textTransform:"uppercase"}}>The Dead Dads Club · {new Date().getFullYear()}</p>
<p style={{color:"#222",fontSize:10,marginTop:8,fontWeight:300,letterSpacing:1}}>The only club you never wanted to join.</p></footer>)}

export default function App(){const[ic,setIC]=useState(false);const[wc,setWc]=useState(0);
return(<div>{!ic&&<Intro onDone={()=>setIC(true)}/>}<Nav/><Hero onCount={setWc}/>
<TQ quote="I've never told anyone this, but Father's Day is the worst day of my year. Every year I pretend I'm fine." who="Anonymous, 34, Chicago"/>
<Stats/>
<TQ quote="I learned to tie a tie from a YouTube video the morning of my wedding. I cried in the bathroom after." who="Anonymous, 29, Dallas"/>
<Pillars/><BoxReveal/>
<TQ quote="My son asked me 'what was grandpa like?' and I didn't have an answer. That's the day I knew I needed this." who="Anonymous, 41, Denver"/>
<VaultPreview/><FDCountdown/><MemorialWall/><CallDemo/><Quiz/><Pricing/><Founder/><Footer/>
<StickyBar count={wc}/><ExitIntent/></div>)}
