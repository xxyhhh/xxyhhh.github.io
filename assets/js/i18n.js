(function () {
  const SUPPORTED_LANGUAGES = ['zh-CN', 'en']
  const STORAGE_KEY = 'toolkit-language'
  let currentLanguage = null
  const dictionaries = {
    'zh-CN': { 'site.name':'在线工具集','site.subtitle':'纯前端 · 本地优先','nav.tools':'全部工具','nav.about':'关于与隐私','nav.github':'GitHub 仓库','privacy.local':'本地内存处理 · 数据不离设备','back.home':'< 返回首页' },
    en: { 'site.name':'Online Toolkit','site.subtitle':'Client-side · Local-first','nav.tools':'All tools','nav.about':'About & privacy','nav.github':'GitHub repository','privacy.local':'Local memory only · Data stays on device','back.home':'< Back home' }
  }
  function normaliseLanguage(value) { return value === 'en' || String(value).toLowerCase().startsWith('en') ? 'en' : 'zh-CN' }
  function getLanguage() {
    if (currentLanguage) return currentLanguage
    let stored = null
    try { stored = localStorage.getItem(STORAGE_KEY) } catch {}
    currentLanguage = SUPPORTED_LANGUAGES.includes(stored) ? stored : normaliseLanguage(navigator.language)
    return currentLanguage
  }
  function translate(key, language = getLanguage()) { return dictionaries[language]?.[key] ?? dictionaries['zh-CN'][key] ?? key }
  function registerTranslations(bundle) { SUPPORTED_LANGUAGES.forEach(language => Object.assign(dictionaries[language], bundle[language] || {})) }
  function translatePage(language = getLanguage()) {
    currentLanguage = normaliseLanguage(language)
    document.documentElement.lang = currentLanguage
    document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = translate(node.dataset.i18n, currentLanguage) })
    document.querySelectorAll('[data-i18n-placeholder]').forEach(node => { node.placeholder = translate(node.dataset.i18nPlaceholder, currentLanguage) })
    document.querySelectorAll('[data-i18n-aria-label]').forEach(node => { node.setAttribute('aria-label', translate(node.dataset.i18nAriaLabel, currentLanguage)) })
    document.querySelectorAll('[data-i18n-title]').forEach(node => { node.title = translate(node.dataset.i18nTitle, currentLanguage) })
    document.querySelectorAll('[data-i18n-value]').forEach(node => { node.value = translate(node.dataset.i18nValue, currentLanguage) })
    document.dispatchEvent(new CustomEvent('toolkit:languagechange', { detail: { language: currentLanguage } }))
  }
  function setLanguage(language) {
    const next = SUPPORTED_LANGUAGES.includes(language) ? language : 'zh-CN'
    currentLanguage = next
    try { localStorage.setItem(STORAGE_KEY, next) } catch {}
    translatePage(next)
  }
  function toggleLanguage() { setLanguage(getLanguage() === 'zh-CN' ? 'en' : 'zh-CN') }
  window.ToolkitI18n = { SUPPORTED_LANGUAGES, getLanguage, setLanguage, toggleLanguage, translate, translatePage, registerTranslations }
})()
