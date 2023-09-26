function easeInSine(t){return 1-Math.cos(t*Math.PI/2)}function easeOutSine(t){return Math.sin(t*Math.PI/2)}function easeInOutSine(t){return-(Math.cos(Math.PI*t)-1)/2}function easeInQuad(t){return t*t}function easeOutBack(t){const e=1.70158;return 1+2.70158*Math.pow(t-1,3)+e*Math.pow(t-1,2)}function easeInOutCubic(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}function linear(t){return t}const timingFunctions={linear:linear,"ease-in":easeInSine,"ease-out":easeOutSine,"ease-in-out":easeInOutSine,easeInQuad:easeInQuad,easeOutBack:easeOutBack,easeInOutCubic:easeInOutCubic};function convertGradientString(t){const e=document.createElement("div");e.style.backgroundImage=t,e.style.display="none",document.body.appendChild(e);const n=window.getComputedStyle(e).backgroundImage;document.body.removeChild(e);const i=n.match(/(linear|repeating-linear|radial|repeating-radial)-gradient\((.*)\)/),r=i[1],a=i[2].split(/(?<=[a-z\)%]), /),o="radial"===r||"repeating-radial"===r;if("linear"===r||"repeating-linear"===r){const t=convertRotationToDegString(a[0]);t?a[0]=t:a.unshift("180deg")}else if(o){const t=convertRadialGradientShape(a[0]);t?a[0]=t:a.unshift("ellipse at 50% 50%")}return{string:`${r}-gradient(${a.map((t=>(/rgb/.test(t)&&!/rgba/.test(t)&&(t=(t=t.replace("rgb","rgba")).replace(")",", 1)")),t))).join(", ")})`,type:r}}function convertRotationToDegString(t){let e=t.match(/deg|turn|to /);if(!e)return!1;let n=t.split(e[0])[0];if("turn"===e&&(n=n.includes(".")?"0."+n.split(".")[1]:n,n=String(360*Number(n))),"to"===e){n={top:"0","right top":"10",right:"90","right bottom":"170",bottom:"180","left bottom":"190",left:"270","left top":"350"}[t.split(e)[1].trim()]}return`${n}deg`}function convertRadialGradientShape(t){const e=t[0]+t[1]==="at",n=t[0]+t[1]+t[2]==="rgb";if("circle"===t)return"circle at 50% 50%";if(n)return!1;const i=e?t.split("at "):t.split(" at ");e&&(i[0]="ellipse");let r="";if(1===i.length){const t=i[0].split(" "),e=t[0],n=t[1];r=parseFloat(e)?n?`${e} ${n} at 50% 50%`:`${e} ${e} at 50% 50%`:`${e} at 50% 50%`}else{const t=i[0];let e=i[1];const n=t.split(" "),a="circle"===n[0]||"ellipse"===n[0],o={top:"50% 0%","top center":"50% 0%","center top":"50% 0%","top right":"100% 0%","right top":"100% 0%",right:"100% 50%","right center":"100% 50%","center right":"100% 50%","bottom right":"100% 100%","right bottom":"100% 100%",bottom:"50% 100%","center bottom":"50% 100%","bottom center":"50% 100%","bottom left":"0% 100%","left bottom":"0% 100%",left:"0% 50%","left center":"0% 50%","center left":"0% 50%","top left":"0% 0%","left top":"0% 0%"};o[e]&&(e=o[e]);const l=e.split(" ").map((t=>("center"===t?t="50%":"left"===t||"top"===t?t="0%":"bottom"!==t&&"right"!==t||(t="100%"),t)));r=!n[1]&&a?`${n[0]} at ${l[0]} ${l[1]}`:n[1]?`${n[0]} ${n[1]} at ${l[0]} ${l[1]}`:`${n[0]} ${n[0]} at ${l[0]} ${l[1]}`}return console.log(r),r}function linearGradientStringToNestedArray(t,e){const n="linear"===e||"repeating-linear"===e,i="radial"===e||"repeating-radial"===e,r=new RegExp(`${e}-gradient\\((.*)\\)`),a=t.match(r)[1].split(/(?<=[a-z\)%]), /),o=[];for(let t=0;t<a.length;t++){const e=a[t],r=e.split(/(?<=[a-z\)]) /);if(0===t&&n)o.push(splitRotationStringToArr(e));else if(0===t&&i)o.push(splitRadialShapeStringToArr(e));else{let t=/rgba\(/,e=r[0];e=e.replace(t,""),e=e.replace(")","");const n=e.split(", "),i=r[1],a=i?[...n,i]:[...n];o.push(a)}}return o.unshift([`${e}-gradient`]),o}function splitRotationStringToArr(t){return[t.split("deg")[0],"deg"]}function splitRadialShapeStringToArr(t){return t.split(" ")}function formatStringFromArr(t){const e=t[0][0],n="linear-gradient"===e||"repeating-linear-gradient"===e,i="radial-gradient"===e||"repeating-radial-gradient"===e;let r=`${e}(`,a=t.length-1;for(let e=0;e<t.length;e++){const o=e,l=t[o];if(0!==o){if(1===o&&n)r+=l.join("");else if(1===o&&i)r+=l.join(" ");else{let t=`rgba(${l[0]}, ${l[1]}, ${l[2]}, ${l[3]})`;l[4]&&(t+=` ${l[4]}`),r+=t}o!==a&&(r+=",")}}return r+=")",r}function formatStepsFromJs(t,e){let n=[],i=window.getComputedStyle(e).backgroundImage;for(let e=0;e<t.length;e++){const r=t[e];if(0===e&&!r.duration)continue;const a=t[e-1],o=a?.value,l=r.value;"none"===i&&(i=l);let s={from:0===e?i:o,to:l,duration:r.duration,method:r.method};n.push(s)}return n}function checkForGradientAnimationCSS(t){const e=t.styleSheets;let n=[];for(let t=0;t<e.length;t++){const{href:i}=e[t],{origin:r}=window.location;if(i&&!i.includes(r))continue;const a=e[t].cssRules;for(let t=0;t<a.length;t++){let e,i;7===a[t].type&&a[t].name.includes("gradient-animation")&&(e=a[t],i=a[t].name,n.push({keyframeRuleName:i,keyframes:e}))}}return n}function formatKeyframeStrings(t,e){let n=[],i=0;for(let r in t){if(!(parseInt(r)>-1))break;{let a=/(linear|repeating-linear|radial|repeating-radial)-gradient\(.*\)/,o=t[r],l=o.cssText,s=o.keyText;0===i&&"0%"!==s&&n.push([e,"0%"]),n.push([l.match(a)[0],s])}i++}return n}function formatKeyframes(t,e,n){let i=[];e=secondsStringToMs(e);for(let r=0;r<t.length;r++){if(0===r)continue;const a=calculateDurationPerFrame(e,parseFloat(t[r][1]),parseFloat(t[r-1][1])),o=t[r-1][0],l=t[r][0];i.push({from:"none"===o?l:o,to:l,duration:a,method:n})}return i}function secondsStringToMs(t){return 1e3*parseFloat(t)}function calculateDurationPerFrame(t,e,n){const i=(e-n)/100;return Math.floor(t*i)}function checkForTransitions(t){}function initialiseCssOnLoad(t){const e=checkForGradientAnimationCSS(t);let n=[];for(let i=0;i<e.length;i++){const{keyframeRuleName:r,keyframes:a}=e[i],o=t.querySelector(`.${r}`);if(!o)continue;const l=window.getComputedStyle(o);let{animation:s,animationName:c,animationDuration:u,animationTimingFunction:d,animationIterationCount:f,backgroundImage:m,animationDelay:p,animationFillMode:g,animationDirection:h}=l,y=l.getPropertyValue("--animation-start-delay");if(s.split(", ")[1]&&(c=c.split(", ")[0],u=u.split(", ")[0],d=d.split(", ")[0],f=f.split(", ")[0]||null,p=p.split(", ")[0]||null,g=g.split(", ")[0]||null,h=h.split(", ")[0]||null),"gradient"!==c&&!c.includes("_gradient_"))continue;if(!a&&!parseFloat(u))continue;let S=formatKeyframes(formatKeyframeStrings(a,m),u,d);p=1e3*parseFloat(p);const b=y.includes("ms");y=parseFloat(y),b||(y*=1e3),n.push([o,S,f,p,y,g,h])}for(let t=0;t<n.length;t++){animate(n[t][0],n[t][1],{iterations:n[t][2],delay:n[t][3],startDelay:n[t][4],fill:n[t][5],direction:n[t][6]})}}function findDiffIndex(t,e){const n=t.length,i=[];for(let r=1;r<n;r++){const n=t[r],a=e[r];if(n[1])if(n.length<3){const t={};if(n[0]===a[0]!==(n[1]===a[1])){const e=/\D+/,o=parseFloat(n[1])>-1?1:0;t.index=r,t.subIndex=o,t.startValue=parseFloat(n[o]),t.endValue=parseFloat(a[o]),t.unit=n[1].match(e)[0],t.property=0===o?"rotation":"position",i.push(t)}}else{const t=(n.length<a.length?n:a).length;for(let e=0;e<t;e++){const t=n[e],o=a[e];if(!(t===o)){const n={},a=/[A-Za-z%]+/,l=a.test(t)?t.match(a)[0]:null;n.index=r,n.subIndex=e,n.startValue=parseFloat(t),n.endValue=parseFloat(o),n.unit=l,n.property=l?"position":"color",i.push(n)}}}}return i}function delayAnimation(t){return new Promise((e=>{setTimeout(e,t)}))}function reverseSteps(t){const e=[],n=t.toReversed();for(let t=0;t<n.length;t++){const i=n[t],{to:r,from:a}=i,o={...i};o.to=a,o.from=r,e.push(o)}return e}async function animate(t,e,n){let i;e[0].value&&(e=formatStepsFromJs(e,t)),e.forEach(((t,e)=>{const n=convertGradientString(t.from),r=convertGradientString(t.to);0===e&&(i=n.type),t.from=n.string,t.to=r.string}));const r=window.getComputedStyle(t).backgroundImage;let a=n?.iterations;a=a?"infinite"===a?1/0:parseInt(a):1;const o=n?.startDelay,l=n?.fill,s=n?.delay,c=n?.direction||"normal";let u=1;const d=e.length;let f=0;const m="normal"!==c?reverseSteps(e):null,p={normal:{0:e,1:e},reverse:{0:m,1:m},alternate:{0:m,1:e},"alternate-reverse":{0:e,1:m}};let g=u%2,h=p[c][g];o&&await delayAnimation(o);let y=performance.now();async function S(e){const n=e-y,r=h[f],o=linearGradientStringToNestedArray(r.from,i),l=linearGradientStringToNestedArray(r.to,i),{duration:m}=h[f];let b=timingFunctions[h[f].method];if(b||(b=timingFunctions.linear),n>=m){if(t.style.backgroundImage=formatStringFromArr(l),f++,f===d){if(f=0,u++,g=u%2,h=p[c][g],u>a)return void t.dispatchEvent(new Event("animationFinished"));s&&await delayAnimation(s)}y=performance.now()}const F=findDiffIndex(o,l);F.length&&F.forEach((e=>{const{index:i,subIndex:r,startValue:a,endValue:l,unit:s,property:c}=e,u=Math.min(n/m,1),d=a+(l-a)*b(u);"rotation"===c||"color"===c?o[i][r]=`${d}`:"position"===c&&(o[i][r]=`${d}${s}`),t.style.backgroundImage=formatStringFromArr(o)})),requestAnimationFrame(S)}return new Promise((e=>{t.addEventListener("animationFinished",(function n(){l||(t.style.backgroundImage=r),t.removeEventListener("animationFinished",n),e()})),requestAnimationFrame(S)}))}"undefined"!=typeof document&&initialiseCssOnLoad(document);export default animate;