import{t as p}from"./chunks/theme.CHkh1REu.js";import{R as o,ab as u,ac as l,ad as c,ae as f,af as d,ag as m,ah as h,ai as g,aj as A,ak as v,d as P,u as y,v as C,s as b,al as w,am as R,an as E,a0 as S}from"./chunks/framework.Btvayb31.js";function i(e){if(e.extends){const a=i(e.extends);return{...a,...e,async enhanceApp(t){a.enhanceApp&&await a.enhanceApp(t),e.enhanceApp&&await e.enhanceApp(t)}}}return e}const s=i(p),T=P({name:"VitePressApp",setup(){const{site:e,lang:a,dir:t}=y();return C(()=>{b(()=>{document.documentElement.lang=a.value,document.documentElement.dir=t.value})}),e.value.router.prefetchLinks&&w(),R(),E(),s.setup&&s.setup(),()=>S(s.Layout)}});async function j(){globalThis.__VITEPRESS__=!0;const e=_(),a=D();a.provide(l,e);const t=c(e.route);return a.provide(f,t),a.component("Content",d),a.component("ClientOnly",m),Object.defineProperties(a.config.globalProperties,{$frontmatter:{get(){return t.frontmatter.value}},$params:{get(){return t.page.value.params}}}),s.enhanceApp&&await s.enhanceApp({app:a,router:e,siteData:h}),{app:a,router:e,data:t}}function D(){return g(T)}function _(){let e=o,a;return A(t=>{let n=v(t),r=null;return n&&(e&&(a=n),(e||a===n)&&(n=n.replace(/\.js$/,".lean.js")),r=import(n)),o&&(e=!1),r},s.NotFound)}o&&j().then(({app:e,router:a,data:t})=>{a.go().then(()=>{u(a.route,t.site),e.mount("#app")})});export{j as createApp};
