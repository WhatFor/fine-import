import{r as u}from"./index-61bf1805.js";import"./_commonjsHelpers-de833af9.js";var _={exports:{}},n={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var f=u,y=Symbol.for("react.element"),x=Symbol.for("react.fragment"),v=Object.prototype.hasOwnProperty,E=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,O={key:!0,ref:!0,__self:!0,__source:!0};function d(o,e,p){var r,t={},a=null,c=null;p!==void 0&&(a=""+p),e.key!==void 0&&(a=""+e.key),e.ref!==void 0&&(c=e.ref);for(r in e)v.call(e,r)&&!O.hasOwnProperty(r)&&(t[r]=e[r]);if(o&&o.defaultProps)for(r in e=o.defaultProps,e)t[r]===void 0&&(t[r]=e[r]);return{$$typeof:y,type:o,key:a,ref:c,props:t,_owner:E.current}}n.Fragment=x;n.jsx=d;n.jsxs=d;_.exports=n;var S=_.exports;const g=S.jsxs,R=({name:o})=>g("div",{className:"bg-red-100",children:["Hey, ",o,"!"]}),j=R;try{src.displayName="src",src.__docgenInfo={description:"",displayName:"src",props:{name:{defaultValue:null,description:"",name:"name",required:!0,type:{name:"string"}}}}}catch{}const h={component:j,title:"Components/SayHello"},s={args:{name:"You"}};var l,m,i;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    name: "You"
  }
}`,...(i=(m=s.parameters)==null?void 0:m.docs)==null?void 0:i.source}}};const k=["Default"];export{s as Default,k as __namedExportsOrder,h as default};
//# sourceMappingURL=SayHello.stories-bb4f142e.js.map
