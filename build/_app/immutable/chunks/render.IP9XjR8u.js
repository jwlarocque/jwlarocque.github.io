import{k as p,m as S,H as b,o as H,s as m,t as c,v as R,w as I,c as u,x as L,y as O,z as V,A as C,B as Y,C as k,D as M,a as P,p as $,h as w,F as j,g as z,i as B}from"./runtime.aC8ubUF_.js";import{a as F,r as A,h}from"./events.7lky384w.js";import{b as W}from"./disclose-version.Cro_FNzC.js";const q=["touchstart","touchmove"];function G(t){return q.includes(t)}function X(t,e){var r=e==null?"":typeof e=="object"?e+"":e;r!==(t.__t??(t.__t=t.nodeValue))&&(t.__t=r,t.nodeValue=r==null?"":r+"")}function J(t,e){return N(t,e)}function Z(t,e){p(),e.intro=e.intro??!1;const r=e.target,_=w,l=u;try{for(var a=S(r);a&&(a.nodeType!==8||a.data!==b);)a=H(a);if(!a)throw m;c(!0),R(a),I();const d=N(t,{...e,anchor:a});if(u===null||u.nodeType!==8||u.data!==L)throw O(),m;return c(!1),d}catch(d){if(d===m)return e.recover===!1&&V(),p(),C(r),c(!1),J(t,e);throw d}finally{c(_),R(l)}}const i=new Map;function N(t,{target:e,anchor:r,props:_={},events:l,context:a,intro:d=!0}){p();var v=new Set,y=o=>{for(var s=0;s<o.length;s++){var n=o[s];if(!v.has(n)){v.add(n);var f=G(n);e.addEventListener(n,h,{passive:f});var T=i.get(n);T===void 0?(document.addEventListener(n,h,{passive:f}),i.set(n,1)):i.set(n,T+1)}}};y(Y(F)),A.add(y);var g=void 0,D=k(()=>{var o=r??e.appendChild(M());return P(()=>{if(a){$({});var s=B;s.c=a}l&&(_.$$events=l),w&&W(o,null),g=t(o,_)||{},w&&(j.nodes_end=u),a&&z()}),()=>{var f;for(var s of v){e.removeEventListener(s,h);var n=i.get(s);--n===0?(document.removeEventListener(s,h),i.delete(s)):i.set(s,n)}A.delete(y),o!==r&&((f=o.parentNode)==null||f.removeChild(o))}});return E.set(g,D),g}let E=new WeakMap;function x(t,e){const r=E.get(t);return r?(E.delete(t),r(e)):Promise.resolve()}export{Z as h,J as m,X as s,x as u};
