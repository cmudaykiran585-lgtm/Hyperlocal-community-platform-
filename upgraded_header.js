Bo=()=>{
  let e=Dt(),t=wt(),{brand:n,currentUser:r,logout:i,switchRole:a,currentLocality:o,setCurrentLocality:s,localities:c,providers:l,bookings:u,openProviderDetail:d,showToast:K_toast}=br();
  let[f,p]=(0,_.useState)(!1);
  let[m,h]=(0,_.useState)(!1);
  let[g,v]=(0,_.useState)("");
  let[y,b]=(0,_.useState)(!1);
  let[x,ee]=(0,_.useState)("");
  let[te,ne]=(0,_.useState)(!1);
  let[re,ie]=(0,_.useState)(!1);
  let[ae,S]=(0,_.useState)(!1);
  let[ht,sht]=(0,_.useState)("all");
  let[hs,shs]=(0,_.useState)("");
  let[tName,setTName]=(0,_.useState)("");
  let[tContact,setTContact]=(0,_.useState)("");
  let[tCat,setTCat]=(0,_.useState)("Login & OTP Issues");
  let[tPriority,setTPriority]=(0,_.useState)("Normal");
  let[tMsg,setTMsg]=(0,_.useState)("");
  let[tSuccess,setTSuccess]=(0,_.useState)(null);
  let[tError,setTError]=(0,_.useState)("");
  let ce=(0,_.useRef)(null),le=(0,_.useRef)(null),de=(0,_.useRef)(null);

  (0,_.useEffect)(()=>{
    let e=e=>{
      if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();b(e=>!e)}
      if(e.key==="Escape"){h(!1);S(!1);b(!1);ie(!1);ne(!1);p(!1)}
    };
    return window.addEventListener("keydown",e),()=>window.removeEventListener("keydown",e)
  },[]);

  (0,_.useEffect)(()=>{y&&setTimeout(()=>{de.current?.focus()},50)},[y]);

  (0,_.useEffect)(()=>{
    let e=e=>{
      ce.current&&!ce.current.contains(e.target)&&h(!1);
      le.current&&!le.current.contains(e.target)&&ie(!1);
    };
    return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)
  },[]);

  let pe=_.useMemo(()=>{
    if(!g.trim()||!Array.isArray(l))return[];
    let e=Cr(g,o),t=wr(l,e);
    if(t.length>0)return t.slice(0,5);
    let n=g.toLowerCase();
    return l.filter(e=>e&&(e.name&&e.name.toLowerCase().includes(n)||e.title&&e.title.toLowerCase().includes(n)||Array.isArray(e.skills)&&e.skills.some(e=>typeof e=="string"&&e.toLowerCase().includes(n)))).slice(0,5)
  },[g,l,o]),
  me=_.useMemo(()=>{
    if(!x.trim()||!Array.isArray(l))return{providers:[],categories:[]};
    let e=Cr(x,o),t=wr(l,e).slice(0,4),n=x.toLowerCase();
    return{providers:t,categories:xr.filter(e=>e.subcategory.toLowerCase().includes(n)||e.keywords.some(e=>e.toLowerCase().includes(n))).slice(0,3)}
  },[x,l,o]),
  he=t=>{
    t&&t.preventDefault&&t.preventDefault();
    if(g.trim()){
      e(`/services?q=${encodeURIComponent(g.trim())}&locality=${encodeURIComponent(o)}`);
      h(!1)
    }
  };

  let submitTicket=ev=>{
    ev.preventDefault();
    setTError("");
    if(!tName.trim()){setTError("Please provide your name.");return}
    if(!tContact.trim()){setTError("Please provide an email address or mobile phone.");return}
    if(!tMsg.trim()||tMsg.trim().length<10){setTError("Please describe your issue (at least 10 characters).");return}
    
    let ticketId="NX-TICK-"+Math.floor(10000+Math.random()*90000);
    let newTicket={id:ticketId,name:tName.trim(),contact:tContact.trim(),category:tCat,priority:tPriority,message:tMsg.trim(),timestamp:new Date().toISOString(),status:"Submitted"};
    try{
      let existing=JSON.parse(localStorage.getItem("nexora_support_tickets")||"[]");
      existing.unshift(newTicket);
      localStorage.setItem("nexora_support_tickets",JSON.stringify(existing));
    }catch(err){}
    
    setTSuccess({id:ticketId,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),contact:tContact.trim()});
    setTName("");
    setTContact("");
    setTMsg("");
    if(typeof K_toast==="function")K_toast(`Support ticket #${ticketId} submitted successfully!`,"success");
  };

  let helpArticles=[
    {id:"h-otp-1",cat:"auth",title:"Email OTP Delivery & Verification",tags:["otp","email","login","signup"],summary:"Email OTP codes are dispatched instantly via encrypted SMTP. Check spam/junk folders for support@nexora.community. Wait for the 60s cooldown timer before requesting a new code."},
    {id:"h-otp-2",cat:"auth",title:"Mobile SMS OTP Delivery & Carrier Delays",tags:["otp","sms","phone","mobile"],summary:"SMS codes are routed via Tier-1 telecom gateways to 10-digit mobile numbers with the +91 prefix. Ensure carrier DND filters are not blocking incoming texts."},
    {id:"h-otp-3",cat:"auth",title:"Code Expired or Max Attempts Lockout",tags:["expired","error","lockout","attempts"],summary:"For account safety, one-time verification passcodes expire strictly after 5 minutes. If 5 incorrect codes are entered consecutively, request a new code after a short cooldown."},
    {id:"h-auth-4",cat:"auth",title:"Password Reset & Account Recovery",tags:["forgot","password","reset","recover"],summary:"Tap 'Forgot password?' on the login screen to receive a secure recovery code via email or mobile. Enter the 6-digit code and choose a new password (min 6 characters)."},
    {id:"h-auth-5",cat:"auth",title:"Trusted Device & Remember Me Sessions",tags:["remember","session","device","persistence"],summary:"Checking 'Keep me signed in on this trusted device' stores a secure 30-day session token. Leaving it unchecked will automatically expire your session when you close your browser."},
    {id:"h-bk-1",cat:"booking",title:"What is Smart Person Booking?",tags:["booking","person","queue","companion","assistant"],summary:"NEXORA connects you with verified individuals for everyday tasks that gig apps miss: waiting in long queues for tickets or hospital tokens, friendly hospital visit companionship, running errands, or moving furniture."},
    {id:"h-bk-2",cat:"booking",title:"Hourly vs Full-Day Booking Packages",tags:["rates","pricing","hourly","day"],summary:"Book specialists by the hour (1-2 hours for queue standees or tutoring), half-day (4 hours for errands), or full-day (8 hours for personal assistants). Rates are clearly posted before you confirm."},
    {id:"h-bk-3",cat:"booking",title:"In-Person Doorstep vs Remote Video Consultations",tags:["remote","online","in-person","doorstep"],summary:"Select 'Doorstep In-Person' for local home services and errands, or 'Remote Consultation' for coding mentorship, tutoring, and technical advisory over video call."},
    {id:"h-bk-4",cat:"booking",title:"Specialist Background Verification Guarantee",tags:["verified","safety","pro","background"],summary:"Every provider displays verified badges. Specialists undergo Government Photo ID checks, local Bengaluru residence verification, and trade skill certifications before directory approval."},
    {id:"h-cn-1",cat:"cancellation",title:"How to Cancel a Booking Instantly",tags:["cancel","cancellation","refund"],summary:"Open 'My Bookings' from the top navigation bar, locate your appointment card, and click 'Cancel Booking'. The status updates to Cancelled immediately without penalty."},
    {id:"h-cn-2",cat:"cancellation",title:"Rescheduling an Existing Appointment",tags:["reschedule","time","date","change"],summary:"Need to change your appointment date or time? Open the booking card in 'My Bookings' and select a new available time slot offered by your specialist."},
    {id:"h-cn-3",cat:"cancellation",title:"Zero-Fee Cancellation & Payment Escrow",tags:["fee","refund","free","policy"],summary:"Cancellations made prior to specialist dispatch incur zero cancellation fees. Any online advance payments are credited directly back to your account within 2-3 business days."},
    {id:"h-acc-1",cat:"accounts",title:"Managing Customer Profile & Saved Addresses",tags:["profile","address","settings","locality"],summary:"Update your name, primary mobile number, and saved residential addresses (Indiranagar, Koramangala, etc.) anytime under 'My Profile & Settings'."},
    {id:"h-acc-2",cat:"accounts",title:"Becoming a Verified Service Provider",tags:["provider","join","partner","register"],summary:"Are you a skilled technician, educator, companion, or assistant? Click 'For Providers' or register as a Provider to set your hourly rates, choose service categories, and receive bookings."},
    {id:"h-acc-3",cat:"accounts",title:"Role Switching (User, Provider, Admin)",tags:["role","switch","admin","provider"],summary:"Use your profile avatar menu in the top right corner to preview different roles (Customer, Provider, Admin) seamlessly across the platform."},
    {id:"h-faq-1",cat:"faqs",title:"Is there any platform booking charge for residents?",tags:["fee","cost","free","charges"],summary:"No! Browsing the directory, chatting with the AI Assistant, and scheduling appointments through NEXORA has zero platform booking fees for residents."},
    {id:"h-faq-2",cat:"faqs",title:"Can I book a specialist for elderly parents or family members?",tags:["parents","senior","family","companion"],summary:"Yes! In the booking notes, simply specify the recipient's name, apartment address, and contact number. Specialists will coordinate directly with your family member."}
  ];

  let filteredArticles=helpArticles.filter(art=>{
    let matchesTab=ht==="all"||art.cat===ht;
    if(!hs.trim())return matchesTab;
    let q=hs.toLowerCase().trim();
    let matchesSearch=art.title.toLowerCase().includes(q)||art.summary.toLowerCase().includes(q)||art.tags.some(t=>t.includes(q));
    return matchesTab&&matchesSearch;
  });

  return(0,D.jsxDEV)("header",{className:"sticky top-0 z-40 bg-white shadow-[0_1px_3px_rgba(16,27,51,0.05)] transition-all",children:[
    /* 1. Top information strip */
    (0,D.jsxDEV)("div",{className:"bg-[#101B33] text-slate-300 text-[11px] py-1 border-b border-[#172541]",children:
      (0,D.jsxDEV)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between font-medium",children:[
        (0,D.jsxDEV)("div",{className:"flex items-center gap-2",children:[
          (0,D.jsxDEV)("span",{className:"w-1.5 h-1.5 rounded-full bg-[#00C2B8] shrink-0"}),
          (0,D.jsxDEV)("span",{className:"text-slate-200 hidden sm:inline",children:"Serving Greater Bengaluru • Hyperlocal Intelligence & Smart Person Booking"}),
          (0,D.jsxDEV)("span",{className:"text-slate-200 sm:hidden",children:"Bengaluru Community Services"})
        ]}),
        (0,D.jsxDEV)("div",{className:"flex items-center gap-3 text-slate-400 text-[11px]",children:[
          (0,D.jsxDEV)("a",{href:"tel:112",className:"hover:text-[#00C2B8] transition-colors flex items-center gap-1",children:[
            (0,D.jsxDEV)("span",{className:"text-[#00C2B8] font-bold",children:"24/7 Helpline:"}),
            (0,D.jsxDEV)("span",{children:"112"})
          ]}),
          (0,D.jsxDEV)("span",{className:"text-slate-700 hidden sm:inline",children:"|"}),
          (0,D.jsxDEV)("a",{href:"mailto:support@nexora.community",className:"hover:text-[#00C2B8] transition-colors hidden sm:inline",children:"support@nexora.community"})
        ]})
      ]})
    }),

    /* 2. Main navigation bar */
    (0,D.jsxDEV)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:
      (0,D.jsxDEV)("div",{className:"flex items-center justify-between h-16 gap-3",children:[
        /* Logo & Location */
        (0,D.jsxDEV)("div",{className:"flex items-center gap-3 shrink-0",children:[
          (0,D.jsxDEV)(Vn,{to:"/",className:"flex items-center gap-2.5 group",children:[
            (0,D.jsxDEV)("div",{className:"w-9 h-9 rounded-xl bg-[#101B33] p-[2px] flex items-center justify-center border border-[#172541] shadow-xs group-hover:border-[#00C2B8] transition-colors shrink-0",children:
              (0,D.jsxDEV)("svg",{className:"w-full h-full rounded-[10px]",viewBox:"0 0 40 40",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[
                (0,D.jsxDEV)("rect",{width:"40",height:"40",rx:"10",fill:"#101B33"}),
                (0,D.jsxDEV)("path",{d:"M11 29V11L20 21L29 11V29",stroke:"url(#hdrGrad)",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round"}),
                (0,D.jsxDEV)("circle",{cx:"11",cy:"11",r:"2.5",fill:"#FFFFFF"}),
                (0,D.jsxDEV)("circle",{cx:"29",cy:"11",r:"2.5",fill:"#FFFFFF"}),
                (0,D.jsxDEV)("circle",{cx:"20",cy:"21",r:"2",fill:"#00C2B8"}),
                (0,D.jsxDEV)("circle",{cx:"11",cy:"29",r:"2.5",fill:"#2563EB"}),
                (0,D.jsxDEV)("circle",{cx:"29",cy:"29",r:"2.5",fill:"#00C2B8"}),
                (0,D.jsxDEV)("defs",{},void 0,!1,{children:(0,D.jsxDEV)("linearGradient",{id:"hdrGrad",x1:"0",y1:"0",x2:"40",y2:"40",gradientUnits:"userSpaceOnUse",children:[(0,D.jsxDEV)("stop",{stopColor:"#00C2B8"}),(0,D.jsxDEV)("stop",{offset:"1",stopColor:"#2563EB"})]})})
              ]})
            }),
            (0,D.jsxDEV)("div",{children:[
              (0,D.jsxDEV)("div",{className:"font-black text-lg tracking-tight text-[#182338] flex items-center gap-1",children:[
                "NEXORA",
                (0,D.jsxDEV)("span",{className:"w-1.5 h-1.5 rounded-full bg-[#00C2B8]"})
              ]}),
              (0,D.jsxDEV)("div",{className:"text-[9px] font-bold tracking-widest text-[#00C2B8] uppercase -mt-1 hidden sm:block",children:"Bengaluru"})
            ]})
          ]}),

          /* Location Selector (matches search height and radius) */
          (0,D.jsxDEV)("div",{className:"relative",children:[
            (0,D.jsxDEV)("button",{type:"button",onClick:()=>ne(!te),className:"h-10 px-3 bg-[#F7F9FC] hover:bg-[#EDF2F7] text-[#182338] text-xs font-semibold rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors flex items-center gap-1.5 cursor-pointer",children:[
              (0,D.jsxDEV)(Da,{className:"w-3.5 h-3.5 text-[#00C2B8] shrink-0"}),
              (0,D.jsxDEV)("span",{className:"max-w-[110px] truncate",children:o}),
              (0,D.jsxDEV)(di,{className:"w-3 h-3 text-[#66748B] shrink-0"})
            ]}),
            te&&(0,D.jsxDEV)("div",{className:"absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-2 z-50 animate-in fade-in zoom-in-95",children:[
              (0,D.jsxDEV)("div",{className:"px-3 py-1.5 text-[10px] font-bold text-[#66748B] uppercase tracking-wider border-b border-[#E2E8F0]",children:"Select Area"}),
              (Array.isArray(c)?c:[]).map(e=>(0,D.jsxDEV)("button",{key:e.id,type:"button",onClick:()=>{s(e.name);ne(!1)},className:`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-[#F7F9FC] transition-colors cursor-pointer ${o===e.name?"text-[#00C2B8] font-bold bg-[#E6FAF9]":"text-[#182338]"}`,children:[
                (0,D.jsxDEV)("div",{children:[(0,D.jsxDEV)("div",{children:e.name}),e.landmark&&(0,D.jsxDEV)("div",{className:"text-[10px] text-[#66748B]",children:e.landmark})]}),
                o===e.name&&(0,D.jsxDEV)(li,{className:"w-3.5 h-3.5 text-[#00C2B8]"})
              ]}))
            ]})
          ]})
        ]}),

        /* Search Control (matches location height and radius) */
        (0,D.jsxDEV)("div",{className:"hidden md:flex flex-1 max-w-xs lg:max-w-sm relative",ref:ce,children:[
          (0,D.jsxDEV)("form",{onSubmit:he,className:"w-full relative flex items-center",children:[
            (0,D.jsxDEV)("button",{type:"submit",className:"absolute left-3 top-3 text-[#66748B] hover:text-[#00C2B8] p-0 cursor-pointer transition-colors",title:"Search",children:(0,D.jsxDEV)(Qa,{className:"w-4 h-4"})}),
            (0,D.jsxDEV)("input",{type:"text",placeholder:`Search services or people in ${o}...`,value:g,onChange:e=>{v(e.target.value);h(!0)},onFocus:()=>h(!0),onKeyDown:e=>{if(e.key==="Escape")h(!1)},className:"h-10 w-full bg-[#F7F9FC] hover:bg-white focus:bg-white border border-[#E2E8F0] focus:border-[#00C2B8] rounded-xl pl-9 pr-16 text-xs text-[#182338] placeholder-[#66748B] font-medium focus:outline-none focus:ring-2 focus:ring-[#00C2B8]/20 transition-all"}),
            g&&(0,D.jsxDEV)("button",{type:"button",onClick:()=>{v("");h(!1)},className:"absolute right-12 top-2.5 text-[#66748B] hover:text-[#182338] text-xs px-1.5 py-0.5 rounded cursor-pointer",title:"Clear search",children:"✕"}),
            (0,D.jsxDEV)("button",{type:"button",onClick:()=>b(!0),className:"absolute right-2 top-2.5 px-1.5 py-0.5 bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[10px] text-[#66748B] hover:text-[#182338] rounded font-mono border border-[#CBD5E1] transition-colors cursor-pointer",title:"Open Search (Ctrl+K)",children:"Ctrl K"})
          ]}),
          m&&g.trim().length>0&&(0,D.jsxDEV)("div",{className:"absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-3 z-50 animate-in fade-in zoom-in-95 text-xs text-[#182338]",children:[
            (0,D.jsxDEV)("div",{className:"flex items-center justify-between text-[10px] font-bold text-[#66748B] uppercase tracking-wider mb-2 px-1",children:[
              (0,D.jsxDEV)("span",{children:"Matching Verified Specialists"}),
              pe.length>0&&(0,D.jsxDEV)("span",{className:"text-[#00C2B8] font-semibold normal-case",children:`${pe.length} found`})
            ]}),
            pe.length===0?(0,D.jsxDEV)("div",{className:"py-3 px-2 text-center space-y-2",children:[
              (0,D.jsxDEV)("div",{className:"text-xs text-[#66748B]",children:[`No direct specialist matches for "`,(0,D.jsxDEV)("span",{className:"text-[#182338] font-semibold",children:g}),`" in ${o}`]}),
              (0,D.jsxDEV)("div",{className:"flex flex-wrap items-center justify-center gap-2 pt-1",children:[
                (0,D.jsxDEV)("button",{type:"button",onClick:()=>{e(`/services?q=${encodeURIComponent(g.trim())}&locality=Bangalore`);h(!1)},className:"px-3 py-1.5 bg-[#F7F9FC] hover:bg-[#EDF2F7] border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#182338] cursor-pointer transition-colors",children:"Search All Bangalore"}),
                (0,D.jsxDEV)("button",{type:"button",onClick:()=>{e(`/ai-assistant?prompt=${encodeURIComponent(g.trim())}`);h(!1)},className:"px-3 py-1.5 bg-[#00C2B8] hover:bg-[#009E96] rounded-lg text-xs font-semibold text-white flex items-center gap-1 cursor-pointer transition-colors",children:[(0,D.jsxDEV)(Yr,{className:"w-3.5 h-3.5"}),(0,D.jsxDEV)("span",{children:"Ask AI Assistant"})]})
              ]})
            ]}):(0,D.jsxDEV)("div",{className:"space-y-1.5",children:pe.map(p=>(0,D.jsxDEV)("div",{key:p.id,onClick:()=>{d(p);h(!1)},className:"flex items-center justify-between p-2 rounded-xl hover:bg-[#F7F9FC] cursor-pointer transition-colors group",children:[
              (0,D.jsxDEV)("div",{className:"flex items-center gap-2.5 min-w-0",children:[
                (0,D.jsxDEV)("img",{src:p.image,alt:p.name,className:"w-8 h-8 rounded-lg object-cover shrink-0 border border-[#E2E8F0]"}),
                (0,D.jsxDEV)("div",{className:"min-w-0",children:[
                  (0,D.jsxDEV)("div",{className:"text-xs font-bold text-[#182338] flex items-center gap-1 truncate",children:[p.name,(0,D.jsxDEV)(oo,{className:"w-3 h-3 text-[#00C2B8] shrink-0"})]}),
                  (0,D.jsxDEV)("div",{className:"text-[10px] text-[#66748B] truncate",children:p.title})
                ]})
              ]}),
              (0,D.jsxDEV)("div",{className:"text-right shrink-0 ml-2",children:[
                (0,D.jsxDEV)("span",{className:"text-xs font-bold text-[#2563EB]",children:[`₹`,p.hourlyRate,`/hr`]}),
                (0,D.jsxDEV)("div",{className:"text-[9px] text-[#66748B]",children:`★ ${p.rating||4.8}`})
              ]})
            ]}))}),
            (0,D.jsxDEV)("div",{className:"mt-2 pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs",children:[
              (0,D.jsxDEV)("button",{type:"button",onClick:()=>{e(`/services?q=${encodeURIComponent(g.trim())}&locality=${encodeURIComponent(o)}`);h(!1)},className:"text-[#00C2B8] hover:text-[#009E96] flex items-center gap-1 font-semibold p-1 rounded hover:bg-[#F7F9FC] cursor-pointer transition-colors",children:[
                (0,D.jsxDEV)("span",{children:`View all results in Directory`}),
                (0,D.jsxDEV)(Ur,{className:"w-3.5 h-3.5"})
              ]}),
              (0,D.jsxDEV)("button",{type:"button",onClick:()=>{e(`/ai-assistant?prompt=${encodeURIComponent(g.trim())}`);h(!1)},className:"text-[#66748B] hover:text-[#182338] flex items-center gap-1 text-[11px] p-1 rounded hover:bg-[#F7F9FC] cursor-pointer transition-colors",children:[
                (0,D.jsxDEV)(Yr,{className:"w-3 h-3 text-[#00C2B8]"}),
                (0,D.jsxDEV)("span",{children:"Ask AI"})
              ]})
            ]})
          ]})
        ]}),

        /* Main Nav items */
        (0,D.jsxDEV)("nav",{className:"hidden lg:flex items-center gap-1",children:[
          (0,D.jsxDEV)(Vn,{to:"/",className:`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${t.pathname==="/"?"text-[#009E96] bg-[#E6FAF9] font-bold":"text-[#66748B] hover:text-[#182338] hover:bg-[#F7F9FC]"}`,children:"Home"}),
          
          /* AI Assistant with subtle teal accent */
          (0,D.jsxDEV)(Vn,{to:"/ai-assistant",className:`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${t.pathname==="/ai-assistant"?"text-[#009E96] bg-[#E6FAF9] font-bold border border-[#00C2B8]/40 shadow-xs":"text-[#182338] bg-[#F7F9FC] hover:bg-[#E6FAF9] hover:text-[#009E96] border border-[#E2E8F0]"}`,children:[
            (0,D.jsxDEV)(Yr,{className:"w-3.5 h-3.5 text-[#00C2B8]"}),
            (0,D.jsxDEV)("span",{children:"AI Assistant"})
          ]}),

          /* Smart Person Booking - prominent tasteful highlight */
          (0,D.jsxDEV)(Vn,{to:"/smart-booking",className:`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${t.pathname==="/smart-booking"?"bg-[#101B33] text-white shadow-sm ring-2 ring-[#00C2B8]":"bg-[#172541] hover:bg-[#101B33] text-white shadow-xs"}`,children:[
            (0,D.jsxDEV)(ri,{className:"w-3.5 h-3.5 text-[#00C2B8]"}),
            (0,D.jsxDEV)("span",{children:"Smart Booking"})
          ]}),

          (0,D.jsxDEV)(Vn,{to:"/services",className:`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${t.pathname==="/services"?"text-[#009E96] bg-[#E6FAF9] font-bold":"text-[#66748B] hover:text-[#182338] hover:bg-[#F7F9FC]"}`,children:"Directory"}),
          (0,D.jsxDEV)(Vn,{to:"/community",className:`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${t.pathname==="/community"?"text-[#009E96] bg-[#E6FAF9] font-bold":"text-[#66748B] hover:text-[#182338] hover:bg-[#F7F9FC]"}`,children:[
            (0,D.jsxDEV)(No,{className:"w-3.5 h-3.5 text-[#66748B]"}),
            (0,D.jsxDEV)("span",{children:"Community"})
          ]}),
          
          /* My Bookings - clean link, NO fake counts */
          (0,D.jsxDEV)(Vn,{to:"/bookings",className:`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${t.pathname==="/bookings"?"text-[#009E96] bg-[#E6FAF9] font-bold":"text-[#66748B] hover:text-[#182338] hover:bg-[#F7F9FC]"}`,children:[
            (0,D.jsxDEV)(ti,{className:"w-3.5 h-3.5 text-[#66748B]"}),
            (0,D.jsxDEV)("span",{children:"My Bookings"})
          ]}),

          (0,D.jsxDEV)(Vn,{to:"/provider-dashboard",className:`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${t.pathname==="/provider-dashboard"?"text-[#009E96] bg-[#E6FAF9] font-bold":"text-[#66748B] hover:text-[#182338] hover:bg-[#F7F9FC]"}`,children:"For Providers"})
        ]}),

        /* Action Buttons: Help & Auth */
        (0,D.jsxDEV)("div",{className:"flex items-center gap-2",children:[
          (0,D.jsxDEV)("button",{type:"button",onClick:()=>b(!0),className:"md:hidden h-10 w-10 flex items-center justify-center bg-[#F7F9FC] hover:bg-[#EDF2F7] text-[#66748B] hover:text-[#182338] rounded-xl border border-[#E2E8F0] transition-colors cursor-pointer",title:"Search",children:(0,D.jsxDEV)(Qa,{className:"w-4 h-4 text-[#00C2B8]"})}),
          
          /* Help Button */
          (0,D.jsxDEV)("button",{type:"button",onClick:()=>S(!0),className:"h-10 px-3 bg-[#F7F9FC] hover:bg-[#EDF2F7] text-[#182338] text-xs font-semibold rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors flex items-center gap-1.5 cursor-pointer",title:"Help & Support Center",children:[
            (0,D.jsxDEV)(Ci,{className:"w-3.5 h-3.5 text-[#00C2B8]"}),
            (0,D.jsxDEV)("span",{className:"hidden sm:inline",children:"Help"})
          ]}),

          /* Account / Login */
          r?(0,D.jsxDEV)("div",{className:"relative",ref:le,children:[
            (0,D.jsxDEV)("button",{type:"button",onClick:()=>ie(!re),className:"h-10 flex items-center gap-2 bg-[#F7F9FC] hover:bg-[#EDF2F7] p-1.5 pr-2.5 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors cursor-pointer",children:[
              (0,D.jsxDEV)("img",{src:r.avatar||"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",alt:r.name||"Member",className:"w-7 h-7 rounded-lg object-cover border border-[#00C2B8]"}),
              (0,D.jsxDEV)("div",{className:"text-left hidden sm:block",children:[
                (0,D.jsxDEV)("div",{className:"text-xs font-bold text-[#182338] line-clamp-1",children:(r.name||"Member").split(" ")[0]}),
                (0,D.jsxDEV)("span",{className:"text-[9px] uppercase tracking-wider font-extrabold text-[#00C2B8] block -mt-0.5",children:r.role||"user"})
              ]}),
              (0,D.jsxDEV)(di,{className:"w-3 h-3 text-[#66748B]"})
            ]}),
            re&&(0,D.jsxDEV)("div",{className:"absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-2 z-50 text-xs text-[#182338] animate-in fade-in zoom-in-95",children:[
              (0,D.jsxDEV)("div",{className:"px-4 py-2 border-b border-[#E2E8F0]",children:[
                (0,D.jsxDEV)("div",{className:"font-bold text-[#182338]",children:r.name||"Resident Member"}),
                (0,D.jsxDEV)("div",{className:"text-[11px] text-[#66748B] truncate",children:r.email||r.phone||"Verified Account"})
              ]}),
              (0,D.jsxDEV)("div",{className:"px-2 py-1.5 border-b border-[#E2E8F0]",children:[
                (0,D.jsxDEV)("div",{className:"text-[10px] font-bold text-[#66748B] uppercase tracking-wider px-2 py-1",children:"Quick Switch Role"}),
                (0,D.jsxDEV)("div",{className:"grid grid-cols-3 gap-1",children:[
                  (0,D.jsxDEV)("button",{type:"button",onClick:()=>{a("user");ie(!1)},className:`py-1 px-1 rounded-lg text-center font-bold text-[11px] transition-colors cursor-pointer ${r.role==="user"?"bg-[#00C2B8] text-white":"text-[#66748B] hover:bg-[#F7F9FC]"}`,children:"User"}),
                  (0,D.jsxDEV)("button",{type:"button",onClick:()=>{a("provider");ie(!1)},className:`py-1 px-1 rounded-lg text-center font-bold text-[11px] transition-colors cursor-pointer ${r.role==="provider"?"bg-[#00C2B8] text-white":"text-[#66748B] hover:bg-[#F7F9FC]"}`,children:"Provider"}),
                  (0,D.jsxDEV)("button",{type:"button",onClick:()=>{a("admin");ie(!1)},className:`py-1 px-1 rounded-lg text-center font-bold text-[11px] transition-colors cursor-pointer ${r.role==="admin"?"bg-[#00C2B8] text-white":"text-[#66748B] hover:bg-[#F7F9FC]"}`,children:"Admin"})
                ]})
              ]}),
              (0,D.jsxDEV)(Vn,{to:"/profile",onClick:()=>ie(!1),className:"block px-4 py-2 text-[#66748B] hover:bg-[#F7F9FC] hover:text-[#182338] transition-colors",children:"My Profile & Settings"}),
              (0,D.jsxDEV)(Vn,{to:"/bookings",onClick:()=>ie(!1),className:"block px-4 py-2 text-[#66748B] hover:bg-[#F7F9FC] hover:text-[#182338] transition-colors",children:"My Bookings"}),
              r.role==="provider"&&(0,D.jsxDEV)(Vn,{to:"/provider-dashboard",onClick:()=>ie(!1),className:"block px-4 py-2 text-[#00C2B8] hover:bg-[#F7F9FC] transition-colors",children:"Provider Dashboard"}),
              r.role==="admin"&&(0,D.jsxDEV)(Vn,{to:"/admin",onClick:()=>ie(!1),className:"block px-4 py-2 text-indigo-600 hover:bg-[#F7F9FC] transition-colors",children:"Platform Administration"}),
              (0,D.jsxDEV)("div",{className:"border-t border-[#E2E8F0] mt-1 pt-1",children:(0,D.jsxDEV)("button",{type:"button",onClick:()=>{i();ie(!1)},className:"w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer font-semibold",children:"Sign Out"})})
            ]})
          ]}):(0,D.jsxDEV)("div",{className:"flex items-center gap-2",children:[
            (0,D.jsxDEV)(Vn,{to:"/login",className:"h-10 px-3.5 flex items-center justify-center text-xs font-semibold text-[#182338] hover:text-[#2563EB] bg-[#F7F9FC] hover:bg-[#EDF2F7] rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors",children:"Log In"}),
            (0,D.jsxDEV)(Vn,{to:"/register",className:"h-10 px-4 flex items-center justify-center text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-xs transition-colors shrink-0",children:"Join NEXORA"})
          ]}),

          /* Mobile hamburger */
          (0,D.jsxDEV)("button",{type:"button",onClick:()=>p(!f),className:"lg:hidden h-10 w-10 flex items-center justify-center text-[#182338] hover:bg-[#F7F9FC] rounded-xl border border-[#E2E8F0] transition-colors cursor-pointer",children:f?(0,D.jsxDEV)(zo,{className:"w-5 h-5"}):(0,D.jsxDEV)(ja,{className:"w-5 h-5"})})
        ]})
      ]})
    }),

    /* 3. Mobile Navigation Drawer */
    f&&(0,D.jsxDEV)("div",{className:"lg:hidden border-t border-[#E2E8F0] bg-white px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top",children:[
      (0,D.jsxDEV)("div",{className:"space-y-1",children:[
        (0,D.jsxDEV)(Vn,{to:"/",onClick:()=>p(!1),className:"block px-3 py-2.5 rounded-xl text-xs font-semibold text-[#182338] hover:bg-[#F7F9FC]",children:"Home"}),
        (0,D.jsxDEV)(Vn,{to:"/ai-assistant",onClick:()=>p(!1),className:"flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-[#009E96] bg-[#E6FAF9] border border-[#00C2B8]/30",children:[(0,D.jsxDEV)(Yr,{className:"w-4 h-4 text-[#00C2B8]"}),(0,D.jsxDEV)("span",{children:"AI Local Assistant"})]}),
        (0,D.jsxDEV)(Vn,{to:"/smart-booking",onClick:()=>p(!1),className:"flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-[#172541]",children:[(0,D.jsxDEV)(ri,{className:"w-4 h-4 text-[#00C2B8]"}),(0,D.jsxDEV)("span",{children:"Smart Person Booking"})]}),
        (0,D.jsxDEV)(Vn,{to:"/services",onClick:()=>p(!1),className:"block px-3 py-2.5 rounded-xl text-xs font-semibold text-[#182338] hover:bg-[#F7F9FC]",children:"Services & People Directory"}),
        (0,D.jsxDEV)(Vn,{to:"/community",onClick:()=>p(!1),className:"block px-3 py-2.5 rounded-xl text-xs font-semibold text-[#182338] hover:bg-[#F7F9FC]",children:"Community Hub & Civic Alerts"}),
        (0,D.jsxDEV)(Vn,{to:"/bookings",onClick:()=>p(!1),className:"block px-3 py-2.5 rounded-xl text-xs font-semibold text-[#182338] hover:bg-[#F7F9FC]",children:"My Bookings"}),
        (0,D.jsxDEV)(Vn,{to:"/provider-dashboard",onClick:()=>p(!1),className:"block px-3 py-2.5 rounded-xl text-xs font-semibold text-[#182338] hover:bg-[#F7F9FC]",children:"Provider Portal"})
      ]}),
      (0,D.jsxDEV)("div",{className:"pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs",children:[
        (0,D.jsxDEV)("button",{type:"button",onClick:()=>{S(!0);p(!1)},className:"flex items-center gap-1.5 text-[#182338] p-2 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] font-semibold cursor-pointer",children:[(0,D.jsxDEV)(Ci,{className:"w-4 h-4 text-[#00C2B8]"}),(0,D.jsxDEV)("span",{children:"Help & Support Center"})]}),
        (0,D.jsxDEV)("div",{className:"text-[#66748B] text-xs",children:[`Area: `,(0,D.jsxDEV)("strong",{className:"text-[#182338]",children:o})]})
      ]})
    ]}),

    /* 4. Help & Support Center Modal (White surface with Deep Navy header) */
    ae&&(0,D.jsxDEV)("div",{onClick:()=>S(!1),className:"fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in",children:(0,D.jsxDEV)("div",{onClick:e=>e.stopPropagation(),className:"bg-white border border-[#E2E8F0] rounded-3xl max-w-3xl w-full shadow-2xl flex flex-col text-[#182338] animate-in zoom-in-95 max-h-[92vh] overflow-hidden",children:[
      (0,D.jsxDEV)("div",{className:"p-4 sm:p-5 bg-[#101B33] text-white flex items-center justify-between gap-3 shrink-0",children:[
        (0,D.jsxDEV)("div",{className:"flex items-center gap-2.5",children:[
          (0,D.jsxDEV)("div",{className:"w-10 h-10 rounded-2xl bg-[#172541] border border-[#00C2B8]/40 flex items-center justify-center text-[#00C2B8] shrink-0",children:(0,D.jsxDEV)(Ci,{className:"w-5 h-5"})}),
          (0,D.jsxDEV)("div",{children:[
            (0,D.jsxDEV)("h3",{className:"font-black text-white text-base tracking-tight flex items-center gap-2",children:[
              "NEXORA Help & Support Center",
              (0,D.jsxDEV)("span",{className:"bg-[#00C2B8]/20 text-[#00C2B8] text-[10px] font-bold px-2 py-0.5 rounded-full hidden sm:inline-block",children:"Verified Support"})
            ]}),
            (0,D.jsxDEV)("p",{className:"text-[11px] text-slate-300",children:"Troubleshooting, Smart Booking, Cancellation Guides & Support Requests"})
          ]})
        ]}),
        (0,D.jsxDEV)("button",{type:"button",onClick:()=>S(!1),className:"p-2 text-slate-300 hover:text-white hover:bg-[#172541] rounded-xl transition-colors cursor-pointer",title:"Close (ESC)",children:(0,D.jsxDEV)(zo,{className:"w-5 h-5"})})
      ]}),
      (0,D.jsxDEV)("div",{className:"p-3 sm:p-4 bg-[#F7F9FC] border-b border-[#E2E8F0] space-y-3 shrink-0",children:[
        (0,D.jsxDEV)("div",{className:"relative flex items-center",children:[
          (0,D.jsxDEV)(Qa,{className:"w-4 h-4 text-[#66748B] absolute left-3.5 pointer-events-none"}),
          (0,D.jsxDEV)("input",{type:"text",placeholder:"Search help topics, OTP troubleshooting, cancellation policy...",value:hs,onChange:e=>shs(e.target.value),className:"w-full bg-white border border-[#E2E8F0] focus:border-[#00C2B8] rounded-xl pl-10 pr-9 py-2 text-xs text-[#182338] placeholder-[#66748B] focus:outline-none focus:ring-2 focus:ring-[#00C2B8]/20 transition-all font-medium"}),
          hs&&(0,D.jsxDEV)("button",{type:"button",onClick:()=>shs(""),className:"absolute right-3 text-[#66748B] hover:text-[#182338] text-xs cursor-pointer",children:"✕"})
        ]}),
        (0,D.jsxDEV)("div",{className:"flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none",children:[
          [
            {id:"all",label:"All Topics"},
            {id:"auth",label:"Login & OTP"},
            {id:"booking",label:"Smart Booking"},
            {id:"cancellation",label:"Cancellations"},
            {id:"accounts",label:"Accounts & Providers"},
            {id:"faqs",label:"FAQs"},
            {id:"contact",label:"Submit Ticket"},
            {id:"emergency",label:"Helplines"}
          ].map(tab=>(0,D.jsxDEV)("button",{key:tab.id,type:"button",onClick:()=>sht(tab.id),className:`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${ht===tab.id?"bg-[#00C2B8] text-[#101B33] shadow-xs font-black":"bg-white hover:bg-[#EDF2F7] text-[#66748B] hover:text-[#182338] border border-[#E2E8F0]"}`},tab.id,!1,{children:tab.label}))
        ]})
      ]}),
      (0,D.jsxDEV)("div",{className:"flex-1 overflow-y-auto p-4 sm:p-5 space-y-4",children:[
        ht==="contact"?(0,D.jsxDEV)("div",{className:"space-y-4 max-w-xl mx-auto",children:[
          (0,D.jsxDEV)("div",{className:"bg-[#E6FAF9] border border-[#00C2B8]/30 rounded-2xl p-4 space-y-1.5",children:[
            (0,D.jsxDEV)("div",{className:"flex items-center gap-2 text-[#009E96] font-bold text-xs uppercase tracking-wider",children:[(0,D.jsxDEV)(oo,{className:"w-4 h-4 text-[#00C2B8]"}),"Official Platform Support Channel"]}),
            (0,D.jsxDEV)("p",{className:"text-xs text-[#182338] leading-relaxed",children:["Submit a verified support ticket below. Requests are logged in the platform registry and answered by our team within 24 hours. For direct inquiries, email us at ",(0,D.jsxDEV)("a",{href:"mailto:support@nexora.community",className:"text-[#2563EB] font-bold hover:underline",children:"support@nexora.community"})]}),
            (0,D.jsxDEV)("div",{className:"text-[10px] text-[#009E96] font-mono pt-1",children:"Registry Status: Online • Storage: Connected (Local DB)"})
          ]}),
          tSuccess?(0,D.jsxDEV)("div",{className:"bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-center space-y-2.5 animate-in fade-in",children:[
            (0,D.jsxDEV)("div",{className:"w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300",children:(0,D.jsxDEV)(yi,{className:"w-5 h-5"})}),
            (0,D.jsxDEV)("h4",{className:"text-emerald-900 font-extrabold text-sm",children:`Support Ticket #${tSuccess.id} Registered!`}),
            (0,D.jsxDEV)("p",{className:"text-xs text-[#182338] max-w-md mx-auto",children:[`We have securely logged your request at `,tSuccess.time,`. A specialist will review your details and respond to `,`'`,(0,D.jsxDEV)("strong",{className:"text-[#182338]",children:tSuccess.contact}),`' within 24 business hours.`]}),
            (0,D.jsxDEV)("div",{className:"pt-2",children:(0,D.jsxDEV)("button",{type:"button",onClick:()=>setTSuccess(null),className:"px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer",children:"Submit Another Request"})})
          ]}):(0,D.jsxDEV)("form",{onSubmit:submitTicket,className:"bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 space-y-3.5 text-xs",children:[
            (0,D.jsxDEV)("div",{className:"font-bold text-[#182338] text-sm border-b border-[#E2E8F0] pb-2",children:"Submit a Support Ticket"}),
            tError&&(0,D.jsxDEV)("div",{className:"p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2",children:[(0,D.jsxDEV)(To,{className:"w-4 h-4 text-rose-600 shrink-0"}),(0,D.jsxDEV)("span",{children:tError})]}),
            (0,D.jsxDEV)("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:[
              (0,D.jsxDEV)("div",{children:[
                (0,D.jsxDEV)("label",{className:"block text-[#182338] font-semibold mb-1",children:"Your Full Name *"}),
                (0,D.jsxDEV)("input",{type:"text",required:!0,placeholder:"e.g. Aarav Sharma",value:tName,onChange:e=>setTName(e.target.value),className:"w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#182338] placeholder-[#66748B] text-xs focus:ring-2 focus:ring-[#00C2B8]/20 focus:border-[#00C2B8] focus:outline-none"})
              ]}),
              (0,D.jsxDEV)("div",{children:[
                (0,D.jsxDEV)("label",{className:"block text-[#182338] font-semibold mb-1",children:"Email or Phone Number *"}),
                (0,D.jsxDEV)("input",{type:"text",required:!0,placeholder:"e.g. aarav@gmail.com or 9845199882",value:tContact,onChange:e=>setTContact(e.target.value),className:"w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#182338] placeholder-[#66748B] text-xs focus:ring-2 focus:ring-[#00C2B8]/20 focus:border-[#00C2B8] focus:outline-none"})
              ]})
            ]}),
            (0,D.jsxDEV)("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:[
              (0,D.jsxDEV)("div",{children:[
                (0,D.jsxDEV)("label",{className:"block text-[#182338] font-semibold mb-1",children:"Issue Category"}),
                (0,D.jsxDEV)("select",{value:tCat,onChange:e=>setTCat(e.target.value),className:"w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#182338] text-xs focus:ring-2 focus:ring-[#00C2B8]/20 focus:border-[#00C2B8] focus:outline-none",children:[
                  (0,D.jsxDEV)("option",{value:"Login & OTP Issues",children:"Login & OTP Delivery Issues"}),
                  (0,D.jsxDEV)("option",{value:"Smart Person Booking",children:"Smart Person Booking Assistance"}),
                  (0,D.jsxDEV)("option",{value:"Cancellation & Refund",children:"Cancellation & Refund Question"}),
                  (0,D.jsxDEV)("option",{value:"Provider Verification",children:"Provider Account & Verification"}),
                  (0,D.jsxDEV)("option",{value:"Civic Issue or Poll",children:"Community Hub & Civic Issues"}),
                  (0,D.jsxDEV)("option",{value:"Other",children:"Other Platform Inquiries"})
                ]})
              ]}),
              (0,D.jsxDEV)("div",{children:[
                (0,D.jsxDEV)("label",{className:"block text-[#182338] font-semibold mb-1",children:"Urgency / Priority"}),
                (0,D.jsxDEV)("select",{value:tPriority,onChange:e=>setTPriority(e.target.value),className:"w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#182338] text-xs focus:ring-2 focus:ring-[#00C2B8]/20 focus:border-[#00C2B8] focus:outline-none",children:[
                  (0,D.jsxDEV)("option",{value:"Normal",children:"Normal (Within 24 Hours)"}),
                  (0,D.jsxDEV)("option",{value:"High",children:"High (Within 6 Hours)"}),
                  (0,D.jsxDEV)("option",{value:"Urgent",children:"Urgent (Active Booking Today)"})
                ]})
              ]})
            ]}),
            (0,D.jsxDEV)("div",{children:[
              (0,D.jsxDEV)("label",{className:"block text-[#182338] font-semibold mb-1",children:"Message / Problem Description *"}),
              (0,D.jsxDEV)("textarea",{required:!0,rows:3,placeholder:"Please provide specific details so our support team can resolve your query promptly...",value:tMsg,onChange:e=>setTMsg(e.target.value),className:"w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#182338] placeholder-[#66748B] text-xs focus:ring-2 focus:ring-[#00C2B8]/20 focus:border-[#00C2B8] focus:outline-none"})
            ]}),
            (0,D.jsxDEV)("button",{type:"submit",className:"w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer",children:[
              (0,D.jsxDEV)(eo,{className:"w-4 h-4 text-white"}),
              (0,D.jsxDEV)("span",{children:"Submit Support Ticket"})
            ]})
          ]})
        ]}):ht==="emergency"?(0,D.jsxDEV)("div",{className:"space-y-3",children:[
          (0,D.jsxDEV)("div",{className:"p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-2",children:[
            (0,D.jsxDEV)("h4",{className:"font-extrabold text-rose-900 flex items-center gap-1.5 text-xs uppercase tracking-wider",children:"🚨 Karnataka & Bengaluru Emergency Helplines"}),
            (0,D.jsxDEV)("p",{className:"text-[#182338] text-xs",children:"Direct telephone links to official 24x7 state emergency departments:"}),
            (0,D.jsxDEV)("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]",children:[
              (0,D.jsxDEV)("a",{href:"tel:112",className:"p-2.5 bg-white rounded-xl border border-rose-200 hover:border-rose-400 block text-center transition-colors shadow-xs group",children:[(0,D.jsxDEV)("div",{className:"font-black text-rose-600 text-base group-hover:scale-105 transition-transform",children:"112"}),(0,D.jsxDEV)("div",{className:"text-[10px] text-[#182338] font-bold",children:"Police Emergency"}),(0,D.jsxDEV)("div",{className:"text-[9px] text-[#66748B]",children:"National Toll-Free"})]}),
              (0,D.jsxDEV)("a",{href:"tel:108",className:"p-2.5 bg-white rounded-xl border border-emerald-200 hover:border-emerald-400 block text-center transition-colors shadow-xs group",children:[(0,D.jsxDEV)("div",{className:"font-black text-emerald-600 text-base group-hover:scale-105 transition-transform",children:"108"}),(0,D.jsxDEV)("div",{className:"text-[10px] text-[#182338] font-bold",children:"Ambulance & Trauma"}),(0,D.jsxDEV)("div",{className:"text-[9px] text-[#66748B]",children:"24x7 Paramedic"})]}),
              (0,D.jsxDEV)("a",{href:"tel:101",className:"p-2.5 bg-white rounded-xl border border-amber-200 hover:border-amber-400 block text-center transition-colors shadow-xs group",children:[(0,D.jsxDEV)("div",{className:"font-black text-amber-600 text-base group-hover:scale-105 transition-transform",children:"101"}),(0,D.jsxDEV)("div",{className:"text-[10px] text-[#182338] font-bold",children:"Fire & Rescue"}),(0,D.jsxDEV)("div",{className:"text-[9px] text-[#66748B]",children:"State Fire Force"})]}),
              (0,D.jsxDEV)("a",{href:"tel:1912",className:"p-2.5 bg-white rounded-xl border border-cyan-200 hover:border-cyan-400 block text-center transition-colors shadow-xs group",children:[(0,D.jsxDEV)("div",{className:"font-black text-cyan-600 text-base group-hover:scale-105 transition-transform",children:"1912"}),(0,D.jsxDEV)("div",{className:"text-[10px] text-[#182338] font-bold",children:"BESCOM Electricity"}),(0,D.jsxDEV)("div",{className:"text-[9px] text-[#66748B]",children:"Power Cut & Wire Faults"})]}),
              (0,D.jsxDEV)("a",{href:"tel:1533",className:"p-2.5 bg-white rounded-xl border border-indigo-200 hover:border-indigo-400 block text-center transition-colors shadow-xs group",children:[(0,D.jsxDEV)("div",{className:"font-black text-indigo-600 text-base group-hover:scale-105 transition-transform",children:"1533"}),(0,D.jsxDEV)("div",{className:"text-[10px] text-[#182338] font-bold",children:"BBMP Civic Control"}),(0,D.jsxDEV)("div",{className:"text-[9px] text-[#66748B]",children:"Potholes & Drainage"})]}),
              (0,D.jsxDEV)("a",{href:"tel:1091",className:"p-2.5 bg-white rounded-xl border border-pink-200 hover:border-pink-400 block text-center transition-colors shadow-xs group",children:[(0,D.jsxDEV)("div",{className:"font-black text-pink-600 text-base group-hover:scale-105 transition-transform",children:"1091"}),(0,D.jsxDEV)("div",{className:"text-[10px] text-[#182338] font-bold",children:"Women Safety"}),(0,D.jsxDEV)("div",{className:"text-[9px] text-[#66748B]",children:"24x7 Dedicated Desk"})]})
            ]})
          ]})
        ]}):(0,D.jsxDEV)("div",{className:"space-y-3",children:[
          filteredArticles.length===0?(0,D.jsxDEV)("div",{className:"p-8 text-center space-y-2 bg-[#F7F9FC] rounded-2xl border border-[#E2E8F0]",children:[
            (0,D.jsxDEV)("div",{className:"text-[#66748B] text-xs",children:[`No help articles found matching `,(0,D.jsxDEV)("strong",{className:"text-[#182338]",children:`"${hs}"`})]}),
            (0,D.jsxDEV)("button",{type:"button",onClick:()=>sht("contact"),className:"px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer",children:"Submit a Support Ticket Instead"})
          ]}):filteredArticles.map(art=>(0,D.jsxDEV)("div",{key:art.id,className:"p-3.5 bg-[#F7F9FC] rounded-2xl border border-[#E2E8F0] space-y-1.5 hover:border-[#00C2B8] transition-colors",children:[
            (0,D.jsxDEV)("div",{className:"flex items-center justify-between gap-2",children:[
              (0,D.jsxDEV)("h4",{className:"font-bold text-[#182338] flex items-center gap-2 text-sm",children:[
                art.cat==="auth"?(0,D.jsxDEV)(ya,{className:"w-4 h-4 text-[#00C2B8] shrink-0"}):art.cat==="booking"?(0,D.jsxDEV)(ri,{className:"w-4 h-4 text-[#2563EB] shrink-0"}):art.cat==="cancellation"?(0,D.jsxDEV)(Ka,{className:"w-4 h-4 text-amber-600 shrink-0"}):art.cat==="accounts"?(0,D.jsxDEV)(jo,{className:"w-4 h-4 text-purple-600 shrink-0"}):(0,D.jsxDEV)(Ci,{className:"w-4 h-4 text-emerald-600 shrink-0"}),
                (0,D.jsxDEV)("span",{children:art.title})
              ]}),
              (0,D.jsxDEV)("span",{className:"text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white text-[#00C2B8] border border-[#E2E8F0] shrink-0",children:art.cat})
            ]}),
            (0,D.jsxDEV)("p",{className:"text-xs text-[#66748B] leading-relaxed pl-6",children:art.summary})
          ]}))
        ]})
      ]}),
      (0,D.jsxDEV)("div",{className:"p-3 sm:p-4 bg-[#F7F9FC] border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#66748B] shrink-0",children:[
        (0,D.jsxDEV)("div",{className:"flex items-center gap-2",children:[
          (0,D.jsxDEV)("span",{className:"hidden sm:inline",children:"Official Support:"}),
          (0,D.jsxDEV)("a",{href:"mailto:support@nexora.community",className:"text-[#2563EB] hover:underline font-bold text-xs",children:"support@nexora.community"})
        ]}),
        (0,D.jsxDEV)("div",{className:"flex items-center gap-2",children:[
          (0,D.jsxDEV)("button",{type:"button",onClick:()=>sht("contact"),className:"px-3.5 py-1.5 bg-white hover:bg-[#EDF2F7] text-[#182338] font-bold rounded-xl border border-[#E2E8F0] transition-colors cursor-pointer text-xs",children:"Contact Us"}),
          (0,D.jsxDEV)("button",{type:"button",onClick:()=>S(!1),className:"px-4 py-1.5 bg-[#101B33] hover:bg-[#172541] text-white font-bold rounded-xl transition-colors cursor-pointer text-xs",children:"Close"})
        ]})
      ]})
    ]})}),

    /* 5. Quick Search Modal (Ctrl+K) - Clean White Surface */
    y&&(0,D.jsxDEV)("div",{onClick:()=>b(!1),className:"fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-start justify-center pt-8 sm:pt-16 px-4 animate-in fade-in",children:(0,D.jsxDEV)("div",{onClick:e=>e.stopPropagation(),className:"bg-white border border-[#E2E8F0] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col text-[#182338] animate-in zoom-in-95 max-h-[88vh]",children:[
      (0,D.jsxDEV)("div",{className:"p-4 bg-[#101B33] text-white flex items-center justify-between gap-3",children:[
        (0,D.jsxDEV)("div",{className:"flex items-center gap-2",children:[
          (0,D.jsxDEV)("div",{className:"w-8 h-8 rounded-xl bg-[#172541] border border-[#00C2B8]/40 flex items-center justify-center text-[#00C2B8]",children:(0,D.jsxDEV)(Qa,{className:"w-4 h-4"})}),
          (0,D.jsxDEV)("div",{children:[(0,D.jsxDEV)("h3",{className:"text-sm font-extrabold text-white",children:"Quick Search"}),(0,D.jsxDEV)("p",{className:"text-[10px] text-slate-300",children:"Find local services, verified people, and community assistance"})]})
        ]}),
        (0,D.jsxDEV)("div",{className:"flex items-center gap-2",children:[
          (0,D.jsxDEV)("div",{className:"flex items-center gap-1 bg-[#172541] border border-[#172541] px-2.5 py-1 rounded-xl text-xs text-[#00C2B8] font-bold",children:[(0,D.jsxDEV)(Da,{className:"w-3.5 h-3.5 text-[#00C2B8]"}),(0,D.jsxDEV)("span",{children:o})]}),
          (0,D.jsxDEV)("button",{type:"button",onClick:()=>{b(!1);ee("")},className:"p-1.5 text-slate-300 hover:text-white hover:bg-[#172541] rounded-xl transition-colors cursor-pointer",title:"Close (ESC)",children:(0,D.jsxDEV)(zo,{className:"w-5 h-5"})})
        ]})
      ]}),
      (0,D.jsxDEV)("div",{className:"p-4 border-b border-[#E2E8F0] bg-[#F7F9FC]",children:(0,D.jsxDEV)("form",{onSubmit:t=>{t&&t.preventDefault&&t.preventDefault();x.trim()&&(e(`/services?q=${encodeURIComponent(x.trim())}&locality=${encodeURIComponent(o)}`),b(!1))},className:"relative flex items-center gap-2",children:[
        (0,D.jsxDEV)("div",{className:"relative flex-1",children:[
          (0,D.jsxDEV)(Qa,{className:"w-4 h-4 text-[#66748B] absolute left-3.5 top-3"}),
          (0,D.jsxDEV)("input",{ref:de,type:"text",placeholder:"What service or assistance do you need?",value:x,onChange:e=>ee(e.target.value),className:"w-full bg-white border border-[#E2E8F0] focus:border-[#00C2B8] rounded-2xl pl-10 pr-9 py-2.5 text-sm text-[#182338] placeholder-[#66748B] focus:outline-none focus:ring-2 focus:ring-[#00C2B8]/20 transition-all font-medium"}),
          x&&(0,D.jsxDEV)("button",{type:"button",onClick:()=>ee(""),className:"absolute right-3 top-3 text-[#66748B] hover:text-[#182338] text-xs cursor-pointer",children:"✕"})
        ]}),
        (0,D.jsxDEV)("button",{type:"submit",className:"px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-2xl cursor-pointer transition-colors shrink-0",children:"Search"})
      ]})}),
      (0,D.jsxDEV)("div",{className:"p-4 overflow-y-auto max-h-[60vh] space-y-4",children:[
        !x.trim()?(0,D.jsxDEV)("div",{className:"space-y-4",children:[
          (0,D.jsxDEV)("div",{children:[
            (0,D.jsxDEV)("div",{className:"text-[10px] font-bold text-[#66748B] uppercase tracking-wider mb-2",children:"Popular Scenarios in Bengaluru"}),
            (0,D.jsxDEV)("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2",children:[
              {title:"Queue Standee for Tickets",desc:"Wait in line for cricket, concerts or visa",q:"queue"},
              {title:"Personal Assistant for the Day",desc:"Errands, billing, shopping and coordination",q:"personal assistant"},
              {title:"Hospital Visit Companion",desc:"Senior escort, patient walking partner",q:"companion"},
              {title:"Apartment Moving & Lifting",desc:"Heavy boxes, furniture, event setup",q:"moving"},
              {title:"Doorstep Electrician & Repairs",desc:"MCB tripping, fans, switches, wiring",q:"electrician"},
              {title:"Coding Tutor & System Design",desc:"1-on-1 code debugging, tech interviews",q:"coding tutor"}
            ].map((s,idx)=>(0,D.jsxDEV)("div",{key:idx,onClick:()=>{e(`/services?q=${encodeURIComponent(s.q)}&locality=${encodeURIComponent(o)}`);b(!1)},className:"p-2.5 bg-[#F7F9FC] hover:bg-[#EDF2F7] border border-[#E2E8F0] rounded-2xl cursor-pointer transition-colors group",children:[
              (0,D.jsxDEV)("div",{className:"text-xs font-bold text-[#182338] group-hover:text-[#2563EB] transition-colors",children:s.title}),
              (0,D.jsxDEV)("div",{className:"text-[10px] text-[#66748B]",children:s.desc})
            ]}))})
          ]}),
          (0,D.jsxDEV)("div",{children:[
            (0,D.jsxDEV)("div",{className:"text-[10px] font-bold text-[#66748B] uppercase tracking-wider mb-2",children:"Explore Categories"}),
            (0,D.jsxDEV)("div",{className:"flex flex-wrap gap-1.5",children:[
              "Home & Repairs","Automobiles","Education","Career & Mentorship","Health & Wellness","Beauty & Personal Care","Personal Assistance","Events"
            ].map((c,idx)=>(0,D.jsxDEV)("button",{key:idx,type:"button",onClick:()=>{e(`/services?category=${encodeURIComponent(c.toLowerCase().replace(/ & /g,"-"))}`);b(!1)},className:"px-3 py-1 bg-[#F7F9FC] hover:bg-[#EDF2F7] text-[#66748B] hover:text-[#182338] rounded-xl text-xs border border-[#E2E8F0] transition-colors cursor-pointer",children:c}))})
          ]})
        ]}):(0,D.jsxDEV)("div",{className:"space-y-4",children:[
          me.categories.length>0&&(0,D.jsxDEV)("div",{children:[
            (0,D.jsxDEV)("div",{className:"text-[10px] font-bold text-[#66748B] uppercase tracking-wider mb-2",children:"Matching Categories"}),
            (0,D.jsxDEV)("div",{className:"flex flex-wrap gap-2",children:me.categories.map((c,idx)=>(0,D.jsxDEV)("button",{key:idx,type:"button",onClick:()=>{e(`/services?q=${encodeURIComponent(c.subcategory)}&locality=${encodeURIComponent(o)}`);b(!1)},className:"px-3 py-1.5 bg-[#F7F9FC] hover:bg-[#E6FAF9] border border-[#E2E8F0] hover:border-[#00C2B8] rounded-xl text-xs text-[#009E96] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer",children:[
              (0,D.jsxDEV)(Ci,{className:"w-3 h-3 text-[#00C2B8]"}),
              (0,D.jsxDEV)("span",{children:c.subcategory})
            ]}))})
          ]}),
          (0,D.jsxDEV)("div",{children:[
            (0,D.jsxDEV)("div",{className:"text-[10px] font-bold text-[#66748B] uppercase tracking-wider mb-2 flex items-center justify-between",children:[
              (0,D.jsxDEV)("span",{children:"Matching Verified Specialists"}),
              me.providers.length>0&&(0,D.jsxDEV)("span",{className:"text-[#00C2B8] font-semibold",children:`${me.providers.length} found`})
            ]}),
            me.providers.length===0?(0,D.jsxDEV)("div",{className:"py-6 text-center text-[#66748B] text-xs",children:[`No specialist matches for "${x}". `,(0,D.jsxDEV)("button",{type:"button",onClick:()=>{e(`/ai-assistant?prompt=${encodeURIComponent(x)}`);b(!1)},className:"text-[#2563EB] hover:underline font-bold",children:"Ask AI Assistant"})]}):(0,D.jsxDEV)("div",{className:"space-y-2",children:me.providers.map(p=>(0,D.jsxDEV)("div",{key:p.id,onClick:()=>{d(p);b(!1)},className:"flex items-center justify-between p-2.5 bg-[#F7F9FC] hover:bg-[#EDF2F7] rounded-2xl border border-[#E2E8F0] cursor-pointer transition-colors group",children:[
              (0,D.jsxDEV)("div",{className:"flex items-center gap-3 min-w-0",children:[
                (0,D.jsxDEV)("img",{src:p.image,alt:p.name,className:"w-10 h-10 rounded-xl object-cover shrink-0 border border-[#E2E8F0]"}),
                (0,D.jsxDEV)("div",{className:"min-w-0",children:[
                  (0,D.jsxDEV)("div",{className:"text-xs font-bold text-[#182338] group-hover:text-[#2563EB] flex items-center gap-1",children:[p.name,(0,D.jsxDEV)(oo,{className:"w-3 h-3 text-[#00C2B8] shrink-0"})]}),
                  (0,D.jsxDEV)("div",{className:"text-[11px] text-[#66748B] truncate",children:p.title}),
                  (0,D.jsxDEV)("div",{className:"text-[10px] text-[#66748B]",children:`📍 ${p.zone||p.locality}`})
                ]})
              ]}),
              (0,D.jsxDEV)("div",{className:"text-right shrink-0 ml-3",children:[
                (0,D.jsxDEV)("div",{className:"text-xs font-bold text-[#2563EB]",children:[`₹`,p.hourlyRate,`/hr`]}),
                (0,D.jsxDEV)("div",{className:"text-[10px] text-[#66748B]",children:`★ ${p.rating||4.8}`})
              ]})
            ]}))})
          ]}),
          (0,D.jsxDEV)("div",{className:"pt-2 border-t border-[#E2E8F0] flex items-center justify-between",children:[
            (0,D.jsxDEV)("button",{type:"button",onClick:()=>{e(`/services?q=${encodeURIComponent(x.trim())}&locality=${encodeURIComponent(o)}`);b(!1)},className:"text-[#00C2B8] hover:text-[#009E96] text-xs font-bold flex items-center gap-1",children:[(0,D.jsxDEV)("span",{children:`View all results in Directory`}),(0,D.jsxDEV)(Ur,{className:"w-3.5 h-3.5"})]}),
            (0,D.jsxDEV)("button",{type:"button",onClick:()=>{e(`/ai-assistant?prompt=${encodeURIComponent(x.trim())}`);b(!1)},className:"text-[#66748B] hover:text-[#182338] text-xs flex items-center gap-1",children:[(0,D.jsxDEV)(Yr,{className:"w-3 h-3 text-[#00C2B8]"}),(0,D.jsxDEV)("span",{children:"Consult AI"})]})
          ]})
        ]})
      ]})
    ]})})
  ]})
}