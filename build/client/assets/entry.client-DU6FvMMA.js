import{E as y,c as g,r as t,i as E,d as S,b as $,m as F,s as P,e as k,f as j,g as H,h as O,k as B,l as D,R as I,n as L,o as T,p as z,q as A,j as w,C as q}from"./emotion-element-5486c51c.browser.esm-aXdZ-i2G.js";import{C as N}from"./context-DCszVdUq.js";/**
 * @remix-run/react v2.11.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function W(d){if(!d)return null;let _=Object.entries(d),a={};for(let[o,e]of _)if(e&&e.__type==="RouteErrorResponse")a[o]=new y(e.status,e.statusText,e.data,e.internal===!0);else if(e&&e.__type==="Error"){if(e.__subType){let i=window[e.__subType];if(typeof i=="function")try{let l=new i(e.message);l.stack=e.stack,a[o]=l}catch{}}if(a[o]==null){let i=new Error(e.message);i.stack=e.stack,a[o]=i}}else a[o]=e;return a}/**
 * @remix-run/react v2.11.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let s,r,R=!1;let h,Q=new Promise(d=>{h=d}).catch(()=>{});function U(d){if(!r){let i=window.__remixContext.url,l=window.location.pathname;if(i!==l&&!window.__remixContext.isSpaMode){let u=`Initial URL (${i}) does not match URL at time of hydration (${l}), reloading page...`;return console.error(u),window.location.reload(),t.createElement(t.Fragment,null)}if(window.__remixContext.future.unstable_singleFetch){if(!s){let u=window.__remixContext.stream;E(u,"No stream found for single fetch decoding"),window.__remixContext.stream=void 0,s=S(u,window).then(m=>{window.__remixContext.state=m.value,s.value=!0}).catch(m=>{s.error=m})}if(s.error)throw s.error;if(!s.value)throw s}let M=$(window.__remixManifest.routes,window.__remixRouteModules,window.__remixContext.state,window.__remixContext.future,window.__remixContext.isSpaMode),n;if(!window.__remixContext.isSpaMode){n={...window.__remixContext.state,loaderData:{...window.__remixContext.state.loaderData}};let u=F(M,window.location,window.__remixContext.basename);if(u)for(let m of u){let c=m.route.id,f=window.__remixRouteModules[c],x=window.__remixManifest.routes[c];f&&P(x,f,window.__remixContext.isSpaMode)&&(f.HydrateFallback||!x.hasLoader)?n.loaderData[c]=void 0:x&&!x.hasLoader&&(n.loaderData[c]=null)}n&&n.errors&&(n.errors=W(n.errors))}r=k({routes:M,history:j(),basename:window.__remixContext.basename,future:{v7_normalizeFormMethod:!0,v7_fetcherPersist:window.__remixContext.future.v3_fetcherPersist,v7_partialHydration:!0,v7_prependBasename:!0,v7_relativeSplatPath:window.__remixContext.future.v3_relativeSplatPath,v7_skipActionErrorRevalidation:window.__remixContext.future.unstable_singleFetch===!0},hydrationData:n,mapRouteProperties:H,unstable_dataStrategy:window.__remixContext.future.unstable_singleFetch?O(window.__remixManifest,window.__remixRouteModules):void 0,unstable_patchRoutesOnNavigation:B(window.__remixManifest,window.__remixRouteModules,window.__remixContext.future,window.__remixContext.isSpaMode,window.__remixContext.basename)}),r.state.initialized&&(R=!0,r.initialize()),r.createRoutesForHMR=g,window.__remixRouter=r,h&&h(r)}let[_,a]=t.useState(void 0),[o,e]=t.useState(r.state.location);return t.useLayoutEffect(()=>{R||(R=!0,r.initialize())},[]),t.useLayoutEffect(()=>r.subscribe(i=>{i.location!==o&&e(i.location)}),[o]),D(r,window.__remixManifest,window.__remixRouteModules,window.__remixContext.future,window.__remixContext.isSpaMode),t.createElement(t.Fragment,null,t.createElement(I.Provider,{value:{manifest:window.__remixManifest,routeModules:window.__remixRouteModules,future:window.__remixContext.future,criticalCss:_,isSpaMode:window.__remixContext.isSpaMode}},t.createElement(L,{location:o},t.createElement(T,{router:r,fallbackElement:null,future:{v7_startTransition:!0}}))),window.__remixContext.future.unstable_singleFetch?t.createElement(t.Fragment,null):null)}var v,p=z;p.createRoot,v=p.hydrateRoot;const V=b();function b(){return A({key:"cha"})}function G({children:d}){const[_,a]=t.useState(V);function o(){a(b())}return w.jsx(N.Provider,{value:{reset:o},children:w.jsx(q,{value:_,children:d})})}const C=()=>t.startTransition(()=>{v(document,w.jsx(G,{children:w.jsx(t.StrictMode,{children:w.jsx(U,{})})}))});window.requestIdleCallback?window.requestIdleCallback(C):setTimeout(C,1);
