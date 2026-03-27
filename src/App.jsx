import { useState, useEffect, useRef } from "react";
const G="#C8A951",GL="#E8D5A0",GD="rgba(200,169,81,0.15)",D="#0A0A0A",DC="#141414",DB="#2A2A2A",CR="#F5F0E8",RH="#C0392B",HEART="#C0392B";
const CG="'Cormorant Garamond',serif",OF="'Outfit',sans-serif";
const isTouch=typeof window!=='undefined'&&('ontouchstart' in window);

function useInView(t=0.15){const r=useRef(null);const[v,s]=useState(false);
useEffect(()=>{const e=r.current;if(!e)return;const o=new IntersectionObserver(([x])=>{if(x.isIntersecting){s(true);o.disconnect()}},{threshold:t});o.observe(e);return()=>o.disconnect()},[]);return[r,v]}

// Kent's actual logo
function Logo({size=120,full=false}){return full?
<img src="/ddc-logo-full.jpg" alt="The Dead Dads Club" style={{width:size,height:"auto",borderRadius:4}} loading="lazy"/>:
<img src="/ddc-logo-icon.jpg" alt="DDC" style={{width:size,height:size,objectFit:"cover",borderRadius:4}} loading="lazy"/>}

function GDiv(){return <div style={{width:80,height:3,background:`linear-gradient(90deg,transparent,${G},transparent)`,margin:"0 auto"}}/>}
function SL({text}){return(<div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,justifyContent:"center"}}>
<div style={{width:24,height:1,background:G}}/><span style={{fontFamily:OF,fontSize:11,fontWeight:600,letterSpacing:4,color:G,textTransform:"uppercase"}}>{text}</span><div style={{width:24,height:1,background:G}}/></div>)}
function SW({children,bg=D,id}){return<section id={id} style={{padding:"100px 24px",background:bg,position:"relative"}}>{children}</section>}

// ━━━ UPGRADE 9: MATCH-STRIKE INTRO ━━━
function Intro({onDone}){const[phase,setPhase]=useState(0);
useEffect(()=>{const t1=setTimeout(()=>setPhase(1),300);const t2=setTimeout(()=>setPhase(2),1200);const t3=setTimeout(()=>setPhase(3),2400);const t4=setTimeout(()=>onDone(),3200);
return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4)}},[]);
return(<div style={{position:"fixed",inset:0,zIndex:9999,background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
opacity:phase>=3?0:1,transition:"opacity 0.8s ease",pointerEvents:phase>=3?"none":"all"}}>
{phase>=1&&<div style={{animation:"fadeUp 0.6s ease",position:"relative"}}>
<Logo size={140}/>
{phase>=1&&<div style={{position:"absolute",inset:-20,borderRadius:"50%",boxShadow:`0 0 ${phase>=2?80:20}px ${phase>=2?40:10}px rgba(200,169,81,${phase>=2?0.4:0.15})`,transition:"all 0.8s ease"}}/>}
</div>}
{phase>=2&&<p style={{marginTop:32,fontFamily:CG,fontSize:"clamp(14px,3vw,18px)",color:GL,fontStyle:"italic",letterSpacing:2,animation:"fadeUp 0.6s ease",textAlign:"center",padding:"0 24px"}}>
The only club you never wanted to join.</p>}
</div>)}

function Nav(){const[s,setS]=useState(false);
useEffect(()=>{const h=()=>setS(window.scrollY>60);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
const ls={color:"#888",fontSize:12,textDecoration:"none",letterSpacing:2,textTransform:"uppercase",fontWeight:400};
return(<nav role="navigation" aria-label="Main navigation" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"12px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",
background:s?"rgba(10,10,10,0.95)":"transparent",borderBottom:s?`1px solid ${DB}`:"1px solid transparent",backdropFilter:s?"blur(12px)":"none",transition:"all 0.3s ease"}}>
<a href="#top" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}><Logo size={32}/>
<span style={{fontFamily:CG,fontSize:16,fontWeight:700,color:CR,letterSpacing:1}}>DDC</span></a>
<div style={{display:"flex",gap:20,alignItems:"center",flexWrap:"wrap"}}>
<a href="#memorial-wall" className="nav-links-text" style={ls}>Wall</a><a href="#the-box" className="nav-links-text" style={ls}>The Box</a><a href="#quiz" className="nav-links-text" style={ls}>Quiz</a>
<a href="#top" style={{padding:"8px 20px",border:`1px solid ${G}`,color:G,fontSize:11,textDecoration:"none",letterSpacing:2,textTransform:"uppercase",borderRadius:3,fontWeight:500}}>Join</a>
</div></nav>)}

// ━━━ UPGRADE 1: STICKY BOTTOM CTA ━━━
function StickyBar({count}){const[show,setShow]=useState(false);const[email,setEmail]=useState("");const[done,setDone]=useState(false);const[sub,setSub]=useState(false);
useEffect(()=>{const h=()=>setShow(window.scrollY>window.innerHeight*0.9);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
const go=async()=>{if(!email||!email.includes("@")||sub)return;setSub(true);
try{await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})})}catch(e){}setDone(true);setSub(false)};
if(!show||done)return null;
return(<div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:99,background:"rgba(10,10,10,0.95)",borderTop:`1px solid ${G}40`,padding:"12px 16px",backdropFilter:"blur(12px)",
transform:show?"translateY(0)":"translateY(100%)",transition:"transform 0.3s ease"}}>
<div style={{maxWidth:500,margin:"0 auto",display:"flex",gap:8,alignItems:"center"}}>
<span style={{fontSize:11,color:G,fontWeight:600,whiteSpace:"nowrap",letterSpacing:1}}>{Math.max(100-(count||0),0)} spots left</span>
<input type="email" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}
style={{flex:1,padding:"10px 14px",background:"#111",border:`1px solid ${DB}`,borderRadius:4,color:CR,fontFamily:OF,fontSize:13,outline:"none",minWidth:0}}/>
<button onClick={go} disabled={sub} style={{padding:"10px 20px",background:G,color:D,border:"none",borderRadius:4,fontFamily:OF,fontSize:11,fontWeight:600,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",whiteSpace:"nowrap"}}>
{sub?"...":"Join"}</button></div></div>)}

// ━━━ HERO + UPGRADE 7: BROTHERHOOD NUMBER ━━━
function Hero({onCount}){const[email,setEmail]=useState("");const[submitted,setSub]=useState(false);const[submitting,setIng]=useState(false);
const[wc,setWc]=useState(null);const[rj,setRj]=useState([]);const[ti,setTi]=useState(0);const[err,setErr]=useState("");const[myNumber,setMyNum]=useState(null);
const[ref,vis]=useInView();const CAP=100;
useEffect(()=>{fetch("/api/waitlist-count").then(r=>r.json()).then(d=>{setWc(d.count||0);setRj(d.recent||[]);onCount(d.count||0)}).catch(()=>setWc(0))},[submitted]);
useEffect(()=>{if(!rj.length)return;const t=setInterval(()=>setTi(i=>(i+1)%rj.length),3500);return()=>clearInterval(t)},[rj]);
const submit=async()=>{const e=email.trim().toLowerCase();if(!e||!e.includes("@")||!e.split("@")[1]?.includes(".")){setErr("Enter a valid email");return}
if(submitting)return;setErr("");setIng(true);
try{const r=await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e})});
if(!r.ok){setErr("Something went wrong");setIng(false);return}}catch(x){setErr("Network error. Try again.");setIng(false);return}
setMyNum((wc||0)+1);setSub(true);setIng(false);setEmail("")};
const pct=wc===null?0:Math.min((wc/CAP)*100,100);const left=wc===null?null:Math.max(CAP-wc,0);
function ago(d){const m=Math.floor((Date.now()-new Date(d).getTime())/60000);if(m<1)return"just now";if(m<60)return m+"m ago";const h=Math.floor(m/60);return h<24?h+"h ago":Math.floor(h/24)+"d ago"}
return(<section id="top" ref={ref} style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"80px 24px",position:"relative",overflow:"hidden",textAlign:"center"}}>
<div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 30%,#1a150a 0%,${D} 70%)`,zIndex:0}}/>
<div style={{position:"absolute",inset:0,backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23C8A951' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,zIndex:0}}/>
<div style={{position:"relative",zIndex:1,maxWidth:700,opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(40px)",transition:"all 1s ease"}}>
<div style={{marginBottom:24}}><Logo size={180} full={true}/></div>
<GDiv/>
<p style={{fontFamily:CG,fontSize:"clamp(16px,2.5vw,22px)",color:GL,fontStyle:"italic",marginTop:20,marginBottom:40,letterSpacing:1,fontWeight:400}}>The only club you never wanted to join.</p>
{/* UPGRADE 7: Brotherhood Number on submit */}
{!submitted?(<div><div style={{display:"flex",gap:0,maxWidth:460,margin:"0 auto",borderRadius:4,overflow:"hidden",border:`1px solid ${err?RH:DB}`}}>
<input type="email" placeholder="Your email" value={email} onChange={e=>{setEmail(e.target.value);if(err)setErr("")}}
onKeyDown={e=>e.key==="Enter"&&submit()} aria-label="Email address"
style={{flex:1,padding:"16px 20px",background:"#111",border:"none",color:CR,fontFamily:OF,fontSize:15,outline:"none"}}/>
<button onClick={submit} disabled={submitting} style={{padding:"16px 28px",background:G,color:D,border:"none",cursor:"pointer",fontFamily:OF,fontSize:13,fontWeight:600,letterSpacing:2,textTransform:"uppercase",opacity:submitting?0.6:1,whiteSpace:"nowrap"}}>
{submitting?"...":"Join"}</button></div>
{err&&<p style={{color:RH,fontSize:12,marginTop:8}}>{err}</p>}</div>):
(<div style={{padding:"24px 32px",border:`1px solid ${G}`,borderRadius:4,background:GD,animation:"fadeUp 0.5s ease"}}>
<p style={{fontFamily:CG,fontSize:28,color:G,fontWeight:700,marginBottom:4}}>Brother #{myNumber}</p>
<p style={{color:CR,fontWeight:400,fontSize:15,marginBottom:4}}>Founding Member · Est. 2026</p>
<p style={{color:"#888",fontSize:12,fontWeight:300}}>Screenshot this. You earned your place.</p></div>)}
<div style={{maxWidth:400,margin:"28px auto 0"}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
<span style={{fontSize:13,color:G,fontWeight:600,letterSpacing:1}}>{wc===null?"Loading...":(`${wc} of ${CAP} Founding Spots`)}</span>
{left!==null&&<span style={{fontSize:12,color:left<=20?RH:"#666",fontWeight:left<=20?600:400}}>{left<=0?"SOLD OUT":`${left} left`}</span>}
</div>
<div style={{height:6,background:"#1a1a1a",borderRadius:3,overflow:"hidden"}}>
<div style={{height:"100%",background:`linear-gradient(90deg,${G},${GL})`,borderRadius:3,width:`${pct}%`,transition:"width 1.5s ease",boxShadow:`0 0 12px ${G}40`}}/></div></div>
{rj.length>0&&<div style={{marginTop:16,height:24,overflow:"hidden"}} aria-live="polite"><div key={ti} style={{fontSize:12,color:"#666",fontWeight:300,animation:"fadeUp 0.5s ease"}}>
<span style={{color:GL}}>{rj[ti]?.name}</span> joined the Brotherhood · {ago(rj[ti]?.time)}</div></div>}
<p style={{marginTop:12,fontSize:12,color:"#444",fontWeight:300}}>Founding Members get locked-in pricing for life.</p>
</div>
<div style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",animation:"pulse 2s infinite"}} aria-hidden="true">
<svg width="20" height="30" viewBox="0 0 20 30" fill="none"><rect x="1" y="1" width="18" height="28" rx="9" stroke={G} strokeWidth="1.5"/>
<circle cx="10" cy="10" r="2" fill={G}><animate attributeName="cy" values="10;20;10" dur="2s" repeatCount="indefinite"/></circle></svg></div>
</section>)}

function Stats(){const[r,v]=useInView();const st=[{n:"51.7M",l:"American men with a deceased father"},{n:"25%",l:"of children grow up fatherless"},{n:"85%",l:"of youth in prison from fatherless homes"},{n:"0",l:"premium communities serving these men"}];
return(<SW bg="#0D0D0D"><div ref={r} style={{maxWidth:900,margin:"0 auto",textAlign:"center"}}><SL text="The Crisis"/>
<h2 style={{fontFamily:CG,fontSize:"clamp(32px,5vw,48px)",fontWeight:700,color:CR,marginBottom:12}}>Nobody's Coming to Save Us.</h2>
<p style={{color:"#888",fontSize:15,maxWidth:520,margin:"0 auto 56px",lineHeight:1.7,fontWeight:300}}>America has a fatherlessness crisis. The U.S. Surgeon General declared loneliness a public health epidemic. And yet no premium, secular brotherhood exists for these men.</p>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:24}}>{st.map((s,i)=>(<div key={i} style={{padding:"36px 20px",background:DC,border:`1px solid ${DB}`,borderRadius:4,opacity:v?1:0,transform:v?"translateY(0)":"translateY(30px)",transition:`all 0.6s ease ${i*0.12}s`}}>
<div style={{fontFamily:CG,fontSize:40,fontWeight:700,color:G,marginBottom:8}}>{s.n}</div><div style={{fontSize:13,color:"#999",lineHeight:1.5,fontWeight:300}}>{s.l}</div></div>))}</div></div></SW>)}

// ━━━ UPGRADE 5: TESTIMONIAL ━━━
function Testimonial({quote,who}){const[r,v]=useInView();
return(<div ref={r} style={{padding:"48px 24px",background:D,textAlign:"center",opacity:v?1:0,transform:v?"translateY(0)":"translateY(20px)",transition:"all 0.8s ease"}}>
<div style={{maxWidth:560,margin:"0 auto"}}><div style={{width:40,height:2,background:G,margin:"0 auto 20px"}}/>
<p style={{fontFamily:CG,fontSize:"clamp(18px,3vw,24px)",color:CR,fontStyle:"italic",lineHeight:1.6,fontWeight:400}}>"{quote}"</p>
<p style={{color:"#666",fontSize:12,marginTop:16,letterSpacing:2,fontWeight:300}}>— {who}</p></div></div>)}

function Pillars(){const[r,v]=useInView();const ps=[{i:"🤝",t:"The Brotherhood",d:"Private digital community. Weekly live calls, accountability pods, and men who show up because they've been in the same dark room."},{i:"📦",t:"The Box",d:"Monthly curated box. Dog tags, pocket knives, letter-writing kits. Every item answers: 'What would your old man have given you?'"},{i:"📖",t:"The Vault",d:"Everything your dad should've taught you. Money, relationships, fitness, mental toughness, practical skills, fatherhood."},{i:"🪦",t:"The Memorial Wall",d:"A permanent digital tribute to your father. On his anniversary, we call you. Because nobody should be alone on that day."}];
return(<SW><div ref={r} style={{maxWidth:1000,margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:64}}><SL text="What We Built"/>
<h2 style={{fontFamily:CG,fontSize:"clamp(32px,5vw,48px)",fontWeight:700,color:CR}}>Four Pillars. One Brotherhood.</h2></div>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:20}}>{ps.map((p,i)=>(<div key={i} style={{padding:"40px 28px",background:DC,border:`1px solid ${DB}`,borderRadius:4,opacity:v?1:0,transform:v?"translateY(0)":"translateY(30px)",transition:`all 0.7s ease ${i*0.15}s`,position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${G},transparent)`}}/>
<div style={{fontSize:32,marginBottom:16}} aria-hidden="true">{p.i}</div><h3 style={{fontFamily:CG,fontSize:22,fontWeight:700,color:CR,marginBottom:12}}>{p.t}</h3>
<p style={{fontSize:14,color:"#999",lineHeight:1.7,fontWeight:300}}>{p.d}</p></div>))}</div></div></SW>)}

function BoxReveal(){const[r,v]=useInView();const[opened,setO]=useState(false);const[rc,setRc]=useState(0);
const items=[{icon:"🏷️",name:"Personalized Dog Tags",story:"Your father's name. Your name. Connected forever in steel."},{icon:"🔪",name:"EDC Pocket Knife",story:"The one he would've handed you and said 'Take care of this.'"},{icon:"🪙",name:"DDC Challenge Coin",story:"Carry it daily. You earned your place in this Brotherhood."},{icon:"✉️",name:"Letter-Writing Kit",story:"Write the letter you never got to send. Or the one you wish you'd received."},{icon:"⏳",name:"Brass Hourglass",story:"Time is the one thing we can't get back. Use yours well."},{icon:"📘",name:"The Father's Blueprint",story:"The financial freedom guide your old man should've left you."}];
useEffect(()=>{if(!opened)return;const t=setInterval(()=>setRc(c=>{if(c>=items.length){clearInterval(t);return c}return c+1}),400);return()=>clearInterval(t)},[opened]);
return(<SW bg="#080808" id="the-box"><div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 50%,rgba(200,169,81,0.03) 0%,transparent 60%)`}}/>
<div ref={r} style={{maxWidth:800,margin:"0 auto",position:"relative",zIndex:1,textAlign:"center"}}><SL text="The Welcome Box"/>
<h2 style={{fontFamily:CG,fontSize:"clamp(32px,5vw,48px)",fontWeight:700,color:CR,marginBottom:8}}>What Would Your Old Man Have Given You?</h2>
<p style={{color:"#888",fontSize:15,maxWidth:480,margin:"0 auto 40px",lineHeight:1.7,fontWeight:300}}>Every new member receives a Welcome Box. It's not a product. It's an initiation.</p>
{!opened?(<div onClick={()=>setO(true)} onKeyDown={e=>(e.key==="Enter"||e.key===" ")&&setO(true)} tabIndex={0} role="button" aria-label="Open the Welcome Box"
style={{width:220,height:220,margin:"0 auto",cursor:"pointer",position:"relative",opacity:v?1:0,transform:v?"scale(1)":"scale(0.8)",transition:"all 0.8s ease"}}>
<div style={{width:"100%",height:"100%",background:`linear-gradient(135deg,#1a1508 0%,#2a200e 100%)`,border:`2px solid ${G}`,borderRadius:8,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,boxShadow:`0 0 40px rgba(200,169,81,0.15),inset 0 0 40px rgba(200,169,81,0.05)`}}>
<Logo size={80}/><div style={{width:60,height:2,background:G}}/><span style={{fontSize:10,color:G,letterSpacing:3,textTransform:"uppercase",fontWeight:600}}>Welcome Box</span></div>
<div style={{position:"absolute",bottom:-36,left:"50%",transform:"translateX(-50%)",fontSize:13,color:G,fontWeight:500,whiteSpace:"nowrap",animation:"pulse 2s infinite"}}>
↑ {isTouch?"Tap":"Click"} to open</div></div>):
(<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16,marginTop:16}}>{items.map((item,i)=>(<div key={i} style={{padding:"28px 20px",background:DC,border:`1px solid ${DB}`,borderRadius:4,opacity:i<rc?1:0,transform:i<rc?"translateY(0) scale(1)":"translateY(30px) scale(0.9)",transition:"all 0.5s ease",position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${G},transparent)`}}/>
<div style={{fontSize:36,marginBottom:12}} aria-hidden="true">{item.icon}</div><h4 style={{fontFamily:CG,fontSize:18,fontWeight:700,color:CR,marginBottom:8}}>{item.name}</h4>
<p style={{fontSize:13,color:"#999",lineHeight:1.6,fontStyle:"italic",fontWeight:300}}>{item.story}</p></div>))}</div>)}</div></SW>)}

// ━━━ UPGRADE 6: VAULT PREVIEW ━━━
function VaultPreview(){const[r,v]=useInView();const[email,setEmail]=useState("");const[unlocked,setU]=useState(false);const[sub,setSub]=useState(false);
const go=async()=>{if(!email||!email.includes("@")||sub)return;setSub(true);
try{await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})})}catch(e){}setU(true);setSub(false)};
return(<SW bg="#0D0D0D" id="vault"><div ref={r} style={{maxWidth:640,margin:"0 auto",textAlign:"center",opacity:v?1:0,transform:v?"translateY(0)":"translateY(30px)",transition:"all 0.8s ease"}}>
<SL text="Free Preview"/><h2 style={{fontFamily:CG,fontSize:"clamp(28px,5vw,44px)",fontWeight:700,color:CR,marginBottom:12}}>The Father's Blueprint</h2>
<p style={{color:"#888",fontSize:15,maxWidth:460,margin:"0 auto 32px",lineHeight:1.7,fontWeight:300}}>Chapter 1 of the financial freedom guide your dad should've left you. Enter your email to read it free.</p>
{!unlocked?(<div>
<div style={{padding:"32px 24px",background:DC,border:`1px solid ${DB}`,borderRadius:4,marginBottom:24,position:"relative",overflow:"hidden"}}>
<div style={{filter:"blur(6px)",userSelect:"none",pointerEvents:"none"}}>
<h3 style={{fontFamily:CG,fontSize:22,color:CR,fontWeight:700,marginBottom:12}}>Chapter 1: The Money Talk Nobody Had With You</h3>
<p style={{color:"#aaa",fontSize:14,lineHeight:1.8,fontWeight:300}}>Most men learn about money the hard way — through debt, through shame, through silence. If your old man was anything like mine, the closest thing to financial advice you got was "we can't afford it" or nothing at all. This chapter isn't about budgets and spreadsheets. It's about the conversation that never happened and why it left a mark...</p>
</div>
<div style={{position:"absolute",inset:0,background:`linear-gradient(transparent 20%, ${DC} 90%)`,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:20}}>
<div style={{background:"rgba(0,0,0,0.6)",borderRadius:4,padding:"4px 12px"}}><span style={{fontSize:11,color:G,letterSpacing:2,textTransform:"uppercase",fontWeight:600}}>🔒 Unlock to read</span></div></div></div>
<div style={{display:"flex",gap:0,maxWidth:400,margin:"0 auto",borderRadius:4,overflow:"hidden",border:`1px solid ${DB}`}}>
<input type="email" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}
style={{flex:1,padding:"14px 16px",background:"#111",border:"none",color:CR,fontFamily:OF,fontSize:14,outline:"none"}}/>
<button onClick={go} disabled={sub} style={{padding:"14px 24px",background:G,color:D,border:"none",cursor:"pointer",fontFamily:OF,fontSize:12,fontWeight:600,letterSpacing:2,textTransform:"uppercase",whiteSpace:"nowrap"}}>
{sub?"...":"Unlock"}</button></div></div>):
(<div style={{padding:"32px 24px",background:DC,border:`1px solid ${G}40`,borderRadius:4,textAlign:"left",animation:"fadeUp 0.5s ease"}}>
<h3 style={{fontFamily:CG,fontSize:22,color:CR,fontWeight:700,marginBottom:16}}>Chapter 1: The Money Talk Nobody Had With You</h3>
<p style={{color:"#ccc",fontSize:14,lineHeight:1.9,fontWeight:300,marginBottom:16}}>Most men learn about money the hard way — through debt, through shame, through silence. If your old man was anything like mine, the closest thing to financial advice you got was "we can't afford it" or nothing at all.</p>
<p style={{color:"#ccc",fontSize:14,lineHeight:1.9,fontWeight:300,marginBottom:16}}>This chapter isn't about budgets and spreadsheets. It's about the conversation that never happened and why it left a mark deeper than any bank statement ever could.</p>
<p style={{color:"#ccc",fontSize:14,lineHeight:1.9,fontWeight:300,marginBottom:16}}>Here's what I wish someone had told me at 18: the first $1,000 you save isn't about money. It's about proving to yourself that you can build something from nothing. And if you grew up without a dad showing you how — that proof matters more than you think.</p>
<p style={{color:G,fontSize:14,fontWeight:500,marginTop:24,fontStyle:"italic"}}>The full Father's Blueprint is available inside the Brotherhood. Join to unlock all 6 chapters.</p>
</div>)}</div></SW>)}

function FDCountdown(){const[r,v]=useInView();const FD=new Date("2026-06-21T00:00:00");const[tl,setTl]=useState({});const[past,setPast]=useState(false);
useEffect(()=>{const c=()=>{const d=FD-new Date();if(d<=0){setPast(true);return{days:0,hours:0,minutes:0,seconds:0}}
return{days:Math.floor(d/864e5),hours:Math.floor((d%864e5)/36e5),minutes:Math.floor((d%36e5)/6e4),seconds:Math.floor((d%6e4)/1e3)}};setTl(c());const t=setInterval(()=>setTl(c()),1000);return()=>clearInterval(t)},[]);
const us=[{v:tl.days,l:"Days"},{v:tl.hours,l:"Hours"},{v:tl.minutes,l:"Minutes"},{v:tl.seconds,l:"Seconds"}];
return(<SW><div ref={r} style={{maxWidth:700,margin:"0 auto",textAlign:"center",opacity:v?1:0,transform:v?"translateY(0)":"translateY(30px)",transition:"all 0.8s ease"}}>
<SL text="June 21, 2026"/><h2 style={{fontFamily:CG,fontSize:"clamp(28px,5vw,44px)",fontWeight:700,color:CR,marginBottom:12}}>
{past?"We Showed Up. Together.":"The Hardest Day on the Calendar."}</h2>
<p style={{color:"#888",fontSize:15,maxWidth:480,margin:"0 auto 40px",lineHeight:1.7,fontWeight:300}}>
{past?"Father's Day has passed, but the Brotherhood endures.":"Father's Day is coming. For millions of men, it's a day of silence while the world celebrates. This year, you won't face it alone."}</p>
{!past&&<div style={{display:"flex",justifyContent:"center",gap:16,flexWrap:"wrap",marginBottom:40}}>{us.map((u,i)=>(<div key={i} style={{width:90,padding:"20px 0",background:DC,border:`1px solid ${DB}`,borderRadius:4}}>
<div style={{fontFamily:CG,fontSize:36,fontWeight:700,color:G}}>{String(u.v||0).padStart(2,"0")}</div>
<div style={{fontSize:10,color:"#666",letterSpacing:2,textTransform:"uppercase",marginTop:4}}>{u.l}</div></div>))}</div>}
<div style={{padding:"28px 32px",background:GD,border:`1px solid rgba(200,169,81,0.3)`,borderRadius:4,maxWidth:520,margin:"0 auto"}}>
<p style={{fontFamily:CG,fontSize:20,color:CR,fontStyle:"italic",lineHeight:1.6,marginBottom:16}}>"On Father's Day, the Brotherhood gathers. We honor the men who made us — present or absent — and we show up for each other."</p>
<a href="#memorial-wall" style={{display:"inline-block",padding:"12px 28px",background:G,color:D,textDecoration:"none",fontFamily:OF,fontSize:12,fontWeight:600,letterSpacing:2,textTransform:"uppercase",borderRadius:4}}>
Honor Your Father{!past?" Before June 21":""}</a></div></div></SW>)}

// ━━━ MEMORIAL WALL + UPGRADE 2 (funnel) + UPGRADE 8 (anniversary date) ━━━
function MemorialWall(){const[r,v]=useInView();const[entries,setE]=useState([]);const[sf,setSf]=useState(false);
const[form,setF]=useState({name:"",years:"",message:"",by:"",anniversary:""});const[sub,setSub]=useState(false);const[loading,setL]=useState(true);const[apiErr,setApiErr]=useState("");
const[showFunnel,setShowFunnel]=useState(false);const[funnelEmail,setFE]=useState("");const[funnelDone,setFD]=useState(false);const[lastEntry,setLE]=useState(null);
const seed=[{id:"s1",father_name:"Robert James Grossi",years:"1955 – 2008",message:"His last words cut deep. But every man I help build is a brick laid on top of that sentence. I carry you, old man.",submitted_by:"Kent"}];
useEffect(()=>{fetch("/api/memorials").then(r=>r.json()).then(d=>{if(d.entries?.length>0)setE(d.entries);setL(false)}).catch(()=>setL(false))},[]);
const add=async()=>{if(!form.name.trim()||!form.message.trim()||sub)return;if(form.name.trim().length<2){setApiErr("Please enter your father's full name");return}
setSub(true);setApiErr("");
try{const r=await fetch("/api/memorials",{method:"POST",headers:{"Content-Type":"application/json"},
body:JSON.stringify({father_name:form.name.trim(),years:form.years.trim(),message:form.message.trim(),submitted_by:form.by.trim()||"Anonymous"})});
const d=await r.json();if(!r.ok){setApiErr(d.error||"Something went wrong");setSub(false);return}
if(d.entry){setE(p=>[d.entry,...p]);setLE(d.entry);setShowFunnel(true)}}catch(e){setApiErr("Network error.")}
setF({name:"",years:"",message:"",by:"",anniversary:""});setSf(false);setSub(false)};
const funnelSubmit=async()=>{if(!funnelEmail||!funnelEmail.includes("@"))return;
try{await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:funnelEmail})})}catch(e){}setFD(true)};
const de=entries.length>0?entries:seed;
const is={width:"100%",padding:"14px 16px",background:"#111",border:`1px solid ${DB}`,borderRadius:4,color:CR,fontFamily:OF,fontSize:14,outline:"none",marginBottom:12};
return(<SW bg="#080808" id="memorial-wall"><div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 0%,rgba(200,169,81,0.04) 0%,transparent 60%)`}}/>
<div ref={r} style={{maxWidth:1000,margin:"0 auto",position:"relative",zIndex:1}}>
{/* UPGRADE 2: Post-submit funnel */}
{showFunnel&&lastEntry&&!funnelDone&&(<div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,backdropFilter:"blur(8px)"}}>
<div style={{maxWidth:440,width:"100%",padding:32,background:DC,border:`1px solid ${G}`,borderRadius:8,textAlign:"center",animation:"fadeUp 0.5s ease"}}>
<Logo size={60}/><div style={{width:40,height:2,background:G,margin:"16px auto"}}/>
<h3 style={{fontFamily:CG,fontSize:24,color:CR,fontWeight:700,marginBottom:8}}>Your father's tribute is live.</h3>
<div style={{padding:"16px 20px",background:"rgba(200,169,81,0.06)",border:`1px solid ${DB}`,borderRadius:4,marginBottom:20,textAlign:"left"}}>
<p style={{fontFamily:CG,fontSize:18,color:CR,fontWeight:700}}>{lastEntry.father_name}</p>
{lastEntry.years&&<p style={{fontSize:11,color:G,letterSpacing:2,marginTop:4}}>{lastEntry.years}</p>}
<p style={{fontSize:13,color:"#aaa",fontStyle:"italic",marginTop:8,lineHeight:1.6}}>"{lastEntry.message}"</p></div>
<p style={{color:"#999",fontSize:14,lineHeight:1.6,marginBottom:20}}>Join the Brotherhood so we can <span style={{color:G,fontWeight:500}}>call you on his anniversary</span>. No one should be alone on that day.</p>
<div style={{display:"flex",gap:0,borderRadius:4,overflow:"hidden",border:`1px solid ${DB}`}}>
<input type="email" placeholder="Your email" value={funnelEmail} onChange={e=>setFE(e.target.value)} onKeyDown={e=>e.key==="Enter"&&funnelSubmit()}
style={{flex:1,padding:"14px 16px",background:"#111",border:"none",color:CR,fontFamily:OF,fontSize:14,outline:"none"}}/>
<button onClick={funnelSubmit} style={{padding:"14px 24px",background:G,color:D,border:"none",cursor:"pointer",fontFamily:OF,fontSize:12,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Join</button></div>
<button onClick={()=>setShowFunnel(false)} style={{marginTop:16,padding:"8px 16px",background:"transparent",border:"none",color:"#555",fontFamily:OF,fontSize:12,cursor:"pointer"}}>Maybe later</button>
</div></div>)}
{showFunnel&&funnelDone&&(<div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
<div style={{maxWidth:400,width:"100%",padding:32,background:DC,border:`1px solid ${G}`,borderRadius:8,textAlign:"center",animation:"fadeUp 0.5s ease"}}>
<Logo size={60}/><p style={{fontFamily:CG,fontSize:22,color:G,fontWeight:700,marginTop:16}}>Welcome, brother.</p>
<p style={{color:"#999",fontSize:14,marginTop:8}}>We'll be in touch on the day that matters most.</p>
<button onClick={()=>setShowFunnel(false)} style={{marginTop:20,padding:"12px 28px",background:G,color:D,border:"none",borderRadius:4,fontFamily:OF,fontSize:12,fontWeight:600,letterSpacing:2,textTransform:"uppercase",cursor:"pointer"}}>Close</button>
</div></div>)}
<div style={{textAlign:"center",marginBottom:56}}>
<SL text="Honor Them"/><h2 style={{fontFamily:CG,fontSize:"clamp(32px,5vw,52px)",fontWeight:700,color:CR,marginBottom:12}}>The Memorial Wall</h2>
<p style={{color:"#888",fontSize:15,maxWidth:500,margin:"0 auto 32px",lineHeight:1.7,fontWeight:300}}>A permanent tribute. Because every father deserves to be remembered, and every son deserves a place to go.</p>
{!sf?(<button onClick={()=>setSf(true)} style={{padding:"14px 32px",background:"transparent",border:`1px solid ${G}`,color:G,fontFamily:OF,fontSize:13,fontWeight:500,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",borderRadius:4}}>
✝ Honor Your Father</button>):
(<div style={{maxWidth:460,margin:"0 auto",padding:32,background:DC,border:`1px solid ${DB}`,borderRadius:4,textAlign:"left",animation:"fadeUp 0.4s ease"}}>
<h4 style={{fontFamily:CG,fontSize:20,color:CR,marginBottom:20}}>Create a Tribute</h4>
<input style={is} placeholder="Father's full name" value={form.name} onChange={e=>setF({...form,name:e.target.value.slice(0,200)})} maxLength={200}/>
<input style={is} placeholder="Years (e.g. 1955 – 2008)" value={form.years} onChange={e=>setF({...form,years:e.target.value.slice(0,50)})} maxLength={50}/>
{/* UPGRADE 8: Anniversary date */}
<div style={{marginBottom:12}}><label style={{fontSize:11,color:G,letterSpacing:2,textTransform:"uppercase",fontWeight:500,marginBottom:6,display:"block"}}>Date of passing</label>
<input type="date" style={{...is,marginBottom:0,colorScheme:"dark"}} value={form.anniversary} onChange={e=>setF({...form,anniversary:e.target.value})}/>
<p style={{fontSize:11,color:"#555",marginTop:4,fontStyle:"italic"}}>On this day each year, the Brotherhood will remember him with you.</p></div>
<div style={{position:"relative"}}><textarea style={{...is,minHeight:80,resize:"vertical"}} placeholder="Your message to him..." value={form.message}
onChange={e=>setF({...form,message:e.target.value.slice(0,2000)})} maxLength={2000}/>
<span style={{position:"absolute",bottom:18,right:8,fontSize:10,color:form.message.length>1800?RH:"#444"}}>{form.message.length}/2000</span></div>
<input style={is} placeholder="Your first name (optional)" value={form.by} onChange={e=>setF({...form,by:e.target.value.slice(0,100)})} maxLength={100}/>
{apiErr&&<p style={{color:RH,fontSize:12,marginBottom:8}}>{apiErr}</p>}
<div style={{display:"flex",gap:12,marginTop:8}}><button onClick={add} disabled={sub} style={{flex:1,padding:"14px",background:G,color:D,border:"none",borderRadius:4,fontFamily:OF,fontSize:13,fontWeight:600,letterSpacing:1,cursor:"pointer",textTransform:"uppercase",opacity:sub?0.6:1}}>
{sub?"Placing...":"Place on the Wall"}</button>
<button onClick={()=>{setSf(false);setApiErr("")}} style={{padding:"14px 20px",background:"transparent",color:"#666",border:`1px solid ${DB}`,borderRadius:4,fontFamily:OF,fontSize:13,cursor:"pointer"}}>Cancel</button></div></div>)}</div>
{loading?<div style={{textAlign:"center",padding:40}}><p style={{color:"#555",fontSize:14}}>Loading tributes...</p></div>:
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20}}>{de.map((e,i)=>(<div key={e.id} style={{padding:"32px 28px",background:DC,border:`1px solid ${DB}`,borderRadius:4,position:"relative",overflow:"hidden",opacity:v?1:0,transform:v?"translateY(0)":"translateY(20px)",transition:`all 0.6s ease ${i*0.1}s`}}>
<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${G},transparent)`}}/>
<div style={{marginBottom:16,opacity:0.3}}><Logo size={28}/></div>
<h4 style={{fontFamily:CG,fontSize:20,fontWeight:700,color:CR,marginBottom:4}}>{e.father_name}</h4>
{e.years&&<p style={{fontSize:12,color:G,letterSpacing:2,marginBottom:16,fontWeight:500}}>{e.years}</p>}
<p style={{fontSize:14,color:"#aaa",lineHeight:1.7,fontStyle:"italic",fontWeight:300}}>"{e.message}"</p>
{e.submitted_by&&<p style={{fontSize:12,color:"#666",marginTop:16,fontWeight:400}}>— {e.submitted_by}</p>}</div>))}</div>}</div></SW>)}

function CallDemo(){const[r,v]=useInView();const[playing,setP]=useState(false);const[li,setLi]=useState(-1);const tr=useRef([]);
const lines=[{d:0,t:"📱  Your phone rings.",s:"sys"},{d:1200,t:"It's March 15th — the day your father passed.",s:"sys"},{d:3000,t:'"Hey brother, it\'s Kent."',s:"k"},{d:5000,t:'"I know what today is. I just wanted you to know — you\'re not alone today."',s:"k"},{d:7500,t:'"Your old man would be proud of the man you\'ve become. And if nobody else tells you that today, I will."',s:"k"},{d:10000,t:'"The Brotherhood is here. We see you. We\'ve got you."',s:"k"},{d:12500,t:"This is the call that changes everything.",s:"f"},{d:14000,t:"No competitor can replicate this. Because no competitor lived this.",s:"f"}];
const start=()=>{tr.current.forEach(t=>clearTimeout(t));setP(true);setLi(0);tr.current=lines.map((l,i)=>setTimeout(()=>setLi(i),l.d))};
const replay=()=>{setLi(-1);setP(false);setTimeout(start,100)};
useEffect(()=>()=>tr.current.forEach(t=>clearTimeout(t)),[]);
return(<SW><div ref={r} style={{maxWidth:560,margin:"0 auto",textAlign:"center",opacity:v?1:0,transform:v?"translateY(0)":"translateY(30px)",transition:"all 0.8s ease"}}>
<SL text="The Moat"/><h2 style={{fontFamily:CG,fontSize:"clamp(28px,5vw,44px)",fontWeight:700,color:CR,marginBottom:12}}>The Call That Changes Everything</h2>
<p style={{color:"#888",fontSize:15,maxWidth:440,margin:"0 auto 36px",lineHeight:1.7,fontWeight:300}}>On the anniversary of your father's passing, your phone rings. It's DDC.</p>
{!playing?(<button onClick={start} aria-label="Play demo" style={{width:80,height:80,borderRadius:"50%",background:G,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",boxShadow:`0 0 30px rgba(200,169,81,0.3)`}}>
<svg width="28" height="28" viewBox="0 0 24 24" fill={D}><path d="M8 5v14l11-7z"/></svg></button>):
(<div style={{maxWidth:480,margin:"0 auto",padding:"32px 28px",background:DC,border:`1px solid ${DB}`,borderRadius:8,textAlign:"left",minHeight:280}}>
<div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24,paddingBottom:16,borderBottom:`1px solid ${DB}`}}>
<div style={{width:40,height:40,borderRadius:"50%",overflow:"hidden"}}><Logo size={40}/></div>
<div><div style={{fontSize:14,color:CR,fontWeight:600}}>Dead Dads Club</div><div style={{fontSize:11,color:"#4CAF50",fontWeight:500}}>Incoming Call</div></div></div>
<div role="log" aria-live="polite" style={{display:"flex",flexDirection:"column",gap:16}}>{lines.map((l,i)=>{if(i>li)return null;const ik=l.s==="k",iF=l.s==="f";
return(<div key={i} style={{animation:"fadeUp 0.4s ease",padding:ik?"12px 16px":"0",background:ik?"rgba(200,169,81,0.08)":"transparent",borderLeft:ik?`2px solid ${G}`:"none",borderRadius:ik?"0 4px 4px 0":0}}>
<p style={{fontSize:iF?13:15,color:ik?CR:iF?G:"#aaa",fontFamily:ik?CG:OF,fontStyle:ik?"italic":"normal",fontWeight:iF?600:ik?400:300,lineHeight:1.6,letterSpacing:iF?1:0}}>{l.t}</p></div>)})}</div>
{li>=lines.length-1&&(<div style={{marginTop:24,display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
<a href="#top" style={{display:"inline-block",padding:"12px 28px",background:G,color:D,textDecoration:"none",fontFamily:OF,fontSize:12,fontWeight:600,letterSpacing:2,textTransform:"uppercase",borderRadius:4}}>Join the Brotherhood</a>
<button onClick={replay} style={{padding:"12px 20px",background:"transparent",border:`1px solid ${DB}`,color:"#888",borderRadius:4,fontFamily:OF,fontSize:12,cursor:"pointer"}}>↻ Replay</button></div>)}</div>)}</div></SW>)}

function Quiz(){const[r,v]=useInView();const[step,setS]=useState(0);const[ans,setA]=useState([]);const[email,setE]=useState("");const[sent,setSent]=useState(false);const[err,setErr]=useState("");const[myNum,setMyNum]=useState(null);
const qs=[{q:"Did you learn to shave from YouTube — or just figured it out?",y:"Figured it out alone",n:"Someone taught me"},{q:"Do you dread Father's Day every year?",y:"Every single year",n:"Not really"},{q:"Have you ever had to teach yourself something you knew a dad should've taught you?",y:"More times than I can count",n:"Not that I remember"},{q:"When something goes wrong, is your first instinct to handle it completely alone?",y:"Always",n:"I reach out for help"},{q:"Do you ever feel like you're performing 'being a man' instead of actually knowing how?",y:"That hits close",n:"I feel confident in it"}];
const score=ans.filter(a=>a==="y").length;const ha=(a)=>{setA([...ans,a]);setS(step+1)};
const msgs=[{mn:0,mx:1,m:"You had some guidance along the way. But if you felt something reading these questions — that's enough. The Brotherhood is open."},{mn:2,mx:3,m:"You've carried more than most people know. You figured out things no kid should have to figure out alone. You belong here."},{mn:4,mx:5,m:"You built yourself from scratch. No blueprint, no safety net, no phone call to make when it all fell apart. 51.7 million men know exactly what that feels like. The Brotherhood is waiting."}];
const rm=msgs.find(x=>score>=x.mn&&score<=x.mx)?.m||"";
const restart=()=>{setS(0);setA([]);setSent(false);setE("");setErr("");setMyNum(null)};
const es=async()=>{if(!email||!email.includes("@")||!email.split("@")[1]?.includes(".")){setErr("Enter a valid email");return}
try{const c=await fetch("/api/waitlist-count").then(r=>r.json());setMyNum((c.count||0)+1)}catch(e){}
try{await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})})}catch(e){}setSent(true)};
const bs=(g)=>({flex:1,padding:"16px 20px",background:g?G:"transparent",color:g?D:CR,border:g?"none":`1px solid ${DB}`,borderRadius:4,fontFamily:OF,fontSize:14,fontWeight:500,cursor:"pointer"});
return(<SW bg="#080808" id="quiz"><div ref={r} style={{maxWidth:560,margin:"0 auto",textAlign:"center",opacity:v?1:0,transform:v?"translateY(0)":"translateY(30px)",transition:"all 0.8s ease"}}>
<SL text="Find Out"/><h2 style={{fontFamily:CG,fontSize:"clamp(28px,5vw,44px)",fontWeight:700,color:CR,marginBottom:12}}>Did You Figure It Out Alone?</h2>
{step===0&&(<div><p style={{color:"#888",fontSize:15,lineHeight:1.7,fontWeight:300,marginBottom:32}}>Five questions. No right answers. Just the truth about how you got here.</p>
<button onClick={()=>setS(1)} style={{padding:"16px 40px",background:G,color:D,border:"none",borderRadius:4,fontFamily:OF,fontSize:14,fontWeight:600,letterSpacing:2,textTransform:"uppercase",cursor:"pointer"}}>Start</button></div>)}
{step>=1&&step<=5&&(<div key={step} style={{animation:"fadeUp 0.4s ease"}}>
<div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:32}}>{[1,2,3,4,5].map(i=>(<div key={i} style={{width:40,height:3,borderRadius:2,background:i<=step?G:DB}}/>))}</div>
<p style={{fontFamily:CG,fontSize:24,color:CR,lineHeight:1.5,fontStyle:"italic",marginBottom:36}}>"{qs[step-1].q}"</p>
<div style={{display:"flex",gap:12,flexWrap:"wrap"}}><button onClick={()=>ha("y")} style={bs(true)}>{qs[step-1].y}</button><button onClick={()=>ha("n")} style={bs(false)}>{qs[step-1].n}</button></div></div>)}
{step===6&&(<div style={{animation:"fadeUp 0.5s ease"}}><div style={{fontFamily:CG,fontSize:64,color:G,fontWeight:700,marginBottom:8}}>{score}/5</div>
<p style={{fontFamily:CG,fontSize:20,color:CR,lineHeight:1.6,fontStyle:"italic",maxWidth:460,margin:"0 auto 32px"}}>{rm}</p>
{!sent?(<div><div style={{display:"flex",gap:0,maxWidth:400,margin:"0 auto",borderRadius:4,overflow:"hidden",border:`1px solid ${err?RH:DB}`}}>
<input type="email" placeholder="Your email" value={email} onChange={e=>{setE(e.target.value);if(err)setErr("")}} onKeyDown={e=>e.key==="Enter"&&es()}
style={{flex:1,padding:"14px 16px",background:"#111",border:"none",color:CR,fontFamily:OF,fontSize:14,outline:"none"}}/>
<button onClick={es} style={{padding:"14px 24px",background:G,color:D,border:"none",cursor:"pointer",fontFamily:OF,fontSize:12,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Join</button></div>
{err&&<p style={{color:RH,fontSize:12,marginTop:8}}>{err}</p>}</div>):
(<div style={{padding:"24px",border:`1px solid ${G}`,borderRadius:4,background:GD}}>
{myNum&&<p style={{fontFamily:CG,fontSize:28,color:G,fontWeight:700}}>Brother #{myNum}</p>}
<p style={{color:CR,fontWeight:400,fontSize:14}}>Welcome to the Brotherhood.</p></div>)}
<button onClick={restart} style={{marginTop:20,padding:"8px 16px",background:"transparent",border:`1px solid ${DB}`,color:"#666",borderRadius:4,fontFamily:OF,fontSize:11,cursor:"pointer"}}>↻ Retake</button>
</div>)}</div></SW>)}

function Pricing(){const[r,v]=useInView();const ts=[{name:"Brotherhood",price:39,tag:null,feat:["Private community access","Weekly live group calls","Accountability pods","Full Vault access","Memorial Wall profile"],a:false},{name:"Brotherhood + Box",price:69,tag:"MOST POPULAR",feat:["Everything in Brotherhood","Monthly curated DDC Box","Welcome Box on signup","Exclusive box-only content","Early access to events"],a:true},{name:"Inner Circle",price:149,tag:null,feat:["Everything in Tier 2","1:1 mentoring access","Private Inner Circle calls","Live event priority","Direct founder access"],a:false}];
return(<SW id="pricing"><div ref={r} style={{maxWidth:1000,margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:56}}><SL text="Join"/>
<h2 style={{fontFamily:CG,fontSize:"clamp(32px,5vw,48px)",fontWeight:700,color:CR,marginBottom:12}}>Choose Your Brotherhood.</h2>
<p style={{color:"#888",fontSize:15,fontWeight:300}}>Founding members lock in their rate for life.</p></div>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20,alignItems:"start"}}>{ts.map((t,i)=>(<div key={i} style={{padding:"40px 28px",background:t.a?"rgba(200,169,81,0.06)":DC,border:`1px solid ${t.a?G:DB}`,borderRadius:4,position:"relative",overflow:"hidden",opacity:v?1:0,transform:v?"translateY(0)":"translateY(30px)",transition:`all 0.7s ease ${i*0.12}s`}}>
{t.a&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:G}}/>}
{t.tag&&<div style={{position:"absolute",top:16,right:-30,background:G,color:D,fontSize:9,fontWeight:700,padding:"4px 36px",transform:"rotate(45deg)",letterSpacing:1}}>{t.tag}</div>}
<h3 style={{fontFamily:CG,fontSize:24,fontWeight:700,color:CR,marginBottom:8}}>{t.name}</h3>
<div style={{marginBottom:24}}><span style={{fontFamily:CG,fontSize:48,fontWeight:700,color:G}}>${t.price}</span><span style={{fontSize:14,color:"#666",fontWeight:300}}>/month</span></div>
{t.feat.map((f,j)=>(<div key={j} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
<div style={{width:16,height:16,borderRadius:"50%",border:`1px solid ${G}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><div style={{width:6,height:6,borderRadius:"50%",background:G}}/></div>
<span style={{fontSize:14,color:"#bbb",fontWeight:300}}>{f}</span></div>))}
<a href="#top" style={{display:"block",width:"100%",marginTop:24,padding:"14px",textAlign:"center",background:t.a?G:"transparent",color:t.a?D:G,border:t.a?"none":`1px solid ${G}`,borderRadius:4,fontFamily:OF,fontSize:13,fontWeight:600,letterSpacing:2,textTransform:"uppercase",textDecoration:"none"}}>Join the Waitlist</a></div>))}</div></div></SW>)}

function Founder(){const[r,v]=useInView();return(<SW bg="#080808"><div ref={r} style={{maxWidth:700,margin:"0 auto",textAlign:"center",opacity:v?1:0,transform:v?"translateY(0)":"translateY(30px)",transition:"all 0.8s ease"}}>
<Logo size={80}/><div style={{margin:"24px auto",width:60,height:2,background:G}}/>
<blockquote style={{fontFamily:CG,fontSize:"clamp(20px,3vw,28px)",color:CR,lineHeight:1.6,fontStyle:"italic",fontWeight:400,marginBottom:24}}>
"DDC exists because nobody showed up for us. Nobody called. Nobody sent a box. Nobody said 'I know what this day feels like.' We build this not because it was easy — but because we are the men who know, better than anyone, what it costs to build without a blueprint."</blockquote>
<p style={{color:G,fontSize:14,fontWeight:500,letterSpacing:2,textTransform:"uppercase"}}>Kent Grossi</p>
<p style={{color:"#666",fontSize:13,fontWeight:300,marginTop:4}}>Founder & CEO, The Dead Dads Club</p>
<p style={{color:"#888",fontSize:14,lineHeight:1.8,marginTop:32,fontWeight:300,maxWidth:560,margin:"32px auto 0"}}>From homelessness to building a commercial roofing company in Southwest Florida. Self-made, self-taught, and intimately familiar with the pain of figuring out manhood without a roadmap. The founder IS the market.</p></div></SW>)}

// ━━━ UPGRADE 10: EXIT INTENT MODAL ━━━
function ExitIntent(){const[show,setShow]=useState(false);const[email,setEmail]=useState("");const[done,setDone]=useState(false);const fired=useRef(false);
useEffect(()=>{if(isTouch)return; // skip on mobile
const h=(e)=>{if(e.clientY<10&&!fired.current){fired.current=true;setShow(true)}};
document.addEventListener("mouseout",h);return()=>document.removeEventListener("mouseout",h)},[]);
const go=async()=>{if(!email||!email.includes("@"))return;
try{await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})})}catch(e){}setDone(true);setTimeout(()=>setShow(false),2000)};
if(!show)return null;
return(<div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,backdropFilter:"blur(8px)"}}>
<div style={{maxWidth:420,width:"100%",padding:32,background:DC,border:`1px solid ${G}`,borderRadius:8,textAlign:"center",animation:"fadeUp 0.4s ease",position:"relative"}}>
<button onClick={()=>setShow(false)} style={{position:"absolute",top:12,right:16,background:"transparent",border:"none",color:"#555",fontSize:20,cursor:"pointer"}}>×</button>
<Logo size={60}/><div style={{width:40,height:2,background:G,margin:"16px auto"}}/>
<h3 style={{fontFamily:CG,fontSize:24,color:CR,fontWeight:700,marginBottom:8}}>Before you go.</h3>
<p style={{color:"#888",fontSize:14,lineHeight:1.6,marginBottom:20}}>51.7 million men share this. You don't have to carry it alone.</p>
{!done?(<div style={{display:"flex",gap:0,borderRadius:4,overflow:"hidden",border:`1px solid ${DB}`}}>
<input type="email" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}
style={{flex:1,padding:"14px 16px",background:"#111",border:"none",color:CR,fontFamily:OF,fontSize:14,outline:"none"}}/>
<button onClick={go} style={{padding:"14px 24px",background:G,color:D,border:"none",cursor:"pointer",fontFamily:OF,fontSize:12,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Join</button></div>):
(<p style={{color:G,fontWeight:500,fontSize:15}}>Welcome, brother.</p>)}
</div></div>)}

function Footer(){return(<footer style={{padding:"48px 24px 100px",background:D,borderTop:`1px solid ${DB}`,textAlign:"center"}}><Logo size={48}/>
<p style={{color:"#444",fontSize:12,marginTop:16,letterSpacing:2,fontWeight:300}}>THE DEAD DADS CLUB &nbsp;|&nbsp; {new Date().getFullYear()}</p>
<p style={{color:"#333",fontSize:11,marginTop:8,fontWeight:300}}>The only club you never wanted to join.</p></footer>)}

export default function App(){const[introComplete,setIC]=useState(false);const[wc,setWc]=useState(0);
return(<div>
{!introComplete&&<Intro onDone={()=>setIC(true)}/>}
<Nav/><Hero onCount={setWc}/>
<Testimonial quote="I've never told anyone this, but Father's Day is the worst day of my year. Every year I pretend I'm fine." who="Anonymous, 34, Chicago"/>
<Stats/>
<Testimonial quote="I learned to tie a tie from a YouTube video the morning of my wedding. I cried in the bathroom after." who="Anonymous, 29, Dallas"/>
<Pillars/><BoxReveal/>
<Testimonial quote="My son asked me 'what was grandpa like?' and I didn't have an answer. That's the day I knew I needed something like this." who="Anonymous, 41, Denver"/>
<VaultPreview/><FDCountdown/><MemorialWall/><CallDemo/><Quiz/><Pricing/><Founder/><Footer/>
<StickyBar count={wc}/>
<ExitIntent/>
</div>)}
