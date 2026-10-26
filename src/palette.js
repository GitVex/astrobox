/* Palette derivation: every colour token from one accent, in OKLCH.
   Pure functions, no DOM. Injected into the runtime and run by the build for the static tokens. */
const cbrt=Math.cbrt,clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function toLin(c){c/=255;return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
function toGam(c){return c<=0.0031308?12.92*c:1.055*Math.pow(c,1/2.4)-0.055;}
function hexToOklch(hex){
 const n=parseInt(hex.slice(1),16),r=toLin(n>>16&255),g=toLin(n>>8&255),b=toLin(n&255);
 const l=cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b),m=cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b),q=cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);
 const L=0.2104542553*l+0.7936177850*m-0.0040720468*q,A=1.9779984951*l-2.4285922050*m+0.4505937099*q,B=0.0259040371*l+0.7827717662*m-0.8086757660*q;
 return {L:L,C:Math.hypot(A,B),h:(Math.atan2(B,A)*180/Math.PI+360)%360};
}
function lchToLin(L,C,h){
 const a=C*Math.cos(h*Math.PI/180),b=C*Math.sin(h*Math.PI/180);
 const l=Math.pow(L+0.3963377774*a+0.2158037573*b,3),m=Math.pow(L-0.1055613458*a-0.0638541728*b,3),q=Math.pow(L-0.0894841775*a-1.2914855480*b,3);
 return [4.0767416621*l-3.3077115913*m+0.2309699292*q,-1.2684380046*l+2.6097574011*m-0.3413193965*q,-0.0041960863*l-0.7034186147*m+1.7076147010*q];
}
function rgb(L,C,h){L=clamp(L,0,1);let c=Math.max(C,0),v=lchToLin(L,c,h);
 while(c>0&&v.some(x=>x<-1e-4||x>1+1e-4)){c=Math.max(0,c-0.004);v=lchToLin(L,c,h);}
 return v.map(x=>Math.round(clamp(toGam(clamp(x,0,1)),0,1)*255));}
function hex(L,C,h){return '#'+rgb(L,C,h).map(x=>x.toString(16).padStart(2,'0')).join('');}
function rgba(L,C,h,a){return 'rgba('+rgb(L,C,h).join(',')+','+a+')';}
function avoid(h,ah){const d=((h-ah+540)%360)-180;return Math.abs(d)<30?(ah+(d>=0?1:-1)*36+360)%360:h;}
const SIG={ok:[178,.1,'--jade',.82],warn:[48,.17,'--ember',.75],bad:[12,.19,'--oxide',.69],pre:[292,.12,'--iris',.77]};
function gen(day,hc,c){
 const A=hexToOklch(c.acc),T=c.tint?hexToOklch(c.tint):null;
 const hn=T?T.h:(A.h+180)%360,cn=(T?clamp(T.C,.006,.04):.016)*(day?.75:1);
 const N=day?(hc?{bg:.965,grid:.915,panel:1,panel2:.975,hov:.945,ln:0,ln2:.63,txt:0,dim:.28,faint:.45}:{bg:.925,grid:.885,panel:.99,panel2:.955,hov:.93,ln:.13,ln2:.79,txt:.13,dim:.43,faint:.59})
             :(hc?{bg:.1,grid:.175,panel:.13,panel2:.16,hov:.225,ln:.9,ln2:.47,txt:1,dim:.9,faint:.76}:{bg:.155,grid:.205,panel:.18,panel2:.205,hov:.24,ln:.68,ln2:.335,txt:.95,dim:.77,faint:.585});
 const t={};
 ['bg','grid','panel','panel2','hov'].forEach(k=>t['--'+k]=hex(N[k],cn,hn));
 ['ln','ln2','dim','faint'].forEach(k=>t['--'+k]=hex(N[k],cn*.8,hn));
 t['--txt']=day?hex(N.txt,cn*.5,hn):hex(N.txt,hc?0:.014,A.h);
 const fc=A.C*(hc?1.06:1),fl=day?clamp(A.L,.66,.82):clamp(A.L,.7,.88)+(hc?.03:0);
 const tl=day?(hc?.4:.5):Math.min(.95,Math.max(fl,.8)+(hc?.05:0)),tc=day?Math.min(fc,.15):fc*.95;
 t['--brass']=hex(fl,fc,A.h);t['--brass-txt']=hex(tl,tc,A.h);
 t['--pc']=day?hex(fl-.05,fc,A.h):t['--brass'];
 t['--on-brass']=fl>.6?hex(.16,.02,A.h):'#ffffff';
 t['--orb']=day?rgba(tl,tc,A.h,hc?.72:.46):rgba(fl,fc,A.h,hc?.75:.5);
 t['--orbf']=day?rgba(tl,tc,A.h,hc?.34:.2):rgba(fl,fc,A.h,hc?.38:.2);
 t['--flash']=rgba(fl,fc,A.h,day?.16:(hc?.18:.13));
 t['--planet-hi']=hex(.93,.07,A.h);t['--planet-lo']=hex(day?.46:.33,.07,A.h);
 t['--bar']=day?t['--ln']:hex(hc?1:.92,.004,hn);
 for(const k in SIG){const[dh,dc,v,nl]=SIG[k],O=c[k]?hexToOklch(c[k]):null,SL=day?(hc?.37:.48):nl+(hc?.07:0);
  const h=O?O.h:avoid(dh,A.h),C=O?clamp(O.C,.04,.2):dc;
  t[v]=hex(SL,C,h);if(k==='ok')t['--orb2']=rgba(SL,C,h,hc?.62:.4);}
 t._tint=hex(.6,Math.max(cn,.05),hn);
 return t;
}
function block(t){return Object.keys(t).filter(k=>k[0]==='-').map(k=>k+':'+t[k]).join(';');}
