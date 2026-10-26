/*!
 * Astrobox runtime 1.0
 * Behaviour for the Astrobox design system: palette derivation, seeded orbits, moods,
 * identity glyphs, units and tooltips, redaction, counting values, motion, contents rail,
 * attention brackets and segmented controls.
 *
 * Load after astrobox.tokens.css and astrobox.css. Initialises itself on DOMContentLoaded;
 * call Astrobox.init(element) after inserting new markup (route changes, lists, modals).
 * Set window.ASTROBOX_MANUAL = true before loading to skip the automatic first init.
 */
(function (global) {
 'use strict';
 if (global.Astrobox && global.Astrobox.version) return;
 const document = global.document, root = document.documentElement;
 const NS = 'http://www.w3.org/2000/svg';
 const reduce = global.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const Astrobox = global.Astrobox = { version: '1.0.0' };

 /* ---------- seeds and orbits ---------- */
 function mk(tag,attrs){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);return e;}
 /* seeded orbits: FNV-1a hash of the host's text seeds a mulberry32 generator */
 function fnv(str){let h=0x811c9dc5;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,0x01000193);}return h>>>0;}
 function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
 function edgePoint(side,r){const along=0.1+0.8*r(),out=-0.08+0.3*r();return side===0?[along,-out]:side===1?[1+out,along]:side===2?[along,1+out]:[-out,along];}
 function tiltFrom(seed){return -26+52*mulberry((seed^0x9e3779b9)>>>0)();}
 function autoSpec(el){
  const txt=el.dataset.entity||((el.dataset.orbitSeed||'')+el.textContent.replace(/\s+/g,' ').trim());
  const seed=fnv(txt),r=mulberry(seed),R=(a,b)=>a+(b-a)*r();
  const side=Math.floor(r()*4),[cx,cy]=edgePoint(side,r);
  R(0,1);const rot=tiltFrom(seed),rx=R(0.6,1.12),ry=rx*R(0.3,0.62);
  const o=[[cx,cy,rx,ry,rot,r()<0.75?R(0,360):NaN]];
  const k=r();
  if(k<0.42){const f=R(0.5,0.7);o.push([cx,cy,rx*f,ry*f,rot,r()<0.35?R(0,360):NaN]);}
  else if(k<0.74){const[c2x,c2y]=edgePoint((side+2)%4,r);o.push([c2x,c2y,R(0.45,0.8),R(0.18,0.42),rot+R(-8,8),NaN]);}
  el._seed=seed;return o;
 }
 function specs(el){
  if(el.dataset.orbit==='auto')return el._spec||(el._spec=autoSpec(el));
  return el.dataset.orbit.split(';').map(x=>x.split(',').map(Number));
 }
 /* keep a seeded satellite on the visible part of its orbit */
 function visibleAngle(dot,X,Y,RX,RY,rot,w,h){
  const t=rot*Math.PI/180;
  for(let n=0;n<12;n++){const a=(dot+n*30)*Math.PI/180;
   const px=X+RX*Math.cos(a)*Math.cos(t)-RY*Math.sin(a)*Math.sin(t),py=Y+RX*Math.cos(a)*Math.sin(t)+RY*Math.sin(a)*Math.cos(t);
   if(px>14&&px<w-14&&py>14&&py<h-14)return dot+n*30;}
  return NaN;
 }
 function drawOrbits(el){
  const mode=el.dataset.orbitMode||'behind';
  let svg=el.querySelector(':scope>svg.orb:not(.front)');
  if(!svg){svg=mk('svg',{class:'orb','aria-hidden':'true'});el.prepend(svg);}
  let front=el.querySelector(':scope>svg.orb.front');
  if(mode==='ring'&&!front){front=mk('svg',{class:'orb front','aria-hidden':'true'});el.appendChild(front);}
  const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;
  svg.setAttribute('viewBox','0 0 '+w+' '+h);svg.innerHTML='';
  if(front){front.setAttribute('viewBox','0 0 '+w+' '+h);front.innerHTML='';}
  const seeded=el.dataset.orbit==='auto';
  specs(el).forEach(([cx,cy,rx,ry,rot,dot0],i)=>{
   const X=cx*w,Y=cy*h,RX=rx*w,RY=ry*h,tr='rotate('+rot+' '+X+' '+Y+')';
   let d0=dot0;if(i===0&&el.dataset.mood&&isNaN(d0))d0=(el._seed||fnv(el.textContent))%360;
   const dot=(seeded||el.dataset.mood)&&!isNaN(d0)?visibleAngle(d0,X,Y,RX,RY,rot,w,h):d0;
   const g=mk('g',{transform:tr}),ell={cx:X,cy:Y,rx:RX,ry:RY},rev=i%2?' rev':'';
   if(mode==='over'){
    g.appendChild(mk('ellipse',Object.assign({class:'o-under drift'+rev},ell)));
    g.appendChild(mk('ellipse',Object.assign({class:'o-on drift'+rev},ell)));
   }else{
    g.appendChild(mk('ellipse',Object.assign({class:(i%2?'o-b':'o-a')+' drift'+rev},ell)));
   }
   if(!isNaN(dot)){const a=dot*Math.PI/180;g.appendChild(mk('circle',{cx:X+RX*Math.cos(a),cy:Y+RY*Math.sin(a),r:3.2,class:'o-dot'+(i%2?' j':'')}));}
   svg.appendChild(g);
   if(mode==='ring'&&i===0){
    /* front half of the orbit, drawn only where it crosses the image */
    const m=el.querySelector('.media');if(!m)return;
    const hr=el.getBoundingClientRect(),mr=m.getBoundingClientRect();
    const id='clip'+Math.random().toString(36).slice(2,8);
    const cp=mk('clipPath',{id:id});cp.appendChild(mk('rect',{x:mr.left-hr.left,y:mr.top-hr.top,width:mr.width,height:mr.height}));
    const defs=mk('defs',{});defs.appendChild(cp);front.appendChild(defs);
    const outer=mk('g',{'clip-path':'url(#'+id+')'}),fg=mk('g',{transform:tr});
    const d='M'+(X-RX)+','+Y+' A'+RX+','+RY+' 0 0,0 '+(X+RX)+','+Y;
    fg.appendChild(mk('path',{d:d,class:'o-under drift'}));fg.appendChild(mk('path',{d:d,class:'o-on drift'}));
    if(!isNaN(dot)){const a=dot*Math.PI/180,py=Y+RY*Math.sin(a);if(Math.sin(a)>0)fg.appendChild(mk('circle',{cx:X+RX*Math.cos(a),cy:py,r:3.6,class:'o-dot'}));}
    outer.appendChild(fg);front.appendChild(outer);
   }
  });
 }
 const ro = 'ResizeObserver' in global ? new ResizeObserver(es => es.forEach(en => drawOrbits(en.target))) : null;
 function initOrbits(scope) {
  scope.querySelectorAll('[data-orbit]').forEach(el => {
   if (!el._abOrbit) { el._abOrbit = 1; if (ro) ro.observe(el); }
   el._spec = null; drawOrbits(el);
  });
 }
 new MutationObserver(ms => ms.forEach(m => {
  const el = m.target;
  if (el.dataset && el.dataset.orbit) drawOrbits(el);
  el.dispatchEvent(new CustomEvent('astro:mood', { bubbles: true, detail: { mood: el.dataset.mood || null, previous: m.oldValue } }));
 })).observe(root, { attributes: true, attributeFilter: ['data-mood'], attributeOldValue: true, subtree: true });

 /* hover reveal on touch screens: light the reveal card nearest the middle of the viewport */
 if (global.matchMedia('(hover: none)').matches) {
  let rt = false;
  const lightUp = () => {
   rt = false; const mid = innerHeight / 2; let best = null, bd = 1e9;
   const rv = [...document.querySelectorAll('[data-orbit-reveal]')];
   rv.forEach(el => { const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; const d = Math.abs((r.top + r.bottom) / 2 - mid); if (d < bd) { bd = d; best = el; } });
   rv.forEach(el => el.classList.toggle('lit', el === best));
  };
  global.addEventListener('scroll', () => { if (!rt) { rt = true; requestAnimationFrame(lightUp); } }, { passive: true });
 }

 /* ---------- palette: every colour token derived from one accent (OKLCH) ---------- */
 /* @@PALETTE@@ : injected from src/palette.js by scripts/build.mjs */
 const PRESETS = { signal: '#f5a524', command: '#ff6a33', astra: '#d3b777' };
 const PDEF = { acc: PRESETS.signal, tint: null, ok: null, warn: null, bad: null, pre: null };
 let pcfg = Object.assign({}, PDEF);
 function paletteCSS(c) {
  c = Object.assign({}, PDEF, c || {});
  const ns = gen(false, false, c), nh = gen(false, true, c), ds = gen(true, false, c), dh = gen(true, true, c);
  return ':root{' + block(ns) + ';color-scheme:dark}\n'
   + ':root[data-contrast="high"]{' + block(nh) + '}\n'
   + '@media (prefers-color-scheme:light){:root:not([data-theme="dark"]){' + block(ds) + ';color-scheme:light}}\n'
   + ':root[data-theme="light"]{' + block(ds) + ';color-scheme:light}\n'
   + '@media (prefers-color-scheme:light){:root[data-contrast="high"]:not([data-theme="dark"]){' + block(dh) + '}}\n'
   + ':root[data-contrast="high"][data-theme="light"]{' + block(dh) + '}\n';
 }
 Astrobox.palette = {
  presets: Object.assign({}, PRESETS),
  /* cfg: { acc, tint, ok, warn, bad, pre } as #rrggbb; omitted keys are derived */
  apply(cfg) {
   pcfg = Object.assign({}, PDEF, cfg || {});
   let st = document.getElementById('astrobox-palette');
   if (!st) { st = document.createElement('style'); st.id = 'astrobox-palette'; document.head.appendChild(st); }
   st.textContent = paletteCSS(pcfg);
   root.dispatchEvent(new CustomEvent('astro:palette', { detail: Object.assign({}, pcfg) }));
   return pcfg;
  },
  reset() { const st = document.getElementById('astrobox-palette'); if (st) st.remove(); pcfg = Object.assign({}, PDEF); },
  get() { return Object.assign({}, pcfg); },
  css: paletteCSS,
  /* tokens for one mode: tokens({ day: true, high: false }, cfg) */
  tokens(mode, cfg) { const t = gen(!!(mode && mode.day), !!(mode && mode.high), Object.assign({}, PDEF, cfg || {})); const tint = t._tint; delete t._tint; Object.defineProperty(t, 'tintSample', { value: tint }); return t; }
 };
 Astrobox.setTheme = t => { if (t === 'light' || t === 'dark') root.dataset.theme = t; else delete root.dataset.theme; };
 Astrobox.setContrast = on => { if (on) root.dataset.contrast = 'high'; else delete root.dataset.contrast; };

 /* ---------- units, formatting and tooltips ---------- */
 const UNITS={AU:['astronomical unit',v=>'≈ '+num(v*149597870.7,{maximumFractionDigits:0})+' km'],TL:['tech level',v=>['Stone age','Pre-gunpowder','Industrial','Early modern','Postech','Pretech','Ancient pretech'][v]||''],cr:['credits']};
 const fmtState={locale:''};
 function loc(){return fmtState.locale||navigator.language||'en';}
 function num(v,o){return new Intl.NumberFormat(loc(),Object.assign({maximumFractionDigits:2},o||{})).format(v).replace(/^-/,'−');}
 const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const uu=u=>u?' <span class="uu">'+esc(u)+'</span>':'';
 function render(el){
  const k=el.dataset.kind||'qty',v=el.getAttribute('value'),u=el.dataset.unit||'',n=parseFloat(v);
  let h='',tip=null,cls='';
  if(k==='qty'){h=num(n)+uu(u);const d=UNITS[u];if(d&&d[1])tip=[d[0],d[1](n)];}
  else if(k==='pool'){h=num(n)+'<span class="us">/'+num(+el.dataset.max)+'</span>';}
  else if(k==='range'){h=num(n)+'–'+num(+el.dataset.to)+uu(u);}
  else if(k==='est'){h='<span class="ux">≈</span>'+num(n,{maximumFractionDigits:0})+uu(u);cls='est';tip=['estimate',el.dataset.source||'Not confirmed'];}
  else if(k==='delta'){h=(n>0?'+':n<0?'−':'±')+num(Math.abs(n))+uu(u);cls=n>0?'up':n<0?'down':'';if(el.dataset.since)tip=['change','Compared with '+el.dataset.since];}
  else if(k==='hex'){const c=v.slice(0,2),r=v.slice(2);h='<span class="uu pre">Hex</span> '+esc(c+r);}
  else if(k==='bearing'){h=String(Math.round(n)%360).padStart(3,'0')+'°';}
  else if(k==='cr'){h=num(n,{maximumFractionDigits:0})+uu('cr');}
  else if(k==='pre'){h='<span class="uu pre">'+esc(u)+'</span>'+num(n);const d=UNITS[u];if(d&&d[1]&&d[1](n))tip=[d[0],d[1](n)];}
  else if(k==='dice'){const m=/^(\d*)d(\d+)([+−-]\d+)?$/.exec(v.trim());cls='dice';h=esc(v.replace('-','−'));
   if(m){const c=+(m[1]||1),f=+m[2],md=m[3]?+m[3].replace('−','-'):0;tip=['roll',c+' × d'+f+(md?(md>0?' + ':' − ')+Math.abs(md):'')+' · average '+num(c*(f+1)/2+md,{maximumFractionDigits:1})+' · range '+(c+md)+'–'+(c*f+md)];}}
  else if(k==='time'){const day=el.dataset.day,ses=v;
   h=el.hasAttribute('data-short')?num(+ses):(day?'<span class="uu pre">Day</span> '+num(+day,{useGrouping:false})+' · ':'')+'<span class="uu pre">Session</span> '+num(+ses);
   if(el.dataset.real){const d=new Date(el.dataset.real+'T19:00:00'),days=Math.round((d-new Date())/864e5);
    tip=['real date',new Intl.DateTimeFormat(loc(),{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(d)+' · '+new Intl.RelativeTimeFormat(loc(),{numeric:'auto'}).format(days,'day')];}}
  el.innerHTML=h;el.classList.remove('est','up','down','dice');if(cls)el.classList.add(cls);
  if(tip&&(tip[1]||tip[0])){el.dataset.tip=tip[0]+'\n'+tip[1];el.tabIndex=0;}else{delete el.dataset.tip;}
  return el.outerHTML;
 }
 let tipEl = null;
 function ensureTip() { if (!tipEl) { tipEl = document.createElement('div'); tipEl.className = 'utip'; tipEl.id = 'utip'; tipEl.setAttribute('role', 'tooltip'); document.body.appendChild(tipEl); } }
 function showTip(el){if(!el.dataset.tip)return;const[a,b]=el.dataset.tip.split('\n');tipEl.innerHTML='<b>'+esc(a)+'</b>'+esc(b||'');
  const r=el.getBoundingClientRect();tipEl.classList.add('on');const w=tipEl.offsetWidth,hh=tipEl.offsetHeight;
  let x=Math.min(Math.max(8,r.left),innerWidth-w-8),y=r.top-hh-8;if(y<8)y=r.bottom+8;
  tipEl.style.left=x+'px';tipEl.style.top=y+'px';el.setAttribute('aria-describedby','utip');}
 function hideTip(){tipEl.classList.remove('on');}
 document.addEventListener('mouseover', e => { const u = e.target.closest && e.target.closest('.u[data-tip]'); if (u) { ensureTip(); showTip(u); } });
 document.addEventListener('mouseout', e => { if (tipEl && e.target.closest && e.target.closest('.u[data-tip]')) hideTip(); });
 document.addEventListener('focusin', e => { const u = e.target.closest && e.target.closest('.u[data-tip]'); if (u) { ensureTip(); showTip(u); } });
 document.addEventListener('focusout', () => { if (tipEl) hideTip(); });
 global.addEventListener('scroll', () => { if (tipEl) hideTip(); }, { passive: true });
 function mkU(kind,v,extra){const el=document.createElement('data');el.className='u';el.dataset.kind=kind;el.setAttribute('value',v);Object.keys(extra||{}).forEach(k=>{if(extra[k]!=null&&extra[k]!=='')el.dataset[k]=extra[k];});return render(el);}
 Astrobox.fmt={
  qty:(v,u)=>mkU('qty',v,{unit:u}),pool:(v,max)=>mkU('pool',v,{max}),range:(a,b,u)=>mkU('range',a,{to:b,unit:u}),
  est:(v,u,source)=>mkU('est',v,{unit:u,source}),delta:(v,u,since)=>mkU('delta',v,{unit:u,since}),hex:c=>mkU('hex',c),bearing:d=>mkU('bearing',d),
  cr:v=>mkU('cr',v),pre:(u,v)=>mkU('pre',v,{unit:u}),dice:d=>mkU('dice',d),time:o=>mkU('time',o.session,{day:o.day,real:o.real}),
  get locale(){return loc();},set locale(l){fmtState.locale=l||'';Astrobox.hydrate(document);}
 };
 Astrobox.hydrate = function (scope) { (scope || document).querySelectorAll('data.u').forEach(render); };
 /* register an app-specific unit: label for the tooltip, convert(value) returns the added information */
 Astrobox.units = { register(name, label, convert) { UNITS[name] = [label, convert]; }, list: UNITS };

 /* ---------- identity glyphs ---------- */
 const GCORE={
  world:()=>'<circle class="g-core" cx="20" cy="20" r="7.2"/>',
  ship:()=>'<path class="g-core" d="M20 11.5 L27.5 27.5 L20 23.2 L12.5 27.5 Z"/>',
  station:w=>'<rect class="g-line" x="14" y="14" width="12" height="12" stroke-width="'+w+'"/><rect class="g-core" x="18.4" y="18.4" width="3.2" height="3.2"/>',
  person:w=>'<circle class="g-line" cx="20" cy="20" r="6.2" stroke-width="'+w+'"/><circle class="g-core" cx="20" cy="20" r="2"/>',
  faction:w=>{let d='';for(let i=0;i<6;i++){const a=Math.PI/3*i-Math.PI/2;d+=(i?'L':'M')+(20+8.2*Math.cos(a)).toFixed(2)+' '+(20+8.2*Math.sin(a)).toFixed(2)+' ';}return '<path class="g-line" d="'+d+'Z" stroke-width="'+w+'" stroke-linejoin="round"/>';}
 };
 function glyphSVG(kind,seedStr,size){
  size=size||16;const seed=fnv(String(seedStr||'?')),r=mulberry(seed),tilt=tiltFrom(seed);
  const w=size<=18?2.6:size<=24?2:size<=40?1.5:1.1,ow=size<=18?2.1:size<=24?1.7:size<=40?1.35:1.1;
  const rx=14.5+3.5*r(),ry=rx*(0.28+0.18*r()),two=size>=24&&r()<0.5,a=r()*Math.PI*2;
  const sx=20+rx*Math.cos(a),sy=20+ry*Math.sin(a),sr=size<=18?3.8:size<=24?3.3:2.9;
  const ring=(RX,RY)=>'<ellipse class="g-orb" cx="20" cy="20" rx="'+RX.toFixed(2)+'" ry="'+RY.toFixed(2)+'" stroke-width="'+ow+'"/>';
  const front=(RX,RY)=>'<path class="g-orb" d="M'+(20-RX).toFixed(2)+' 20 A'+RX.toFixed(2)+' '+RY.toFixed(2)+' 0 0 0 '+(20+RX).toFixed(2)+' 20" stroke-width="'+ow+'"/>';
  const g0='<g transform="rotate('+tilt.toFixed(1)+' 20 20)">';
  let out='<svg width="'+size+'" height="'+size+'" viewBox="0 0 40 40" aria-hidden="true">';
  out+=g0+ring(rx,ry)+(two?ring(rx*1.22,ry*1.3):'')+'</g>';
  out+=(GCORE[kind]||GCORE.world)(w);
  out+=g0+front(rx,ry)+'<circle class="g-sat" cx="'+sx.toFixed(2)+'" cy="'+sy.toFixed(2)+'" r="'+sr+'"/></g>';
  return out+'</svg>';
 }
 function renderGlyph(el){
  const size=+(el.dataset.size||16),seed=el.dataset.seed||el.dataset.name||'';
  el.innerHTML=glyphSVG(el.dataset.kind,seed,size);
  if(el.dataset.name){el.setAttribute('role','img');el.setAttribute('aria-label',el.dataset.name);}else el.setAttribute('aria-hidden','true');
 }
 Astrobox.glyphSVG = glyphSVG;
 /* the FNV-1a hash behind every seeded orbit and glyph */
 Astrobox.hash = fnv;
 Astrobox.glyphs = function (scope) { (scope || document).querySelectorAll('.glyph[data-kind]').forEach(renderGlyph); };

 /* ---------- moods ---------- */
 Astrobox.moods = ['neutral', 'nominal', 'strained', 'damaged', 'unverified', 'hidden'];
 Astrobox.setMood = function (el, mood) { if (!el) return; if (mood) el.dataset.mood = mood; else delete el.dataset.mood; };
 Astrobox.redraw = function (el) { if (el && el.dataset.orbit) { el._spec = null; drawOrbits(el); } };

 /* ---------- redaction: one bar per withheld word ---------- */
 Astrobox.redact = function (scope) {
  (scope || document).querySelectorAll('[data-words]').forEach(el => {
   const w = el.dataset.words.trim().split(/\s+/).map(Number).filter(n => n > 0);
   el.innerHTML = w.map(n => '<span class="lbar" style="--len:' + n + 'ch"></span>').join(' ');
   el.setAttribute('role', 'img'); el.setAttribute('aria-label', 'withheld, ' + w.length + (w.length === 1 ? ' word' : ' words'));
  });
 };

 /* ---------- counting values ---------- */
 const msOf=(el,name)=>parseFloat(getComputedStyle(el).getPropertyValue(name))||0;
 function stepper(el,to,apply){
  if(el._cnt)cancelAnimationFrame(el._cnt);
  const from=el._cur!=null?el._cur:to,steps=Math.abs(to-from);
  if(!steps||reduce){el._cur=to;apply(to);return;}
  const dur=msOf(el,'--t-count'),t0=performance.now();
  const tick=now=>{const k=Math.min(1,(now-t0)/dur),v=Math.round(from+(to-from)*k);
   if(v!==el._cur){el._cur=v;apply(v);}if(k<1)el._cnt=requestAnimationFrame(tick);else el._cnt=null;};
  el._cnt=requestAnimationFrame(tick);
 }
 Astrobox.count=function(el,to){
  if(!el)return;
  if(el.classList.contains('cells')){if(el._cur==null)el._cur=+el.dataset.f;const cs=[...el.children];
   stepper(el,to,v=>{el.dataset.f=v;cs.forEach((c,i)=>c.classList.toggle('f',i<v));});}
  else{if(el._cur==null)el._cur=parseFloat(el.getAttribute('value'));stepper(el,to,v=>{el.setAttribute('value',v);render(el);});}
 };

 /* ---------- segmented controls ---------- */
 function placeInd(seg) { const on = seg.querySelector('button.on'), ind = seg.querySelector('.ind'); if (!on || !ind) return; ind.style.width = on.offsetWidth + 'px'; ind.style.transform = 'translateX(' + on.offsetLeft + 'px)'; }
 function initSeg(scope) {
  scope.querySelectorAll('.seg').forEach(seg => {
   if (!seg.querySelector('.ind')) { const i = document.createElement('span'); i.className = 'ind'; seg.prepend(i); }
   if (!seg.querySelector('button.on')) { const b = seg.querySelector('button'); if (b) b.classList.add('on'); }
   if (!seg._abSeg) {
    seg._abSeg = 1;
    seg.addEventListener('click', e => {
     const b = e.target.closest('button'); if (!b || !seg.contains(b)) return;
     seg.querySelectorAll('button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
     placeInd(seg);
     seg.dispatchEvent(new CustomEvent('astro:change', { bubbles: true, detail: { value: b.dataset.value != null ? b.dataset.value : b.textContent.trim(), button: b } }));
    });
   }
   placeInd(seg);
  });
 }
 Astrobox.placeIndicator = placeInd;

 /* ---------- cell meters ---------- */
 function initCells(scope) {
  scope.querySelectorAll('.cells').forEach(c => {
   const n = +getComputedStyle(c).getPropertyValue('--n') || +c.dataset.n || 0, f = +c.dataset.f || 0, x = +(c.dataset.x || 0);
   if (c.children.length === n) return;
   let h = ''; for (let i = 0; i < n; i++) h += '<i class="' + (i < f ? 'f' : (i < f + x ? 'x' : '')) + '"></i>';
   c.innerHTML = h; c.setAttribute('role', 'img'); c.setAttribute('aria-label', f + ' of ' + n);
  });
 }

 /* ---------- media: loading and failure states ---------- */
 function initMedia(scope) {
  scope.querySelectorAll('.media').forEach(m => {
   const img = m.querySelector('img'); if (!img || m._abMedia) return; m._abMedia = 1;
   const alt = m.querySelector('[data-alt]'); if (alt) alt.textContent = img.alt;
   const fail = () => { m.classList.remove('loading'); m.classList.add('broken'); };
   if (img.complete) { if (!img.naturalWidth) fail(); return; }
   const t = setTimeout(() => { if (!img.complete) m.classList.add('loading'); }, 300);
   img.addEventListener('load', () => { clearTimeout(t); m.classList.remove('loading'); const o = m.closest('[data-orbit]'); if (o) drawOrbits(o); });
   img.addEventListener('error', () => { clearTimeout(t); fail(); });
  });
 }

 /* ---------- attention brackets ---------- */
 function initAtt(scope) {
  scope.querySelectorAll('.att').forEach(att => {
   if (att._abAtt) return; att._abAtt = 1;
   let b = att.querySelector('.att-b'); if (!b) { b = document.createElement('span'); b.className = 'att-b'; b.setAttribute('aria-hidden', 'true'); att.prepend(b); }
   const items = () => [...att.querySelectorAll('.att-i')];
   const place = () => { const it = items().find(x => x.getAttribute('aria-selected') === 'true') || items()[0]; if (!it) return; b.style.width = it.offsetWidth + 'px'; b.style.height = it.offsetHeight + 'px'; b.style.transform = 'translate(' + it.offsetLeft + 'px,' + it.offsetTop + 'px)'; };
   const select = i => { const its = items(); if (!its.length) return; i = (i + its.length) % its.length; its.forEach((x, j) => x.setAttribute('aria-selected', j === i ? 'true' : 'false')); place(); att.dispatchEvent(new CustomEvent('astro:select', { bubbles: true, detail: { index: i, item: its[i] } })); };
   att.addEventListener('click', e => { const it = e.target.closest('.att-i'); if (it) select(items().indexOf(it)); });
   att.addEventListener('keydown', e => { const cols = getComputedStyle(att).gridTemplateColumns.split(' ').length, cur = items().findIndex(x => x.getAttribute('aria-selected') === 'true');
    const d = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols }[e.key]; if (d) { e.preventDefault(); select(Math.max(0, cur) + d); } });
   if (ro) new ResizeObserver(place).observe(att);
   place();
  });
 }

 /* ---------- contents rail: <nav class="toc" data-toc="#article-body"> ---------- */
 const tocs = [];
 function initToc(scope) {
  scope.querySelectorAll('[data-toc]').forEach(nav => {
   if (nav._abToc) return; nav._abToc = 1;
   const links = [...nav.querySelectorAll('a[href^="#"]')];
   const heads = links.map(a => document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))));
   tocs.push({ nav, links, heads, body: document.querySelector(nav.dataset.toc), bar: [...nav.querySelectorAll('.dprog i')], now: nav.querySelector('[data-toc-now]'), count: nav.querySelector('[data-toc-count]'), cur: -1 });
  });
  updateTocs();
 }
 function updateTocs() {
  const y = innerHeight * 0.32;
  tocs.forEach(t => {
   let cur = 0; t.heads.forEach((h, i) => { if (h && h.getBoundingClientRect().top < y) cur = i; });
   if (t.body && t.body.getBoundingClientRect().bottom < y) cur = t.heads.length;
   if (cur === t.cur) return; t.cur = cur; const n = t.heads.length;
   t.links.forEach((a, i) => { a.parentElement.classList.toggle('done', i < cur); a.parentElement.classList.toggle('cur', i === cur); if (i === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
   t.bar.forEach((b, i) => b.className = i < cur ? 'done' : i === cur ? 'next' : '');
   if (t.count) t.count.textContent = cur >= n ? 'Read' : String(cur + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
   if (t.now) t.now.textContent = cur >= n ? 'End of entry' : (t.links[cur].querySelector('span') || t.links[cur]).textContent;
  });
 }
 let tocTick = false;
 global.addEventListener('scroll', () => { if (!tocTick && tocs.length) { tocTick = true; requestAnimationFrame(() => { tocTick = false; updateTocs(); }); } }, { passive: true });

 /* ---------- motion: frames draw once, drift only while visible ---------- */
 const xio = 'IntersectionObserver' in global ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('xf-wait'); xio.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' }) : null;
 function initFrames(scope) {
  if (!xio) return;
  scope.querySelectorAll('.xf').forEach(x => { if (x._abXf) return; x._abXf = 1; if (x.getBoundingClientRect().top > innerHeight) { x.classList.add('xf-wait'); xio.observe(x); } });
 }
 const dio = 'IntersectionObserver' in global ? new IntersectionObserver(es => es.forEach(e => {
  const sv = e.target; sv.classList.toggle('off', !e.isIntersecting);
  if (sv.pauseAnimations && sv.querySelector('animateMotion') && !reduce) { try { e.isIntersecting ? sv.unpauseAnimations() : sv.pauseAnimations(); } catch (err) { } }
 })) : null;
 function initDrift(scope) {
  scope.querySelectorAll('.drift').forEach(d => { const sv = d.ownerSVGElement; if (sv && !sv._abDrift && dio) { sv._abDrift = 1; dio.observe(sv); } });
  if (reduce) scope.querySelectorAll('svg').forEach(sv => { if (sv.pauseAnimations && sv.querySelector('animateMotion')) try { sv.pauseAnimations(); } catch (e) { } });
 }

 /* ---------- audits for development ---------- */
 Astrobox.auditOrbits = function () {
  const vis = [...document.querySelectorAll('[data-orbit]:not([data-orbit-reveal])')].filter(el => {
   const r = el.getBoundingClientRect(), svg = el.querySelector(':scope>svg.orb');
   return r.bottom > 0 && r.top < innerHeight && svg && getComputedStyle(svg).display !== 'none';
  });
  if (vis.length > 1) console.warn('Astrobox: ' + vis.length + ' orbit fields visible; the budget is one.', vis);
  return vis.length;
 };
 Astrobox.auditFrames = function () {
  const deep = [...document.querySelectorAll('.xf .xf .xf')];
  if (deep.length) console.warn('Astrobox: ' + deep.length + ' cross-frame(s) nested deeper than one level.', deep);
  const bad = [...document.querySelectorAll('.oc .xf,.cb .xf')];
  if (bad.length) console.warn('Astrobox: cross-frame inside an orbit card or bracket.', bad);
  return deep.length + bad.length;
 };

 /* ---------- init ---------- */
 Astrobox.init = function (scope) {
  scope = scope || document;
  initSeg(scope); initCells(scope); initMedia(scope);
  Astrobox.hydrate(scope); Astrobox.glyphs(scope); Astrobox.redact(scope);
  initOrbits(scope); initAtt(scope); initToc(scope); initFrames(scope); initDrift(scope);
  return Astrobox;
 };
 global.addEventListener('resize', () => { document.querySelectorAll('.seg').forEach(placeInd); updateTocs(); });
 if (document.fonts) document.fonts.ready.then(() => document.querySelectorAll('.seg').forEach(placeInd));
 if (!global.ASTROBOX_MANUAL) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => Astrobox.init(document));
  else Astrobox.init(document);
 }
})(window);
