(function(){
const SUPPORTED_LANGUAGES=['zh-CN','en'],STORAGE_KEY='toolkit-language';
const dictionaries={'zh-CN':{'site.name':'在线工具集','site.subtitle':'纯前端 · 本地优先','nav.tools':'全部工具','nav.about':'关于与隐私','nav.github':'GitHub 仓库','privacy.local':'本地内存处理 · 数据不离设备','back.home':'< 返回首页'},en:{'site.name':'Online Toolkit','site.subtitle':'Client-side · Local-first','nav.tools':'All tools','nav.about':'About & privacy','nav.github':'GitHub repository','privacy.local':'Local memory only · Data stays on device','back.home':'< Back home'}};
function normaliseLanguage(v){return v==='en'||String(v).toLowerCase().startsWith('en')?'en':'zh-CN'}
function getLanguage(){let v=null;try{v=localStorage.getItem(STORAGE_KEY)}catch{}return SUPPORTED_LANGUAGES.includes(v)?v:normaliseLanguage(navigator.language)}
function translate(k,l=getLanguage()){return dictionaries[l]?.[k]??dictionaries['zh-CN'][k]??k}
function registerTranslations(b){SUPPORTED_LANGUAGES.forEach(l=>Object.assign(dictionaries[l],b[l]||{}))}
function translatePage(l=getLanguage()){document.documentElement.lang=l;document.querySelectorAll('[data-i18n]').forEach(n=>n.textContent=translate(n.dataset.i18n,l));document.querySelectorAll('[data-i18n-placeholder]').forEach(n=>n.placeholder=translate(n.dataset.i18nPlaceholder,l));document.querySelectorAll('[data-i18n-aria-label]').forEach(n=>n.setAttribute('aria-label',translate(n.dataset.i18nAriaLabel,l)));document.dispatchEvent(new CustomEvent('toolkit:languagechange',{detail:{language:l}}))}
function setLanguage(l){const next=SUPPORTED_LANGUAGES.includes(l)?l:'zh-CN';try{localStorage.setItem(STORAGE_KEY,next)}catch{}translatePage(next)}
function toggleLanguage(){setLanguage(getLanguage()==='zh-CN'?'en':'zh-CN')}
window.ToolkitI18n={SUPPORTED_LANGUAGES,getLanguage,setLanguage,toggleLanguage,translate,translatePage,registerTranslations};
})()
