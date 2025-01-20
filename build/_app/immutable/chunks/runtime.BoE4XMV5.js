var Cn=Array.isArray,Zt=Array.prototype.indexOf,Nn=Array.from,bn=Object.defineProperty,ct=Object.getOwnPropertyDescriptor,zt=Object.getOwnPropertyDescriptors,Pn=Object.prototype,Fn=Array.prototype,Jt=Object.getPrototypeOf;const qn=()=>{};function Ln(t){return t()}function Wt(t){for(var n=0;n<t.length;n++)t[n]()}const y=2,Et=4,j=8,at=16,g=32,B=64,K=128,O=256,$=512,h=1024,D=2048,P=4096,b=8192,F=16384,Xt=32768,yt=65536,Mn=1<<17,Qt=1<<19,wt=1<<20,vt=Symbol("$state"),Yn=Symbol("legacy props"),Hn=Symbol("");function Tt(t){return t===this.v}function tn(t,n){return t!=t?n==n:t!==n||t!==null&&typeof t=="object"||typeof t=="function"}function mt(t){return!tn(t,this.v)}function nn(t){throw new Error("https://svelte.dev/e/effect_in_teardown")}function rn(){throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function en(t){throw new Error("https://svelte.dev/e/effect_orphan")}function ln(){throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function jn(){throw new Error("https://svelte.dev/e/hydration_failed")}function Bn(t){throw new Error("https://svelte.dev/e/props_invalid_value")}function Un(){throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function Vn(){throw new Error("https://svelte.dev/e/state_prototype_fixed")}function sn(){throw new Error("https://svelte.dev/e/state_unsafe_local_read")}function an(){throw new Error("https://svelte.dev/e/state_unsafe_mutation")}let X=!1;function Gn(){X=!0}const Kn=1,$n=2,Zn=4,zn=8,Jn=16,Wn=1,Xn=2,Qn=4,tr=8,nr=16,rr=1,er=2,un="[",on="[!",fn="]",At={},lr=Symbol();function ut(t,n){var r={f:0,v:t,reactions:null,equals:Tt,rv:0,wv:0};return r}function sr(t){return _n(ut(t))}function ar(t,n=!1){var e;const r=ut(t);return n||(r.equals=mt),X&&_!==null&&_.l!==null&&((e=_.l).s??(e.s=[])).push(r),r}function _n(t){return u!==null&&u.f&y&&(m===null?gn([t]):m.push(t)),t}function ur(t,n){return u!==null&&Q()&&u.f&(y|at)&&(m===null||!m.includes(t))&&an(),cn(t,n)}function cn(t,n){return t.equals(n)||(t.v,t.v=n,t.wv=jt(),gt(t,D),Q()&&f!==null&&f.f&h&&!(f.f&(g|B))&&(A===null?Dn([t]):A.push(t))),n}function gt(t,n){var r=t.reactions;if(r!==null)for(var e=Q(),l=r.length,s=0;s<l;s++){var a=r[s],o=a.f;o&D||!e&&a===f||(T(a,n),o&(h|O)&&(o&y?gt(a,P):nt(a)))}}function Dt(t){console.warn("https://svelte.dev/e/hydration_mismatch")}function or(t){console.warn("https://svelte.dev/e/legacy_recursive_reactive_block")}let S=!1;function ir(t){S=t}let w;function L(t){if(t===null)throw Dt(),At;return w=t}function fr(){return L(k(w))}function _r(t){if(S){if(k(w)!==null)throw Dt(),At;w=t}}function cr(t=1){if(S){for(var n=t,r=w;n--;)r=k(r);w=r}}function vr(){for(var t=0,n=w;;){if(n.nodeType===8){var r=n.data;if(r===fn){if(t===0)return n;t-=1}else(r===un||r===on)&&(t+=1)}var e=k(n);n.remove(),n=e}}var pt,Rt,It;function pr(){if(pt===void 0){pt=window;var t=Element.prototype,n=Node.prototype;Rt=ct(n,"firstChild").get,It=ct(n,"nextSibling").get,t.__click=void 0,t.__className="",t.__attributes=null,t.__styles=null,t.__e=void 0,Text.prototype.__t=void 0}}function rt(t=""){return document.createTextNode(t)}function et(t){return Rt.call(t)}function k(t){return It.call(t)}function hr(t,n){if(!S)return et(t);var r=et(w);if(r===null)r=w.appendChild(rt());else if(n&&r.nodeType!==3){var e=rt();return r==null||r.before(e),L(e),e}return L(r),r}function dr(t,n){if(!S){var r=et(t);return r instanceof Comment&&r.data===""?k(r):r}return w}function Er(t,n=1,r=!1){let e=S?w:t;for(var l;n--;)l=e,e=k(e);if(!S)return e;var s=e==null?void 0:e.nodeType;if(r&&s!==3){var a=rt();return e===null?l==null||l.after(a):e.before(a),L(a),a}return L(e),e}function yr(t){t.textContent=""}function vn(t){var n=y|D;f===null?n|=O:f.f|=wt;var r=u!==null&&u.f&y?u:null;const e={children:null,ctx:_,deps:null,equals:Tt,f:n,fn:t,reactions:null,rv:0,v:null,wv:0,parent:r??f};return r!==null&&(r.children??(r.children=[])).push(e),e}function wr(t){const n=vn(t);return n.equals=mt,n}function St(t){var n=t.children;if(n!==null){t.children=null;for(var r=0;r<n.length;r+=1){var e=n[r];e.f&y?ot(e):x(e)}}}function pn(t){for(var n=t.parent;n!==null;){if(!(n.f&y))return n;n=n.parent}return null}function xt(t){var n,r=f;J(pn(t));try{St(t),n=Ut(t)}finally{J(r)}return n}function Ot(t){var n=xt(t),r=(I||t.f&O)&&t.deps!==null?P:h;T(t,r),t.equals(n)||(t.v=n,t.wv=jt())}function ot(t){St(t),H(t,0),T(t,F),t.v=t.children=t.deps=t.ctx=t.reactions=null}function kt(t){f===null&&u===null&&en(),u!==null&&u.f&O&&rn(),it&&nn()}function hn(t,n){var r=n.last;r===null?n.last=n.first=t:(r.next=t,t.prev=r,n.last=t)}function q(t,n,r,e=!0){var l=(t&B)!==0,s=f,a={ctx:_,deps:null,deriveds:null,nodes_start:null,nodes_end:null,f:t|D,first:null,fn:n,last:null,next:null,parent:l?null:s,prev:null,teardown:null,transitions:null,wv:0};if(r){var o=C;try{ht(!0),ft(a),a.f|=Xt}catch(v){throw x(a),v}finally{ht(o)}}else n!==null&&nt(a);var c=r&&a.deps===null&&a.first===null&&a.nodes_start===null&&a.teardown===null&&(a.f&(wt|K))===0;if(!c&&!l&&e&&(s!==null&&hn(a,s),u!==null&&u.f&y)){var p=u;(p.children??(p.children=[])).push(a)}return a}function Tr(t){const n=q(j,null,!1);return T(n,h),n.teardown=t,n}function mr(t){kt();var n=f!==null&&(f.f&g)!==0&&_!==null&&!_.m;if(n){var r=_;(r.e??(r.e=[])).push({fn:t,effect:f,reaction:u})}else{var e=Ct(t);return e}}function Ar(t){return kt(),dn(t)}function gr(t){const n=q(B,t,!0);return(r={})=>new Promise(e=>{r.outro?wn(n,()=>{x(n),e(void 0)}):(x(n),e(void 0))})}function Ct(t){return q(Et,t,!1)}function dn(t){return q(j,t,!0)}function Dr(t){return En(t)}function En(t,n=0){return q(j|at|n,t,!0)}function Rr(t,n=!0){return q(j|g,t,!0,n)}function Nt(t){var n=t.teardown;if(n!==null){const r=it,e=u;dt(!0),z(null);try{n.call(null)}finally{dt(r),z(e)}}}function bt(t){var n=t.deriveds;if(n!==null){t.deriveds=null;for(var r=0;r<n.length;r+=1)ot(n[r])}}function Pt(t,n=!1){var r=t.first;for(t.first=t.last=null;r!==null;){var e=r.next;x(r,n),r=e}}function yn(t){for(var n=t.first;n!==null;){var r=n.next;n.f&g||x(n),n=r}}function x(t,n=!0){var r=!1;if((n||t.f&Qt)&&t.nodes_start!==null){for(var e=t.nodes_start,l=t.nodes_end;e!==null;){var s=e===l?null:k(e);e.remove(),e=s}r=!0}Pt(t,n&&!r),bt(t),H(t,0),T(t,F);var a=t.transitions;if(a!==null)for(const c of a)c.stop();Nt(t);var o=t.parent;o!==null&&o.first!==null&&Ft(t),t.next=t.prev=t.teardown=t.ctx=t.deps=t.fn=t.nodes_start=t.nodes_end=null}function Ft(t){var n=t.parent,r=t.prev,e=t.next;r!==null&&(r.next=e),e!==null&&(e.prev=r),n!==null&&(n.first===t&&(n.first=e),n.last===t&&(n.last=r))}function wn(t,n){var r=[];qt(t,r,!0),Tn(r,()=>{x(t),n&&n()})}function Tn(t,n){var r=t.length;if(r>0){var e=()=>--r||n();for(var l of t)l.out(e)}else n()}function qt(t,n,r){if(!(t.f&b)){if(t.f^=b,t.transitions!==null)for(const a of t.transitions)(a.is_global||r)&&n.push(a);for(var e=t.first;e!==null;){var l=e.next,s=(e.f&yt)!==0||(e.f&g)!==0;qt(e,n,s?r:!1),e=l}}}function Ir(t){Lt(t,!0)}function Lt(t,n){if(t.f&b){t.f^=b,t.f&h||(t.f^=h),U(t)&&(T(t,D),nt(t));for(var r=t.first;r!==null;){var e=r.next,l=(r.f&yt)!==0||(r.f&g)!==0;Lt(r,l?n:!1),r=e}if(t.transitions!==null)for(const s of t.transitions)(s.is_global||n)&&s.in()}}let Z=!1,lt=[];function Mt(){Z=!1;const t=lt.slice();lt=[],Wt(t)}function Sr(t){Z||(Z=!0,queueMicrotask(Mt)),lt.push(t)}function mn(){Z&&Mt()}const Yt=0,An=1;let V=!1,G=Yt,M=!1,Y=null,C=!1,it=!1;function ht(t){C=t}function dt(t){it=t}let R=[],N=0;let u=null;function z(t){u=t}let f=null;function J(t){f=t}let m=null;function gn(t){m=t}let d=null,E=0,A=null;function Dn(t){A=t}let Ht=1,W=0,I=!1,_=null;function jt(){return++Ht}function Q(){return!X||_!==null&&_.l===null}function U(t){var p;var n=t.f;if(n&D)return!0;if(n&P){var r=t.deps,e=(n&O)!==0;if(r!==null){var l,s,a=(n&$)!==0,o=e&&f!==null&&!I,c=r.length;if(a||o){for(l=0;l<c;l++)s=r[l],(a||!((p=s==null?void 0:s.reactions)!=null&&p.includes(t)))&&(s.reactions??(s.reactions=[])).push(t);a&&(t.f^=$)}for(l=0;l<c;l++)if(s=r[l],U(s)&&Ot(s),s.wv>t.wv)return!0}(!e||f!==null&&!I)&&T(t,h)}return!1}function Rn(t,n){for(var r=n;r!==null;){if(r.f&K)try{r.fn(t);return}catch{r.f^=K}r=r.parent}throw V=!1,t}function In(t){return(t.f&F)===0&&(t.parent===null||(t.parent.f&K)===0)}function tt(t,n,r,e){if(V){if(r===null&&(V=!1),In(n))throw t;return}r!==null&&(V=!0);{Rn(t,n);return}}function Bt(t,n,r=0){var e=t.reactions;if(e!==null)for(var l=0;l<e.length;l++){var s=e[l];s.f&y?Bt(s,n,r+1):n===s&&(r===0?T(s,D):s.f&h&&T(s,P),nt(s))}}function Ut(t){var _t;var n=d,r=E,e=A,l=u,s=I,a=m,o=_,c=t.f;d=null,E=0,A=null,u=c&(g|B)?null:t,I=!C&&(c&O)!==0,m=null,_=t.ctx,W++;try{var p=(0,t.fn)(),v=t.deps;if(d!==null){var i;if(H(t,E),v!==null&&E>0)for(v.length=E+d.length,i=0;i<d.length;i++)v[E+i]=d[i];else t.deps=v=d;if(!I)for(i=E;i<v.length;i++)((_t=v[i]).reactions??(_t.reactions=[])).push(t)}else v!==null&&E<v.length&&(H(t,E),v.length=E);if(Q()&&A!==null&&!(t.f&(y|P|D)))for(i=0;i<A.length;i++)Bt(A[i],t);return l!==null&&W++,p}finally{d=n,E=r,A=e,u=l,I=s,m=a,_=o}}function Sn(t,n){let r=n.reactions;if(r!==null){var e=Zt.call(r,t);if(e!==-1){var l=r.length-1;l===0?r=n.reactions=null:(r[e]=r[l],r.pop())}}r===null&&n.f&y&&(d===null||!d.includes(n))&&(T(n,P),n.f&(O|$)||(n.f^=$),H(n,0))}function H(t,n){var r=t.deps;if(r!==null)for(var e=n;e<r.length;e++)Sn(t,r[e])}function ft(t){var n=t.f;if(!(n&F)){T(t,h);var r=f,e=_;f=t;try{n&at?yn(t):Pt(t),bt(t),Nt(t);var l=Ut(t);t.teardown=typeof l=="function"?l:null,t.wv=Ht;var s=t.deps,a}catch(o){tt(o,t,r,e||t.ctx)}finally{f=r}}}function Vt(){if(N>1e3){N=0;try{ln()}catch(t){if(Y!==null)tt(t,Y,null);else throw t}}N++}function Gt(t){var n=t.length;if(n!==0){Vt();var r=C;C=!0;try{for(var e=0;e<n;e++){var l=t[e];l.f&h||(l.f^=h);var s=[];Kt(l,s),xn(s)}}finally{C=r}}}function xn(t){var n=t.length;if(n!==0)for(var r=0;r<n;r++){var e=t[r];if(!(e.f&(F|b)))try{U(e)&&(ft(e),e.deps===null&&e.first===null&&e.nodes_start===null&&(e.teardown===null?Ft(e):e.fn=null))}catch(l){tt(l,e,null,e.ctx)}}}function On(){if(M=!1,N>1001)return;const t=R;R=[],Gt(t),M||(N=0,Y=null)}function nt(t){G===Yt&&(M||(M=!0,queueMicrotask(On))),Y=t;for(var n=t;n.parent!==null;){n=n.parent;var r=n.f;if(r&(B|g)){if(!(r&h))return;n.f^=h}}R.push(n)}function Kt(t,n){var r=t.first,e=[];t:for(;r!==null;){var l=r.f,s=(l&g)!==0,a=s&&(l&h)!==0,o=r.next;if(!a&&!(l&b))if(l&j){if(s)r.f^=h;else try{U(r)&&ft(r)}catch(i){tt(i,r,null,r.ctx)}var c=r.first;if(c!==null){r=c;continue}}else l&Et&&e.push(r);if(o===null){let i=r.parent;for(;i!==null;){if(t===i)break t;var p=i.next;if(p!==null){r=p;continue t}i=i.parent}}r=o}for(var v=0;v<e.length;v++)c=e[v],n.push(c),Kt(c,n)}function $t(t){var n=G,r=R;try{Vt();const l=[];G=An,R=l,M=!1,Gt(r);var e=t==null?void 0:t();return mn(),(R.length>0||l.length>0)&&$t(),N=0,Y=null,e}finally{G=n,R=r}}async function xr(){await Promise.resolve(),$t()}function Or(t){var v;var n=t.f,r=(n&y)!==0;if(r&&n&F){var e=xt(t);return ot(t),e}if(u!==null){m!==null&&m.includes(t)&&sn();var l=u.deps;t.rv<W&&(t.rv=W,d===null&&l!==null&&l[E]===t?E++:d===null?d=[t]:d.push(t))}else if(r&&t.deps===null)for(var s=t,a=s.parent,o=s;a!==null;)if(a.f&y){var c=a;o=c,a=c.parent}else{var p=a;(v=p.deriveds)!=null&&v.includes(o)||(p.deriveds??(p.deriveds=[])).push(o);break}return r&&(s=t,U(s)&&Ot(s)),t.v}function kr(t){const n=u;try{return u=null,t()}finally{u=n}}const kn=-7169;function T(t,n){t.f=t.f&kn|n}function Cr(t,n=!1,r){_={p:_,c:null,e:null,m:!1,s:t,x:null,l:null},X&&!n&&(_.l={s:null,u:null,r1:[],r2:ut(!1)})}function Nr(t){const n=_;if(n!==null){const a=n.e;if(a!==null){var r=f,e=u;n.e=null;try{for(var l=0;l<a.length;l++){var s=a[l];J(s.effect),z(s.reaction),Ct(s.fn)}}finally{J(r),z(e)}}_=n.p,n.m=!0}return{}}function br(t){if(!(typeof t!="object"||!t||t instanceof EventTarget)){if(vt in t)st(t);else if(!Array.isArray(t))for(let n in t){const r=t[n];typeof r=="object"&&r&&vt in r&&st(r)}}}function st(t,n=new Set){if(typeof t=="object"&&t!==null&&!(t instanceof EventTarget)&&!n.has(t)){n.add(t),t instanceof Date&&t.getTime();for(let e in t)try{st(t[e],n)}catch{}const r=Jt(t);if(r!==Object.prototype&&r!==Array.prototype&&r!==Map.prototype&&r!==Set.prototype&&r!==Date.prototype){const e=zt(r);for(let l in e){const s=e[l].get;if(s)try{s.call(t)}catch{}}}}}export{mt as $,yr as A,Nn as B,gr as C,rt as D,yt as E,f as F,z as G,un as H,J as I,u as J,Tr as K,bn as L,Cn as M,Pn as N,Fn as O,ut as P,Un as Q,ur as R,vt as S,ct as T,lr as U,Or as V,Vn as W,Jt as X,Bn as Y,Mn as Z,Qn as _,Rr as a,g as a0,B as a1,Wn as a2,Xn as a3,tr as a4,nr as a5,Yn as a6,vn as a7,wr as a8,ar as a9,$n as aA,qt as aB,Tn as aC,zn as aD,Jn as aE,Hn as aF,zt as aG,cr as aH,pt as aI,tn as aJ,$t as aa,Ar as ab,D as ac,or as ad,T as ae,P as af,rr as ag,er as ah,Wt as ai,Ln as aj,br as ak,Gn as al,Dr as am,Er as an,hr as ao,_r as ap,on as aq,vr as ar,Ir as as,wn as at,xr as au,sr as av,Zn as aw,b as ax,Kn as ay,cn as az,En as b,w as c,x as d,Ct as e,dr as f,Nr as g,S as h,_ as i,mr as j,pr as k,X as l,et as m,qn as n,k as o,Cr as p,Sr as q,dn as r,At as s,ir as t,kr as u,L as v,fr as w,fn as x,Dt as y,jn as z};
