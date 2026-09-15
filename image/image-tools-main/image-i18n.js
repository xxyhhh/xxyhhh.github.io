(() => {
  const messages = {
    'zh-CN': {
      title:'图片工具集',subtitle:'专业的在线图片处理工具',rotate:'旋转',flip:'翻转',convert:'格式转换',
      upload:'点击或拖放图片到此处',formats:'支持 JPG、PNG、WebP、GIF 格式',invalidType:'请上传 JPG、PNG、WebP 或 GIF 格式的图片',
      tooLarge:'图片大小不能超过 10MB',decodeFailed:'图片解码失败',chooseFormat:'选择输出格式',success:'格式转换成功！'
    },
    en: {
      title:'Image Tools',subtitle:'Private image processing in your browser',rotate:'Rotate',flip:'Flip',convert:'Convert format',
      upload:'Click or drop an image here',formats:'Supports JPG, PNG, WebP and GIF',invalidType:'Upload a JPG, PNG, WebP or GIF image',
      tooLarge:'The image must be 10 MB or smaller',decodeFailed:'The image could not be decoded',chooseFormat:'Choose an output format',success:'Format converted successfully!'
    }
  };
  let language = 'zh-CN';
  function apply(next) {
    language = next === 'en' ? 'en' : 'zh-CN';
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    document.title = language === 'en' ? 'Image Tools | Private browser utilities' : '图片工具集 | 专业的在线图片处理工具';
    document.querySelectorAll('[data-image-i18n]').forEach(element => {
      element.textContent = messages[language][element.dataset.imageI18n];
    });
  }
  window.ImageToolsI18n = { apply, t:key => messages[language][key] || key };
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.data?.type !== 'toolkit-language') return;
    apply(event.data.language);
  });
})();
