// 场景探索 / 密码锁 / 道具特写 子系统 (从 app.js 抽出的方法 mixin)。
// 相关状态仍在主组件 data(); Vue 合并后 this 指向同一实例。
import { getVisibleHotspots, resolveHotspot } from './rpg/sceneEngine.js?v=20260601-hotfix21';
import { gameRuntime } from './rpg/runtimeInstance.js?v=20260601-hotfix21';
import { playScream, playWhisper, playKnock, playTone } from './audio.js?v=20260601-hotfix21';

export const sceneMixin = {
    methods: {
        showSceneExplore(image, title, hotspots, node = {}) {
            this.exploreSceneId = node.sceneId || this.currentNodeId || title || 'scene';
            this.exploreImage = image;
            this.exploreTitle = title;
            this.exploreHint = node.sceneHint || '点击场景里的可疑处。选中背包道具后，可以直接点场景物件使用。';
            this.exploreReturnNode = node.returnNode || node.backNode || node.closeNode || null;
            this.exploreCloseText = node.closeText || (this.exploreReturnNode ? '退出场景' : this.t('close'));
            this.exploreAllHotspots = hotspots || [];
            this.refreshExploreHotspots();
            this.sceneExploreVisible = true;
        },
        refreshExploreHotspots() {
            this.exploreHotspots = getVisibleHotspots(this.exploreAllHotspots, {
                sceneId: this.exploreSceneId,
                inventory: this.inventory,
                flags: this.flags
            });
        },
        onHotspotClick(hs) {
            // 手动合成 + 提示: 需要的道具没有但背包材料够 → 提示玩家去背包合成(不自动做, 保留解谜)
            if (hs.requireItem && !gameRuntime.hasItem(this.inventory, hs.requireItem)) {
                const hint = gameRuntime.combineHintFor(this.inventory, hs.requireItem);
                if (hint) { this.showToast(hint); return; }
            }
            const result = resolveHotspot(hs, {
                sceneId: this.exploreSceneId,
                selectedItem: this.selectedItem?.key || null,
                inventory: this.inventory,
                flags: this.flags
            });

            if (result.blocked) {
                this.showToast(result.message);
                return;
            }

            if (result.flags && Object.keys(result.flags).length > 0) {
                this.flags = { ...this.flags, ...result.flags };
            }
            if (result.consumeItem) {
                this.inventory = gameRuntime.removeItem(this.inventory, result.consumeItem);
                this.selectedItem = null;
            }
            if (!result.consumeItem && hs.requireItem && this.selectedItem?.key === hs.requireItem) {
                this.selectedItem = null;
            }
            if (result.addItem && !gameRuntime.hasItem(this.inventory, result.addItem)) {
                this.inventory = gameRuntime.addItem(this.inventory, result.addItem);
                // 若紧接着会弹特写, 不再弹"获得道具"toast(否则与特写文字重叠); 由特写自述
                if (!hs.closeup) this.showToast(result.toast || `获得道具：${hs.itemName || result.addItem}`);
            } else if (result.toast && !hs.closeup) {
                this.showToast(result.toast);
            }
            this.refreshExploreHotspots();
            this._hotspotFeedback(hs);

            if (hs.puzzle) {
                this.sceneExploreVisible = false;
                this.showPuzzle(hs.puzzleType, hs.puzzleTarget, hs.puzzleHint, (success) => {
                    if (success && hs.puzzleSuccessNode) this.enterNode(hs.puzzleSuccessNode);
                    else if (!success && hs.puzzleFailNode) this.enterNode(hs.puzzleFailNode);
                });
                return;
            }
            if (hs.closeup) {
                this.showCloseup(
                    hs.closeupImage,
                    hs.closeupText,
                    hs.closeupNextNode,
                    hs.closeupTitle || hs.itemName || hs.label || '物件特写',
                    hs.closeupHint || '这件东西也许会改变后面的选择。'
                );
                return;
            }
            if (hs.deathNode) {
                this.sceneExploreVisible = false;
                this.enterNode(hs.deathNode);
                return;
            }
            if (hs.nextNode) {
                this.sceneExploreVisible = false;
                this.enterNode(hs.nextNode);
            }
        },
        // 探索热点感官反馈: 死亡→尖叫+重震; 禁忌窥视→耳语+中震; 发现→轻音+轻震
        // 热点可用 sfx('scream'|'whisper'|'knock'|'tone') 与 vib([..]) 字段显式覆盖
        _hotspotFeedback(hs) {
            const hint = (hs.closeupHint || '') + (hs.closeupTitle || '') + (hs.label || '');
            if (hs.vib || hs.sfx) {
                if (hs.vib) this.vibrate(hs.vib);
                if (hs.sfx === 'scream') playScream();
                else if (hs.sfx === 'whisper') playWhisper();
                else if (hs.sfx === 'knock') playKnock();
                else if (hs.sfx === 'tone') playTone(180, 0.4, 'sine', 0.05);
                return;
            }
            if (hs.deathNode) { this.vibrate([300, 200, 300]); playScream(); }
            else if (/别往|水里|水面|井|镜|血玉|倒影|盯/.test(hint)) { this.vibrate([60, 120, 60]); playWhisper(); }
            else if (hs.item || (hs.setFlags && Object.keys(hs.setFlags).length)) { this.vibrate([30, 60, 30]); playTone(180, 0.4, 'sine', 0.05); }
        },
        closeSceneExplore() {
            this.sceneExploreVisible = false;
            this.selectedItem = null;
            if (this.exploreReturnNode) {
                const next = this.exploreReturnNode;
                this.exploreReturnNode = null;
                this.exploreCloseText = '';
                setTimeout(() => this.enterNode(next), 160);
            }
        },

        // ===== 密码锁 =====
        showPuzzle(type, target, hint, callback) {
            this.puzzleType = type;
            this.puzzleTarget = target;
            this.puzzleHint = hint || '';
            this.puzzleInput = '';
            this.puzzleCallback = callback;
            this.puzzleVisible = true;
        },
        onPuzzleKey(key) {
            if (key === 'clear') { this.puzzleInput = ''; return; }
            if (key === 'enter') {
                const success = this.puzzleInput === this.puzzleTarget;
                this.puzzleVisible = false;
                if (this.puzzleCallback) this.puzzleCallback(success);
                return;
            }
            if (this.puzzleInput.length < 6) this.puzzleInput += key;
        },
        closePuzzle() {
            this.puzzleVisible = false;
            if (this.puzzleCallback) this.puzzleCallback(false);
        },

        // ===== 道具特写 =====
        showCloseup(image, text, nextNode, title = '物件特写', hint = '细看之后，点下方返回。') {
            this.achievementToast = null;   // 清掉残留 toast, 避免与特写文字重叠(互相遮盖)
            this.closeupImage = image;
            this.closeupText = text;
            this.closeupTitle = title;
            this.closeupHint = hint;
            this.closeupNextNode = nextNode;
            this.closeupVisible = true;
        },
        closeCloseup() {
            this.closeupVisible = false;
            this.closeupTitle = '';
            this.closeupHint = '';
            if (this.closeupNextNode) this.enterNode(this.closeupNextNode);
        },
    }
};
