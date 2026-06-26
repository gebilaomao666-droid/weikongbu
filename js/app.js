import { apiPost, apiGet } from './api.js?v=20260601-hotfix21';
import { initAudio, resumeAudio, playTone, playHeartbeat, playScream, playKnock, playWhisper, playTinnitus, startBgm, stopBgm, playSuonaPhrase, playJumpscareSfx } from './audio.js?v=20260601-hotfix21';
import { NODES, ITEMS, BPM_MAP, SFX_MAP, MESSAGES, EPITAPHS } from './nodes.js?v=20260601-hotfix21';
import { t, setLang, getLang } from './i18n.js?v=20260601-hotfix21';
import { gameRuntime } from './rpg/runtimeInstance.js?v=20260601-hotfix21';
import { getVisibleHotspots, resolveHotspot } from './rpg/sceneEngine.js?v=20260601-hotfix21';
import { CHAPTER_BACKGROUNDS, objectiveForNode, preloadImageList, sceneNameForChapter } from './rpg/assets.js?v=20260601-hotfix21';
import { KEYS, readJSON, writeJSON, readRaw, writeRaw, remove as removeKey } from './storage.js?v=20260601-hotfix21';
import { holdMixin } from './holdMixin.js?v=20260601-hotfix21';
import { sceneMixin } from './sceneMixin.js?v=20260601-hotfix21';
import { uiMixin } from './uiMixin.js?v=20260601-hotfix21';
import { smsMixin } from './smsMixin.js?v=20260601-hotfix21';
import { persistenceMixin } from './persistenceMixin.js?v=20260601-hotfix21';

const { createApp } = Vue;

// 理智过低时随机注入的幻觉句池
const HALLUCINATIONS = [
    '（你眼角的余光里，墙上的影子比你多动了一下。）',
    '（有人在你耳边很轻地、很慢地数着数：……四，五。）',
    '（你低头看自己的手，怎么数都数不清到底有几根手指。）',
    '（屋子里飘着一股香灰味，可这里并没有点香。）',
    '（你听见自己的名字被人念了一遍——声音是从你身后传来的。）'
];

const Rpg2DStage = {
    props: {
        screen: String,
        rpgMode: Boolean,
        bgImageUrl: String,
        bgImageVisible: Boolean,
        bgImageTransition: Boolean,
        sceneIntroActive: Boolean,
        characterVisible: Boolean,
        characterUrl: String,
        characterEmotion: String,
        characterPosition: String,
        characterFlicker: Boolean,
        noiseActive: Boolean,
        ghostOpacity: Number,
        chapter: String
    },
    computed: {
        stageStyle() {
            return {
                '--ghost-opacity': this.ghostOpacity || 0
            };
        },
        backdropStyle() {
            const image = this.bgImageUrl
                ? `url("${this.bgImageUrl}")`
                : 'linear-gradient(180deg, #090303, #000)';
            return {
                backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.16), rgba(0,0,0,0.68)), ${image}`
            };
        },
        chapterMood() {
            if (!this.chapter) return 'mood-road';
            if (this.chapter.includes('末班车') || this.chapter.includes('夜路')) return 'mood-road';
            if (this.chapter.includes('三条') || this.chapter.includes('终焉')) return 'mood-house';
            if (this.chapter.includes('厨房')) return 'mood-kitchen';
            if (this.chapter.includes('地下室')) return 'mood-basement';
            if (this.chapter.includes('纸人村')) return 'mood-village';
            if (this.chapter.includes('冥婚')) return 'mood-wedding';
            return 'mood-ritual';
        }
    },
    template: `
        <div
            id="rpg-2d-stage"
            v-if="screen === 'game'"
            :class="[
                chapterMood,
                {
                    'is-rpg': rpgMode,
                    transitioning: bgImageTransition,
                    'scene-intro-view': sceneIntroActive,
                    'has-character': characterVisible,
                    noisy: noiseActive
                }
            ]"
            :style="stageStyle"
        >
            <div class="stage-layer stage-backdrop" :style="backdropStyle"></div>
            <div class="stage-layer stage-mid"></div>
            <div class="stage-layer stage-light left"></div>
            <div class="stage-layer stage-light right"></div>
            <div class="stage-layer stage-paper paper-a"></div>
            <div class="stage-layer stage-paper paper-b"></div>
            <div class="stage-layer stage-paper paper-c"></div>
            <transition name="char-slide">
                <div
                    id="character-portrait"
                    v-if="characterVisible"
                    :class="[characterEmotion, characterPosition, { flicker: characterFlicker }]"
                >
                    <img :src="characterUrl" class="char-img" alt="">
                    <div class="char-shadow"></div>
                </div>
            </transition>
            <div class="stage-layer stage-foreground"></div>
            <div id="vignette"></div>
            <div id="scanlines"></div>
            <div id="noise" v-if="noiseActive"></div>
        </div>
    `
};

createApp({
    mixins: [holdMixin, sceneMixin, uiMixin, smsMixin, persistenceMixin],
    components: {
        'rpg-2d-stage': Rpg2DStage
    },
    data() {
        return {
            // 屏幕状态
            screen: 'start',
            chapterCheckpoint: null,
            loading: true,

            // 玩家信息
            playerName: '',
            sessionId: null,
            playerId: '',

            // 游戏状态
            currentNodeId: 'node01',
            currentNode: null,
            choicePath: [],
            inventory: [],
            flags: {},
            deathCount: 0,

            // 文字显示
            displayText: '',
            isTyping: false,
            fullText: '',
            typeTextToken: 0,
            typeTextTimer: null,

            // 恐怖氛围
            ghostOpacity: 0.01,
            signalBars: 4,
            batteryPercent: 80,
            gameTime: '23:30',
            showStatusBar: true,
            showChapter: true,
            chapterTitle: '',
            chapterTitleVisible: false,
            noiseActive: false,
            uiShatter: false,
            stageIntroActive: false,
            stageIntroTimer: null,
            sceneIntroActive: false,
            sceneIntroDarkening: false,
            sceneIntroAfterClose: null,

            // 长按
            holdActive: false,
            holdFailed: false,
            holdProgress: 0,
            holdText: t('holdHint'),
            holdRaf: null,
            holdStartTime: 0,

            // 弹窗
            fakeAlertVisible: false,
            alertBlood: false,
            alertNextNode: null,

            // Jumpscare
            jumpscareVisible: false,

            // 手机短信UI
            smsVisible: false,
            smsSender: '',
            smsContent: '',
            smsHistory: [],
            smsTyping: false,
            smsCreepy: false,
            smsDate: '',

            // 遗言
            lastWordInput: '',
            randomLastWord: null,

            // 场景图片
            sceneImageVisible: false,
            sceneImageUrl: '',
            sceneImageNext: null,
            sceneImageAfterClose: null,
            sceneImageReady: false,
            sceneImageCloseQueued: false,

            // ===== 新增：场景背景系统 =====
            bgImageVisible: false,
            bgImageUrl: '',
            bgImageTransition: false,

            // ===== 新增：角色立绘系统 =====
            characterVisible: false,
            characterUrl: '',
            characterEmotion: 'normal',   // normal | grin | angry | fade | ghost
            characterPosition: 'right',   // left | right | center
            characterFlicker: false,

            // ===== 新增：死亡CG系统 =====
            deathCGVisible: false,
            deathCGUrl: '',
            deathCGName: '',
            deathCGDesc: '',

            // ===== 新增：结局插图系统 =====
            endingCGVisible: false,
            endingCGUrl: '',

            // 监控画面
            camAlertVisible: false,
            camAlertNext: null,

            // 手机开机过程
            phoneBooting: false,
            phoneBootStep: 0,

            // 弹幕
            danmuList: [],
            danmuId: 0,

            // 统计
            stats: { total_sessions: 0, total_deaths: 0 },
            onlineInfo: null,
            deathCountGlobal: 0,
            lastDeathInfo: null,

            // 结局
            endingText: '',

            // 多周目 / 收集
            endingCollection: [],
            showEndingBook: false,
            saveSlots: [],
            showSaveMenu: false,

            // 成就系统
            achievements: [],
            showAchievementMenu: false,
            achievementToast: null,
            lang: getLang(),
            holdSuccessCount: 0,
            tabSwitchCount: 0,
            gameStartTime: null,

            // 分享卡片
            shareCardVisible: false,
            shareCardDataUrl: '',

            // 场景探索
            sceneExploreVisible: false,
            exploreSceneId: '',
            exploreImage: '',
            exploreHotspots: [],
            exploreAllHotspots: [],
            exploreTitle: '',
            exploreHint: '',
            exploreReturnNode: null,
            exploreCloseText: '',

            // 密码锁
            puzzleVisible: false,
            puzzleType: 'keypad',
            puzzleHint: '',
            puzzleInput: '',
            puzzleTarget: '',
            puzzleCallback: null,

            // 道具特写
            closeupVisible: false,
            closeupImage: '',
            closeupTitle: '',
            closeupText: '',
            closeupHint: '',
            closeupNextNode: null,

            // 耳机检测
            headphoneWarned: false,

            // 真实时间彩蛋
            realHour: new Date().getHours(),
            isLateNight: new Date().getHours() >= 0 && new Date().getHours() < 5,
            lunarDate: '',
            showEasterEgg: false,
            easterEggText: '',

            // 缓存
            victimLocation: '你所在的地方',

            // ===== RPG系统 =====
            rpgMode: true,
            showRpgHud: true,
            playerStats: { hp: 100, maxHp: 100, sanity: 100, maxSanity: 100, fear: 0, maxFear: 100 },
            menuVisible: false,
            inventoryVisible: false,
            settingsVisible: false,
            showSaveMenuRpg: false,
            selectedItem: null,
            textSpeed: 3,
            soundEnabled: true,
            vibrationEnabled: true,
        };
    },

    computed: {
        // 剧情推进度 0→1: 综合 ghostOpacity(每次选择递增, 已持久化)与恐惧值; 驱动对白颜色由米黄渐变到血红
        storyProgress() {
            const g = Math.min(Math.max(this.ghostOpacity || 0, 0), 1);
            const fear = (this.playerStats && this.playerStats.fear) ? this.playerStats.fear / 100 : 0;
            return Math.min(g * 0.7 + fear * 0.3, 1);
        },
        // 对白颜色: 在 JS 端线性插值(陈旧米黄 #e7d6b0 → 血红 #bf2018), 比 CSS color-mix 在旧 webview 更可靠
        storyInkColor() {
            const p = this.storyProgress;
            const a = [231, 214, 176], b = [191, 32, 24];
            const c = a.map((v, i) => Math.round(v + (b[i] - v) * p));
            return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
        },
        storyInkGlow() {
            const p = this.storyProgress;
            return `0 2px 3px #000, 0 0 ${(p * 11).toFixed(1)}px rgba(176,22,14,${(p * 0.6).toFixed(2)})`;
        },
        // 探索界面内可就地合成的配方: 背包里材料齐、产物还没有的(免去退出开背包)
        craftableRecipes() {
            const inv = this.inventory || [];
            const out = [];
            for (const key of Object.keys(ITEMS)) {
                const recipe = ITEMS[key] && ITEMS[key].combine;
                if (!recipe || !recipe.result) continue;
                if (inv.includes(recipe.result)) continue;            // 已经有成品了
                const need = [key, ...(recipe.with || [])];
                if (need.every((k) => inv.includes(k))) {
                    out.push({ baseKey: key, resultName: (ITEMS[recipe.result] && ITEMS[recipe.result].name) || recipe.result });
                }
            }
            return out;
        },
        currentChapter() {
            return this.currentNode?.chapter || '';
        },
        currentSceneName() {
            return this.currentNode?.sceneName || sceneNameForChapter(this.currentNode?.chapter || '');
        },
        currentObjective() {
            return objectiveForNode(this.currentNode, {
                selectedItem: this.selectedItem,
                sceneExploreVisible: this.sceneExploreVisible
            });
        },
        exploreProgressText() {
            if (!this.sceneExploreVisible) return '';
            const total = this.exploreAllHotspots.length || 0;
            const visible = this.exploreHotspots.length || 0;
            if (!total) return '暂无可调查目标';
            return `可疑处 ${visible}/${total}`;
        },
        visibleChoices() {
            return gameRuntime.getVisibleChoices(this.currentNode, {
                inventory: this.inventory,
                flags: this.flags,
                stats: this.playerStats
            });
        }
    },

    async mounted() {
        this.playerId = gameRuntime.getPlayerId();
        this.inventory = gameRuntime.normalizeInventory(this.inventory);

        // IP定位
        window.getIpData = (data) => {
            if (data && data.pro) {
                this.victimLocation = data.pro;
                if (data.city && data.city !== data.pro) this.victimLocation += data.city;
            }
        };
        const ipScript = document.createElement('script');
        ipScript.src = 'https://whois.pconline.com.cn/ipJson.jsp?callback=getIpData';
        document.head.appendChild(ipScript);

        // 预加载恐怖资源
        this.preloadAssets();

        // 防切出制裁
        this.setupVisibilityTrap();

        // 加载统计和遗言
        await this.loadGlobalData();
        await this.loadAchievements();

        // 检查本地存档
        const savedSession = readRaw(KEYS.session);
        if (savedSession) {
            const saved = await apiGet('/api/progress/' + savedSession);
            if (saved && saved.node_id) {
                this.sessionId = savedSession;
                this.currentNodeId = saved.node_id;
                this.choicePath = saved.choice_path || [];
                this.ghostOpacity = saved.ghost_opacity || 0.01;
                this.inventory = saved.inventory ? gameRuntime.normalizeInventory(JSON.parse(saved.inventory)) : [];
                this.flags = saved.flags ? JSON.parse(saved.flags) : {};
            }
        }

        // 读取多周目数据
        this.deathCount = parseInt(readRaw(KEYS.deathCount, '0'), 10);
        this.endingCollection = readJSON(KEYS.endings, []);
        this.saveSlots = readJSON(KEYS.saves, []);
        this.chapterCheckpoint = readJSON(KEYS.checkpoint, null);

        // 加载RPG设置
        this.loadSettings();
        this.playerStats = readJSON(KEYS.rpgStats, this.playerStats);

        this.loading = false;

        // 03:33 实时彩蛋: 定时检查, 玩家在该时刻会看到"阴气最重之时"提示
        this.checkTimeEasterEgg();
        this._easterEggTimer = setInterval(() => this.checkTimeEasterEgg(), 30000);
    },

    unmounted() {
        if (this._easterEggTimer) clearInterval(this._easterEggTimer);
    },

    methods: {
        // ===== i18n =====
        t(key) { return t(key); },
        switchLang() {
            const next = this.lang === 'zh' ? 'en' : 'zh';
            setLang(next);
            this.lang = next;
            document.title = this.lang === 'zh' ? '回魂煞' : 'Soul Return';
        },

        // ===== 成就系统 =====
        async loadAchievements() {
            const data = await apiGet('/api/achievements');
            if (data && data.achievements) {
                const localUnlocked = readJSON(KEYS.achievements, []);
                // Merge server + local
                this.achievements = data.achievements.map(a => ({
                    ...a,
                    unlocked: a.unlocked || localUnlocked.includes(a.code)
                }));
            }
        },

        async unlockAchievement(code) {
            const already = this.achievements.find(a => a.code === code);
            if (already && already.unlocked) return;
            const localUnlocked = readJSON(KEYS.achievements, []);
            if (localUnlocked.includes(code)) return;
            localUnlocked.push(code);
            writeJSON(KEYS.achievements, localUnlocked);
            // Update UI
            const idx = this.achievements.findIndex(a => a.code === code);
            if (idx >= 0) this.achievements[idx].unlocked = true;
            // Show toast
            const name = already ? already.name : code;
            this.showAchievementToast(name);
            // Sync to server
            if (this.playerId) {
                await apiPost('/api/achievement/unlock', {
                    player_id: this.playerId,
                    code: code,
                    session_id: this.sessionId
                });
            }
        },

        showAchievementToast(name) {
            this.achievementToast = `🏆 解锁成就：${name}`;
            setTimeout(() => { this.achievementToast = null; }, 3500);
        },

        toggleAchievementMenu() {
            this.showAchievementMenu = !this.showAchievementMenu;
        },

        getAchievementRarityColor(rarity) {
            const colors = { common: '#8a7a5a', rare: '#4a90d9', epic: '#9b59b6', legendary: '#ffd700' };
            return colors[rarity] || '#8a7a5a';
        },

        // ===== 分享卡片 =====
        async generateShareCard() {
            const canvas = document.createElement('canvas');
            canvas.width = 800; canvas.height = 450;
            const ctx = canvas.getContext('2d');

            // Background
            ctx.fillStyle = '#0a0505';
            ctx.fillRect(0, 0, 800, 450);

            // CRT scanlines
            ctx.fillStyle = 'rgba(255,255,255,0.03)';
            for (let y = 0; y < 450; y += 4) ctx.fillRect(0, y, 800, 2);

            // Border
            ctx.strokeStyle = '#8a0000';
            ctx.lineWidth = 2;
            ctx.strokeRect(20, 20, 760, 410);

            // Title
            ctx.fillStyle = '#c9a86c';
            ctx.font = 'bold 36px "Courier New", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('《回魂煞》存活报告', 400, 80);

            // Stats
            ctx.fillStyle = '#8a7a5a';
            ctx.font = '20px "Courier New", monospace';
            ctx.textAlign = 'left';
            const endings = this.endingCollection.length;
            const deaths = this.deathCount;
            const achievements = this.achievements.filter(a => a.unlocked).length;
            ctx.fillText(`结局收集: ${endings}/8`, 80, 150);
            ctx.fillText(`死亡次数: ${deaths}`, 80, 190);
            ctx.fillText(`成就解锁: ${achievements}/${this.achievements.length || 10}`, 80, 230);
            if (this.sessionId) ctx.fillText(`恐惧值: ${this.stats.total_sessions || '???'}`, 80, 270);

            // Ending distribution bar
            ctx.fillStyle = '#3a1515';
            ctx.fillRect(80, 310, 640, 30);
            ctx.fillStyle = '#8a0000';
            const pct = Math.min(endings / 8, 1);
            ctx.fillRect(80, 310, 640 * pct, 30);

            // Footer
            ctx.fillStyle = '#5a3a1a';
            ctx.font = '14px "Courier New", monospace';
            ctx.textAlign = 'center';
            ctx.fillText((location.origin + location.pathname).replace(/index\.html$/, '') + ' | 它记得你。', 400, 400);

            this.shareCardDataUrl = canvas.toDataURL('image/png');
            this.shareCardVisible = true;
        },

        closeShareCard() {
            this.shareCardVisible = false;
        },

        // ===== 耳机检测 =====
        checkHeadphones() {
            if (this.headphoneWarned) return;
            if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                navigator.mediaDevices.enumerateDevices().then(devices => {
                    const audioOutputs = devices.filter(d => d.kind === 'audiooutput');
                    const hasHeadphones = audioOutputs.some(d =>
                        d.label.toLowerCase().includes('head') ||
                        d.label.toLowerCase().includes('ear') ||
                        d.label.toLowerCase().includes('bluetooth')
                    );
                    if (!hasHeadphones && audioOutputs.length > 0) {
                        this.headphoneWarned = true;
                        alert(`⚠️ 警告：未检测到耳机/耳塞。\n为了最佳恐怖体验，建议佩戴耳机。\n（回魂煞是一个声音沉浸体验）`);
                    }
                }).catch(() => {});
            }
        },

        // ===== 实时彩蛋 =====
        checkTimeEasterEgg() {
            const now = new Date();
            const h = now.getHours();
            const m = now.getMinutes();
            if (h === 3 && m >= 33 && m <= 35) {
                this.showEasterEgg = true;
                this.easterEggText = '03:33 - 阴气最重之时。它醒着。';
                setTimeout(() => { this.showEasterEgg = false; }, 5000);
            }
            if (h >= 0 && h < 5) {
                this.isLateNight = true;
            }
        },

        getLunarDate() {
            // Simplified lunar date (approximation for common years)
            const lunarMonths = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
            const lunarDays = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
                '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
                '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
            const now = new Date();
            // Use a simple offset-based approximation for 2025-2026
            const base = new Date(2025, 0, 29); // 2025-01-29 = Chinese New Year
            const diff = Math.floor((now - base) / 86400000);
            if (diff < 0) return '';
            const lunarMonthDays = [29, 30, 29, 30, 29, 30, 29, 30, 30, 29, 30, 29]; // 2025 approx
            let d = diff;
            let monthIdx = 0;
            while (d >= lunarMonthDays[monthIdx] && monthIdx < 11) {
                d -= lunarMonthDays[monthIdx];
                monthIdx++;
            }
            const dayIdx = d;
            return `${lunarMonths[monthIdx]}月${lunarDays[dayIdx]}`;
        },

        // ===== 场景探索 =====
        showToast(msg) {
            this.achievementToast = msg;
            setTimeout(() => { if (this.achievementToast === msg) this.achievementToast = null; }, 2500);
        },
        vibrate(pattern) {
            try {
                if (!this.vibrationEnabled || !navigator.vibrate) return;
                if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
                navigator.vibrate(pattern);
            } catch (e) {}
        },

        // ===== 全局数据加载 =====


        async loadGlobalData() {
            const stats = await apiGet('/api/stats');
            if (stats) this.stats = stats;
            const lw = await apiGet('/api/last-word/random');
            if (lw && lw.has_word) this.randomLastWord = lw.content;
        },

        // ===== 预加载恐怖资源 =====
        preloadAssets() {
            preloadImageList().forEach(src => {
                const img = new Image();
                img.src = src;
            });
        },

        // ===== 防切出制裁系统 =====
        setupVisibilityTrap() {
            const originalTitle = document.title;
            let awayCount = 0;

            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    awayCount++;
                    const titles = ['你要丢下我吗？', '救救我...', '它来了', '别走', '回头看'];
                    document.title = titles[Math.min(awayCount - 1, titles.length - 1)];
                } else {
                    document.title = originalTitle;
                    if (awayCount > 0 && this.screen === 'game') {
                        // 切回来触发惩罚
                        this.triggerReturnPunishment(awayCount);
                    }
                }
            });
        },

        // ===== 切回惩罚 =====
        triggerReturnPunishment(count) {
            // 屏幕闪红
            const flash = document.createElement('div');
            flash.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:#ff0000;z-index:99999;pointer-events:none;opacity:0.3;';
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 100);

            // 音效
            playScream();
            this.vibrate([100, 50, 100, 50, 200]);

            // 随机惩罚文字
            const punishments = [
                '你以为切出去就能逃掉吗？',
                '你离开了' + count + '次，它都记着呢。',
                '不要丢下我...',
                '它趁你不在的时候，靠得更近了。'
            ];
            const text = punishments[Math.min(count - 1, punishments.length - 1)];
            this.showDanmu('【系统】' + text);
        },

        // ===== 开始游戏 =====
        async startGame() {
            initAudio();
            resumeAudio();

            if (!this.sessionId) {
                const res = await apiPost('/api/session', {
                    user_agent: navigator.userAgent,
                    name: this.playerName
                });
                if (res && res.session_id) {
                    this.sessionId = res.session_id;
                    writeRaw(KEYS.session, this.sessionId);
                }
            }

            // 初始化RPG属性
            this.playerStats = { hp: 100, maxHp: 100, sanity: 100, maxSanity: 100, fear: 0, maxFear: 100 };
            removeKey(KEYS.rpgStats);

            this.screen = 'game';
            this.showDanmuPreview();
            this.enterNode(this.currentNodeId);
        },

        // ===== 显示开场弹幕遗言 =====
        showDanmuPreview() {
            if (this.randomLastWord) {
                this.showDanmu('【前人遗言】' + this.randomLastWord);
            }
        },

        // ===== 声音总开关(同步 BGM) =====
        toggleSound() {
            this.soundEnabled = !this.soundEnabled;
            this.saveSettings();
            if (!this.soundEnabled) { stopBgm(); this._bgmMood = null; }
            else { resumeAudio(); this._bgmMood = null; this._updateBgm(this.currentNode); }
        },
        // ===== 按章节/进度更新背景音乐(程序化氛围乐 + 后期唢呐) =====
        _updateBgm(node) {
            if (!node) return;
            if (!this.soundEnabled) { stopBgm(); this._bgmMood = null; return; }
            const ch = node.chapter || '';
            let mood = 'base';
            if (node.isEnding || node.isFinal) mood = 'ending';        // 结局: 唢呐送葬句
            else if (ch.includes('冥婚') || ch.includes('阴阳')) mood = 'wedding';
            else if (ch.includes('回魂')) mood = 'ritual';
            // 死亡节点不专门切 BGM(由 scream 等音效承担), 维持原氛围
            if (node.isDeath) return;
            if (mood !== this._bgmMood) {
                this._bgmMood = mood;
                startBgm(mood);
            }
        },

        // ===== 进入节点 =====
        async enterNode(nodeId) {
            if (this.stageIntroTimer) {
                clearTimeout(this.stageIntroTimer);
                this.stageIntroTimer = null;
            }
            if (this.typeTextTimer) {
                clearTimeout(this.typeTextTimer);
                this.typeTextTimer = null;
            }
            this.typeTextToken += 1;
            this.stageIntroActive = false;
            this.sceneIntroActive = false;
            this.sceneIntroDarkening = false;
            this.sceneIntroAfterClose = null;
            this.sceneImageVisible = false;
            this.sceneImageReady = false;
            this.sceneImageCloseQueued = false;
            this.sceneImageAfterClose = null;
            this.sceneImageNext = null;
            this.sceneExploreVisible = false;
            this.closeupVisible = false;
            this.puzzleVisible = false;
            this.fakeAlertVisible = false;
            this.camAlertVisible = false;
            this.currentNodeId = nodeId;
            let node = gameRuntime.getNode(nodeId);
            if (!node) return;
            // 多周目文本注入
            node = this.injectNewGamePlusText(node);
            this.currentNode = node;

            this._updateBgm(node);

            const effects = gameRuntime.applyNodeEffects(node, {
                inventory: this.inventory,
                flags: this.flags
            });
            this.inventory = effects.inventory;
            this.flags = effects.flags;

            // 更新RPG属性
            this.updatePlayerStats(node);

            // 更新状态栏
            this.updateStatusBar(node);

            // ===== 场景背景切换 =====
            this.updateBackground(node);

            // ===== 角色立绘切换 =====
            this.updateCharacter(node);

            // 章节标题(去抖: 仅进入新章时弹一次, 避免同章连刷反复闪同一标题)
            if (node.chapter && node.chapter !== this._lastChapterShown) {
                this._lastChapterShown = node.chapter;
                this.chapterTitle = node.chapter;
                this.chapterTitleVisible = true;
                setTimeout(() => { this.chapterTitleVisible = false; }, 3000);
                // 章节续关: 进入新章时记录, 死亡后可回到本章开头(降低长流程劝退)
                if (!node.isDeath && !node.isEnding && !node.isFinal) {
                    this.chapterCheckpoint = {
                        nodeId, chapter: node.chapter,
                        inventory: gameRuntime.normalizeInventory(this.inventory),
                        flags: { ...this.flags },
                        playerStats: { ...this.playerStats },
                        ghostOpacity: this.ghostOpacity
                    };
                    writeJSON(KEYS.checkpoint, this.chapterCheckpoint);
                }
            }

            // 震动
            if (node.vibration) this.vibrate(node.vibration);

            // 音效 + 心跳(用前端 BPM_MAP 同帧起跳, 覆盖全部节点, 不再等后端往返)
            resumeAudio();
            playHeartbeat(BPM_MAP[nodeId] || 60);
            const sfx = SFX_MAP[nodeId];
            if (sfx === 'knock') playKnock();
            else if (sfx === 'tinnitus') playTinnitus();
            else if (sfx === 'whisper') playWhisper();
            else if (sfx === 'scream') playScream();
            if (nodeId.startsWith('node_dead')) playScream();

            // 后端交互
            this.fetchBackendData(nodeId);

            // 文字
            let text = node.text || '';
            text = text.replace(/\$\{victimLocation\}/g, this.victimLocation);
            // 理智过低: 注入幻觉(节点可配 hallucinationText, 否则用通用句池)
            if (this.playerStats.sanity < 30 && !node.isDeath && !node.isEnding && !node.isFinal) {
                text = text + '\n\n' + (node.hallucinationText || HALLUCINATIONS[Math.floor(Math.random() * HALLUCINATIONS.length)]);
            }
            this.fullText = text;
            this.displayText = '';

            const playText = () => {
                this.stageIntroActive = false;
                // 检查是否是死亡/结局/最终节点/监控画面/场景图片
                if (node.isDeath) {
                    this.typeText(text, () => this.handleDeath(node));
                } else if (node.isFinal) {
                    this.typeText(text, () => this.handleFinal(node));
                } else if (node.isEnding) {
                    this.typeText(text, () => this.handleEnding(node));
                } else if (node.exploreScene) {
                    this.typeText(text, () => {
                        this.showSceneExplore(node.sceneImage, node.sceneTitle, node.hotspots || [], node);
                    });
                } else if (node.fakeAlert) {
                    this.typeText(text, () => {
                        this.alertNextNode = node.alertNext;
                        setTimeout(() => { this.fakeAlertVisible = true; }, 500);
                    });
                } else if (node.camAlert) {
                    this.typeText(text, () => {
                        this.camAlertVisible = true;
                        this.camAlertNext = node.camNext;
                        this.noiseActive = true;
                        playTone(200, 0.5, 'sawtooth', 0.05);
                        this.vibrate([100, 50, 100, 50, 200]);
                    });
                } else if (node.puzzleLock) {
                    this.typeText(text, () => {
                        this.showPuzzle(node.puzzleType, node.puzzleTarget, node.puzzleHint, (success) => {
                            const next = success ? node.puzzleSuccessNode : node.puzzleFailNode;
                            if (next) this.enterNode(next);
                        });
                    });
                } else if (node.closeupItem) {
                    this.typeText(text, () => {
                        this.showCloseup(node.closeupImage, node.closeupText, node.closeupNextNode || null);
                    });
                } else if (node.holdRequired) {
                    this.typeText(text, () => { /* 长按按钮会自动显示 */ });
                } else if (node.sceneImageNext) {
                    this.typeText(text, () => {
                        setTimeout(() => this.enterNode(node.sceneImageNext), 300);
                    });
                } else {
                    this.typeText(text);
                }
            };

            const showSceneBeforeText = () => {
                this.stageIntroActive = false;
                this.isTyping = false;
                this.sceneImageUrl = node.sceneImage;
                this.sceneImageNext = null;
                this.sceneImageAfterClose = playText;
                this.sceneImageReady = false;
                this.sceneImageCloseQueued = false;
                this.sceneImageVisible = true;
                setTimeout(() => {
                    this.sceneImageReady = true;
                    if (this.sceneImageCloseQueued) this.closeSceneImage();
                }, 300);
                this.vibrate([50, 100, 50]);
            };

            const shouldShowSceneBeforeText = Boolean(
                node.sceneImage &&
                !node.exploreScene &&
                !node.isDeath &&
                !node.isFinal &&
                !node.isEnding &&
                !node.fakeAlert &&
                !node.camAlert &&
                !node.puzzleLock &&
                !node.closeupItem &&
                !node.holdRequired
            );

            const presentNode = shouldShowSceneBeforeText ? showSceneBeforeText : playText;

            // 仅首次进入该节点放开场过场动画; 退回/重进时直接呈现, 不重演"剧情过场"
            this._seenNodes = this._seenNodes || new Set();
            const firstVisit = !this._seenNodes.has(nodeId);
            this._seenNodes.add(nodeId);
            const shouldPreviewStage = firstVisit && this.rpgMode && !shouldShowSceneBeforeText && !node.isDeath && !node.isFinal && !node.isEnding;
            if (shouldPreviewStage) {
                this.stageIntroActive = true;
                this.isTyping = true;
                this.stageIntroTimer = setTimeout(presentNode, nodeId === 'node01' ? 950 : 520);
            } else {
                presentNode();
            }

            // 物品获取
            if (node.item) {
                const itemKey = gameRuntime.normalizeItemKey(node.item);
                const itemData = gameRuntime.getItem(itemKey);
                if (itemData && itemData.image) {
                    setTimeout(() => {
                        this.showCloseup(itemData.image, `获得了【${itemData.name}】\n${itemData.desc}`, null);
                    }, 500);
                }
            }
        },

        // ===== 场景背景切换 =====
        updateBackground(node) {
            // 优先使用节点显式配置，否则按章节自动匹配
            let bgImage = node.bgImage;
            if (!bgImage && this.rpgMode && node.sceneImage && !node.sceneImageNext && !node.exploreScene) {
                bgImage = node.sceneImage;
            }
            if (!bgImage && !node.clearBg && node.chapter) {
                bgImage = CHAPTER_BACKGROUNDS[node.chapter];
            }

            if (bgImage) {
                // 如果背景变化，先做过渡
                if (this.bgImageUrl && this.bgImageUrl !== bgImage) {
                    this.bgImageTransition = true;
                    setTimeout(() => {
                        this.bgImageUrl = bgImage;
                        this.bgImageTransition = false;
                    }, 400);
                } else {
                    this.bgImageUrl = bgImage;
                }
                this.bgImageVisible = true;
            } else if (node.clearBg) {
                // 显式清除背景
                this.bgImageVisible = false;
                this.bgImageUrl = '';
            }
            // 色调分级
            if (node.colorGrade) {
                document.body.className = '';
                document.body.classList.add('grade-' + node.colorGrade);
            }
        },

        // ===== 角色立绘切换 =====
        updateCharacter(node) {
            if (node.character) {
                this.characterUrl = node.character;
                this.characterEmotion = node.characterEmotion || 'normal';
                this.characterPosition = node.characterPosition || 'right';
                this.characterFlicker = node.characterFlicker || false;
                this.characterVisible = true;
            } else if (node.hideCharacter) {
                this.characterVisible = false;
            }
        },

        // ===== 打字机效果 =====
        typeText(text, onDone) {
            this.typeTextToken += 1;
            const token = this.typeTextToken;
            if (this.typeTextTimer) {
                clearTimeout(this.typeTextTimer);
                this.typeTextTimer = null;
            }
            this.isTyping = true;
            this._typeInQuote = false;
            this.displayText = '<span class="cursor"></span>';
            const chars = text.split('');
            let i = 0;
            // 文字速度映射：1=慢(80ms), 5=快(15ms)
            const speedMap = { 1: 80, 2: 50, 3: 30, 4: 20, 5: 12 };
            const baseDelay = speedMap[this.textSpeed] || 30;

            const step = () => {
                if (token !== this.typeTextToken) return;
                if (i >= chars.length) {
                    this.isTyping = false;
                    this.displayText = text.replace(/\n/g, '<br>');
                    this.typeTextTimer = null;
                    if (onDone && token === this.typeTextToken) onDone();
                    return;
                }
                let chunk = '';
                let lastCh = '';
                for (let c = 0; c < 2 && i < chars.length; c++) {
                    let ch = chars[i++];
                    lastCh = ch;
                    if (ch === '“' || ch === '「') this._typeInQuote = true;
                    else if (ch === '”' || ch === '」') this._typeInQuote = false;
                    if (ch === '\n') ch = '<br>';
                    chunk += ch;
                }
                const current = this.displayText.replace('<span class="cursor"></span>', '');
                this.displayText = current + chunk + '<span class="cursor"></span>';
                let delay = baseDelay + Math.random() * (baseDelay * 0.5);
                if (this._typeInQuote) delay *= 2.2;                          // 引号内鬼台词放慢
                if ('。！？…'.includes(lastCh)) delay += baseDelay * 4;        // 句末重顿
                else if ('，、；'.includes(lastCh)) delay += baseDelay * 1.5;  // 逗号轻顿
                this.typeTextTimer = setTimeout(step, delay);
            };
            step();
        },

        // ===== 状态栏更新 =====
        updateStatusBar(node) {
            if (node.time) this.gameTime = node.time;
            if (node.signal !== undefined) this.signalBars = node.signal;
            if (node.battery !== undefined) this.batteryPercent = node.battery;
            this.ghostOpacity = Math.min(this.ghostOpacity + 0.03, 1.0);
            writeRaw(KEYS.ghost, this.ghostOpacity.toString());
        },

        // ===== 做出选择 =====
        makeChoice(choice) {
            if (!gameRuntime.canUseChoice(choice, { inventory: this.inventory, flags: this.flags, stats: this.playerStats })) {
                this.showToast('还缺少关键线索。');
                return;
            }
            initAudio();
            resumeAudio();
            if (choice.vibration && navigator.vibrate) {
                navigator.vibrate(choice.vibration);
            }
            if (choice.statEffect) this.applyStatEffect(choice.statEffect);
            this.ghostOpacity = Math.min(this.ghostOpacity + 0.04, 1.0);
            this.choicePath.push(this.currentNodeId);
            this.enterNode(choice.next);
        },

        // 应用数值变化 (选择/节点的 statEffect: { hp, sanity, fear } 增量, 自动钳制)
        applyStatEffect(e) {
            if (!e) return;
            const s = this.playerStats;
            if (e.hp) s.hp = Math.max(0, Math.min(s.maxHp, s.hp + e.hp));
            if (e.sanity) s.sanity = Math.max(0, Math.min(s.maxSanity, s.sanity + e.sanity));
            if (e.fear) s.fear = Math.max(0, Math.min(s.maxFear, s.fear + e.fear));
        },

        // ===== 长按屏息（带陀螺仪判定） =====
        // ===== 关闭假弹窗 =====
        closeFakeAlert() {
            this.alertBlood = true;
            if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
            setTimeout(() => {
                this.fakeAlertVisible = false;
                this.alertBlood = false;
                if (this.alertNextNode) {
                    this.enterNode(this.alertNextNode);
                }
            }, 800);
        },

        // ===== 关闭短信 =====
        // ===== 关闭监控画面 =====
        closeCamAlert() {
            this.camAlertVisible = false;
            this.noiseActive = false;
            playTone(100, 0.3, 'sine', 0.05);
            if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
            if (this.camAlertNext) {
                setTimeout(() => this.enterNode(this.camAlertNext), 300);
            }
        },

        // ===== 关闭场景图片 =====
        closeSceneImage() {
            if (!this.sceneImageReady) {
                this.sceneImageCloseQueued = true;
                return;
            }
            this.sceneImageVisible = false;
            this.sceneImageReady = false;
            this.sceneImageCloseQueued = false;
            if (this.sceneImageAfterClose) {
                const afterClose = this.sceneImageAfterClose;
                this.sceneImageAfterClose = null;
                this.isTyping = true;
                this.displayText = '<span class="cursor"></span>';
                setTimeout(afterClose, 160);
                return;
            }
            if (this.sceneImageNext) {
                const next = this.sceneImageNext;
                this.sceneImageNext = null;
                setTimeout(() => this.enterNode(next), 400);
            }
        },

        // ===== 关闭舞台开场图 =====
        closeSceneIntro() {
            if (!this.sceneIntroActive || this.sceneIntroDarkening) return;
            this.sceneIntroDarkening = true;
            const afterClose = this.sceneIntroAfterClose;
            this.sceneIntroAfterClose = null;
            if (navigator.vibrate) navigator.vibrate([35, 50, 35]);
            setTimeout(() => {
                this.sceneIntroActive = false;
                this.sceneIntroDarkening = false;
                if (afterClose) {
                    this.isTyping = true;
                    this.displayText = '<span class="cursor"></span>';
                    setTimeout(afterClose, 120);
                }
            }, 620);
        },

        // ===== 获取节点的默认下一个节点 =====
        getNextFromChoices(node) {
            if (node.choices && node.choices.length > 0) {
                return node.choices[0].next;
            }
            return null;
        },

        // ===== 后端数据交互 =====
        async fetchBackendData(nodeId) {
            if (!this.sessionId) return;
            const node = NODES[nodeId];

            // 保存进度
            apiPost('/api/progress', {
                session_id: this.sessionId,
                node_id: nodeId,
                chapter: node?.chapter,
                time_in_game: node?.time,
                choice_path: this.choicePath,
                ghost_opacity: this.ghostOpacity,
                inventory: JSON.stringify(this.inventory),
                flags: JSON.stringify(this.flags)
            });

            // 记录节点访问
            apiPost('/api/node_visit', { node_id: nodeId });

            // 记录事件
            apiPost('/api/event', {
                session_id: this.sessionId,
                event_type: 'enter_node',
                node_id: nodeId,
                payload: JSON.stringify({ chapter: node?.chapter, time: node?.time })
            });

            // 心跳已在 enterNode 用前端 BPM_MAP 同帧播放(见上), 不再走后端往返(后端表只覆盖 node01-30)

            // 获取短信 - 手机UI展示(同一节点本次会话只弹一次, 避免退回堂屋等重进时重复触发手机剧情)
            this._smsShownNodes = this._smsShownNodes || new Set();
            if (!this._smsShownNodes.has(nodeId)) {
                const msg = await apiGet('/api/message?node_id=' + nodeId);
                if (msg && msg.has_message) {
                    this._smsShownNodes.add(nodeId);
                    setTimeout(() => {
                        this.showSmsDialog(msg.from_sender, msg.content, nodeId);
                    }, msg.delay_ms || 500);
                }
            }
        },

        // ===== 死亡处理 =====
        async handleDeath(node) {
            this.deathCount++;
            writeRaw(KEYS.deathCount, this.deathCount.toString());
            this.unlockAchievement('first_blood');
            if (this.sessionId) {
                apiPost('/api/death', {
                    session_id: this.sessionId,
                    node_id: this.currentNodeId,
                    death_name: node.deathName,
                    death_desc: node.deathDesc,
                    chapter: node.chapter
                });
            }

            // ===== 死亡CG展示 =====
            if (node.deathCG) {
                this.deathCGUrl = node.deathCG;
                this.deathCGName = node.deathName || '无名之死';
                this.deathCGDesc = node.deathDesc || '';
                this.deathCGVisible = true;
                // 3秒后淡出CG，显示死亡界面
                setTimeout(() => {
                    this.deathCGVisible = false;
                }, 3500);
            }

            // 获取全局死亡计数
            const dc = await apiGet('/api/death-count');
            if (dc) this.deathCountGlobal = dc.count;

            // 获取上一个死亡
            const last = await apiGet('/api/last_death');
            if (last && !last.error) this.lastDeathInfo = last;

            // 氛围音效
            playWhisper();
        },

        // ===== 最终结局处理 =====
        async handleFinal(node) {
            this.uiShatter = true;
            setTimeout(() => {
                this.triggerJumpscare(() => {
                    this.showEnding('【结局：深渊注视】\n\n你今晚最好别关灯。');
                });
            }, 2000);
        },

        // ===== 普通结局处理 =====
        async handleEnding(node) {
            this.uiShatter = true;
            document.body.classList.add('final-flash');

            // ===== 结局CG展示 =====
            if (node.endingCG) {
                this.endingCGUrl = node.endingCG;
                this.endingCGVisible = true;
            }

            // 记录结局
            if (node.endingCode) {
                this.recordEnding(node.endingCode, node.endingName);
            }

            // 提交结果
            const fearScore = node.fearScore || 50;
            if (this.sessionId && node.endingCode) {
                apiPost('/api/result', {
                    session_id: this.sessionId,
                    fear_score: fearScore,
                    ending_type: node.endingCode,
                    answers: this.buildAnswers()
                });
            }

            // 获取在线氛围
            const online = await apiGet('/api/online');
            if (online) this.onlineInfo = online;

            // 构建结局文本
            let text = '【结局：' + node.endingName + '】\n\n' + node.text;
            if (this.onlineInfo) {
                text += '\n\n【深渊注视】\n还有 ' + this.onlineInfo.active_players + ' 个灵魂正在黑暗中挣扎。\n最近有 ' + this.onlineInfo.recent_deaths + ' 人永远留在了这里。';
            }
            this.endingText = text;
        },

        // ===== Jumpscare =====
        triggerJumpscare(onDone) {
            this.jumpscareVisible = true;
            if (this.soundEnabled) playJumpscareSfx(); else playScream();
            if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200, 100, 200]);
            setTimeout(() => {
                this.jumpscareVisible = false;
                if (onDone) onDone();
            }, 2500);
        },

        // ===== 显示结局文字 =====
        showEnding(text) {
            this.endingText = text;
            if (navigator.vibrate) navigator.vibrate([50, 50, 50, 50, 50, 50, 50, 50]);
            playTone(100, 3, 'sine', 0.2);
        },

        // ===== 构建答案记录 =====
        buildAnswers() {
            const answers = [];
            for (let i = 0; i < this.choicePath.length; i++) {
                const nodeId = this.choicePath[i];
                const node = NODES[nodeId];
                if (node && node.choices) {
                    // 找到下一个节点对应的选择
                    const nextId = i < this.choicePath.length - 1 ? this.choicePath[i + 1] : this.currentNodeId;
                    const choice = node.choices.find(c => c.next === nextId);
                    if (choice) {
                        answers.push({
                            question_index: i,
                            question_text: (node.text || '').substring(0, 50),
                            choice_index: node.choices.indexOf(choice),
                            choice_text: choice.text,
                            node_id: nodeId,
                            chapter: node.chapter
                        });
                    }
                }
            }
            return answers;
        },

        // ===== 提交遗言 =====
        async submitLastWord() {
            const val = this.lastWordInput.trim();
            if (val && this.sessionId) {
                const endingName = this.currentNode?.deathName || this.currentNode?.endingName || '未知结局';
                await apiPost('/api/last-word', {
                    session_id: this.sessionId,
                    content: val,
                    ending_name: endingName,
                    player_name: this.playerName
                });
            }
            this.lastWordInput = '';
            alert('你的遗言已被封入黄裱纸。');
        },

        // ===== 重新开始 =====
        // 章节续关: 恢复本章开头的存点(不刷新页面)
        restartFromCheckpoint() {
            const cp = this.chapterCheckpoint;
            if (!cp) return;
            this.inventory = gameRuntime.normalizeInventory(cp.inventory || []);
            this.flags = { ...(cp.flags || {}) };
            if (cp.playerStats) this.playerStats = { ...this.playerStats, ...cp.playerStats };
            if (cp.ghostOpacity !== undefined) this.ghostOpacity = cp.ghostOpacity;
            this.holdFailed = false;
            this.currentNodeId = cp.nodeId;
            this.enterNode(cp.nodeId);
        },
        restartGame() {
            removeKey(KEYS.session);
            removeKey(KEYS.ghost);
            location.reload();
        },

        // ===== 多周目文本注入 =====
        injectNewGamePlusText(node) {
            if (this.deathCount <= 0) return node;
            const dc = this.deathCount;
            let text = node.text;
            // 根据死亡次数注入提示
            if (dc >= 2 && this.currentNodeId === 'node04') {
                text += '\n\n（你记得上一次，烧纸的人转过头来...是一张白纸脸。）';
            }
            if (dc >= 3 && this.currentNodeId === 'node09') {
                text += '\n\n（你死在这里两次了。这一次，不要出声。）';
            }
            if (dc >= 5 && this.currentNodeId === 'node14') {
                text = '【第' + dc + '次尝试】\n\n' + text;
            }
            return { ...node, text };
        },

        // ===== 存档系统 =====
        // ===== 结局收集册 =====
        toggleEndingBook() {
            this.showEndingBook = !this.showEndingBook;
        },
        recordEnding(code, name) {
            if (!this.endingCollection.includes(code)) {
                this.endingCollection.push(code);
                writeJSON(KEYS.endings, this.endingCollection);
            }
        },

        // ===== 真实时间彩蛋 =====
        checkRealTimeEasterEgg() {
            const h = new Date().getHours();
            const isJuly15 = false; // 可扩展农历判断
            if (h >= 0 && h < 5) {
                return '凌晨的黑暗最深。你确定要在这个时间打开它吗？';
            }
            if (h === 3 || h === 4) {
                return '现在是' + h + ':44。你知道这个时间意味着什么吗？';
            }
            return null;
        },

        // ===== 分享结局卡片 =====
        shareEnding() {
            const isDeath = this.currentNode?.isDeath;
            const name = this.currentNode?.endingName || this.currentNode?.deathName || '未知结局';
            const gameName = this.lang === 'zh' ? '回魂煞' : 'Soul Return';
            const shareUrl = (location.origin + location.pathname).replace(/index\.html$/, '');
            const text = isDeath
                ? `我在《${gameName}》中死在了【${name}】\n你敢来试试吗？\n${shareUrl}`
                : `我在《${gameName}》中打出了结局【${name}】\n你敢来试试吗？\n${shareUrl}`;
            if (navigator.share) {
                navigator.share({ title: gameName + ' · ' + name, text }).catch(() => {});
            } else if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => alert('分享文案已复制到剪贴板')).catch(() => alert('复制失败，请手动复制'));
            } else {
                alert('您的浏览器不支持自动复制，请手动复制以下文案：\n\n' + text);
            }
        },

        // ===== 结局名称查询 =====
        getEndingName(code) {
            const names = {
                'A': '红鸾星动', 'B': '鬼媒牵线', 'C': '封棺活人',
                'D': '借尸还魂', 'E': '冥婚已成', 'F': '逃出生天',
                'G': '替罪羔羊', 'H': '守灵人'
            };
            return names[code] || '未知';
        },

        // ===== 弹幕 =====
        showDanmu(text) {
            const id = this.danmuId++;
            const danmu = {
                id,
                text,
                style: { top: (40 + Math.random() * 100) + 'px' }
            };
            this.danmuList.push(danmu);
            // 动画移动
            this.$nextTick(() => {
                const el = document.querySelectorAll('.danmu');
                const target = el[el.length - 1];
                if (target) {
                    let pos = window.innerWidth;
                    const move = () => {
                        pos -= 1.2;
                        target.style.left = pos + 'px';
                        if (pos > -target.offsetWidth) requestAnimationFrame(move);
                        else {
                            const idx = this.danmuList.findIndex(d => d.id === id);
                            if (idx >= 0) this.danmuList.splice(idx, 1);
                        }
                    };
                    requestAnimationFrame(move);
                }
            });
        },

        // ===== 选项延迟动画 =====
        choiceDelay(idx) {
            return { animationDelay: (idx * 0.15) + 's' };
        },

        // ===== RPG系统 =====
        updatePlayerStats(node) {
            if (!node) return;
            const s = this.playerStats;
            // 根据节点类型自动计算属性变化
            if (node.isDeath) {
                s.hp = 0;
            } else if (node.statEffect) {
                this.applyStatEffect(node.statEffect);
            } else if (node.isEnding) {
                s.fear = Math.max(s.fear - 20, 0);
                s.sanity = Math.min(s.sanity + 10, s.maxSanity);
            } else if (node.holdRequired) {
                // 屏息节点：恐惧微增
                s.fear = Math.min(s.fear + 5, s.maxFear);
            } else if (node.vibration && node.vibration.length > 0) {
                // 有震动的恐怖节点
                const intensity = node.vibration.reduce((a, b) => a + b, 0);
                if (intensity > 400) {
                    s.sanity = Math.max(s.sanity - 15, 0);
                    s.fear = Math.min(s.fear + 15, s.maxFear);
                    s.hp = Math.max(s.hp - 5, 0);
                } else if (intensity > 200) {
                    s.sanity = Math.max(s.sanity - 10, 0);
                    s.fear = Math.min(s.fear + 10, s.maxFear);
                } else {
                    s.sanity = Math.max(s.sanity - 5, 0);
                    s.fear = Math.min(s.fear + 5, s.maxFear);
                }
            } else if (node.isFinal) {
                s.sanity = Math.max(s.sanity - 30, 0);
                s.fear = Math.min(s.fear + 30, s.maxFear);
            } else {
                // 普通节点：略微恢复理智
                s.sanity = Math.min(s.sanity + 2, s.maxSanity);
            }
            // 恐惧达到100时扣血
            if (s.fear >= 100) {
                s.hp = Math.max(s.hp - 10, 0);
            }
            // 理智为0时额外扣血
            if (s.sanity <= 0) {
                s.hp = Math.max(s.hp - 5, 0);
            }
            // 保存RPG属性
            writeJSON(KEYS.rpgStats, s);
        },
    }
}).mount('#app');









