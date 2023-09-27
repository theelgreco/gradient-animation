var t={d:(e,n)=>{for(var o in n)t.o(n,o)&&!t.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:n[o]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)},e={};t.d(e,{H:()=>X,Z:()=>at});var n=.1,o="function"==typeof Float32Array;function a(t,e){return 1-3*e+3*t}function i(t,e){return 3*e-6*t}function r(t){return 3*t}function s(t,e,n){return((a(e,n)*t+i(e,n))*t+r(e))*t}function u(t,e,n){return 3*a(e,n)*t*t+2*i(e,n)*t+r(e)}function l(t){return t}function c(t,e,a,i){if(!(0<=t&&t<=1&&0<=a&&a<=1))throw new Error("bezier x values must be in [0, 1] range");if(t===e&&a===i)return l;for(var r=o?new Float32Array(11):new Array(11),c=0;c<11;++c)r[c]=s(c*n,t,a);return function(o){return 0===o?0:1===o?1:s(function(e){for(var o=0,i=1;10!==i&&r[i]<=e;++i)o+=n;--i;var l=o+(e-r[i])/(r[i+1]-r[i])*n,c=u(l,t,a);return c>=.001?function(t,e,n,o){for(var a=0;a<4;++a){var i=u(e,n,o);if(0===i)return e;e-=(s(e,n,o)-t)/i}return e}(e,l,t,a):0===c?l:function(t,e,n,o,a){var i,r,u=0;do{(i=s(r=e+(n-e)/2,o,a)-t)>0?n=r:e=r}while(Math.abs(i)>1e-7&&++u<10);return r}(e,o,o+n,t,a)}(o),e,i)}}function f(t){return t}function p(t){return 1-Math.cos(t*Math.PI/2)}function d(t){return Math.sin(t*Math.PI/2)}function m(t){return-(Math.cos(Math.PI*t)-1)/2}function g(t){return t*t}function h(t){return 1-(1-t)*(1-t)}function b(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}function y(t){return t*t*t}function w(t){return 1-Math.pow(1-t,3)}function I(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}function v(t){return t*t*t*t}function M(t){return 1-Math.pow(1-t,4)}function $(t){return t<.5?8*t*t*t*t:1-Math.pow(-2*t+2,4)/2}function k(t){return t*t*t*t*t}function F(t){return 1-Math.pow(1-t,5)}function O(t){return t<.5?16*t*t*t*t*t:1-Math.pow(-2*t+2,5)/2}function P(t){return 0===t?0:Math.pow(2,10*t-10)}function x(t){return 1===t?1:1-Math.pow(2,-10*t)}function E(t){return 0===t?0:1===t?1:t<.5?Math.pow(2,20*t-10)/2:(2-Math.pow(2,-20*t+10))/2}function q(t){return 1-Math.sqrt(1-Math.pow(t,2))}function D(t){return sqrt(1-Math.pow(t-1,2))}function C(t){return t<.5?(1-Math.sqrt(1-Math.pow(2*t,2)))/2:(Math.sqrt(1-Math.pow(-2*t+2,2))+1)/2}function S(t){return 2.70158*t*t*t-1.70158*t*t}function z(t){return 1+2.70158*Math.pow(t-1,3)+1.70158*Math.pow(t-1,2)}function A(t){const e=2.5949095;return t<.5?Math.pow(2*t,2)*(7.189819*t-e)/2:(Math.pow(2*t-2,2)*((e+1)*(2*t-2)+e)+2)/2}function B(t){const e=2*Math.PI/3;return 0===t?0:1===t?1:-Math.pow(2,10*t-10)*Math.sin((10*t-10.75)*e)}function Q(t){const e=2*Math.PI/3;return 0===t?0:1===t?1:Math.pow(2,-10*t)*Math.sin((10*t-.75)*e)+1}function T(t){const e=2*Math.PI/4.5;return 0===t?0:1===t?1:t<.5?-Math.pow(2,20*t-10)*Math.sin((20*t-11.125)*e)/2:Math.pow(2,-20*t+10)*Math.sin((20*t-11.125)*e)/2+1}function V(t){return 1-j(1-t)}function j(t){const e=7.5625,n=2.75;return t<1/n?e*t*t:t<2/n?e*(t-=1.5/n)*t+.75:t<2.5/n?e*(t-=2.25/n)*t+.9375:e*(t-=2.625/n)*t+.984375}function R(t){return t<.5?(1-j(1-2*t))/2:(1+j(2*t-1))/2}const Z={linear:f,"cubic-bezier":c,cubicBezier:c,ease:f,easeInSine:p,easeOutSine:d,easeInOutSine:m,"ease-in":p,"ease-out":d,"ease-in-out":m,easeInQuad:g,easeOutQuad:h,easeInOutQuad:b,"ease-in-quad":g,"ease-out-quad":h,"ease-in-out-quad":b,easeInCubic:y,easeOutCubic:w,easeInOutCubic:I,"ease-in-cubic":y,"ease-out-cubic":w,"ease-in-out-cubic":I,easeInQuart:v,easeOutQuart:M,easeInOutQuart:$,"ease-in-quart":v,"ease-out-quart":M,"ease-in-out-quart":$,easeInQuint:k,easeOutQuint:F,easeInOutQuint:O,"ease-in-quint":k,"ease-out-quint":F,"ease-in-out-quint":O,easeInExpo:P,easeOutExpo:x,easeInOutExpo:E,"ease-in-expo":P,"ease-out-expo":x,"ease-in-out-expo":E,easeInCirc:q,easeOutCirc:D,easeInOutCirc:C,"ease-in-circ":q,"ease-out-circ":D,"ease-in-out-circ":C,easeInBack:S,easeOutBack:z,easeInOutBack:A,"ease-in-back":S,"ease-out-back":z,"ease-in-out-back":A,easeInElastic:B,easeOutElastic:Q,easeInOutElastic:T,"ease-in-elastic":B,"ease-out-elastic":Q,"ease-in-out-elastic":T,easeInBounce:V,easeOutBounce:j,easeInOutBounce:R,"ease-in-bounce":V,"ease-out-bounce":j,"ease-in-out-bounce":R};function L(t){const e=document.createElement("div");e.style.backgroundImage=t,e.style.display="none",document.body.appendChild(e);const n=window.getComputedStyle(e).backgroundImage;document.body.removeChild(e);const o=n.match(/(linear|repeating-linear|radial|repeating-radial)-gradient\((.*)\)/),a=o[1],i=o[2].split(/(?<=[a-z\)%]), /),r="radial"===a||"repeating-radial"===a;if("linear"===a||"repeating-linear"===a){const t=function(t){let e=t.match(/deg|turn|to /);if(!e)return!1;let n=t.split(e[0])[0];return"turn"===e&&(n=n.includes(".")?"0."+n.split(".")[1]:n,n=String(360*Number(n))),"to"===e&&(n={top:"0","right top":"10",right:"90","right bottom":"170",bottom:"180","left bottom":"190",left:"270","left top":"350"}[t.split(e)[1].trim()]),`${n}deg`}(i[0]);t?i[0]=t:i.unshift("180deg")}else if(r){const t=function(t){const e=t[0]+t[1]==="at",n=t[0]+t[1]+t[2]==="rgb";if("circle"===t)return"circle at 50% 50%";if(n)return!1;const o=e?t.split("at "):t.split(" at ");e&&(o[0]="ellipse");let a="";if(1===o.length){const t=o[0].split(" "),e=t[0],n=t[1];a=parseFloat(e)?n?`${e} ${n} at 50% 50%`:`${e} ${e} at 50% 50%`:`${e} at 50% 50%`}else{const t=o[0];let e=o[1];const n=t.split(" "),i="circle"===n[0]||"ellipse"===n[0],r={top:"50% 0%","top center":"50% 0%","center top":"50% 0%","top right":"100% 0%","right top":"100% 0%",right:"100% 50%","right center":"100% 50%","center right":"100% 50%","bottom right":"100% 100%","right bottom":"100% 100%",bottom:"50% 100%","center bottom":"50% 100%","bottom center":"50% 100%","bottom left":"0% 100%","left bottom":"0% 100%",left:"0% 50%","left center":"0% 50%","center left":"0% 50%","top left":"0% 0%","left top":"0% 0%"};r[e]&&(e=r[e]);const s=e.split(" ").map((t=>("center"===t?t="50%":"left"===t||"top"===t?t="0%":"bottom"!==t&&"right"!==t||(t="100%"),t)));a=!n[1]&&i?`${n[0]} at ${s[0]} ${s[1]}`:n[1]?`${n[0]} ${n[1]} at ${s[0]} ${s[1]}`:`${n[0]} ${n[0]} at ${s[0]} ${s[1]}`}return console.log(a),a}(i[0]);t?i[0]=t:i.unshift("ellipse at 50% 50%")}return{string:`${a}-gradient(${i.map((t=>(/rgb/.test(t)&&!/rgba/.test(t)&&(t=(t=t.replace("rgb","rgba")).replace(")",", 1)")),t))).join(", ")})`,type:a}}function N(t,e){const n="linear"===e||"repeating-linear"===e,o="radial"===e||"repeating-radial"===e,a=new RegExp(`${e}-gradient\\((.*)\\)`),i=t.match(a)[1].split(/(?<=[a-z\)%]), /),r=[];for(let t=0;t<i.length;t++){const e=i[t],a=e.split(/(?<=[a-z\)]) /);if(0===t&&n)r.push(H(e));else if(0===t&&o)r.push(_(e));else{let t=/rgba\(/,e=a[0];e=e.replace(t,""),e=e.replace(")","");const n=e.split(", "),o=a[1],i=o?[...n,o]:[...n];r.push(i)}}return r.unshift([`${e}-gradient`]),r}function H(t){return[t.split("deg")[0],"deg"]}function _(t){return t.split(" ")}function G(t){const e=t[0][0],n="linear-gradient"===e||"repeating-linear-gradient"===e,o="radial-gradient"===e||"repeating-radial-gradient"===e;let a=`${e}(`,i=t.length-1;for(let e=0;e<t.length;e++){const r=e,s=t[r];if(0!==r){if(1===r&&n)a+=s.join("");else if(1===r&&o)a+=s.join(" ");else{let t=`rgba(${s[0]}, ${s[1]}, ${s[2]}, ${s[3]})`;s[4]&&(t+=` ${s[4]}`),a+=t}r!==i&&(a+=",")}}return a+=")",a}function J(t){return new Promise((e=>{setTimeout(e,t)}))}let K=0,U={};function W(t){cancelAnimationFrame(U[t.dataset.animnum]),delete t.dataset.animnum,delete U[t.dataset.animnum]}async function X(t,e,n){let o;t.dataset.animnum||(t.dataset.animnum=K),K++,console.log(n),e[0].value&&(e=function(t,e){let n=[],o=window.getComputedStyle(e).backgroundImage;for(let e=0;e<t.length;e++){const a=t[e];if(0===e&&!a.duration)continue;const i=t[e-1],r=i?.value,s=a.value;"none"===o&&(o=s);let u={from:0===e?o:r,to:s,duration:a.duration,method:a.method};n.push(u)}return n}(e,t)),e.forEach(((t,e)=>{const n=L(t.from),a=L(t.to);0===e&&(o=n.type),t.from=n.string,t.to=a.string}));const a=window.getComputedStyle(t).backgroundImage;let i=n?.iterations;i=i?"infinite"===i?1/0:parseInt(i):1;const r=nt(n?.startDelay),s=n?.fill,u=nt(n?.delay),l=n?.direction||"normal";let c=1;const f=e.length;let p=0;const d="normal"!==l?function(t){const e=[],n=t.toReversed();for(let t=0;t<n.length;t++){const o=n[t],{to:a,from:i}=o,r={...o};r.to=i,r.from=a,e.push(r)}return e}(e):null,m={normal:{0:e,1:e},reverse:{0:d,1:d},alternate:{0:d,1:e},"alternate-reverse":{0:e,1:d}};let g=c%2,h=m[l][g];r&&await J(r);let b=performance.now();async function y(e){const n=e-b,a=h[p],r=N(a.from,o),s=N(a.to,o),{duration:d}=h[p];let w=h[p].method;if(console.log(w),console.log("hello"),w)if(w.includes("cubic-bezier")){const t=/(?<=\(|, )\d\.\d+|\d/g,e=[...w.matchAll(t)],n=e[0][0],o=e[1][0],a=e[2][0],i=e[3][0];w=Z["cubic-bezier"](n,o,a,i)}else w=Z[w];else w=Z.linear;if(n>=d){if(t.style.backgroundImage=G(s),p++,p===f){if(p=0,c++,g=c%2,h=m[l][g],c>i)return void t.dispatchEvent(new Event("animationFinished"));u&&await J(u)}b=performance.now()}const I=function(t,e){const n=t.length,o=[];for(let a=1;a<n;a++){const n=t[a],i=e[a];if(n[1])if(n.length<3){const t={};if(n[0]===i[0]!=(n[1]===i[1])){const e=/\D+/,r=parseFloat(n[1])>-1?1:0;t.index=a,t.subIndex=r,t.startValue=parseFloat(n[r]),t.endValue=parseFloat(i[r]),t.unit=n[1].match(e)[0],t.property=0===r?"rotation":"position",o.push(t)}}else{const t=(n.length<i.length?n:i).length;for(let e=0;e<t;e++){const t=n[e],r=i[e];if(t!==r){const n={},i=/[A-Za-z%]+/,s=i.test(t)?t.match(i)[0]:null;n.index=a,n.subIndex=e,n.startValue=parseFloat(t),n.endValue=parseFloat(r),n.unit=s,n.property=s?"position":"color",o.push(n)}}}}return o}(r,s);I.length&&I.forEach((e=>{const{index:o,subIndex:a,startValue:i,endValue:s,unit:u,property:l}=e,c=Math.min(n/d,1),f=i+(s-i)*w(c);"rotation"===l||"color"===l?r[o][a]=`${f}`:"position"===l&&(r[o][a]=`${f}${u}`),t.style.backgroundImage=G(r)})),U[t.dataset.animnum]=requestAnimationFrame(y)}return new Promise((e=>{t.addEventListener("animationFinished",(function n(){delete t.dataset.animnum,delete U[t.dataset.animnum],s||(t.style.backgroundImage=a),t.removeEventListener("animationFinished",n),e()})),U[t.dataset.animnum]=requestAnimationFrame(y)}))}function Y(t){const e={hover:["mouseenter","mouseleave"],focus:["focus","blur"],active:["mousedown","mouseup"]};for(const n in t){const o=document.querySelectorAll(n),{transitionProps:a,events:i}=t[n];let{transitionDuration:r,transitionBehavior:s,transitionDelay:u,transitionTimingFunction:l}=a;r=nt(r),o.forEach((t=>{const n=window.getComputedStyle(t).backgroundImage;for(let o=0;o<i.length;o++){const{event:a,backgroundImage:c}=i[o],f=e[a][0],p=e[a][1];let d=0,m=0;t.addEventListener(f,(e=>{e.stopPropagation(),e.preventDefault(),0===m&&(t.style.backgroundImage=n),m++;let o=n;const a=performance.now()-d;let i=r;a<r&&d&&(W(t),o=t.style.backgroundImage,i-=a),d=performance.now(),X(t,[{value:o},{value:c,duration:i,method:l}],{iterations:1,startDelay:u,fill:"forwards",direction:s})})),t.addEventListener(p,(e=>{e.stopPropagation(),e.preventDefault();const o=performance.now()-d;let a=r;o<r&&(W(t),a=o),d=performance.now();const i=[{value:t.style.backgroundImage},{value:n,duration:a,method:l}];X(t,i,{iterations:1,startDelay:u,fill:"forwards",direction:s})}))}}))}}function tt(t,e){let n=[],o=0;for(let a in t){if(!(parseInt(a)>-1))break;{let i=/(linear|repeating-linear|radial|repeating-radial)-gradient\(.*\)/,r=t[a],s=r.cssText,u=r.keyText;0===o&&"0%"!==u&&n.push([e,"0%"]),n.push([s.match(i)[0],u])}o++}return n}function et(t,e,n){let o=[];e=nt(e);for(let a=0;a<t.length;a++){if(0===a)continue;const i=ot(e,parseFloat(t[a][1]),parseFloat(t[a-1][1])),r=t[a-1][0],s=t[a][0];o.push({from:"none"===r?s:r,to:s,duration:i,method:n})}return o}function nt(t){return"string"!=typeof t?t:t.includes("ms")?parseFloat(t):1e3*parseFloat(t)}function ot(t,e,n){const o=(e-n)/100;return Math.floor(t*o)}"undefined"!=typeof document&&function(t){const e=function(t){const e=t.styleSheets,n=[],o={};for(let t=0;t<e.length;t++){const{href:a}=e[t],{origin:i}=window.location;if(a&&!a.includes(i))continue;const r=e[t].cssRules;for(let t=0;t<r.length;t++){const e=r[t],a=e.style,i=e.selectorText,s=1===e.type&&(i.includes(":hover")||i.includes(":focus")||i.includes(":active"));if(7===e.type&&e.name.includes("gradient-animation")){const t=e,o=e.name;n.push({keyframeRuleName:o,keyframes:t})}else if(1===e.type&&a.transitionProperty.includes("gradient")){const t=e.selectorText;let{transitionBehavior:n,transitionDelay:a,transitionDuration:i,transitionProperty:r,transitionTimingFunction:s}=e.style,u=e.style.getPropertyValue("--transition-custom-timing");u&&(s=u),o[t]={transitionProps:{transitionBehavior:n,transitionDelay:a,transitionDuration:i,transitionProperty:r,transitionTimingFunction:s},events:[]}}else if(s){const t=i.split(":"),e=t[0],n=t[1],{backgroundImage:r}=a;o[e]?.events.push({event:n,backgroundImage:r})}}}return Y(o),n}(t);let n=[];for(let o=0;o<e.length;o++){const{keyframeRuleName:a,keyframes:i}=e[o],r=t.querySelector(`.${a}`);if(!r)continue;const s=window.getComputedStyle(r);let{animation:u,animationName:l,animationDuration:c,animationTimingFunction:f,animationIterationCount:p,backgroundImage:d,animationDelay:m,animationFillMode:g,animationDirection:h}=s,b=s.getPropertyValue("--animation-start-delay"),y=s.getPropertyValue("--animation-custom-timing");y&&(f=y);let w=/(?<=[A-Za-z)]), /,I=/[A-Za-z], /;if(u.split(I)[1]&&(l=l.split(", ")[0],c=c.split(", ")[0],f=f.split(w)[0],p=p.split(", ")[0]||null,m=m.split(", ")[0]||null,g=g.split(", ")[0]||null,h=h.split(", ")[0]||null),"gradient"!==l&&!l.includes("_gradient_"))continue;if(!i&&!parseFloat(c))continue;let v=et(tt(i,d),c,f);m=1e3*parseFloat(m);const M=b.includes("ms");b=parseFloat(b),M||(b*=1e3),n.push([r,v,p,m,b,g,h])}for(let t=0;t<n.length;t++){const e=n[t][0],o=n[t][1],a=n[t][2],i=n[t][3],r=n[t][4],s=n[t][5],u=n[t][6];console.log(o),X(e,o,{iterations:a,delay:i,startDelay:r,fill:s,direction:u})}}(document);const at=X;var it=e.H,rt=e.Z;export{it as animateGradient,rt as default};