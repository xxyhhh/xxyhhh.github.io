import { PHOTO_SIZES } from './sizes.mjs'
import { createIdPhotoState } from './state.mjs'
import { refineAlphaMask } from './mask-refinement.mjs'
import { stepForPhase } from './progress.mjs'

const state = createIdPhotoState()
const file = document.querySelector('#photo')
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
const size = document.querySelector('#size')
const zoom = document.querySelector('#zoom')
const status = document.querySelector('#status')
const download = document.querySelector('#download')
const cutout = document.querySelector('#cutout')
const steps = [...document.querySelectorAll('.step')]
let image = null
let objectUrl = ''
let background = '#ffffff'
let subjectCanvas = null
let segmenter = null
let segmenterPromise = null

ToolkitI18n.registerTranslations({ 'zh-CN': { 'id.settings':'证件照设置','id.upload':'点击选择 JPG、PNG 或 WebP 照片（最大 10MB）','id.size':'照片尺寸','id.zoom':'人物缩放','id.background':'背景颜色','id.cutout':'智能抠图','id.clear':'清空','id.private':'照片只在当前页面内存中处理','id.preview':'预览与构图','id.download':'下载证件照' }, en: { 'id.settings':'ID photo settings','id.upload':'Choose a JPG, PNG or WebP photo (10 MB max)','id.size':'Photo size','id.zoom':'Subject zoom','id.background':'Background','id.cutout':'Smart cutout','id.clear':'Clear','id.private':'Your photo is processed only in this page memory','id.preview':'Preview & composition','id.download':'Download ID photo' } })
ToolkitI18n.translatePage()

function renderProgress(){const current=stepForPhase(state.phase);steps.forEach((step,index)=>{step.classList.toggle('active',index===current);step.classList.toggle('done',index<current);if(index===current)step.setAttribute('aria-current','step');else step.removeAttribute('aria-current')})}

function renderSizes(){const en=ToolkitI18n.getLanguage()==='en';size.innerHTML=PHOTO_SIZES.map(s=>`<option value="${s.id}">${en?s.en:s.zh} · ${s.width}×${s.height}px</option>`).join('')}
function selected(){return PHOTO_SIZES.find(s=>s.id===size.value)||PHOTO_SIZES[0]}
function drawSource(target=canvas){const c=target.getContext('2d'),s=selected();target.width=s.width;target.height=s.height;c.clearRect(0,0,s.width,s.height);if(!image)return;const z=Number(zoom.value),scale=Math.max(s.width/image.naturalWidth,s.height/image.naturalHeight)*z,w=image.naturalWidth*scale,h=image.naturalHeight*scale;c.drawImage(image,(s.width-w)/2,(s.height-h)/2,w,h)}
function draw(){const source=document.createElement('canvas');drawSource(source);canvas.width=source.width;canvas.height=source.height;ctx.clearRect(0,0,canvas.width,canvas.height);if(!image)return;if(subjectCanvas){ctx.fillStyle=background;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(subjectCanvas,0,0,canvas.width,canvas.height)}else ctx.drawImage(source,0,0)}
function invalidateMask(){if(subjectCanvas){subjectCanvas.width=subjectCanvas.height=0;subjectCanvas=null;state.phase='ready'}draw();renderProgress()}

async function loadSegmenter(){
  if(segmenter)return segmenter
  if(segmenterPromise)return segmenterPromise
  segmenterPromise=new Promise((resolve,reject)=>{
    const base=new URL('../../assets/vendor/mediapipe/',import.meta.url).href
    const script=document.createElement('script')
    script.src=base+'selfie_segmentation.js'
    script.onload=()=>{try{segmenter=new SelfieSegmentation({locateFile:name=>base+name});segmenter.setOptions({modelSelection:0});resolve(segmenter)}catch(error){reject(error)}}
    script.onerror=()=>reject(new Error('MODEL_SCRIPT_FAILED'))
    document.head.append(script)
  })
  return segmenterPromise
}

file.onchange=()=>{const f=file.files[0];if(!f)return;if(f.size>10*1024*1024){status.textContent='图片不能超过 10MB';return}if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=URL.createObjectURL(f);image=new Image();image.onload=()=>{state.setImage(f);download.disabled=false;invalidateMask()};image.onerror=clear;image.src=objectUrl}
size.onchange=invalidateMask
zoom.oninput=invalidateMask
renderSizes()
document.addEventListener('toolkit:languagechange',renderSizes)

for(const color of['#ffffff','#438edb','#d92d20','#000000']){const button=document.createElement('button');button.type='button';button.className='color'+(color===background?' active':'');button.style.background=color;button.ariaLabel=color;button.onclick=()=>{background=color;document.querySelectorAll('.color').forEach(x=>x.classList.remove('active'));button.classList.add('active');draw()};document.querySelector('#colors').append(button)}

function clear(){if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl='';image=null;file.value='';if(subjectCanvas){subjectCanvas.width=subjectCanvas.height=0;subjectCanvas=null}state.clear();download.disabled=true;ctx.clearRect(0,0,canvas.width,canvas.height);status.textContent=ToolkitI18n.translate('id.private');renderProgress()}
document.querySelector('#clear').onclick=clear

cutout.onclick=async()=>{
  if(!state.requestCutout()){status.textContent=ToolkitI18n.getLanguage()==='en'?'Choose a photo first':'请先选择照片';return}
  renderProgress()
  status.textContent=ToolkitI18n.getLanguage()==='en'?'Loading local portrait model…':'正在加载本地人像模型…'
  cutout.disabled=true
  try{
    const engine=await loadSegmenter()
    const source=document.createElement('canvas');drawSource(source)
    await new Promise(async(resolve,reject)=>{engine.onResults(results=>{try{const nextSubject=document.createElement('canvas');nextSubject.width=source.width;nextSubject.height=source.height;const subjectContext=nextSubject.getContext('2d',{willReadFrequently:true});subjectContext.clearRect(0,0,nextSubject.width,nextSubject.height);subjectContext.drawImage(results.segmentationMask,0,0,nextSubject.width,nextSubject.height);const maskPixels=subjectContext.getImageData(0,0,nextSubject.width,nextSubject.height);const alpha=new Uint8ClampedArray(nextSubject.width*nextSubject.height);for(let pixel=0;pixel<alpha.length;pixel++)alpha[pixel]=maskPixels.data[pixel*4+3];const refinedAlpha=refineAlphaMask(alpha,nextSubject.width,nextSubject.height);let transparentPixels=0;for(let pixel=0;pixel<refinedAlpha.length;pixel++){maskPixels.data[pixel*4]=255;maskPixels.data[pixel*4+1]=255;maskPixels.data[pixel*4+2]=255;maskPixels.data[pixel*4+3]=refinedAlpha[pixel];if(refinedAlpha[pixel]<245)transparentPixels++}if(transparentPixels<refinedAlpha.length*.005)throw new Error('INVALID_MASK');subjectContext.putImageData(maskPixels,0,0);subjectContext.globalCompositeOperation='source-in';subjectContext.drawImage(source,0,0);subjectContext.globalCompositeOperation='source-over';subjectCanvas=nextSubject;resolve()}catch(error){reject(error)}});try{await engine.send({image:source})}catch(error){reject(error)}})
    state.completeCutout();draw();renderProgress();status.textContent=ToolkitI18n.getLanguage()==='en'?'Cutout complete. Choose a background and download.':'抠图完成，可选择背景并下载。'
  }catch(error){state.failCutout();renderProgress();segmenterPromise=null;status.textContent=ToolkitI18n.getLanguage()==='en'?'Cutout unavailable. You can still export the original background.':'智能抠图暂不可用，仍可导出原背景照片。'}finally{cutout.disabled=false}
}

download.onclick=()=>canvas.toBlob(blob=>{const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='id-photo.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),0)},'image/png')
window.addEventListener('beforeunload',()=>{clear();segmenter?.close?.()})
draw()
renderProgress()
