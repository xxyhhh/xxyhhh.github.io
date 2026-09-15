import test from 'node:test';import assert from'node:assert/strict';import{readFile}from'node:fs/promises';
const pages=['time-converter','text-tools','codec','idgen','cron','jwt'];
for(const page of pages)test(`${page} uses shared shell and bilingual control`,async()=>{const html=await readFile(new URL(`../tools/${page}/index.html`,import.meta.url),'utf8');assert.match(html,/assets\/js\/i18n\.js/);assert.match(html,/assets\/js\/site-shell\.js/);assert.match(html,/data-language-toggle|中 \/ EN/);assert.match(html,/data-site-header/)});
