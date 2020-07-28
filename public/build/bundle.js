var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function a(t){t.forEach(e)}function i(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function o(t){return null==t?"":t}function s(t,e){t.appendChild(e)}function l(t,e,n){t.insertBefore(e,n||null)}function c(t){t.parentNode.removeChild(t)}function h(t){return document.createElement(t)}function u(){return t=" ",document.createTextNode(t);var t}function p(t,e,n,a){return t.addEventListener(e,n,a),()=>t.removeEventListener(e,n,a)}function m(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}class d{constructor(t=null){this.a=t,this.e=this.n=null}m(t,e,n=null){this.e||(this.e=h(e.nodeName),this.t=e,this.h(t)),this.i(n)}h(t){this.e.innerHTML=t,this.n=Array.from(this.e.childNodes)}i(t){for(let e=0;e<this.n.length;e+=1)l(this.t,this.n[e],t)}p(t){this.d(),this.h(t),this.i(this.a)}d(){this.n.forEach(c)}}let f;function g(t){f=t}const b=[],v=[],w=[],y=[],k=Promise.resolve();let $=!1;function q(t){w.push(t)}let j=!1;const H=new Set;function x(){if(!j){j=!0;do{for(let t=0;t<b.length;t+=1){const e=b[t];g(e),G(e.$$)}for(b.length=0;v.length;)v.pop()();for(let t=0;t<w.length;t+=1){const e=w[t];H.has(e)||(H.add(e),e())}w.length=0}while(b.length);for(;y.length;)y.pop()();$=!1,j=!1,H.clear()}}function G(t){if(null!==t.fragment){t.update(),a(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(q)}}const L=new Set;let _;function z(t,e){t&&t.i&&(L.delete(t),t.i(e))}function E(t,e,n,a){if(t&&t.o){if(L.has(t))return;L.add(t),_.c.push(()=>{L.delete(t),a&&(n&&t.d(1),a())}),t.o(e)}}function P(t,n,r){const{fragment:o,on_mount:s,on_destroy:l,after_update:c}=t.$$;o&&o.m(n,r),q(()=>{const n=s.map(e).filter(i);l?l.push(...n):a(n),t.$$.on_mount=[]}),c.forEach(q)}function A(t,e){const n=t.$$;null!==n.fragment&&(a(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function S(t,e){-1===t.$$.dirty[0]&&(b.push(t),$||($=!0,k.then(x)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function M(e,i,r,o,s,l,h=[-1]){const u=f;g(e);const p=i.props||{},m=e.$$={fragment:null,ctx:null,props:l,update:t,not_equal:s,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:n(),dirty:h};let d=!1;if(m.ctx=r?r(e,p,(t,n,...a)=>{const i=a.length?a[0]:n;return m.ctx&&s(m.ctx[t],m.ctx[t]=i)&&(m.bound[t]&&m.bound[t](i),d&&S(e,t)),n}):[],m.update(),d=!0,a(m.before_update),m.fragment=!!o&&o(m.ctx),i.target){if(i.hydrate){const t=function(t){return Array.from(t.childNodes)}(i.target);m.fragment&&m.fragment.l(t),t.forEach(c)}else m.fragment&&m.fragment.c();i.intro&&z(e.$$.fragment),P(e,i.target,i.anchor),x()}g(u)}class C{$destroy(){A(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}function I(t){let e;return{c(){e=h("div"),m(e,"class","links")},m(n,a){l(n,e,a),e.innerHTML=t[1]},p(t,n){2&n&&(e.innerHTML=t[1])},d(t){t&&c(e)}}}function T(t){let e,n;return{c(){e=h("div"),m(e,"class",n=o(t[4]||t[5]?"desc visible":"desc")+" svelte-1trwls7")},m(n,a){l(n,e,a),e.innerHTML=t[3]},p(t,a){8&a&&(e.innerHTML=t[3]),48&a&&n!==(n=o(t[4]||t[5]?"desc visible":"desc")+" svelte-1trwls7")&&m(e,"class",n)},d(t){t&&c(e)}}}function B(e){let n,i,r,o,f,g,b,v,w,y,k=e[1]&&I(e),$=e[3]&&T(e);return{c(){n=h("main"),i=h("h3"),o=u(),k&&k.c(),f=u(),g=h("div"),v=u(),$&&$.c(),r=new d(o),b=new d(v),m(g,"class","img svelte-1trwls7"),m(n,"class","project svelte-1trwls7")},m(t,a){l(t,n,a),s(n,i),r.m(e[0],i),s(i,o),k&&k.m(i,null),s(n,f),s(n,g),b.m(e[2],g),s(g,v),$&&$.m(g,null),w||(y=[p(n,"click",e[6]),p(n,"mouseenter",e[7]),p(n,"mouseleave",e[8])],w=!0)},p(t,[e]){1&e&&r.p(t[0]),t[1]?k?k.p(t,e):(k=I(t),k.c(),k.m(i,null)):k&&(k.d(1),k=null),4&e&&b.p(t[2]),t[3]?$?$.p(t,e):($=T(t),$.c(),$.m(g,null)):$&&($.d(1),$=null)},i:t,o:t,d(t){t&&c(n),k&&k.d(),$&&$.d(),w=!1,a(y)}}}function N(t,e,n){let{title:a}=e,{links:i}=e,{img:r}=e,{desc:o}=e,s=!1,l=!1;return t.$set=t=>{"title"in t&&n(0,a=t.title),"links"in t&&n(1,i=t.links),"img"in t&&n(2,r=t.img),"desc"in t&&n(3,o=t.desc)},t.$$.update=()=>{2&t.$$.dirty&&console.log(i)},[a,i,r,o,s,l,()=>{n(4,s=!s),n(5,l=s)},()=>{n(5,l=!0)},()=>{n(5,l=!1)}]}class O extends C{constructor(t){super(),M(this,t,N,B,r,{title:0,links:1,img:2,desc:3})}}function D(t,e,n){const a=t.slice();return a[1]=e[n],a}function R(e){let n,a;return n=new O({props:{title:e[1].title,links:e[1].links,img:e[1].img,desc:e[1].desc}}),{c(){var t;(t=n.$$.fragment)&&t.c()},m(t,e){P(n,t,e),a=!0},p:t,i(t){a||(z(n.$$.fragment,t),a=!0)},o(t){E(n.$$.fragment,t),a=!1},d(t){A(n,t)}}}function F(t){let e,n,i,r,o,p,d,f=t[0],g=[];for(let e=0;e<f.length;e+=1)g[e]=R(D(t,f,e));const b=t=>E(g[t],1,1,()=>{g[t]=null});return{c(){e=h("main"),n=h("div"),n.innerHTML='<h1 class="current svelte-1ebcryz">John LaRocque</h1> \n\t\t<a href="https://github.com/jwlarocque" target="_blank" class="svelte-1ebcryz"><h1 class="svelte-1ebcryz">GitHub↗</h1></a> \n\t\t<a href="https://gitlab.com/jwlarocque" target="_blank" class="svelte-1ebcryz"><h1 class="svelte-1ebcryz">GitLab↗</h1></a> \n\t\t<a href="https://www.linkedin.com/in/jwlarocque/" target="_blank" class="svelte-1ebcryz"><h1 class="svelte-1ebcryz">LinkedIn↗</h1></a> \n\t\t<hr class="svelte-1ebcryz">',i=u(),r=h("div"),r.innerHTML='<div><p>Hi, my name is John.  I&#39;m a programmer, rock climber, and ravenous reader.  I&#39;ve just finished studying computer science at the University of Oklahoma!</p> \n\t\t\t<p>On this page you can find a few projects I&#39;ve created or contributed to.</p></div> \n\t\t<div><p>You can contact me via email: <a href="mailto:john@jwlarocque.com">john@jwlarocque.com</a></p></div>',o=u(),p=h("div");for(let t=0;t<g.length;t+=1)g[t].c();m(n,"id","horizontal-nav"),m(n,"class","svelte-1ebcryz"),m(r,"id","blurb"),m(r,"class","svelte-1ebcryz"),m(p,"id","project-list"),m(p,"class","svelte-1ebcryz")},m(t,a){l(t,e,a),s(e,n),s(e,i),s(e,r),s(e,o),s(e,p);for(let t=0;t<g.length;t+=1)g[t].m(p,null);d=!0},p(t,[e]){if(1&e){let n;for(f=t[0],n=0;n<f.length;n+=1){const a=D(t,f,n);g[n]?(g[n].p(a,e),z(g[n],1)):(g[n]=R(a),g[n].c(),z(g[n],1),g[n].m(p,null))}for(_={r:0,c:[],p:_},n=f.length;n<g.length;n+=1)b(n);_.r||a(_.c),_=_.p}},i(t){if(!d){for(let t=0;t<f.length;t+=1)z(g[t]);d=!0}},o(t){g=g.filter(Boolean);for(let t=0;t<g.length;t+=1)E(g[t]);d=!1},d(t){t&&c(e),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(g,t)}}}function J(t){return[[{title:'<a href="http://which.jwlarocque.com">Which?</a>',links:'<a href="http://which.jwlarocque.com"><img src="img/wysiwyg.svg" alt="Live" title="Live"></a><a href="https://github.com/jwlarocque/which"><img src="img/github.png" alt="GitHub" title="GitHub"></a>',img:'<img src="img/which_2.jpg" alt="Which New Question Page">',desc:'<p>My current project, a tiny voting/polling web app similar to <a href="https://www.strawpoll.me/">Straw Poll</a>, but with support for instant runoff as well as approval and plurality voting.  Still adding features and cleaning up, code quality is currently: <span class="code">gradually improving</span>.</p>\n\t\t\t\t   <p><a href="https://svelte.dev/">Svelte</a> frontend and PostgreSQL database connected by a Go server with from-scratch routing and session management.  Currently live on AWS EC2 + RDS!</p>\n\t\t\t\t   <p><a href="https://github.com/jwlarocque/which">GitHub</a>, <a href="http://which.jwlarocque.com">Live</a></p>'},{title:'<a href="https://gitlab.com/glatteis/earthwalker">Earthwalker</a>',links:'<a href="https://gitlab.com/glatteis/earthwalker"><img src="img/gitlab.svg" alt="GitLab" title="GitLab"></a><a href="https://gitlab.com/glatteis/earthwalker/-/merge_requests?scope=all&state=all&author_username=jwlarocque"><img src="img/merge.svg" alt="Contributions" title="Contributions"></a>',img:'<img src="img/earthwalker_example.png" alt="Earthwalker Example">',desc:'<p>An open source clone of <a href="https://www.geoguessr.com/">Geoguessr</a> with a Go backend, which adds some extra features and works around Google\'s pricey dynamic Streetview API.</p>\n\t\t\t\t   <p>I rewrote most of the application to loosen coupling between its components and better allow for future features.</p>\n\t\t\t\t   <p><a href="https://gitlab.com/glatteis/earthwalker">GitLab</a>, <a href="https://gitlab.com/glatteis/earthwalker/-/merge_requests?scope=all&state=all&author_username=jwlarocque">Contributions</a></p>'},{title:'<a href="https://github.com/jwlarocque/svelte-dragdroplist">Svelte-DragDropList</a>',links:'<a href="https://svelte.dev/repl/915db3b3ed704fddb7ddfb64bcbc2624?version=3.22.2"><img src="img/svelte.svg" alt="REPL" title="REPL"></a><a href="https://github.com/jwlarocque/svelte-dragdroplist"><img src="img/github.png" alt="GitHub" title="GitHub"></a>',img:'<video autoplay loop style="object-fit: contain;">\n\t\t\t\t\t  <source src="img/dragdroplist.mp4" type="video/mp4">\n\t\t\t\t  </video>',desc:'<p>Sortable lists in a Svelte 3 component.  Some features: bidirectional data binding, touch support, and buttons for accessibility.</p>\n\t\t\t\t   <p><a href="https://github.com/jwlarocque/svelte-dragdroplist">GitHub</a></p>'},{title:'<a href="https://hacklahoma.org/">Hacklahoma</a>',img:'<img src="img/hacklahoma19_centered.svg" alt="Hacklahoma Logo" style="background: #a9d9bc; object-fit: contain;">',desc:'<p>The first MLH hackathon in Oklahoma!</p>\n\t\t\t\t   <p>As ACM secretary (2018) and a member of the Hacklahoma advertising and media board, I\'m lucky to have been a part of the great student team that made this event happen. (I worked on the website (<a href="https://2019.hacklahoma.org/">2019</a>, <a href="https://2018.hacklahoma.org/">2018</a>) quite a bit, and some other stuff.)</p>\n\t\t\t\t   <p>Thanks to all our sponsors, mentors, and attendees for making Hacklahoma awesome.</p>'},{title:'<a href="https://github.com/draekris/Barrage/">Barrage</a>',links:'<a href="https://github.com/draekris/Barrage/"><img src="img/github.png" alt="GitHub" title="GitHub"></a>',img:'<img src="https://raw.githubusercontent.com/draekris/Barrage/master/examples/barrage-example.png" alt="Barrage Screenshot" style="object-fit: contain; background-color: rgba(0, 0, 0, 0.1)">',desc:'<p>An implementation of a minimal music player.</p>\n                   <p>Built on Electron, with howler.js for audio and additional packages to handle metadata.  I only spent a couple of days on this, so the code isn\'t exactly debugged, optimized, and documented.</p>\n\t\t\t\t   <p>Since this application does quite a bit of processing to create a real-time frequency visualization, I wouldn\'t recommend it for mobile devices, though it\'s not too heavy on desktop.</p>\n\t\t\t\t   <p>Design copied from renders by <a href="http://annemunition.tv/">AnneMunition</a>.  Example audio is "After midnight kiss" by <a href="https://bisoudelenfantsauvage.bandcamp.com/">Bisou de l\'enfant sauvage</a>.</p>\n\t\t\t\t   <p><a href="https://github.com/draekris/Barrage/">GitHub</a></p>'},{title:"Other Contributions",img:'<ul>\n\t\t\t\t\t  <li><a href="https://github.com/parker-codes/finite-state-microwave/issues?q=author%3Ajwlarocque">finite-state-microwave</a> (<a href="https://github.com/parker-codes/finite-state-microwave">GitHub</a>)</li>\n\t\t\t\t\t  <li><a href="https://github.com/notartom/ffreszoom/issues?utf8=%E2%9C%93&q=author%3Ajwlarocque">ffreszoom</a> (<a href="https://github.com/notartom/ffreszoom">GitHub</a>, <a href="https://addons.mozilla.org/en-US/firefox/addon/ffreszoom/">Firefox extension</a>)</li>\n\t\t\t\t\t  <li><a href="https://github.com/nose-devs/nose2/issues?utf8=%E2%9C%93&q=author%3Ajwlarocque">nose2</a> (<a href="https://github.com/nose-devs/nose2">GitHub</a>)</li>\n\t\t\t\t  </ul>',desc:!1},{title:'<a href="inversesquare.html">Attraction</a>',img:'<iframe src="inversesquarethumb.html" style="border: 0;"></iframe>',desc:'<p style="pointer-events: none;">This Javascript doodle was put together during my high school physics class, when I should have been studying.  It\'s an inverse square vector field with respect to the mouse position.  Faster than it used to be.</p>\n\t\t\t\t   <p style="pointer-events: none;">(Thanks to Chris for the idea!)</p>'},{title:'<a href="https://github.com/jwlarocque/Python-Python">Python Python</a>',links:'<a href="https://github.com/jwlarocque/Python-Python/"><img src="img/github.png" alt="GitHub" title="GitHub"></a>',img:'<img src="img/python-python.png" alt="Screenshot of Python Python">',desc:'<p>Play a quick game of snake from the comfort of your terminal!  Made in an attempt to convince a friend to stop playing Flash snake during English class and learn Python instead.</p>\n\t\t\t\t   <p><a href="https://github.com/jwlarocque/Python-Python">GitHub</a></p>'}]]}return new class extends C{constructor(t){super(),M(this,t,J,F,r,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
