// ===== 音效引擎 =====
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function resumeAudio() {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playTone(freq, duration, type = 'sine', vol = 0.1) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + duration);
}

function playHeartbeat(bpm) {
    if (!audioCtx) return;
    const interval = 60 / bpm;
    let count = 0;
    const beat = () => {
        if (count++ > 10) return;
        playTone(40, 0.15, 'sine', 0.3);
        setTimeout(() => playTone(40, 0.15, 'sine', 0.25), 150);
        setTimeout(beat, interval * 1000);
    };
    beat();
}

function playScream() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(3000, audioCtx.currentTime + 0.3);
    osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 1.5);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 1.5);
}

function playKnock() {
    if (!audioCtx) return;
    const bufferSize = audioCtx.sampleRate * 0.1;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / bufferSize * 5);
    const src = audioCtx.createBufferSource();
    src.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.value = 0.4;
    src.connect(gain); gain.connect(audioCtx.destination);
    src.start();
}

function playWhisper() {
    if (!audioCtx) return;
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.05 * Math.sin(i / bufferSize * Math.PI);
    }
    const src = audioCtx.createBufferSource();
    src.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2);
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    src.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
    src.start();
}

function playTinnitus() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(8000, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(12000, audioCtx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 3);
}

// ===== BGM(程序化氛围乐 + 唢呐悲调,无音频文件) =====
let bgmNodes = null;
let suonaTimer = null;
let bgmMaster = null;

// 唢呐悲句: 锯齿波 + 带通共鸣峰(唢呐的亮/哭腔)+ 颤音 + 音间滑音, 奏一段哀婉下行送葬腔。
function playSuonaPhrase(destGain, volScale = 1) {
    if (!audioCtx) return;
    const out = destGain || audioCtx.destination;
    const t0 = audioCtx.currentTime + 0.05;
    // D 调五声哀腔, 下行带回挑(送葬/哭腔感)
    const notes = [587.33, 523.25, 440.00, 392.00, 440.00, 349.23, 392.00, 293.66];
    const durs  = [0.55,   0.40,   0.75,   0.45,   0.30,   0.55,   0.45,   1.30];

    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    const bp = audioCtx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 1500; bp.Q.value = 4.5;
    const peak = audioCtx.createGain();
    peak.gain.setValueAtTime(0.0001, t0);

    // 颤音(唢呐的抖音)
    const vib = audioCtx.createOscillator(); vib.frequency.value = 5.5;
    const vibg = audioCtx.createGain(); vibg.gain.value = 7;
    vib.connect(vibg); vibg.connect(osc.frequency);

    osc.connect(bp); bp.connect(peak); peak.connect(out);

    let t = t0;
    osc.frequency.setValueAtTime(notes[0], t);
    for (let i = 0; i < notes.length; i++) {
        const d = durs[i];
        osc.frequency.exponentialRampToValueAtTime(notes[i], t + 0.1);   // 滑音到该音
        peak.gain.setValueAtTime(Math.max(peak.gain.value || 0.0001, 0.0001), t);
        peak.gain.exponentialRampToValueAtTime(0.085 * volScale, t + 0.07); // 起音
        peak.gain.exponentialRampToValueAtTime(0.028 * volScale, t + d * 0.85); // 持续渐弱
        t += d;
    }
    peak.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    osc.start(t0); vib.start(t0);
    osc.stop(t + 0.5); vib.stop(t + 0.5);
}

// ===== 真实音频文件层(放了 mp3 就用真音乐, 没放就回退到下面的程序合成) =====
// 把无版权 mp3 放到 vue-frontend/audio/ 下, 用这些文件名即可自动生效:
const BGM_FILES = {
    base:    'audio/bgm_ambient_loop.mp3',   // 全程氛围铺底(可循环)
    wedding: 'audio/bgm_suona_climax.mp3',   // 冥婚/阴阳: 唢呐送葬悲调
    ritual:  'audio/bgm_suona_climax.mp3',   // 回魂: 同上
    ending:  'audio/bgm_ending_relief.mp3',  // 感人结局: 哀婉释怀
};
const BGM_VOL = { base: 0.5, wedding: 0.62, ritual: 0.62, ending: 0.66 };
// 音频缓存版本: 仅在"替换某个音频文件内容"时手动 +1(a1→a2…), 不随代码令牌走, 免得每次部署都重下数 MB 音频。
const AUDIO_VER = 'a3';
let fileBgmEl = null;
let fileBgmFade = null;

function fadeAudioEl(el, to, ms, onDone) {
    if (fileBgmFade) { clearInterval(fileBgmFade); fileBgmFade = null; }
    const from = el.volume;
    const steps = Math.max(1, Math.round(ms / 50));
    let i = 0;
    fileBgmFade = setInterval(() => {
        i++;
        el.volume = Math.min(1, Math.max(0, from + (to - from) * (i / steps)));
        if (i >= steps) { clearInterval(fileBgmFade); fileBgmFade = null; if (onDone) onDone(); }
    }, 50);
}

// 启动 BGM: 先尝试真实音频文件; 加载失败(文件不存在等)则回退程序合成。
function startBgm(mood = 'base') {
    initAudio();
    if (!audioCtx) return;
    const src = (BGM_FILES[mood] || BGM_FILES.base) + '?v=' + AUDIO_VER;
    const targetVol = BGM_VOL[mood] || 0.5;

    // 先停掉旧的(文件 + 合成)
    stopFileBgm(true);
    stopSynthBgm(true);

    const el = new Audio();
    el.loop = true;
    el.preload = 'auto';
    el.volume = 0;
    let usedFile = false;
    el.addEventListener('canplay', () => {
        if (usedFile) return;
        usedFile = true;
        fileBgmEl = el;
        el.play().then(() => fadeAudioEl(el, targetVol, 2500))
            .catch(() => { fileBgmEl = null; startSynthBgm(mood); });   // 自动播放被拦也回退
    }, { once: true });
    el.addEventListener('error', () => { if (!usedFile) startSynthBgm(mood); }, { once: true });
    el.src = src;
    el.load();
}

function stopFileBgm(immediate) {
    if (fileBgmFade) { clearInterval(fileBgmFade); fileBgmFade = null; }
    const el = fileBgmEl;
    fileBgmEl = null;
    if (!el) return;
    if (immediate) { try { el.pause(); } catch (e) {} return; }
    fadeAudioEl(el, 0, 1200, () => { try { el.pause(); } catch (e) {} });
}

// 启动程序合成氛围乐(真实音频缺失时的兜底)
function startSynthBgm(mood = 'base') {
    initAudio();
    if (!audioCtx) return;
    stopSynthBgm(true);
    const now = audioCtx.currentTime;

    bgmMaster = audioCtx.createGain();
    bgmMaster.gain.setValueAtTime(0.0001, now);
    const target = mood === 'base' ? 0.10 : 0.13;
    bgmMaster.gain.exponentialRampToValueAtTime(target, now + 3.5); // 缓入
    bgmMaster.connect(audioCtx.destination);

    // 低频 drone: 根音 + 五度, 极慢呼吸
    const roots = mood === 'wedding' ? [55.00, 82.41]
        : mood === 'ritual' ? [49.00, 73.42]
        : mood === 'ending' ? [65.41, 98.00]
        : [58.27, 87.31];
    const oscs = [];
    roots.forEach((f, idx) => {
        const o = audioCtx.createOscillator();
        o.type = idx === 0 ? 'sine' : 'triangle';
        o.frequency.value = f;
        const g = audioCtx.createGain();
        g.gain.value = 0.5;
        const lfo = audioCtx.createOscillator();
        lfo.frequency.value = 0.06 + idx * 0.03;
        const lfoG = audioCtx.createGain();
        lfoG.gain.value = 0.28;
        lfo.connect(lfoG); lfoG.connect(g.gain);
        o.connect(g); g.connect(bgmMaster);
        o.start(); lfo.start();
        oscs.push(o, lfo);
    });
    bgmNodes = { oscs };

    // 冥婚/回魂/结局: 周期性奏唢呐悲句
    if (mood === 'wedding' || mood === 'ritual' || mood === 'ending') {
        const fire = () => playSuonaPhrase(bgmMaster, mood === 'ending' ? 1.15 : 1);
        setTimeout(fire, 1800);
        suonaTimer = setInterval(fire, mood === 'ending' ? 9000 : 13000);
    }
}

function stopSynthBgm(immediate = false) {
    if (suonaTimer) { clearInterval(suonaTimer); suonaTimer = null; }
    if (bgmMaster && audioCtx) {
        const now = audioCtx.currentTime;
        try {
            bgmMaster.gain.cancelScheduledValues(now);
            bgmMaster.gain.setValueAtTime(Math.max(bgmMaster.gain.value, 0.0001), now);
            bgmMaster.gain.exponentialRampToValueAtTime(0.0001, now + (immediate ? 0.25 : 1.6));
        } catch (e) {}
    }
    if (bgmNodes) {
        const stopAt = audioCtx ? audioCtx.currentTime + (immediate ? 0.3 : 1.7) : 0;
        bgmNodes.oscs.forEach((o) => { try { o.stop(stopAt); } catch (e) {} });
        bgmNodes = null;
    }
    bgmMaster = null;
}

// 停止全部 BGM(文件 + 合成)
function stopBgm(immediate = false) {
    stopFileBgm(immediate);
    stopSynthBgm(immediate);
}

// 惊吓瞬间音效: 有 sfx_jumpscare.mp3 用文件, 否则回退 playScream
function playJumpscareSfx() {
    const el = new Audio();
    el.volume = 0.9;
    let ok = false;
    el.addEventListener('canplay', () => { ok = true; el.play().catch(() => playScream()); }, { once: true });
    el.addEventListener('error', () => { if (!ok) playScream(); }, { once: true });
    el.src = 'audio/sfx_jumpscare.mp3?v=' + AUDIO_VER;
    el.load();
}

export { initAudio, resumeAudio, playTone, playHeartbeat, playScream, playKnock, playWhisper, playTinnitus, startBgm, stopBgm, playSuonaPhrase, playJumpscareSfx };
