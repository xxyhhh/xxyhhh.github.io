import test from'node:test';import assert from'node:assert/strict';import{mmToPixels,PHOTO_SIZES}from'../tools/id-photo/sizes.mjs';import{createIdPhotoState}from'../tools/id-photo/state.mjs';
test('25x35mm at 300dpi rounds to 295x413px',()=>assert.deepEqual(mmToPixels(25,35,300),{width:295,height:413}));
test('common photo presets are available',()=>{for(const id of['one-inch','two-inch','small-one-inch','small-two-inch'])assert.ok(PHOTO_SIZES.some(x=>x.id===id))});
test('model stays idle until explicit smart cutout',()=>{const s=createIdPhotoState();assert.equal(s.modelStatus,'idle');assert.equal(s.shouldLoadModel,false);s.setImage({name:'photo.jpg'});s.requestCutout();assert.equal(s.shouldLoadModel,true);assert.equal(s.modelStatus,'loading')});
test('clear returns to empty state without retained image',()=>{const s=createIdPhotoState();s.setImage({name:'photo.jpg'});s.clear();assert.equal(s.image,null);assert.equal(s.phase,'empty')});
