var s=Object.defineProperty;var u=Object.getOwnPropertyDescriptor;var c=Object.getOwnPropertyNames;var d=Object.prototype.hasOwnProperty;var e=(r,t)=>s(r,"name",{value:t,configurable:!0});var y=(r,t)=>{for(var o in t)s(r,o,{get:t[o],enumerable:!0})},i=(r,t,o,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of c(t))!d.call(r,n)&&n!==o&&s(r,n,{get:()=>t[n],enumerable:!(a=u(t,n))||a.enumerable});return r};var b=r=>i(s({},"__esModule",{value:!0}),r);var f={};y(f,{main:()=>C});module.exports=b(f);async function C(r){try{return{statusCode:200,body:{args:r}}}catch(t){return{statusCode:t?.status??500,body:{error:t}}}}e(C,"main");0&&(module.exports={main});
