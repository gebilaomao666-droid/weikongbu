const ART_BACKLOG = [
    {
        id: 'hall_explore_v2',
        priority: 'P0',
        type: 'scene',
        target: 'img/bg/ch02_hall_explore_v2.jpg',
        fallback: 'img/bg/ch02_living_room.jpg',
        node: 'node06_explore',
        promptDoc: 'docs/ART_ASSET_BACKLOG.md#堂屋探索图提示词'
    },
    {
        id: 'blood_note_closeup',
        priority: 'P0',
        type: 'closeup',
        target: 'img/closeup/closeup_blood_note.jpg',
        fallback: 'img/item/item_note.jpg',
        node: 'node06_explore.hotspots.paper_note',
        promptDoc: 'docs/ART_ASSET_BACKLOG.md#黄裱纸特写提示词'
    },
    {
        id: 'spirit_lamp_closeup',
        priority: 'P0',
        type: 'closeup',
        target: 'img/closeup/closeup_spirit_lamp.png',
        fallback: 'img/bg/ch02_living_room.jpg',
        node: 'node06_explore.hotspots.spirit_lamp',
        promptDoc: 'docs/ART_ASSET_BACKLOG.md#长明灯特写提示词'
    },
    {
        id: 'black_coffin_closeup',
        priority: 'P0',
        type: 'closeup',
        target: 'img/closeup/closeup_black_coffin.png',
        fallback: 'img/bg/ch02_living_room.jpg',
        node: 'node06_explore.hotspots.black_coffin',
        promptDoc: 'docs/ART_ASSET_BACKLOG.md#黑漆棺特写提示词'
    },
    {
        id: 'bus_scene_v2',
        priority: 'P0',
        type: 'scene',
        target: 'img/bg/ch01_bus_v2.png',
        fallback: 'img/bg/ch01_bus.jpg',
        node: 'chapter01',
        promptDoc: 'docs/ART_ASSET_BACKLOG.md'
    },
    {
        id: 'bus_interior_wide',
        priority: 'P0',
        type: 'story-scene',
        target: 'img/bg/ch01_bus_interior_wide.jpg',
        fallback: 'img/bg/ch01_bus.jpg',
        node: 'node01.sceneImage',
        promptDoc: 'docs/ART_ASSET_BACKLOG.md#车厢开场全景'
    },
    {
        id: 'bus_window_reflection',
        priority: 'P0',
        type: 'closeup',
        target: 'img/closeup/closeup_bus_window_reflection.jpg',
        fallback: 'img/bg/ch01_bus.jpg',
        node: 'node02.sceneImage,node02b.sceneImage',
        promptDoc: 'docs/ART_ASSET_BACKLOG.md#车窗倒影特写'
    },
    {
        id: 'phone_message_closeup',
        priority: 'P0',
        type: 'closeup',
        target: 'img/closeup/closeup_phone_message.jpg',
        fallback: 'img/item/item_note.jpg',
        node: 'node01_explore.hotspots.phone_message',
        promptDoc: 'docs/ART_ASSET_BACKLOG.md#手机短信特写'
    },
    {
        id: 'bus_window_face',
        priority: 'P0',
        type: 'closeup',
        target: 'img/closeup/closeup_bus_window_face.jpg',
        fallback: 'img/char/it_shadow.jpg',
        node: 'node02b.sceneImage',
        promptDoc: 'docs/ART_ASSET_BACKLOG.md#车窗鬼脸特写'
    },
    {
        id: 'rearview_mirror',
        priority: 'P0',
        type: 'closeup',
        target: 'img/closeup/closeup_rearview_mirror.jpg',
        fallback: 'img/bg/ch01_bus.jpg',
        node: 'node03.sceneImage',
        promptDoc: 'docs/ART_ASSET_BACKLOG.md#后视镜特写'
    },
    {
        id: 'driver_hands',
        priority: 'P0',
        type: 'closeup',
        target: 'img/closeup/closeup_driver_hands.jpg',
        fallback: 'img/bg/ch01_bus.jpg',
        node: 'node03b.sceneImage',
        promptDoc: 'docs/ART_ASSET_BACKLOG.md#司机手部特写'
    },
    {
        id: 'village_gate_burning_paper',
        priority: 'P0',
        type: 'story-scene',
        target: 'img/bg/ch01_village_gate_burning_paper.jpg',
        fallback: 'img/bg/ch09_graveyard.jpg',
        node: 'node04.sceneImage',
        promptDoc: 'docs/ART_ASSET_BACKLOG.md#村口烧纸镜头'
    },
    {
        id: 'lost_paper_people_death',
        priority: 'P0',
        type: 'death-cg',
        target: 'img/death/death_01_lost_paper_people.jpg',
        fallback: 'img/bg/ch01_village_gate_burning_paper.jpg',
        node: 'node_dead1.deathCG',
        promptDoc: 'docs/ART_ASSET_BACKLOG.md#迷失死亡CG'
    },
    {
        id: 'dead_frogs_ash',
        priority: 'P0',
        type: 'closeup',
        target: 'img/closeup/closeup_dead_frogs_ash.jpg',
        fallback: 'img/bg/ch01_village_gate_burning_paper.jpg',
        node: 'node05.sceneImage',
        promptDoc: 'docs/ART_ASSET_BACKLOG.md#死青蛙与纸灰特写'
    },
    {
        id: 'wet_footprints',
        priority: 'P0',
        type: 'closeup',
        target: 'img/closeup/closeup_wet_footprints.jpg',
        fallback: 'img/bg/ch09_graveyard.jpg',
        node: 'node05b.sceneImage',
        promptDoc: 'docs/ART_ASSET_BACKLOG.md#湿脚印特写'
    }
];

function artTargetsByPriority(priority = 'P0') {
    return ART_BACKLOG.filter((asset) => asset.priority === priority);
}

export { ART_BACKLOG, artTargetsByPriority };
