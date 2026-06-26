const PLAYER_ID_KEY = 'hhs_player_id';

function createId(prefix) {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeItemKey(item) {
    if (!item) return '';
    if (typeof item === 'string') return item;
    return item.id || item.code || '';
}

function normalizeInventory(inventory = []) {
    const seen = new Set();
    const result = [];
    for (const item of inventory) {
        const key = normalizeItemKey(item);
        if (!key || seen.has(key)) continue;
        seen.add(key);
        result.push(key);
    }
    return result;
}

function createGameRuntime({ nodes, items }) {
    return {
        getPlayerId() {
            let id = localStorage.getItem(PLAYER_ID_KEY);
            if (!id) {
                id = createId('player');
                localStorage.setItem(PLAYER_ID_KEY, id);
            }
            return id;
        },

        getNode(nodeId) {
            return nodes[nodeId] || null;
        },

        normalizeItemKey,

        normalizeInventory,

        hasItem(inventory, itemKey) {
            if (!itemKey) return true;
            return normalizeInventory(inventory).includes(itemKey);
        },

        hasFlag(flags, flagKey) {
            if (!flagKey) return true;
            return Boolean(flags && flags[flagKey]);
        },

        canUseChoice(choice, state) {
            if (!choice) return false;
            if (choice.requireItem && !this.hasItem(state.inventory, choice.requireItem)) return false;
            if (choice.requireFlag && !this.hasFlag(state.flags, choice.requireFlag)) return false;
            const st = state && state.stats;
            if (st) {
                // 数值门控: 理智不足 / 恐惧过高时, 某些"冷静"选项不可用
                if (choice.requireSanityMin !== undefined && st.sanity < choice.requireSanityMin) return false;
                if (choice.requireFearMax !== undefined && st.fear > choice.requireFearMax) return false;
            }
            return true;
        },

        getVisibleChoices(node, state) {
            return (node?.choices || []).filter((choice) => this.canUseChoice(choice, state));
        },

        addItem(inventory, item) {
            const key = normalizeItemKey(item);
            if (!key) return normalizeInventory(inventory);
            const next = normalizeInventory(inventory);
            if (!next.includes(key)) next.push(key);
            return next;
        },

        removeItem(inventory, item) {
            const key = normalizeItemKey(item);
            if (!key) return normalizeInventory(inventory);
            return normalizeInventory(inventory).filter((entry) => entry !== key);
        },

        getItem(item) {
            const key = normalizeItemKey(item);
            return items[key] || null;
        },

        combineItem(inventory, item) {
            const key = normalizeItemKey(item);
            const itemData = this.getItem(key);
            const recipe = itemData?.combine;
            if (!key || !recipe) {
                return { success: false, message: '这件东西暂时不能和其他道具组合。' };
            }

            const required = [key, ...(recipe.with || [])];
            const next = normalizeInventory(inventory);
            const missing = required.find((itemKey) => !next.includes(itemKey));
            if (missing) {
                const missingItem = this.getItem(missing);
                return { success: false, message: `还缺少：${missingItem?.name || missing}` };
            }

            let combined = next;
            if (recipe.consume !== false) {
                combined = combined.filter((itemKey) => !required.includes(itemKey));
            }
            combined = this.addItem(combined, recipe.result);

            const resultItem = this.getItem(recipe.result);
            return {
                success: true,
                inventory: combined,
                result: recipe.result,
                message: recipe.message || `组合获得：${resultItem?.name || recipe.result}`
            };
        },

        // 手动合成提示: 若需要的道具没有, 但背包里凑齐了某配方的全部材料,
        // 返回一句提示玩家"去背包合成"的话; 否则返回 null(让调用方走默认的"还缺东西"提示)。
        combineHintFor(inventory, targetKey) {
            if (!targetKey || this.hasItem(inventory, targetKey)) return null;
            for (const key of Object.keys(items)) {
                const recipe = items[key]?.combine;
                if (!recipe || recipe.result !== targetKey) continue;
                const need = [key, ...(recipe.with || [])];
                if (need.every((k) => this.hasItem(inventory, k))) {
                    const names = need.map((k) => items[k]?.name || k).join(' + ');
                    const result = items[targetKey]?.name || targetKey;
                    return `打开背包，把 ${names} 合成「${result}」，再来用在这里。`;
                }
            }
            return null;
        },

        applyNodeEffects(node, state) {
            const flags = { ...(state.flags || {}) };
            let inventory = normalizeInventory(state.inventory);

            if (node?.item) {
                inventory = this.addItem(inventory, node.item);
            }
            if (node?.setFlags) {
                Object.assign(flags, node.setFlags);
            }

            return { flags, inventory };
        },

        createSaveSnapshot(state) {
            return {
                nodeId: state.currentNodeId,
                choicePath: [...(state.choicePath || [])],
                inventory: normalizeInventory(state.inventory),
                flags: { ...(state.flags || {}) },
                playerStats: { ...(state.playerStats || {}) },
                bgImage: state.bgImageUrl || '',
                chapter: state.currentNode?.chapter || '未知',
                savedAt: new Date().toLocaleString('zh-CN')
            };
        }
    };
}

export { createGameRuntime };
