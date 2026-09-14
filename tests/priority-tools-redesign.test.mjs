import test from 'node:test';import assert from 'node:assert/strict';import{readFile}from'node:fs/promises';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const qr=await read('free-tools-collection/qrcodejs/index.html'),regex=await read('tools/regex/index.html'),data=await read('tools/data-convert/index.html');
test('QR defaults remain black on white',()=>{assert.match(qr,/value="#000000"/i);assert.match(qr,/value="#FFFFFF"/i)});
test('regex cheat sheet remains expanded',()=>assert.match(regex,/<details[^>]*class="cheat"[^>]*open/));
for(const [name,source]of[['regex',regex],['data',data]])test(`${name} uses shared bilingual shell`,()=>{assert.match(source,/assets\/js\/i18n\.js/);assert.match(source,/assets\/js\/site-shell\.js/);assert.match(source,/中 \/ EN|data-language-toggle/)});
test('priority tools contain no legacy blue accent',()=>assert.doesNotMatch(regex+data,/#3b82f6|#0a122c|#0f1a38/i));
