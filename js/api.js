// ===== API 封装层（单机版：无后端，全部本地空跳过）=====
// 这个版本不连任何服务器：排行榜 / 遗言 / 在线人数 / 云存档等"社交统计"功能自动留空，
// 而核心剧情、选择、谜题、结局、本地存档照常运行。
// 直接返回 null（而不是真的发请求）是因为游戏每个调用点本就写了 null 兜底，
// 这样既没有网络等待/报错，也不会触发跨域，页面打开即玩。
const API_BASE = '';

async function apiPost(_path, _body) {
    return null;
}

async function apiGet(_path) {
    return null;
}

export { apiPost, apiGet, API_BASE };
