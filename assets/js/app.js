// 首页脚本：搜索 + 分类过滤 + 卡片渲染
const tools = [
  { id: 'image-tools', name: '图片工具集', desc: '本地旋转、水平翻转，并支持 JPG、PNG、WebP 格式转换与下载（最大 10MB）',
    category: '图像工具', tags: ['image','编辑','转换'], href: '/tools/image-tools/' },
  { id: 'cropper', name: '图片裁剪（Cropper）', desc: '基于 CropperJS 的最小裁剪工具',
    category: '图像工具', tags: ['crop','裁剪'], href: '/tools/cropper/' },
  { id: 'time-converter', name: '时间戳/时区转换器', desc: 'Unix ⇄ 日期，多时区&复制',
    category: '编码生成', tags: ['time','timestamp','timezone'], href: '/tools/time-converter/' },
  { id: 'text-tools', name: '文本整理工具', desc: '大小写、去重、排序、前后缀、分隔符互转',
    category: '编码生成', tags: ['text','format'], href: '/tools/text-tools/' },
  { id: 'codec', name: 'Base64/URL/UTF-8 编解码', desc: '字符串/文件 Base64、URL、UTF-8',
    category: '编码生成', tags: ['base64','url','utf8'], href: '/tools/codec/' },
  { id: 'data-convert', name: 'JSON/CSV/YAML 转换', desc: '相互转换、格式化/压缩',
    category: '编码生成', tags: ['json','csv','yaml'], href: '/tools/data-convert/' },
  { id: 'idgen', name: 'UUID/随机密码/Nonce 生成', desc: 'v4、v7，多字符集与长度',
    category: '编码生成', tags: ['uuid','nonce','password'], href: '/tools/idgen/' },
  { id: 'regex', name: '正则测试台', desc: '实时匹配、高亮、分组显示，支持标志位',
    category: '编码生成', tags: ['regex','re'], href: '/tools/regex/' },
  { id: 'cron', name: 'Cron 可视化', desc: '解析下次触发时间，人类可读说明',
    category: '编码生成', tags: ['cron','schedule'], href: '/tools/cron/' },
  { id: 'jwt', name: 'JWT 解码与校验', desc: '本地解析 Header/Payload，HS 校验（可选）',
    category: '编码生成', tags: ['jwt','token'], href: '/tools/jwt/' },
  { id: 'qrcode', name: '二维码生成器', desc: '基于 qrcodejs 的二维码生成',
    category: '编码生成', tags: ['qrcode','二维码'], href: '/tools/qrcode/' },
  { id: 'm3u8player', name: 'M3U8/HLS 播放器', desc: '基于腾讯云 TCPlayer 的在线播放器',
    category: '音视频', tags: ['video','hls'], href: '/tools/m3u8player/', status: 'maintenance' },
];

// 兼容 GitHub Pages 子路径：将 href 改为相对路径
function withBase(p) { return (window.__BASE_PATH__ || '') + p; }

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const searchInput = document.querySelector('#search');
  const chips = document.querySelectorAll('.chip');

  function render(list) {
    grid.innerHTML = list.map(t => {
      const isMaintenance = t.status === 'maintenance';
      return `
        <div class="card${isMaintenance ? ' maintenance' : ''}"${isMaintenance ? ' aria-disabled="true"' : ''}>
          <div class="tags">
            <span class="tag">${t.category}</span>
            ${isMaintenance ? '<span class="status-badge maintenance">维护中</span>' : ''}
          </div>
          <h3>${t.name}</h3>
          <p>${t.desc}</p>
          <div class="actions">
            ${isMaintenance
              ? '<button type="button" class="button disabled" disabled>暂不可用</button>'
              : `<a class="button primary" href="${withBase(t.href)}">进入工具</a>`}
          </div>
        </div>
      `;
    }).join('');
  }

  let state = { keyword: '', category: '全部' };

  function apply() {
    const kw = state.keyword.trim().toLowerCase();
    const list = tools.filter(t => {
      const okCat = state.category === '全部' || t.category === state.category;
      const text = (t.name + ' ' + t.desc + ' ' + t.tags.join(' ')).toLowerCase();
      const okKw = !kw || text.includes(kw);
      return okCat && okKw;
    });
    render(list);
  }

  // 绑定搜索
  searchInput?.addEventListener('input', (e) => {
    state.keyword = e.target.value || '';
    apply();
  });

  // 绑定分类
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.category = chip.dataset.value;
      apply();
    });
  });

  render(tools);
});

