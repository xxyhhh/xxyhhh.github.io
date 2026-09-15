(() => {
  const pairs = [
    ['二维码生成器','QR Code Generator'],
    ['免费在线生成各种类型的二维码，支持文字、链接、WiFi、联系人等','Create text, link, Wi-Fi, contact and other QR codes for free'],
    ['文字/链接','Text / Link'],['WiFi网络','Wi-Fi'],['联系人','Contact'],['邮件','Email'],['短信','SMS'],
    ['输入文字或网址：','Enter text or a URL:'],['提示：','Tip:'],
    ['微信扫码对纯文本支持有限，无法直接预览，只能底部复制文本。','WeChat has limited plain-text preview support and may only offer a copy action.'],
    ['WiFi名称 (SSID)：','Wi-Fi name (SSID):'],['密码：','Password:'],['加密类型：','Security:'],['无密码','No password'],
    ['姓名：','Name:'],['电话号码：','Phone number:'],['邮箱：','Email:'],['公司：','Company:'],
    ['收件人邮箱：','Recipient email:'],['邮件主题：','Subject:'],['邮件内容：','Message:'],['短信内容：','Message:'],
    ['二维码设置','QR settings'],['尺寸：','Size:'],['容错级别：','Error correction:'],
    ['低 (7%)','Low (7%)'],['中 (15%)','Medium (15%)'],['高 (25%)','High (25%)'],['最高 (30%)','Highest (30%)'],
    ['容错级别说明：','Error correction guide:'],['低 (7%)：','Low (7%):'],['中 (15%)：','Medium (15%):'],['高 (25%)：','High (25%):'],['最高 (30%)：','Highest (30%):'],
    ['数据密度最高，但损坏后难以修复','Highest data density, but least damage tolerance'],['推荐设置，平衡了密度和容错能力','Recommended balance of density and resilience'],['适合打印或可能损坏的场景','Good for print or damage-prone use'],['容错能力最强，但二维码较大','Strongest resilience, with a denser QR code'],
    ['外观设置','Appearance'],['前景色：','Foreground:'],['背景色：','Background:'],
    ['默认黑白配色已是最佳扫描效果，如需个性化可调整颜色。','Black on white scans best; adjust colors only when needed.'],
    ['生成二维码','Generate QR code'],['清空','Clear'],['生成的二维码','Generated QR code'],['下载二维码','Download QR code'],
    ['使用说明','How to use'],['📱 手机支持说明','📱 Mobile compatibility'],['使用示例','Examples'],
    ['不同手机扫码软件的功能可能略有差异','Features vary between camera and scanner apps'],['WiFi二维码需要手机支持WiFi扫码功能','Wi-Fi QR codes require Wi-Fi scanning support'],['联系人二维码需要手机支持vCard格式','Contact QR codes require vCard support'],['建议使用256x256或更大尺寸以获得更好的扫描效果','Use 256 × 256 or larger for more reliable scanning'],
    ['网址链接（推荐）：','Website (recommended):'],['WiFi连接：','Wi-Fi:'],['网络名称：MyWiFi，密码：12345678','Network: MyWiFi, password: 12345678'],['姓名：张三，电话：13800138000','Name: Alex Zhang, phone: 13800138000'],['收件人：example@email.com，主题：问候','To: example@email.com, subject: Hello'],
    ['：输入任意文字或网址，生成的二维码扫描后可直接查看内容或访问链接',': Enter text or a URL to create a scannable code.'],
    ['：填写WiFi信息，扫描后可直接连接WiFi网络',': Enter network details so supported devices can connect after scanning.'],
    ['：填写联系人信息，扫描后可直接保存到手机通讯录',': Create a vCard that supported devices can save.'],
    ['：填写邮件信息，扫描后可直接打开邮件应用并填写收件人、主题和内容',': Open an email app with recipient, subject and message filled in.'],
    ['：填写短信信息，扫描后可直接打开短信应用并填写收件人和内容',': Open a messaging app with the phone number and message filled in.'],
    ['：默认黑白配色已是最佳扫描效果，彩色二维码可能影响识别率',': Black on white scans best; colored codes may reduce reliability.'],
    ['：中等级别(15%)适合大多数场景，高级别适合打印或可能损坏的二维码',': Medium (15%) suits most cases; higher levels are useful for print or possible damage.']
  ];
  const placeholders = [
    ['请输入要生成二维码的文字内容或网址链接...','Enter text or a URL...'],['请输入WiFi名称','Enter the Wi-Fi name'],['请输入WiFi密码','Enter the Wi-Fi password'],
    ['请输入联系人姓名','Enter a contact name'],['请输入电话号码','Enter a phone number'],['请输入邮箱地址','Enter an email address'],['请输入公司名称','Enter a company name'],
    ['请输入收件人邮箱','Enter the recipient email'],['请输入邮件主题','Enter the subject'],['请输入邮件内容','Enter the message'],['请输入短信内容','Enter the message']
  ];
  const longPairs = [
    ['文字/链接：输入任意文字或网址，生成的二维码扫描后可直接查看内容或访问链接','Text / Link: Enter text or a URL to create a scannable code.'],
    ['WiFi网络：填写WiFi信息，扫描后可直接连接WiFi网络','Wi-Fi: Enter network details so supported devices can connect after scanning.'],
    ['联系人：填写联系人信息，扫描后可直接保存到手机通讯录','Contact: Create a vCard that supported devices can save.'],
    ['邮件：填写邮件信息，扫描后可直接打开邮件应用并填写收件人、主题和内容','Email: Open an email app with recipient, subject and message filled in.'],
    ['短信：填写短信信息，扫描后可直接打开短信应用并填写收件人和内容','SMS: Open a messaging app with the phone number and message filled in.'],
    ['外观设置：默认黑白配色已是最佳扫描效果，彩色二维码可能影响识别率','Appearance: Black on white scans best; colored codes may reduce reliability.'],
    ['容错级别：中等级别(15%)适合大多数场景，高级别适合打印或可能损坏的二维码','Error correction: Medium (15%) suits most cases; higher levels are useful for print or possible damage.']
  ];
  let language = 'zh-CN';
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  function replaceText(root, from, to) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const value = normalize(node.nodeValue);
      const pair = [...pairs, ...longPairs].find(item => normalize(item[from]) === value);
      if (pair) node.nodeValue = node.nodeValue.replace(node.nodeValue.trim(), pair[to]);
    }
  }
  function apply(next) {
    const from = next === 'en' ? 0 : 1;
    const to = next === 'en' ? 1 : 0;
    replaceText(document.body, from, to);
    document.querySelectorAll('[placeholder]').forEach(element => {
      const pair = placeholders.find(item => item[from] === element.placeholder);
      if (pair) element.placeholder = pair[to];
    });
    language = next;
    document.documentElement.lang = next === 'en' ? 'en' : 'zh-CN';
    document.title = next === 'en' ? 'QR Code Generator' : '二维码生成器';
  }
  const messages = { 'qr.empty': { 'zh-CN':'请填写内容后再生成二维码！', en:'Enter some content before generating a QR code.' } };
  window.QrI18n = { apply, t:key => messages[key]?.[language] || key };
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.data?.type !== 'toolkit-language') return;
    apply(event.data.language === 'en' ? 'en' : 'zh-CN');
  });
})();
