// 存档 / 读档 / 设置持久化 子系统 (从 app.js 抽出的方法 mixin)。
// 相关状态 (saveSlots/playerStats/settings 等) 仍在主组件 data(); Vue 合并后 this 指向同一实例。
import { gameRuntime } from './rpg/runtimeInstance.js?v=20260601-hotfix21';
import { KEYS, readJSON, writeJSON } from './storage.js?v=20260601-hotfix21';

export const persistenceMixin = {
    methods: {
        manualSave(slotIndex) {
            const save = {
                slot: slotIndex,
                nodeId: this.currentNodeId,
                nodeName: this.currentNode?.chapter || '未知',
                time: new Date().toLocaleString('zh-CN'),
                pathLength: this.choicePath.length,
                inventory: gameRuntime.normalizeInventory(this.inventory),
                flags: { ...this.flags },
                playerStats: { ...this.playerStats },
                bgImage: this.bgImageUrl || ''
            };
            // 确保saveSlots有3个位置
            while (this.saveSlots.length < 3) this.saveSlots.push(null);
            this.saveSlots[slotIndex] = save;
            writeJSON(KEYS.saves, this.saveSlots);
            alert('存档已保存到槽位 ' + (slotIndex + 1));
        },
        manualLoad(slotIndex) {
            const save = this.saveSlots[slotIndex];
            if (!save) {
                alert('该存档槽为空');
                return;
            }
            if (confirm('读取存档「' + save.nodeName + '」？\n时间：' + save.time)) {
                this.currentNodeId = save.nodeId;
                this.inventory = gameRuntime.normalizeInventory(save.inventory || this.inventory);
                this.flags = save.flags || this.flags || {};
                if (save.playerStats) this.playerStats = { ...this.playerStats, ...save.playerStats };
                if (save.bgImage) this.bgImageUrl = save.bgImage;
                this.showSaveMenu = false;
                this.showSaveMenuRpg = false;
                this.enterNode(save.nodeId);
            }
        },
        toggleSaveMenu() {
            if (this.rpgMode) {
                this.showSaveMenuRpg = !this.showSaveMenuRpg;
                this.showSaveMenu = false;
                return;
            }
            this.showSaveMenu = !this.showSaveMenu;
        },
        manualSaveRpg(slotIndex) {
            const save = {
                slot: slotIndex,
                nodeId: this.currentNodeId,
                nodeName: this.currentNode?.chapter || '未知',
                time: new Date().toLocaleString('zh-CN'),
                pathLength: this.choicePath.length,
                bgImage: this.bgImageUrl || '',
                hp: this.playerStats.hp,
                sanity: this.playerStats.sanity,
                fear: this.playerStats.fear,
                inventory: gameRuntime.normalizeInventory(this.inventory),
                flags: { ...this.flags },
                playerStats: { ...this.playerStats }
            };
            while (this.saveSlots.length < 3) this.saveSlots.push(null);
            this.saveSlots[slotIndex] = save;
            writeJSON(KEYS.saves, this.saveSlots);
            this.showToast('存档已保存到槽位 ' + (slotIndex + 1));
            this.showSaveMenuRpg = false;
        },
        deleteSave(slotIndex) {
            if (!confirm('确定要删除存档「' + (this.saveSlots[slotIndex]?.nodeName || '空槽位') + '」吗？')) return;
            while (this.saveSlots.length < 3) this.saveSlots.push(null);
            this.saveSlots[slotIndex] = null;
            writeJSON(KEYS.saves, this.saveSlots);
            this.showToast('存档已删除');
        },
        saveSettings() {
            const settings = {
                textSpeed: this.textSpeed,
                soundEnabled: this.soundEnabled,
                vibrationEnabled: this.vibrationEnabled,
                rpgMode: true
            };
            this.rpgMode = true;
            writeJSON(KEYS.settings, settings);
        },
        loadSettings() {
            try {
                const s = readJSON(KEYS.settings, {});
                if (s.textSpeed !== undefined) this.textSpeed = s.textSpeed;
                if (s.soundEnabled !== undefined) this.soundEnabled = s.soundEnabled;
                if (s.vibrationEnabled !== undefined) this.vibrationEnabled = s.vibrationEnabled;
            } catch(e) {}
            this.rpgMode = true;
        },
    }
};
