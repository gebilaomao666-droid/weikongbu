// ===== 单机版 Service Worker（极简直通版）=====
// 作用：让浏览器把本站识别为"可安装的 App"，从而支持「添加到主屏幕 / 像 app 全屏启动」。
// 刻意不做任何缓存（网络直通），避免历史上微信/安卓内核缓存陈旧 UI 的坑。
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  // 网络直通：不缓存、不改写内容，纯粹满足"有 fetch 处理器"的可安装条件。
  e.respondWith(fetch(e.request).catch(() => new Response('', { status: 504 })));
});
