const I18N = {
    zh: {
        startTitle: '《回魂煞》',
        startSubtitle: '一个无法关闭的短信...',
        startBtn: '开始游戏',
        loadBtn: '继续游戏',
        saveBtn: '💾 存档',
        endingBtn: '📖 结局',
        achievementBtn: '🏆 成就',
        shareBtn: '📸 分享',
        namePlaceholder: '输入你的名字（可选）',
        loading: '正在连接...',
        offlineMode: '【离线模式】',
        holdHint: '长按屏住呼吸',
        holdSuccess: '呼吸...',
        holdFail: '你动了...',
        deathBoard: '☠️ 死亡宣告板',
        totalDeaths: '总死亡人数',
        lastWordLabel: '留下你的遗言：',
        lastWordSubmit: '封存遗言',
        endingReport: '📋 灵异事件结案报告',
        survivalTime: '存活时间',
        fearScore: '恐惧指数',
        rank: '排名',
        restart: '再次踏入',
        saveMenuTitle: '💾 存档菜单',
        emptySlot: '空档位',
        saveAction: '保存',
        loadAction: '读取',
        endingBookTitle: '📖 结局收集册',
        achievementTitle: '🏆 成就',
        locked: '???',
        secretHint: '这是一个秘密成就。',
        unlocked: '已解锁',
        shareCardTitle: '📸 长按保存分享图',
        close: '关闭',
        easterEgg0333: '03:33 - 阴气最重之时。它醒着。',
        headphoneAlert: '⚠️ 警告：未检测到耳机/耳塞。\n为了最佳恐怖体验，建议佩戴耳机。\n（回魂煞是一个声音沉浸体验）',
        tabSwitchTitles: ['你要丢下我吗？','救救我...','它来了','别走','回头看'],
    },
    en: {
        startTitle: '《Soul Return》',
        startSubtitle: 'A text message that cannot be closed...',
        startBtn: 'Start Game',
        loadBtn: 'Continue',
        saveBtn: '💾 Save',
        endingBtn: '📖 Endings',
        achievementBtn: '🏆 Achievements',
        shareBtn: '📸 Share',
        namePlaceholder: 'Enter your name (optional)',
        loading: 'Connecting...',
        offlineMode: '[OFFLINE]',
        holdHint: 'Hold to hold breath',
        holdSuccess: 'Breathe...',
        holdFail: 'You moved...',
        deathBoard: '☠️ Death Board',
        totalDeaths: 'Total Deaths',
        lastWordLabel: 'Leave your last words:',
        lastWordSubmit: 'Seal Words',
        endingReport: '📋 Case Closed Report',
        survivalTime: 'Survival Time',
        fearScore: 'Fear Score',
        rank: 'Rank',
        restart: 'Enter Again',
        saveMenuTitle: '💾 Save Menu',
        emptySlot: 'Empty Slot',
        saveAction: 'Save',
        loadAction: 'Load',
        endingBookTitle: '📖 Ending Collection',
        achievementTitle: '🏆 Achievements',
        locked: '???',
        secretHint: 'This is a secret achievement.',
        unlocked: 'Unlocked',
        shareCardTitle: '📸 Long press to save',
        close: 'Close',
        easterEgg0333: '03:33 - The hour of greatest yin. It is awake.',
        headphoneAlert: '⚠️ Warning: No headphones detected.\nFor the best horror experience, please wear headphones.\n(Soul Return is an audio-immersive experience)',
        tabSwitchTitles: ['Are you leaving me?','Save me...','It is coming','Don\'t go','Look behind'],
    }
};

let currentLang = localStorage.getItem('hhs_lang') || 'zh';

function t(key) {
    const map = I18N[currentLang] || I18N.zh;
    return map[key] !== undefined ? map[key] : (I18N.zh[key] || key);
}

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('hhs_lang', lang);
}

function getLang() { return currentLang; }

export { t, setLang, getLang, I18N };
