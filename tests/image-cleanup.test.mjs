import test from'node:test';import assert from'node:assert/strict';import{readFile}from'node:fs/promises';
const cleanup=await readFile(new URL('../assets/js/cleanup.js',import.meta.url),'utf8').catch(()=>''),cropper=await readFile(new URL('../tools/cropper/index.html',import.meta.url),'utf8'),image=await readFile(new URL('../image/image-tools-main/script.js',import.meta.url),'utf8');
test('cleanup revokes URLs and clears canvas buffers',()=>{assert.match(cleanup,/URL\.revokeObjectURL/);assert.match(cleanup,/canvas\.width\s*=\s*0/);assert.match(cleanup,/canvas\.height\s*=\s*0/)});
test('image pages release old object URLs',()=>{assert.match(cropper,/revokeObjectURL/);assert.match(image,/revokeObjectURL/);assert.doesNotMatch(image,/readAsDataURL/)});
