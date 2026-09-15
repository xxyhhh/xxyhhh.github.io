import test from'node:test';import assert from'node:assert/strict';import{readFile,readdir}from'node:fs/promises';
const dirs=(await readdir(new URL('../tools/',import.meta.url),{withFileTypes:true})).filter(x=>x.isDirectory()).map(x=>x.name);const pages=await Promise.all(dirs.map(async d=>[d,await readFile(new URL(`../tools/${d}/index.html`,import.meta.url),'utf8')]));
test('production tool pages contain no Stitch or runtime CDN resources',()=>{for(const[d,h]of pages)assert.doesNotMatch(h,/stitch\.googleapis|cdn\.tailwindcss|fonts\.googleapis|cdn\.jsdelivr\.net/i,d)});
test('every tool exposes literal less-than back navigation and language control',()=>{for(const[d,h]of pages){assert.match(h,/&lt;|>\s*</,d);assert.match(h,/data-language-toggle|中 \/ EN/,d)}});
test('sitemap includes ID photo route',async()=>assert.match(await readFile(new URL('../sitemap.xml',import.meta.url),'utf8'),/tools\/id-photo\//));
