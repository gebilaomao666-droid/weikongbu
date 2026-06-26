const CHAPTER_BACKGROUNDS = {
    '第一章：末班车与夜路': 'img/bg/ch01_bus.jpg',
    '第二章：三条死规矩': 'img/bg/ch02_living_room.jpg',
    '第三章：熄灭的灯与厨房': 'img/bg/ch03_kitchen.jpg',
    '第四章：屏息与视线': 'img/bg/ch04_basement.jpg',
    '第五章：终焉的倒计时': 'img/bg/ch04_basement.jpg',
    '第六章：地下室的秘密': 'img/bg/ch04_basement.jpg',
    '第七章：纸人村': 'img/bg/ch06_village_street.jpg',
    '第八章：冥婚大典': 'img/bg/ch05_shrine.jpg',
    '第九章：阴阳路': 'img/bg/ch09_graveyard.jpg',
    '第十章：回魂': 'img/bg/ch10_ritual.jpg'
};

const SCENE_NAMES = {
    '第一章：末班车与夜路': '村路',
    '第二章：三条死规矩': '老宅客厅',
    '第三章：熄灭的灯与厨房': '厨房',
    '第四章：屏息与视线': '堂屋',
    '第五章：终焉的倒计时': '堂屋',
    '第六章：地下室的秘密': '地下室',
    '第七章：纸人村': '纸人村',
    '第八章：冥婚大典': '祠堂',
    '第九章：阴阳路': '阴阳路',
    '第十章：回魂': '回魂台'
};

const CHAPTER_OBJECTIVES = [
    { match: ['末班车', '夜路'], text: '确认末班车为什么不停' },
    { match: ['三条死规矩'], text: '记住规矩，守住长明灯' },
    { match: ['厨房'], text: '找能让灯继续烧的东西' },
    { match: ['屏息', '终焉'], text: '查清堂屋，不要乱碰棺材' },
    { match: ['地下室'], text: '沿着声音找到被藏起的东西' },
    { match: ['纸人村'], text: '分清活人和纸人' },
    { match: ['冥婚'], text: '破坏这场不该办的婚礼' },
    { match: ['回魂'], text: '把爷爷带回该去的地方' }
];

const UI_ASSETS = {
    paper: 'img/ui/bg_paper.png',
    bloodBorder: 'img/ui/border_blood.png',
    buttonPanel: 'img/ui/rebuild_button_panel.png',
    dialogPanel: 'img/ui/rebuild_dialog_panel.png',
    menuPanel: 'img/ui/panel_menu.png',
    menuBg: 'img/ui/rebuild_menu_bg.png',
    saveSlots: 'img/ui/panel_save_slots.png',
    sceneNav: 'img/ui/panel_scene_nav.png',
    popup: 'img/ui/popup_confirm.png',
    statusBars: 'img/ui/status_bars.png',
    icons: 'img/ui/ic_icons.png',
    items: 'img/ui/item_icons.png'
};

const OPTIONAL_ART_ASSETS = [
    'img/bg/ch01_bus_interior_wide.jpg',
    'img/closeup/closeup_phone_message.jpg',
    'img/closeup/closeup_bus_window_reflection.jpg',
    'img/closeup/closeup_bus_window_face.jpg',
    'img/closeup/closeup_rearview_mirror.jpg',
    'img/closeup/closeup_driver_hands.jpg',
    'img/bg/ch01_village_gate_burning_paper.jpg',
    'img/closeup/closeup_dead_frogs_ash.jpg',
    'img/closeup/closeup_wet_footprints.jpg',
    'img/item/item_note.jpg',
    'img/item/item_match.jpg',
    'img/item/item_red_string.jpg',
    'img/item/item_key.jpg',
    'img/item/item_peach_talisman.jpg'
];

function sceneNameForChapter(chapter = '') {
    return SCENE_NAMES[chapter] || chapter || '';
}

function objectiveForNode(node, state = {}) {
    if (state.selectedItem) return `使用：${state.selectedItem.name}`;
    if (state.sceneExploreVisible) return '搜查场景里的异常物件';
    if (node?.holdRequired) return '按住屏息，别让它听见';
    if (node?.puzzleLock) return '解开眼前的机关';
    if (node?.exploreScene) return '进入场景调查';

    const chapter = node?.chapter || '';
    const entry = CHAPTER_OBJECTIVES.find((item) => item.match.some((word) => chapter.includes(word)));
    return entry?.text || '继续调查';
}

function preloadImageList() {
    return [
        'img/death/death_12_wedding.jpg',
        'img/death/death_01_lost_paper_people.jpg',
        'img/death/death_09_possess.jpg',
        'img/bg/paper_bride.jpg',
        'img/bg/under_bed.jpg',
        'img/bg/ch02_hall_explore_v2.jpg',
        'img/closeup/closeup_blood_note.jpg',
        'img/closeup/closeup_spirit_lamp_dim.jpg',
        'img/closeup/closeup_altar_ash_red_string.jpg',
        'img/closeup/closeup_coffin_sealed_name_tag.jpg',
        ...Object.values(CHAPTER_BACKGROUNDS),
        ...Object.values(UI_ASSETS)
    ];
}

export {
    CHAPTER_BACKGROUNDS,
    OPTIONAL_ART_ASSETS,
    UI_ASSETS,
    sceneNameForChapter,
    objectiveForNode,
    preloadImageList
};
