// 全局唯一的游戏运行时实例 (纯函数封装: 库存/道具/节点效果)。
// 由 app.js 与各 mixin 共享 import, 避免每处各自 createGameRuntime。
import { createGameRuntime } from './runtime.js?v=20260601-hotfix21';
import { NODES, ITEMS } from '../nodes.js?v=20260601-hotfix21';

export const gameRuntime = createGameRuntime({ nodes: NODES, items: ITEMS });
