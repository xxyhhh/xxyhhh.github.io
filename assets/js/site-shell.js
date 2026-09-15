(function () {
  const config = window.ToolkitPage || {}
  const root = config.root || './'
  const tool = Boolean(config.tool)
  const header = document.querySelector('[data-site-header]')
  const footer = document.querySelector('[data-site-footer]')
  const splitTitle = String(config.title || '').split(' / ')
  const titleZh = config.titleZh || splitTitle[0] || ''
  const titleEn = config.titleEn || splitTitle.slice(1).join(' / ') || titleZh
  if (header) {
    header.className = tool ? 'tool-header' : 'site-header'
    header.innerHTML = tool
      ? `<a class="back" href="${root}index.html" data-i18n="back.home">&lt; 返回首页</a><span class="tool-title" data-tool-title></span><div class="tool-bar"><span class="local-badge" data-i18n="privacy.local">本地内存处理 · 数据不离设备</span><button class="language-toggle" type="button" data-language-toggle>中 / EN</button></div>`
      : `<div class="navbar container"><a class="brand" href="${root}index.html"><span class="brand-mark">&lt;/&gt;</span><span class="brand-copy"><span data-i18n="site.name">在线工具集</span><small data-i18n="site.subtitle">纯前端 · 本地优先</small></span></a><span class="local-badge" data-i18n="privacy.local">本地内存处理 · 数据不离设备</span><nav class="site-nav"><a class="nav-link" href="${root}index.html" data-i18n="nav.tools">全部工具</a><a class="nav-link" href="${root}about.html" data-i18n="nav.about">关于与隐私</a><a class="nav-link" href="https://github.com/xxyhhh/xxyhhh.github.io" target="_blank" rel="noreferrer" data-i18n="nav.github">GitHub 仓库</a><button class="language-toggle" type="button" data-language-toggle>中 / EN</button></nav></div>`
  }
  if (footer) footer.innerHTML = `<div class="footer-inner container"><span>© Online Toolkit · MIT Ready</span><span data-i18n="privacy.local">本地内存处理 · 数据不离设备</span></div>`
  function renderToolTitle() {
    const node = document.querySelector('[data-tool-title]')
    if (node) node.textContent = ToolkitI18n.getLanguage() === 'en' ? titleEn : titleZh
  }
  document.querySelectorAll('[data-language-toggle]').forEach(button => button.addEventListener('click', () => ToolkitI18n.toggleLanguage()))
  document.addEventListener('toolkit:languagechange', renderToolTitle)
  ToolkitI18n.translatePage()
  renderToolTitle()
})()
