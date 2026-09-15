import test from'node:test';import assert from'node:assert/strict';import{readFile}from'node:fs/promises';
const script=await readFile(new URL('../tools/id-photo/script.js',import.meta.url),'utf8'),html=await readFile(new URL('../tools/id-photo/index.html',import.meta.url),'utf8');
test('MediaPipe loads only after explicit smart cutout',()=>{assert.match(script,/cutout.*onclick[\s\S]*loadSegmenter/);assert.doesNotMatch(html,/selfie_segmentation\.js/)});
test('segmentation uses same-origin model locator and mask composition',()=>{assert.match(script,/assets\/vendor\/mediapipe/);assert.match(script,/locateFile/);assert.match(script,/segmentationMask/);assert.match(script,/source-in/)});
test('required ID backgrounds are present',()=>{for(const color of['#ffffff','#438edb','#d92d20','#000000'])assert.match(script,new RegExp(color,'i'))});
