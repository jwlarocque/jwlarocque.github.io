const n="card2022/desc/",_="card2022/img/",g=[{desc:"0_generate.html",img:"0_generate.png"},{desc:"1_outline_mask.html",img:"1_outline_mask.png"},{desc:"2_outline_paths.html",img:"2_outline_paths.png"},{desc:"3_smoothed_paths.html",img:"3_smoothed_paths.svg"},{desc:"4_shading.html",img:"0_generate.png"},{desc:"5_shading_quantize.html",img:"5_shading_quantize.png"},{desc:"6_shading_masks.html",img:"6_shading_masks.png"},{desc:"7_all_hatched.html",img:"7_all_hatched.svg"},{desc:"8_plotting.html",img:"8_plotting.svg"}],t={descPath:n,imgPath:_,items:g},c=!0,m=async({fetch:s,params:d})=>(t.items.forEach(async e=>{const a=await s(t.descPath+e.desc);e.descHtml=await a.text()}),{card2022Data:t}),i=Object.freeze(Object.defineProperty({__proto__:null,prerender:c,load:m},Symbol.toStringTag,{value:"Module"}));export{i as _,m as l,c as p};
