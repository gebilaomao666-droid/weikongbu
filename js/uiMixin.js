// 菜单 / 背包面板 / 道具操作 子系统 (从 app.js 抽出的方法 mixin)。
// 相关状态仍在主组件 data(); Vue 合并后 this 指向同一实例。
import { gameRuntime } from './rpg/runtimeInstance.js?v=20260601-hotfix21';

export const uiMixin = {
    methods: {
        // 关闭所有顶层模态(可保留一个), 保证同一时刻只开一个面板, 避免互相遮盖
        _closeOverlays(except) {
            for (const k of ['menuVisible', 'inventoryVisible', 'settingsVisible', 'showSaveMenuRpg', 'showEndingBook', 'showSaveMenu']) {
                if (k !== except && k in this) this[k] = false;
            }
        },
        toggleMenu() {
            const open = !this.menuVisible;
            this._closeOverlays('menuVisible');
            this.menuVisible = open;
        },
        toggleInventory() {
            const open = !this.inventoryVisible;
            this._closeOverlays('inventoryVisible');
            this.inventoryVisible = open;
            this.selectedItem = null;
        },
        toggleSettings() {
            const open = !this.settingsVisible;
            this._closeOverlays('settingsVisible');
            this.settingsVisible = open;
        },
        toggleSaveMenuRpg() {
            const open = !this.showSaveMenuRpg;
            this._closeOverlays('showSaveMenuRpg');
            this.showSaveMenuRpg = open;
        },
        menuContinue() {
            this.menuVisible = false;
        },
        menuAction(action) {
            this.menuVisible = false;
            if (action === 'save') {
                this.showSaveMenuRpg = true;
            } else if (action === 'load') {
                this.showSaveMenuRpg = true;
            } else if (action === 'settings') {
                this.settingsVisible = true;
            } else if (action === 'book') {
                this.showEndingBook = true;
            }
        },
        menuReturnTitle() {
            if (confirm('返回主菜单将丢失未保存的进度，确定吗？')) {
                this.menuVisible = false;
                this.screen = 'start';
            }
        },
        menuQuit() {
            if (confirm('确定要退出游戏吗？')) {
                this.menuVisible = false;
                // 清除当前游戏状态
                this.currentNode = null;
                this.playerName = '';
                this.screen = 'start';
                // 尝试关闭窗口（浏览器限制下可能无效，则刷新回首页）
                window.location.reload();
            }
        },
        // 道具长按(≥450ms)展示介绍特写; 抑制随后的点击选中
        startItemPress(itemKey) {
            this._longPressed = false;
            if (this._itemPressTimer) clearTimeout(this._itemPressTimer);
            if (!itemKey) return;
            this._itemPressTimer = setTimeout(() => {
                this._itemPressTimer = null;
                this._longPressed = true;
                const item = gameRuntime.getItem(itemKey);
                if (item) {
                    this.showCloseup(
                        item.inspectImage || item.image || '',
                        item.inspectText || item.desc || '没有发现更多线索。',
                        null,
                        item.name || '道具',
                        '长按查看介绍 · 点下方返回。'
                    );
                }
            }, 450);
        },
        endItemPress() {
            if (this._itemPressTimer) { clearTimeout(this._itemPressTimer); this._itemPressTimer = null; }
        },
        selectInventoryItem(index) {
            if (this._longPressed) { this._longPressed = false; return; }
            const itemKey = this.inventory[index];
            this.selectInventoryKey(itemKey);
        },
        selectInventoryKey(itemKey) {
            if (this._longPressed) { this._longPressed = false; return; }
            if (!itemKey) {
                this.selectedItem = null;
                return;
            }
            const item = gameRuntime.getItem(itemKey) || { name: '未知物品', desc: '无法识别此物品。' };
            this.selectedItem = { ...item, key: itemKey };
            if (this.sceneExploreVisible) {
                this.inventoryVisible = false;
                this.showToast(`已选中：${this.selectedItem.name}`);
            }
        },
        inspectSelectedItem() {
            if (!this.selectedItem) return;
            const title = this.selectedItem.inspectTitle || this.selectedItem.name || '道具详情';
            const text = this.selectedItem.inspectText || this.selectedItem.desc || '没有发现更多线索。';
            const image = this.selectedItem.inspectImage || this.selectedItem.image || '';
            this.inventoryVisible = false;
            this.showCloseup(image, text, null, title, '细看道具，可能会发现下一步用法。');
        },
        canCombineSelectedItem() {
            return Boolean(this.selectedItem?.combine);
        },
        combineSelectedItem() {
            if (!this.selectedItem) return;
            const result = gameRuntime.combineItem(this.inventory, this.selectedItem.key);
            this.showToast(result.message);
            if (!result.success) return;
            this.inventory = result.inventory;
            this.selectedItem = null;
        },
        // 探索界面内就地合成(顶部"合成"按钮调用), 合成后刷新热点, 免去退出开背包
        craftInExplore(baseKey) {
            const result = gameRuntime.combineItem(this.inventory, baseKey);
            this.showToast(result.message);
            if (!result.success) return;
            this.inventory = result.inventory;
            this.selectedItem = null;
            if (this.refreshExploreHotspots) this.refreshExploreHotspots();
        },
        getItemName(itemKey) {
            return gameRuntime.getItem(itemKey)?.name || '未知物品';
        },
        getItemImage(itemKey) {
            const item = gameRuntime.getItem(itemKey);
            return item ? item.image : null;
        },
    }
};
