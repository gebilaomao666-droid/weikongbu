// ===== 回魂夜 · 完整版超长剧情节点图 =====

// 10章 | 80+节点 | 12种死亡 | 8种结局 | 隐藏路线 | 收集要素



const EPITAPHS = [

    "一个被遗忘的名字", "凌晨三点的访客", "镜子里的陌生人",

    "没有关紧的柜门", "床底的呼吸声", "楼梯上的脚步声",

    "手机屏幕的微光", "永远打不通的电话", "最后一班地铁",

    "停电那夜的影子", "阁楼上的旧箱子", "浴室里的雾气",

    "自动播放的唱片", "走廊尽头的红光", "永远重复的噩梦",

    "窗户外面的脸", "沙发凹陷的痕迹", "冰箱里的纸条",

    "相册多出来的照片", "GPS定位的空白", "没有发送成功的消息",

    "404 Not Found", "信号丢失的第七秒", "缓存区残留意识",

    "第五根手指", "倒映在杯底的眼睛", "永远停在23:59的时钟"

];



const NODES = {

    // ==================== 第一章：末班车与夜路 ====================

    'node01': {

        chapter: '第一章：末班车与夜路',
        sceneName: '末班车',

        time: '23:30',

        bgImage: 'img/bg/ch01_bus_interior_wide.jpg',
        sceneImage: 'img/bg/ch01_bus_interior_wide.jpg',

        text: '你坐在空荡荡的末班大巴最后一排。母亲发短信说爷爷走了，让你今晚务必回村。大巴在颠簸，车厢里弥漫着劣质汽油、雨水和泥土混在一起的腥味。\n\n手机屏幕亮了一下，电量显示：80%。信号满格。可你忽然发现，车厢里除了发动机声，什么都太安静了。',

        vibration: null,

        signal: 4, battery: 80,

        choices: [

            { text: '压低身子，先观察车厢', next: 'node01_explore' },

            { text: '直接看向窗外', next: 'node02' },

            { text: '抬头看前面的后视镜', next: 'node03', vibration: [50, 100, 50] }

        ]

    },

    'node01_return': {

        chapter: '第一章：末班车与夜路',
        sceneName: '末班车',

        time: '23:31',

        bgImage: 'img/bg/ch01_bus_interior_wide.jpg',

        text: '你缩回最后一排，车厢又安静下来。\n\n刚才看见的东西没有消失，只是藏回了黑暗里。前面的后视镜轻轻晃着，车窗外有水痕往下爬，像有人用湿手贴着玻璃。',

        signal: 4, battery: 79,

        choices: [

            { text: '继续压低身子搜查车厢', next: 'node01_explore' },

            { text: '立刻看向窗外', next: 'node02' },

            { text: '抬头看前面的后视镜', next: 'node03' },

            { text: '趁前门开缝下车', next: 'node04', requireFlag: 'bus_driver_hands_seen' }

        ]

    },

    'node01_explore': {

        chapter: '第一章：末班车与夜路',
        sceneName: '末班车车厢',

        time: '23:31',

        bgImage: 'img/bg/ch01_bus_interior_wide.jpg',

        text: '你没有立刻抬头，而是让手机的冷光贴着掌心，慢慢扫过车厢。\n\n座椅一排排空着，扶手上有干掉的泥点。车窗外一片漆黑，前方后视镜偶尔晃一下，像有人在镜子里眨眼。\n\n你决定先弄清这辆车上到底还有什么。',

        exploreScene: true,

        sceneId: 'late_bus_interior',
        returnNode: 'node01_return',
        closeText: '缩回座位',

        sceneImage: 'img/bg/ch01_bus_interior_wide.jpg',

        sceneTitle: '末班车车厢',

        sceneHint: '点车窗、后视镜、司机手和手机。不要急着让自己被看见。',

        signal: 4, battery: 79,

        hotspots: [

            {
                id: 'phone_message',
                x: 38, y: 72, w: 24, h: 15,
                label: '手机冷光',
                once: true,
                setFlags: { bus_phone_checked: true },
                toast: '母亲的信息停在屏幕上，最后一个字像被水泡开了。车前方的镜子忽然晃了一下。',
                closeup: true,
                closeupTitle: '母亲的信息',
                closeupHint: '信息是真的，但发出信息的人不一定还在原来的地方。',
                closeupImage: 'img/closeup/closeup_phone_message.jpg',
                closeupText: '短信只有一句："爷爷走了，今晚一定回来。"下面还有一条未发送的草稿，收件人是你自己："别坐最后一排。"'
            },

            {
                id: 'bus_window',
                x: 8, y: 24, w: 28, h: 32,
                label: '车窗反光',
                once: true,
                setFlags: { bus_window_seen: true },
                closeup: true,
                closeupTitle: '车窗外的头发',
                closeupHint: '车外没有路灯，玻璃却把车顶照得很清楚。',
                closeupImage: 'img/closeup/closeup_bus_window_reflection.jpg',
                closeupText: '车窗里映出车顶边缘：一团湿漉漉的黑影趴在那里，长头发一缕一缕垂下来。你一眨眼，那些头发离窗边更近了。'
            },

            {
                id: 'rearview_mirror',
                x: 48, y: 12, w: 22, h: 12,
                label: '后视镜',
                once: true,
                setFlags: { bus_mirror_seen: true },
                closeup: true,
                closeupTitle: '后视镜',
                closeupHint: '镜子里看见的东西，通常也在看你。',
                closeupImage: 'img/closeup/closeup_rearview_mirror.jpg',
                closeupText: '司机没有回头。可后视镜里，他的脖子歪成一个不可能的角度。仪表盘的时间停在 23:59，像有人把这一分钟钉死在车上。'
            },

            {
                id: 'driver_hands',
                x: 52, y: 44, w: 20, h: 18,
                label: '司机的手',
                visibleWhenFlag: 'bus_mirror_seen',
                once: true,
                setFlags: { bus_driver_hands_seen: true },
                closeup: true,
                closeupTitle: '司机的手',
                closeupHint: '你已经知道他不该是活人。看完这双手后，前门那边会有动静。',
                closeupImage: 'img/closeup/closeup_driver_hands.jpg',
                closeupText: '那双手搭在方向盘上，惨白、僵硬，指甲缝里塞满黑泥。最可怕的是，你数了两遍，左手只有四根手指。\n\n你刚想缩回去，前门忽然开了一条很细的缝。'
            },

            {
                id: 'get_off_bus',
                x: 72, y: 26, w: 18, h: 30,
                label: '前门',
                visibleWhenFlag: 'bus_driver_hands_seen',
                nextNode: 'node04',
                toast: '车门吱呀一声开了，外面的黑暗像等了很久。'
            }

        ],

        vibration: [20, 40, 20]

    },

    'node02': {

        sceneImage: 'img/closeup/closeup_bus_window_reflection.jpg',

        chapter: '第一章：末班车与夜路',
        sceneName: '末班车车窗',

        time: '23:32',

        text: '窗外一片漆黑。你只看了一眼，却在车窗反光里看到车顶边缘趴着一团黑乎乎的东西。\n\n长头发一缕一缕垂下来，贴在玻璃外面。那头发在动。不是风吹的。',

        vibration: [30, 60, 30],

        signal: 4, battery: 78,

        choices: [

            { text: '立刻移开视线', next: 'node04' },

            { text: '继续盯着那团头发', next: 'node02b', vibration: [80, 120, 80] }

        ]

    },

    'node02b': {

        sceneImage: 'img/closeup/closeup_bus_window_face.jpg',

        chapter: '第一章：末班车与夜路',
        sceneName: '末班车车窗',

        time: '23:33',

        bgImage: 'img/closeup/closeup_bus_window_face.jpg',

        character: null,
        characterEmotion: null,
        characterPosition: null,
        hideCharacter: true,

        text: '你没有移开视线。\n\n那团头发下面，有东西慢慢抬起了头。反光里，一张惨白的脸正对着你笑，嘴角一直咧到耳根。\n\n它说："你终于看到我了。"',

        vibration: [100, 200, 100],

        signal: 3, battery: 75,

        choices: [

            { text: '闭上眼，默念这是幻觉', next: 'node04' }

        ]

    },

    'node03': {

        sceneImage: 'img/closeup/closeup_rearview_mirror.jpg',

        chapter: '第一章：末班车与夜路',
        sceneName: '司机座',

        time: '23:35',

        text: '你通过后视镜看向司机。司机一直没有回头，但你发现，他的脖子是以一种不可能的角度扭曲着的。大巴是在自己开的。\n\n仪表盘上显示的时间停在 23:59，已经十分钟没有动过。',

        vibration: [60, 120, 60],

        signal: 3, battery: 75,

        choices: [

            { text: '闭上眼装睡', next: 'node04' },

            { text: '偷偷观察司机的手', next: 'node03b', vibration: [40, 80, 40] }

        ]

    },

    'node03b': {

        sceneImage: 'img/closeup/closeup_driver_hands.jpg',

        chapter: '第一章：末班车与夜路',
        sceneName: '司机座',

        time: '23:36',

        text: '司机的手搭在方向盘上，但那双手惨白惨白的，指甲缝里塞满了黑色的泥土。\n\n而且那双手……只有四根手指。',

        vibration: [80, 160, 80],

        signal: 3, battery: 73,

        choices: [

            { text: '低下头，不敢再看', next: 'node04' }

        ]

    },

    'node04': {

        bgImage: 'img/bg/ch01_village_gate_burning_paper.jpg',
        sceneImage: 'img/bg/ch01_village_gate_burning_paper.jpg',

        chapter: '第一章：末班车与夜路',
        sceneName: '村口槐树',

        time: '00:15',

        text: '车停了。你逃下车。通往老宅的村路连路灯都没有。只有远处的几声狗吠。村口的大槐树下，有个背对着你的人在烧纸钱。\n\n火光映照下，纸灰像黑色的雪片一样飘。',

        vibration: null,

        signal: 2, battery: 65,

        choices: [

            { text: '绕开他，快步走', next: 'node05' },

            { text: '停下来问路', next: 'node_dead1', vibration: [100, 200, 100, 200, 100] }

        ]

    },

    'node05': {

        chapter: '第一章：末班车与夜路',
        sceneName: '村口夜路',

        time: '00:22',

        bgImage: 'img/bg/ch01_village_gate_burning_paper.jpg',
        sceneImage: 'img/closeup/closeup_dead_frogs_ash.jpg',

        text: '你低着头快步走，突然踩到了一滩软绵绵的东西。那是满地的死青蛙。此时，烧纸钱的灰烬被风吹到了你的肩膀上。\n\n灰烬是温热的。像是刚烧完不久。',

        vibration: [40, 80, 40],

        signal: 2, battery: 60,

        choices: [

            { text: '拍掉灰烬，冲进老宅大门！', next: 'node06' },

            { text: '回头看看烧纸的人还在不在', next: 'node05b', vibration: [60, 100, 60] }

        ]

    },

    'node05b': {

        sceneImage: 'img/closeup/closeup_wet_footprints.jpg',

        chapter: '第一章：末班车与夜路',
        sceneName: '村口夜路',

        time: '00:23',

        text: '你回头了。\n\n大槐树下空无一人。只剩下一堆还在燃烧的纸钱。\n\n但地上多了一排湿漉漉的脚印，正朝着你走来。',

        vibration: [80, 150, 80, 150, 80],

        signal: 2, battery: 58,

        choices: [

            { text: '尖叫着冲进老宅！', next: 'node06' }

        ]

    },



    // ==================== 第二章：三条死规矩 ====================

    'node06': {

        chapter: '第二章：三条死规矩',

        time: '00:45',

        text: '你把门闩压下去。门外那串脚步声也停了，像有人把耳朵贴在门板上。\n\n堂屋正中停着黑漆棺，棺前长明灯绿得发青。供桌角压着一张黄裱纸，纸边被香灰糊住，只露出"规矩"两个字。\n\n你忽然意识到，这屋里所有东西都摆得太整齐了，像是在等你按顺序把守灵的局布好。',

        vibration: null,

        signal: 1, battery: 55,

        choices: [

            { text: '进入堂屋，像解谜一样仔细搜查', next: 'node06_explore' },

            { text: '先读桌角的黄裱纸', next: 'node07' },

            { text: '堂屋已经布好，坐回蒲团守灵', next: 'node08', requireFlag: 'hall_ready' },

            { text: '先检查棺材里是不是爷爷', next: 'node_dead3_v2', vibration: [150, 300, 150] }

        ]

    },

    'node06_explore': {

        chapter: '第二章：三条死规矩',

        time: '00:46',

        text: '你没有急着碰棺材。\n\n供桌上的香灰堆成细小的坟包，抽屉缝里露出一角发黑的瓷瓶。长明灯的火苗明明很小，却把棺材影子拉得很长，像有个人正贴着地面慢慢站起来。\n\n你屏住呼吸，决定先按规矩把堂屋布好：灯要稳，水要遮，棺要封，名字不能应。',

        bgImage: 'img/bg/ch02_hall_explore_v2.jpg',

        exploreScene: true,

        sceneId: 'old_house_hall',
        returnNode: 'node06',
        closeText: '退回堂屋',

        sceneImage: 'img/bg/ch02_hall_explore_v2.jpg',

        sceneTitle: '老宅堂屋',

        sceneHint: '先读黄纸，再找能稳灯和封棺的东西。背包里选中道具后，可以直接点场景物件使用。',

        signal: 1, battery: 54,

        hotspots: [

            {
                id: 'paper_note',
                x: 24, y: 62, w: 18, h: 8,
                label: '黄裱纸',
                item: 'note',
                itemName: '带血的纸条',
                setFlags: { rule_note_seen: true },
                once: true,
                toast: '你把黄裱纸收进了背包。纸角有两个针孔，正好能穿红绳。',
                closeup: true,
                closeupTitle: '黄裱纸条',
                closeupHint: '纸条上的规矩缺了半句，香灰盖住的地方需要之后再看清。',
                closeupImage: 'img/closeup/closeup_blood_note.jpg',
                closeupText: '纸上是母亲的字。第一条说长明灯不能灭，第二条被香灰盖住半句，只剩"喊你……不能……"，第三条写着别往水里看。\n\n背面还有一行新血字：别信写纸的人。'
            },

            {
                id: 'drawer_lamp_oil',
                x: 3, y: 45, w: 17, h: 17,
                label: '抽屉',
                item: 'lamp_oil',
                itemName: '半盏灯油',
                once: true,
                closeup: true,
                closeupTitle: '半盏灯油',
                closeupHint: '第二章先稳住长明灯。真正的火柴留到灯灭后的厨房。',
                closeupImage: 'img/item/item_incense.jpg',
                closeupText: '抽屉里放着半盏灯油，油面浮着一根黑发。你晃了一下，黑发慢慢沉下去，像被什么东西含住了。'
            },

            {
                id: 'spirit_lamp',
                x: 64, y: 36, w: 12, h: 13,
                label: '长明灯',
                requireItem: 'lamp_oil',
                consumeItem: 'lamp_oil',
                once: true,
                lockedText: '长明灯的火苗一跳一跳，像在等你先从背包里选中灯油续上。',
                setFlags: { lamp_relit: true },
                toast: '灯油倒进去，火苗忽地直了。供桌后的牌位齐齐响了一声。',
                closeup: true,
                closeupTitle: '长明灯',
                closeupHint: '灯火稳了，香灰和水碗里的东西也终于看清了一点。',
                closeupImage: 'img/closeup/closeup_spirit_lamp_dim.jpg',
                closeupText: '灯油倒进去，火苗忽地直了。供桌后的牌位齐齐响了一声，像有人同时咬紧了牙。'
            },

            {
                id: 'altar_ash',
                x: 43, y: 36, w: 15, h: 11,
                label: '香灰',
                visibleWhenFlag: 'lamp_relit',
                item: 'red_string',
                itemName: '红绳',
                setFlags: { ash_checked: true },
                once: true,
                toast: '你从香灰下面拈出一截红绳。',
                closeup: true,
                closeupTitle: '香灰里的红绳',
                closeupHint: '红绳像是故意压在这里，等你把它和某样东西绑在一起。',
                closeupImage: 'img/closeup/closeup_altar_ash_red_string.jpg',
                closeupText: '红绳被香灰浸得发黑，绳结处缠着一点黄纸屑。它不像装饰，更像某种封口。'
            },

            {
                id: 'water_bowl_cover',
                x: 57, y: 62, w: 18, h: 9,
                label: '供桌水碗',
                visibleWhenFlag: 'lamp_relit',
                hiddenWhenFlag: 'water_covered',
                requireItem: 'note',
                lockedText: '水面没有映出你的脸，只映出棺材后面站着的一双脚。也许该先用黄裱纸遮住它。',
                missingText: '水碗边缘压着香灰。你需要一张能盖住水面的黄纸。',
                setFlags: { water_covered: true },
                toast: '你把黄裱纸压在水碗上。碗底传来轻轻一声叩响。',
                closeup: true,
                closeupTitle: '被遮住的水碗',
                closeupHint: '第三条规矩现在才像真的。水里的东西看不见了，但它还在。',
                closeupImage: 'img/item/item_note.jpg',
                closeupText: '黄纸压住水面后，纸背慢慢洇出一个湿手印。手印只有四根手指。'
            },

            {
                id: 'black_coffin_danger',
                x: 36, y: 49, w: 34, h: 14,
                label: '黑漆棺',
                hiddenWhenFlag: 'lamp_relit',
                deathNode: 'node_dead3_v2'
            },

            {
                id: 'black_coffin_wait',
                x: 36, y: 49, w: 34, h: 14,
                label: '黑漆棺',
                visibleWhenFlag: 'lamp_relit',
                hiddenWhenFlag: 'water_covered',
                closeup: true,
                closeupTitle: '还不能封的棺',
                closeupHint: '水碗里还映着棺后的脚。第三条规矩没处理前，封棺不稳。',
                closeupImage: 'img/bg/ch02_living_room.jpg',
                closeupText: '棺缝里冷气一阵一阵往外吐。你刚靠近，供桌水碗里的倒影先动了一下。\n\n空手去碰，只会让里面的东西记住你的手温。'
            },

            {
                id: 'black_coffin_seal',
                x: 36, y: 49, w: 34, h: 14,
                label: '黑漆棺',
                visibleWhenFlags: ['lamp_relit', 'water_covered'],
                requireItem: 'paper_talisman',
                missingText: '棺缝里的冷气还在往外渗。先稳灯、遮水，再做出能压住它的东西。',
                lockedText: '棺材不能空手碰。也许要先在背包里选中镇棺符。',
                item: 'name_tag',
                itemName: '旧孝牌',
                once: true,
                setFlags: { coffin_sealed: true },
                toast: '镇棺符压住棺缝，棺底滑出一块刻着你名字的旧孝牌。',
                closeup: true,
                closeupTitle: '被压住的黑棺',
                closeupHint: '棺材安静下来。孝牌上的名字，让第二条规矩变得具体。',
                closeupImage: 'img/closeup/closeup_coffin_sealed_name_tag.jpg',
                closeupText: '镇棺符压下去，红绳自己绷紧。棺内的抓挠声停了，棺底滑出一块旧孝牌。\n\n孝牌背面刻着你的全名，最后一个字被指甲刮得很深。'
            },

            {
                id: 'ancestral_tablet',
                x: 39, y: 18, w: 19, h: 23,
                label: '祖先牌位',
                visibleWhenFlag: 'coffin_sealed',
                hiddenWhenFlag: 'name_known',
                setFlags: { name_known: true },
                once: true,
                toast: '你记住了孝牌上的全名。门外若喊这个名字，绝不能答。',
                closeup: true,
                closeupTitle: '刻名旧孝牌',
                closeupHint: '第二条规矩补全了：喊全名时，答的不是话，是命。',
                closeupImage: 'img/item/item_key.jpg',
                closeupText: '孝牌背面刻着你的全名，最后一个字被指甲刮得很深。\n\n你忽然明白，门外若喊全名，答的不是话，是命。'
            },

            {
                id: 'locked_door_wait',
                x: 76, y: 22, w: 21, h: 36,
                label: '反锁木门',
                hiddenWhenFlag: 'coffin_sealed',
                closeup: true,
                closeupTitle: '反锁的木门',
                closeupHint: '门外安静，反而像有人屏着气贴在门缝外。现在还不能出去。',
                closeupImage: 'img/bg/ch02_living_room.jpg',
                closeupText: '门闩已经被你反锁。门缝外没有脚步声，却有一股潮湿的泥土味慢慢钻进来。棺材还没压住，贸然开门只会把屋里的东西也放出去。'
            },

            {
                id: 'hall_ready_exit',
                x: 76, y: 22, w: 21, h: 36,
                label: '坐回蒲团',
                visibleWhenFlags: ['lamp_relit', 'water_covered', 'coffin_sealed', 'name_known'],
                setFlags: { hall_ready: true },
                toast: '灯稳了，水遮了，棺也压住了。你坐回蒲团，等门外的人先开口。',
                nextNode: 'node08'
            }

        ],

        vibration: [20, 40, 20]

    },

    'node07': {

        chapter: '第二章：三条死规矩',

        time: '00:48',

        text: '纸上是母亲的字。\n\n第一条说长明灯不能灭。第二条被香灰盖住半句，只剩"喊你……不能……"。第三条写着别往水里看。\n\n翻到背面，还有一行后添的血字——算是第四条，墨色发黑：别信写纸的人。\n\n你把纸条收好。现在不能只背规矩，必须把堂屋布成能守灵的局。',

        vibration: null,

        signal: 1, battery: 52,

        item: { code: 'note', name: '带血的纸条', desc: '母亲写的守灵规矩，第二条被香灰盖住了半句。' },
        setFlags: { rule_note_seen: true },

        choices: [

            { text: '回到堂屋，按规矩搜查', next: 'node06_explore' }

        ]

    },

    'node08': {

        chapter: '第二章：三条死规矩',

        time: '01:30',

        text: '灯稳了，水遮了，棺也压住了。\n\n你跪在蒲团上守灵。门外响起三下脚步，重得像拖着一身湿寿衣。脚步停住后，有人用指节轻轻叩门。\n\n你膝前的旧孝牌微微发凉，像在提醒你：名字不能应。',

        vibration: [80, 150, 80, 150, 80],

        signal: 1, battery: 45,

        choices: [

            { text: '屏住呼吸听', next: 'node09' },

            { text: '去门缝看看外面是谁', next: 'node08b', vibration: [100, 200, 100] },

            { text: '检查手机有没有信号', next: 'node08c' }

        ]

    },

    'node08c': {

        chapter: '第二章：三条死规矩',

        time: '01:31',

        text: '你下意识地掏出手机。屏幕自己亮了，没等你按，画面就跳了出来。\n\n是一段老旧的监控影像，糊得厉害。左上角用歪歪扭扭的字写着【第三镜头】。\n\n画面卡在一九九七年九月廿二，夜里十一点四十六分——秒数再也没往前跳过。',

        vibration: [50, 100, 50],

        signal: 1, battery: 44,

        camAlert: true,

        camNext: 'node09'

    },

    'node08b': {

        chapter: '第二章：三条死规矩',

        time: '01:31',

        text: '你爬到门缝边，透过缝隙往外看。\n\n外面站着一双红色的绣花鞋。鞋尖正对着门缝。\n\n你抬头——门缝外，一只血红的眼睛正回望着你。',

        vibration: [200, 100, 200],

        signal: 1, battery: 43,

        choices: [

            { text: '捂住嘴往后退', next: 'node09' }

        ]

    },

    'node09': {

        chapter: '第二章：三条死规矩',

        time: '01:33',

        text: '"开门啊，是我，我是你二伯。"\n\n门外传来嘶哑的声音，一字不差喊出了你的全名。它说来给爷爷送寿衣，可语调平得像在照着孝牌念。\n\n你膝前那块旧孝牌越来越凉。第二条规矩终于补全了：喊全名时，绝对不能答。',

        vibration: null,

        signal: 1, battery: 42,

        choices: [

            { text: '隔着门问："怎么这么晚才来？"', next: 'node_dead2' },

            { text: '死死捂住嘴，不出声', next: 'node10' },

            { text: '假装咳嗽一声', next: 'node09b' }

        ]

    },

    'node09b': {

        chapter: '第二章：三条死规矩',

        time: '01:34',

        text: '你咳嗽了一声。\n\n门外瞬间安静了。\n\n然后，门缝里缓缓塞进一张黄纸，上面用朱砂写着你的生辰八字。\n\n纸的背面，画着一个没有脸的纸人。纸人的胸口，已经写好了你的名字。',

        vibration: [100, 200, 100],

        signal: 1, battery: 40,

        setFlags: { paper_effigy_marked: true },

        choices: [

            { text: '把纸撕碎', next: 'node10' }

        ]

    },

    'node10': {

        chapter: '第二章：三条死规矩',

        time: '02:15',

        text: '门外冷笑一声，脚步声拖着潮气远去。\n\n你刚松气，窗缝灌进一阵阴风，长明灯灭了。堂屋陷入绝对的黑暗。\n\n黑暗中，棺材又开始轻轻响。刚才压住它的红绳一点点绷紧，像马上就要断。',

        vibration: [100, 200, 100],

        signal: 0, battery: 35,

        choices: [

            { text: '必须去厨房找火柴！', next: 'node11' },

            { text: '躲在棺材旁边不走', next: 'node_dead3' }

        ]

    },



    // ==================== 第三章：熄灭的灯与厨房 ====================

    'node11': {

        chapter: '第三章：熄灭的灯与厨房',

        time: '02:22',

        text: '你借着手机屏幕那点惨白的光，摸黑走向后院的厨房。厨房里有股浓烈的肉馊味。灶台上放着一盒火柴，纸盒被潮气浸得发软，刮一下能掉下半根火柴头。你刚拿起火柴，听到了水滴声。"滴答...滴答..."\n\n水滴声是从你头顶传来的。',

        vibration: [50, 100, 50, 100, 50],

        signal: 0, battery: 30,

        choices: [

            { text: '拿起火柴赶紧回堂屋', next: 'node13' },

            { text: '声音是从角落的水缸传来的', next: 'node12' },

            { text: '抬头看看天花板', next: 'node11b', vibration: [150, 300, 150] }

        ]

    },

    'node11b': {

        chapter: '第三章：熄灭的灯与厨房',

        time: '02:23',

        character: 'img/char/grandpa_ghost.jpg', characterEmotion: 'ghost', characterPosition: 'center', characterFlicker: true,

        text: '你抬头了。\n\n天花板上倒挂着一个人形。它穿着你爷爷生前最喜欢的中山装，脸朝着天花板，四肢像蜘蛛一样张开。\n\n水滴正从它的嘴角滴下来。\n\n它感觉到了你的目光，脖子发出"咔咔"的声音，关节一节一节，扭了过来。',

        vibration: [200, 400, 200],

        signal: 0, battery: 28,

        choices: [

            { text: '闭眼狂奔回堂屋！', next: 'node13' }

        ]

    },

    'node12': {

        chapter: '第三章：熄灭的灯与厨房',

        time: '02:28',

        text: '你忘了纸条上的第三条规矩。你借着门缝里透进来的月光往水缸看了一眼，水面平静。但水里的倒影不是你，而是一个泡得肿胀的女尸，她正在水里对你笑。\n\n女尸的嘴一张一合，似乎在说什么。你仔细听——\n\n"你来了。我等你很久了。"',

        vibration: [150, 300, 150],

        signal: 0, battery: 25,

        choices: [

            { text: '摔碎手机狂奔！', next: 'node13', statEffect: { fear: 12 } },

            { text: '问她是誰', next: 'node_dead5' }

        ]

    },

    'node13': {

        chapter: '第四章：屏息与视线',

        time: '03:00',

        text: '你连滚带爬跑回堂屋，用颤抖的手划着火柴，重新点燃了长明灯。但在微弱的火光亮起的一瞬间，你发现堂屋里多了一些东西。\n\n——多了很多纸人。它们原本在墙角堆着，现在全都站了起来，围成了一个圈。把你围在中间。',

        vibration: [60, 120, 60],

        signal: 0, battery: 20,

        choices: [

            { text: '屏住气，先数清这一圈纸人', next: 'node13b' },

            { text: '慢慢抬起头', next: 'node14', statEffect: { fear: 8 } }

        ]

    },



    // ==================== 第四章：屏息与视线 ====================

    'node14': {

        chapter: '第四章：屏息与视线',

        time: '03:05',

        text: '棺材左右两侧，不知何时站着两个一人高的纸人。原本纸人是没有眼睛的，但现在，它们被人用黑墨水画上了死鱼般的眼珠，并且，纸人的头死死扭向你的方向。\n\n纸人慢慢转过了头。它闻到了活人的气味。\n\n"纸人缺一双眼睛。"它说。"你的，正好。"',

        character: 'img/char/bride_paper.jpg',

        characterEmotion: 'ghost',

        characterPosition: 'center',

        characterFlicker: true,

        vibration: [80, 160, 80, 160, 80],

        signal: 0, battery: 15,

        holdRequired: true,

        holdSuccess: 'node15',

        holdFail: 'node_dead4'

    },

    'node15': {

        chapter: '第四章：屏息与视线',

        time: '03:12',

        text: '你屏住呼吸整整十秒钟，肺快憋炸了。纸人的头终于缓缓转了回去。你大口喘气，跌坐在地上。\n\n地上有一张黄纸，上面画着地图。地图指向老宅的——地下室。',

        vibration: [30, 60, 30, 60, 30, 60, 30],

        signal: 0, battery: 10,

        item: { code: 'map', name: '地下室的地图', desc: '画着通往地下室密道的路线。' },

        choices: [

            { text: '摸出手机看一眼', next: 'node16' },

            { text: '按地图去找地下室', next: 'node15b' },

            { text: '瞥一眼长明灯的铜座', next: 'node15_mirror' }

        ]

    },

    'node15b': {

        chapter: '第四章：屏息与视线',

        time: '03:14',

        text: '你按地图找到了厨房的暗门。暗门后面是一条向下的石阶，深不见底。\n\n石阶两侧的墙壁上，刻满了名字。你看到了你爷爷的名字，你父亲的名字，还有——\n\n你自己的名字。',

        vibration: [100, 200, 100],

        signal: 0, battery: 8,

        choices: [

            { text: '走下去', next: 'node_explore_cave' },

            { text: '退回堂屋', next: 'node16' }

        ]

    },



    'node13b': {
        chapter: '第四章：屏息与视线',
        time: '03:02',
        character: 'img/char/it_shadow.jpg', characterEmotion: 'ghost', characterPosition: 'left', characterFlicker: true,
        text: '你强迫自己别去看棺材，先借着长明灯的光，一个一个数过去。\n\n一、二、三……十一个纸人，围成一圈。可你分明记得，墙角原本只堆着十个。\n\n第十一个不是纸。它比别的高出半头，没有脸，浑身是慢慢蠕动的黑烟，只有胸口高度浮着两点暗红的光——正对着你。\n\n它没有动。但你知道，它一直在看你。',
        vibration: [40, 80, 40, 80],
        signal: 0, battery: 18,
        choices: [
            { text: '移开目光，慢慢抬头面对棺材', next: 'node14' },
            { text: '盯着那团黑影看', next: 'node_dead_shadow', vibration: [150, 300, 150] }
        ]
    },

    'node_dead_shadow': {
        chapter: '第四章：屏息与视线',
        time: '03:03',
        character: 'img/char/it_shadow.jpg', characterEmotion: 'ghost', characterPosition: 'center',
        deathCG: 'img/death/death_09_possess.jpg',
        text: '你和它对视了。\n\n那两点红光忽然放大。黑烟像被人猛吸一口气那样朝你涌来，从你的眼睛、鼻子、嘴里钻进身体。\n\n你想喊，喊不出；你想跑，腿已经不是你的了。\n\n最后一个念头是：原来"它"要的，从来都不是纸人的身体。',
        vibration: [400, 200, 400, 200],
        signal: 0, battery: 0,
        isDeath: true,
        deathName: '附身',
        deathDesc: '有些东西，看一眼就会被它记住；对视，就是请它进门。'
    },

    'node15_mirror': {
        chapter: '第四章：屏息与视线',
        time: '03:13',
        character: 'img/char/mirror_player.jpg', characterEmotion: 'ghost', characterPosition: 'center', characterFlicker: true,
        text: '长明灯的铜座被擦得发亮，像一面小镜子。你下意识瞥了一眼。\n\n铜座里有你的脸。\n\n可你正在大口喘气，镜子里的"你"却闭着嘴，在笑。它缓缓抬起右手，朝你招了招——而你的右手，正撑在冰冷的地上，没有动。\n\n母亲纸条上的第三条规矩在脑子里炸开：别往水里看。\n\n可这不是水。',
        vibration: [60, 120, 60],
        signal: 0, battery: 9,
        choices: [
            { text: '猛地移开视线，照地图去地下室', next: 'node15b' },
            { text: '忍不住，再多看那个"自己"一眼', next: 'node_dead_mirror', vibration: [200, 400, 200] }
        ]
    },

    'node_dead_mirror': {
        chapter: '第四章：屏息与视线',
        time: '03:13',
        deathCG: 'img/death/death_01_mirror.jpg',
        text: '你多看了一眼。\n\n铜座里的"你"笑得更开，抬起的那只手猛地探出镜面，冰凉的手指扣住你的下巴往里拽。\n\n你的脸先贴上那片发亮的冷铜，然后是整个人。\n\n堂屋里，长明灯的铜座又恢复了平静，只是里面映出的那个人，从此再没有大口喘过气。',
        vibration: [300, 300, 300],
        signal: 0, battery: 0,
        isDeath: true,
        deathName: '照见',
        deathDesc: '镜子、水面、铜器……凡是能照出你的，都不能多看。它们会记住你的脸。'
    },



    // ==================== 第五章：终焉的倒计时 ====================

    'node16': {

        chapter: '第五章：终焉的倒计时',

        time: '03:30',

        text: '手机屏幕闪了一下，信号瞬间满格又掉空，电量只剩最后一格。\n\n屏幕亮起，爷爷的名字跳了出来——后面跟着一句："别看棺材。千万别看。"',

        vibration: null,

        signal: 0, battery: 1,

        fakeAlert: true,

        alertNext: 'node17'

    },

    'node17': {

        chapter: '第五章：终焉的倒计时',

        time: '03:35',

        text: '短信内容只有一句话："快跑！棺材里躺着的不是我！是那个女鬼！"\n\n紧接着，又一条短信进来："等等，别跑。它在门外。棺材里反而安全。"\n\n第三条："不对。它就在你身后。"',

        vibration: [100, 50, 100, 50, 100],

        signal: 0, battery: 1,

        choices: [

            { text: '惊恐地看向棺材', next: 'node18' },
            { text: '先别动,稳住长明灯,守完这炷香', next: 'node5x_wait' },

            { text: '慢慢回头', next: 'node_dead6', vibration: [500] }

        ]

    },

    'node18': {

        chapter: '第五章：终焉的倒计时',

        time: '03:40',

        text: '"砰——！"棺材里传出剧烈的撞击声。棺材盖被一股巨力直接掀飞。一只穿着红绣鞋的脚搭在了棺材边缘。\n\n然后，另一只脚也搭了上来。\n\n一个穿着大红嫁衣的女人，缓缓地、缓缓地，从棺材里坐了起来。',

        vibration: [200, 100, 200, 100, 200],

        signal: 0, battery: 1,

        choices: [

            { text: '跑！往门外跑！', next: 'node19' },

            { text: '跪下来求她', next: 'node_dead7' }

        ]

    },

    'node19': {

        chapter: '第五章：终焉的倒计时',

        time: '03:42',

        text: '你冲向大门，但大门怎么也拉不开。背后的脚步声越来越近，伴随着水渍滴落的声音。\n\n门板上开始出现水渍，像是有水从门缝里渗进来。水渍慢慢形成了一个字：\n\n"留"',

        vibration: [50, 50, 50, 50, 50, 50, 50, 50],

        signal: 0, battery: 1,

        choices: [

            { text: '疯狂拍门！', next: 'node20' },

            { text: '用身体撞门', next: 'node19b' }

        ]

    },

    'node19b': {

        chapter: '第五章：终焉的倒计时',

        time: '03:43',

        text: '你用尽全力撞向大门。门纹丝不动。\n\n但你的手穿过了门板。\n\n不对。不是手穿过了门板。是你的手变成了纸。\n\n你低头看着自己的双手——皮肤正在一点点变成粗糙的黄纸。',

        vibration: [100, 100, 100, 100],

        signal: 0, battery: 1,

        choices: [

            { text: '不！！', next: 'node20' }

        ]

    },

    'node20': {

        chapter: '第五章：终焉的倒计时',

        time: '03:43',

        text: '突然，你的手机屏幕强制弹出一个满屏的提示框，无法关闭，上面写着【你跑不掉的，你回头看看我】。\n\n提示框的关闭按钮变成了一个血红的"好"字。',

        vibration: null,

        signal: 0, battery: 1,

        choices: [

            { text: '我不回头！我不看！', next: 'node21' },

            { text: '颤抖着点击"好"', next: 'node_dead8' }

        ]

    },

    'node21': {

        chapter: '第五章：终焉的倒计时',

        time: '03:44',

        text: '手机屏幕彻底崩坏碎裂。原本灰暗的画面忽然清晰起来——那张惨白的女鬼照片占满了整个屏幕，仿佛她就贴在屏幕内侧盯着你。\n\n所有能点的地方都变成了密密麻麻的一句话：【留下来陪我留下来陪我留下来陪我】\n\n你听见棺材底部传来一声轻响。像是有什么暗扣，被人从里面推开了。',

        vibration: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30],

        signal: 0, battery: 1,

        choices: [

            { text: '摸索棺材底部的暗扣', next: 'node22' },

            { text: '砸碎手机，冲向门外', next: 'node_endA' }

        ]

    },



    // ==================== 第六章：地下室（隐藏路线）====================

    'node22': {

        chapter: '第六章：地下室的秘密',

        time: '03:46',

        text: '棺材底部的暗扣"咔"地松开，供桌后的墙无声裂开一道窄缝，一段向下的石阶吐着冷气。你扶着刻满名字的石壁，摸黑走了下去。\n\n石阶走到尽头，是一间石室。石室中央摆着一张婚床，床上铺着大红被褥。\n\n墙上贴满了泛黄的结婚照。照片里的新郎各个年代都有，穿着不同的衣服。\n\n但新娘——都是同一个人。',

        vibration: [80, 160, 80],

        signal: 0, battery: 5,

        choices: [

            { text: '翻看照片背面的字', next: 'node23' },

            { text: '检查婚床下面', next: 'node22b', statEffect: { fear: 10 } }

        ]

    },

    'node22b': {

        chapter: '第六章：地下室的秘密',

        time: '03:16',

        text: '你弯下腰，看向婚床底下。\n\n床底下整整齐齐地码着十几口小棺材。每口棺材上都贴着标签，写着名字和日期。\n\n最上面那口，标签上写着你的名字。日期是——今晚。\n\n而日期那一栏的墨，正一点一点淡下去，像在等下一个"今晚"重新写上。',

        sceneImage: 'img/bg/under_bed.jpg',

        vibration: [200, 400, 200],

        signal: 0, battery: 4,

        choices: [

            { text: '把小棺材拿出来', next: 'node22c' },

            { text: '把小棺材推回去，假装没看见', next: 'node_endC' }

        ]

    },

    'node22c': {

        chapter: '第六章：地下室的秘密',

        time: '03:17',

        text: '你颤抖着把写有自己名字的小棺材拿了出来。棺材很轻，纸糊的，但里面似乎有什么东西在轻微地动。\n\n你把棺材塞进口袋，冷汗顺着脊背往下流。这时你注意到墙上的结婚照背面似乎有字……',

        item: { id: 'mini_coffin', name: '纸棺材', image: 'img/item/item_paper_doll.jpg' },

        vibration: [100, 200, 100],

        signal: 0, battery: 4,

        choices: [

            { text: '翻看照片背面的字', next: 'node23' }

        ]

    },

    'node23': {

        chapter: '第六章：地下室的秘密',

        time: '03:18',

        text: '照片背面写着："纸人娶妻，十年一轮。轮到你了。"\n\n所有的照片背面都写着同一个日期——都是阴历七月十五。\n\n而今天，正是七月十五。',

        vibration: [100, 200, 100],

        signal: 0, battery: 3,

        choices: [

            { text: '找出口逃出去', next: 'node24' },

            { text: '烧毁这些照片', next: 'node23b' }

        ]

    },

    'node23b': {

        chapter: '第六章：地下室的秘密',

        time: '03:19',

        text: '你用长明灯的火烧照片。照片燃烧时发出刺耳的尖叫声，像是有人在火里惨叫。\n\n烧到最后一张照片时，火突然灭了。\n\n照片里新娘的眼睛，动了。',

        vibration: [300, 200, 300],

        signal: 0, battery: 2,

        choices: [

            { text: '把照片撕碎', next: 'node24' }

        ]

    },

    'node24': {

        chapter: '第七章：纸人村',

        time: '03:25',

        text: '你找到了一条通往村外的密道。但当你爬出密道时，发现自己站在了村口的打谷场上。\n\n打谷场上站满了人。他们全都背对着你，一动不动。\n\n月光下，你看清了——他们都是纸人。纸人身上穿着村民的衣服。',

        vibration: [150, 300, 150],

        signal: 0, battery: 1,

        choices: [

            { text: '混入纸人群中', next: 'node25' },
            { text: '走进打谷场边那座临时灵棚', next: 'node7x_funeral_explore' },

            { text: '大声喊叫', next: 'node_dead9' }

        ]

    },

    'node25': {

        chapter: '第七章：纸人村',

        time: '03:30',

        text: '你学着纸人的样子，低着头，一步一步地走。\n\n纸人们开始移动了，朝着老宅的方向走。你不得不跟着他们。\n\n路过一个纸人时，你听到它压着嗓子说："脚抬高些，别让脚跟沾地。纸人走路是不沾地的——你一脚踩实，活气就露出来了。"',

        vibration: [50, 100, 50],

        signal: 0, battery: 1,

        choices: [

            { text: '把脚抬高', next: 'node26' },

            { text: '趁机逃跑', next: 'node25b' }

        ]

    },

    'node25b': {

        chapter: '第七章：纸人村',

        time: '03:31',

        text: '你转身就跑。\n\n所有的纸人同时停下了脚步。\n\n然后，它们同时转过了头。\n\n一百多张惨白的纸人脸，一百多双死鱼般的黑眼珠，全都盯着你的背影。\n\n它们没有追你。它们只是看着你。\n\n那比追你更可怕。',

        vibration: [200, 200, 200, 200],

        signal: 0, battery: 1,

        choices: [

            { text: '拼命跑向村口', next: 'node26' }

        ]

    },

    'node26': {

        chapter: '第八章：冥婚大典',

        time: '03:35',

        text: '你跑到了村口的老槐树下。树下站着一个人——是烧纸钱的那个。\n\n这次，他有脸了。是你的脸。\n\n"你来了。"他说，用的是你的声音。"我等你很久了。从今天开始，你就是我，我就是你。"',

        vibration: [100, 200, 100, 200, 100],

        signal: 0, battery: 1,

        choices: [

            { text: '质问他你是谁', next: 'node_dead10' },

            { text: '转身往回跑', next: 'node27' },
            { text: '顺着唢呐声拐上岔路', next: 'node9x_yinyang_road' },
            { text: '被一只冰凉的手按住肩，拽向祠堂深处', next: 'node8x_hall' },

            { text: '掏出带血的纸条', next: 'node26b' }

        ]

    },

    'node26b': {

        chapter: '第八章：冥婚大典',

        time: '03:36',

        text: '你掏出带血的纸条。纸条上的血开始发光。\n\n假"你"看到纸条，脸色变了。\n\n"第四条规矩……"它后退了一步，声音黏成一团。"……连那个给你写纸条的人，都在骗你。"\n\n它的脸开始融化。',

        vibration: [150, 300, 150],

        signal: 0, battery: 1,

        choices: [

            { text: '趁它虚弱逃跑', next: 'node27' },

            { text: '问它真相', next: 'node28' }

        ]

    },

    'node27': {

        chapter: '第九章：阴阳路',

        time: '03:40',

        text: '你跑回了老宅。堂屋里，女鬼正坐在棺材边梳头。\n\n她看到了你，笑了。\n\n"你跑了一圈，又回到了这里。你以为那是村口？那是冥界的入口。你一直在原地打转。"',

        vibration: [80, 160, 80],

        signal: 0, battery: 1,

        choices: [

            { text: '问她怎样才能离开', next: 'node28' },

            { text: '冲向棺材', next: 'node_dead11' }

        ]

    },

    'node28': {

        chapter: '第九章：阴阳路',

        time: '03:42',

        text: '"很简单。"女鬼站起来，红嫁衣拖在地上。"要么，你替我躺进棺材。要么——"\n\n她指向棺材底部。\n\n"你找到那个真正该躺在这里的人。"',

        vibration: [100, 200, 100],

        signal: 0, battery: 1,

        choices: [

            { text: '问她谁是真正该躺的人', next: 'node29' },

            { text: '表示愿意替她', next: 'node_endB' },

            { text: '把骨符压在写着自己名字的小棺材上', next: 'node_endD', requireItem: 'bone_amulet' }

        ]

    },

    'node29': {

        chapter: '第十章：回魂',

        time: '03:43',

        character: 'img/char/grandpa_normal.jpg', characterEmotion: 'normal', characterPosition: 'center',

        text: '"是你爷爷。"女鬼的声音很轻，轻得不像恨，倒像认了很多年的命。\n\n"那年办喜事，他掀了我的盖头，又趁夜把我换进了棺材。他说他还想活，想看儿子娶亲、看孙子出世。"\n\n"他用了替死术，把这条命推给你爹；你爹舍不得你，临了又推给了你。"\n\n她抬起头，红盖头底下那片空白，正对着你。\n\n"我等了三代人。等的不是哪个新郎——是有一个人，肯停下来，看一眼我到底是谁。"\n\n"现在，只剩你了。"',

        vibration: [200, 100, 200, 100, 200],

        signal: 0, battery: 1,

        choices: [

            { text: '闭上眼，想起爷爷临终前攥着你的手', next: 'node29b' },

            { text: '拒绝家族诅咒，面对命运', next: 'node_endF' },

            { text: '念出族谱里的真名', next: 'node_endE', requireFlag: 'knows_bride_name' },
            { text: '先别急着念——在堂屋布一座回魂法坛', next: 'node10x_ritual_prep' },

            { text: '问她替死术怎么用', next: 'node_endG' },

            { text: '拿出骨符与族谱，对她说出真名', next: 'node_endH', requireItem: 'bone_amulet', requireFlag: 'knows_bride_name' }

        ]

    },



    'node29b': {
        chapter: '第十章：回魂',
        time: '03:44',
        character: 'img/char/grandpa_normal.jpg', characterEmotion: 'normal', characterPosition: 'center', characterFlicker: true,
        text: '你闭上眼。\n\n爷爷临终前攥着你的手，那只手只剩四根手指，凉得像浸过井水。他当时一直在说胡话，你没听清。现在那几句话，忽然清楚了。\n\n"……我那年也是被人按进喜位的新郎。盖头一盖，唢呐一响，我才知道这门亲事，办的是我自己的丧。"\n\n"我怕。我太怕那口棺材了。所以我学了替死术，把命推给了你爹……你爹又推给了你。"\n\n他的脸在你眼前一寸寸烂下去，中山装上沁出黑水，成了你在天花板上见过的那副模样。\n\n"不是不疼你们。是这屋子，从来不许人疼。"',
        vibration: [120, 200, 120],
        signal: 0, battery: 1,
        choices: [
            { text: '睁开眼，回到女鬼面前', next: 'node29' }
        ]
    },



    // ==================== 普通结局节点 ====================

    'node_endA': {

        chapter: '第五章：终焉的倒计时',

        time: '04:00',

        text: '你砸碎手机，冲出了老宅。\n\n天亮时，你真的站在了村口。回城的第一班车停在路边，司机低着头，没有说话。\n\n你坐上车，车窗上映出你的脸。你松了一口气。\n\n直到车窗外有个穿红嫁衣的女人，慢慢跟着车跑了起来。\n\n她没有追上来。她只是抬起手，像新娘送别新郎那样，轻轻挥了挥。',

        vibration: [40, 80, 40],

        signal: 1, battery: 1,

        isEnding: true,

        endingCode: 'A',
        endingCG: 'img/ending/ending_a_escape.jpg',

        endingName: '残逃',

        fearScore: 45

    },

    'node_endB': {

        chapter: '第九章：阴阳路',

        time: '03:45',

        text: '"我愿意。"你说。\n\n女鬼把红盖头盖在你头上。你听见唢呐声从很远的地方吹来，又像是从你的胸腔里响起。\n\n盖头掀开时，你坐在祠堂正中。你身上穿着嫁衣，手腕上缠着红绳。\n\n门外来了新的脚步声。那个人和你一样，以为自己只是回村奔丧。',

        vibration: [100, 200, 100],

        signal: 0, battery: 1,

        isEnding: true,

        endingCode: 'B',
        endingCG: 'img/ending/ending_b_replace.jpg',

        endingName: '替身',

        fearScore: 78

    },

    'node_endC': {

        chapter: '第六章：地下室的秘密',

        time: '04:00',

        text: '你把小棺材放回婚床底下，转身逃出地下室。\n\n第二天，你醒在末班大巴最后一排。手机屏幕亮了一下，母亲发来短信：爷爷走了，让你今晚务必回村。\n\n你低头看手机：电量莫名其妙又满了，信号满格，时间停在 23:30。\n\n和这一切开始的那一刻，分毫不差。\n\n你看向车窗。车顶上那团黑影，也正在看你。',

        vibration: [60, 120, 60],

        signal: 4, battery: 80,

        isEnding: true,

        endingCode: 'C',
        endingCG: 'img/ending/ending_c_cycle.jpg',

        endingName: '轮回',

        fearScore: 66

    },

    'node_endD': {

        chapter: '第十章：回魂',

        time: '03:50',

        text: '你点燃骨符，把它压在小棺材上。\n\n地下的风停了。纸人们齐齐跪下，像是在拜一位新的主人。\n\n你终于明白，所谓破局不是逃出去，而是选一个人被留下。\n\n你把自己的名字写在黄纸上。火光亮起时，老宅第一次安静下来。',

        vibration: [120, 180, 120],

        signal: 0, battery: 1,

        isEnding: true,

        endingCode: 'D',
        endingCG: 'img/ending/ending_d_sacrifice.jpg',

        endingName: '祭名',

        fearScore: 72

    },

    'node_endE': {

        chapter: '第十章：回魂',

        time: '04:00',

        text: '你念出族谱上的真名。\n\n那三个字一出口，女鬼第一次没有笑。她怔住了，低头看着自己的手，像隔了很多年，终于认出这是一双曾经会疼、会暖、会被人牵着的手。\n\n"……这是我的名字。"她极轻地重复了一遍，声音抖了，"好久……没人这么叫过我了。"\n\n老宅里的红烛一盏盏熄灭，墙上的照片开始褪色。她朝你微微低了低头，像道谢，又像道别。\n\n"原来我不是什么新娘。我只是……被你们家忘了的那个人。"\n\n天亮后，你带走了族谱。缺失的那一页慢慢浮出字迹。你这才看清，历代新郎的血指印都只有四根——第五根，是替死时押在那一边、再也没能拿回来的。血字补全的同时，你爷爷那块孝牌背面刮得最深的那道刻痕，悄悄补成了第五根手指的形状。\n\n你替三代人，把一个被丢下的名字，念全了。',

        vibration: [30, 60, 30],

        signal: 1, battery: 1,

        isEnding: true,

        endingCode: 'E',
        endingCG: 'img/ending/ending_e_truth.jpg',

        endingName: '真名',

        fearScore: 58

    },



    // ==================== 死亡节点 ====================

    'node_dead1': {

        chapter: '第一章：末班车与夜路',

        time: '00:16',

        bgImage: 'img/bg/ch01_village_gate_burning_paper.jpg',
        deathCG: 'img/death/death_01_lost_paper_people.jpg',

        text: '那人转过头，是一张没有五官的白纸脸。你的手机剧烈震动。你感觉无数只冰冷的手从黑暗中伸出来，把你拖进了村路两旁的野草丛中。\n\n野草丛里，密密麻麻全是纸人。它们都在等着新的玩伴。',

        vibration: [200, 400, 200, 400, 200],

        signal: 0, battery: 0,

        isDeath: true,

        deathName: '迷失',

        deathDesc: '你不该跟陌生人搭话的。尤其是在烧纸钱的晚上。'

    },

    'node_dead2': {

        chapter: '第二章：三条死规矩',

        time: '01:34',

        bgImage: 'img/bg/ch02_living_room.jpg',
        deathCG: 'img/death/death_10_blood_curse.jpg',

        text: '你搭腔了。门瞬间被撞开，无数双惨白的手将你拖入黑夜。你最后看到的，是供桌上那三根香，两短一长。\n\n那笑声，不像是悲伤。像是终于等到了你。',

        vibration: [300, 200, 300],

        signal: 0, battery: 0,

        isDeath: true,

        deathName: '忌讳',

        deathDesc: '规矩就是规矩。答应了，就等于签字画押。'

    },

    'node_dead3': {

        chapter: '第三章：熄灭的灯与厨房',

        time: '02:16',

        bgImage: 'img/bg/ch07_funeral.jpg',
        deathCG: 'img/death/death_03_lookback.jpg',

        text: '黑暗中，棺材盖缓缓滑开。一只冰冷的手摸到了你的脸。那只手没有温度，却意外地轻柔，像是在抚摸一个熟睡的婴儿。\n\n然后，你听到了盖盖子的声音。',

        vibration: [100, 300, 100],

        signal: 0, battery: 0,

        isDeath: true,

        deathName: '伴娘',

        deathDesc: '长明灯灭了，就等于给它们开了门。'

    },

    'node_dead3_v2': {

        chapter: '第二章：三条死规矩',

        time: '00:50',

        text: '你掀开了棺材盖。\n\n棺材里躺着的人，是你自己。\n\n"你"睁开了眼睛，对你笑了笑，然后伸出手，把你拉进了棺材。\n\n棺材盖从里面关上了。',

        vibration: [200, 400, 200],

        signal: 0, battery: 0,

        deathCG: 'img/death/death_01_mirror.jpg',

        isDeath: true,

        deathName: '替死',

        deathDesc: '好奇心杀死的不只是猫。'

    },

    'node_dead4': {

        chapter: '第四章：屏息与视线',

        time: '03:06',

        text: '你松手了。纸人的脸在零点一秒内贴到了你的鼻尖。你闻到了浓烈的纸浆和朱砂混合的味道。\n\n然后，你感觉自己的眼睛被什么东西挖了出来。\n\n世界黑了。但你知道，纸人现在有两只漂亮的眼睛了。',

        vibration: [500],

        signal: 0, battery: 0,

        deathCG: 'img/death/death_05_suffocate.jpg',

        isDeath: true,

        deathName: '纸替',

        deathDesc: '纸人缺一双眼睛。现在，它有了。'

    },

    'node_dead5': {

        chapter: '第三章：熄灭的灯与厨房',

        time: '02:30',

        text: '"我是你未来的新娘啊。"女尸从水缸里伸出手，抓住了你的手腕。\n\n她的力气大得不可思议。一把就把你拽进了水缸。\n\n水缸比看起来深得多。你在水里下沉，下沉，下沉……\n\n最后，你看到了水缸底部。那里躺满了人。都在对着你笑。',

        vibration: [300, 300, 300],

        signal: 0, battery: 0,

        bgImage: 'img/bg/ch08_well.jpg',

        deathCG: 'img/death/death_02_well.jpg',

        isDeath: true,

        deathName: '溺亡',

        deathDesc: '有些问题，不该问。有些答案，不该听。'

    },

    'node_dead6': {

        chapter: '第五章：终焉的倒计时',

        time: '03:36',

        text: '你回头了。\n\n身后站着穿红嫁衣的女鬼。她的脸离你只有三厘米。\n\n"谢谢你回头。"她说。"这样我就能亲到你了。"\n\n她的嘴唇贴上你的额头。冰冷，柔软，像纸一样。\n\n你感觉自己的意识正在变成纸浆。',

        vibration: [500],

        signal: 0, battery: 0,

        isDeath: true,

        deathName: '纸婚',

        deathDesc: '回头，就是签约。'

    },

    'node_dead7': {

        chapter: '第五章：终焉的倒计时',

        time: '03:41',

        text: '你跪了下来。女鬼笑了，伸出手抚摸你的头。\n\n"乖。"她说。"做我的纸新郎吧。"\n\n你感觉自己的膝盖正在变成纸。然后是大腿，腰，胸口……\n\n你变成了一张完整的纸人，乖乖地站在了她身后。',

        vibration: [200, 400, 200],

        signal: 0, battery: 0,

        deathCG: 'img/death/death_04_sacrifice.jpg',

        isDeath: true,

        deathName: '臣服',

        deathDesc: '跪下去，就再也站不起来了。'

    },

    'node_dead8': {

        chapter: '第五章：终焉的倒计时',

        time: '03:44',

        text: '你点击了"好"。\n\n屏幕瞬间变成血红。女鬼的脸填满了整个屏幕。\n\n"好。"她说。"你答应了。"\n\n你的手机摄像头闪了一下。\n\n她把你的灵魂，拍进了照片里。',

        vibration: [300, 300, 300, 300],

        signal: 0, battery: 0,

        deathCG: 'img/death/death_13_photo.png',

        isDeath: true,

        deathName: '定格',

        deathDesc: '点击"同意"的那一刻，你已经签字画押了。'

    },

    'node_dead9': {

        chapter: '第七章：纸人村',

        time: '03:31',

        text: '你喊叫了。所有的纸人同时转过了头。\n\n它们没有追你。它们只是朝你走了过来。很慢，很慢。\n\n你后退，摔倒，爬行。它们不紧不慢地跟着。\n\n最后，你被它们围在中间。它们没有伤害你。它们只是贴着你，一层又一层，把你裹成了一个纸人茧。\n\n你的声音，渐渐听不见了。',

        vibration: [100, 100, 100, 100, 100, 100],

        signal: 0, battery: 0,

        isDeath: true,

        deathName: '同化',

        deathDesc: '在纸人村，不沉默，就会被沉默。'

    },

    'node_dead10': {

        chapter: '第八章：冥婚大典',

        time: '03:37',

        text: '"我是谁？"假"你"笑了，脸皮开始脱落，露出下面的纸浆。"我是上一个你。我是上上一个你。我们都被她留下了。她需要一个新郎，所以我们轮流当。"\n\n"现在，轮到你当"我"了。"\n\n他伸出手，手指变成了纸，插进了你的太阳穴。\n\n你感觉自己的记忆正在被他抽走。',

        vibration: [400, 200, 400],

        signal: 0, battery: 0,

        deathCG: 'img/death/death_07_paper_replace.jpg',

        isDeath: true,

        deathName: '夺舍',

        deathDesc: '他想要你的身体。而你，将变成下一张等待的皮囊。'

    },

    'node_dead11': {

        chapter: '第九章：阴阳路',

        time: '03:41',

        text: '你冲向了棺材。女鬼没有拦你。\n\n你躺了进去。棺材里很软，很暖和，有一股淡淡的香味。\n\n你闭上了眼睛。\n\n然后你听到了盖盖子的声音，和钉棺材的声音。\n\n"谢谢。"女鬼在外面说。"我终于可以出去了。"',

        vibration: [200, 400, 200],

        signal: 0, battery: 0,

        deathCG: 'img/death/death_11_lock.jpg',

        isDeath: true,

        deathName: '替嫁',

        deathDesc: '有人进去，才能有人出来。这就是阴阳的规则。'

    },



    // ==================== 真结局节点 ====================

    'node_endF': {

        chapter: '第十章：回魂',

        time: '04:00',

        text: '"我不换。"你说。"我的命是我自己的。"\n\n女鬼愣了一下，然后笑了。\n\n"你是第一个拒绝的。"她说。"好吧。那你可以走了。但记住——"\n\n她凑到你耳边："你家三代欠的债，迟早要还。不是你，就是你儿子。"\n\n天亮了。公鸡打鸣。\n\n你冲出了老宅，一路狂奔到村口。回头时，老宅的门槛上放着一双你的鞋。',

        vibration: [50, 50, 50, 50],

        signal: 0, battery: 1,

        isEnding: true,

        endingCode: 'F',
        endingCG: 'img/ending/ending_f_forget.jpg',

        endingName: '逃出生天',

        fearScore: 60

    },

    'node_endG': {

        chapter: '第十章：回魂',

        time: '04:00',

        text: '"很简单。"女鬼递给你一个小纸人。"写上你想替的人的名字，烧掉。他的命就会转给你。"\n\n你接过纸人。上面已经写好了名字——是你最好朋友的名字。\n\n你犹豫了一秒。\n\n然后你写了。\n\n纸人燃烧时，你听到了朋友的惨叫声。\n\n你活了下来。可你的手机屏幕忽然亮了，挤进一条短信：\n"来陪我玩个旧游戏吧。"——发信人，是你自己。',

        vibration: [100, 200, 100],

        signal: 0, battery: 1,

        isEnding: true,

        endingCode: 'G',
        endingCG: 'img/ending/ending_g_hidden.jpg',

        endingName: '替罪羔羊',

        fearScore: 85

    },

    'node_endH': {

        chapter: '第十章：回魂',

        time: '03:45',

        text: '你把骨符放在族谱缺失的那一页上，念出她真正的名字。\n\n红嫁衣上的金线一根根松开，像很多年前没说出口的话，终于从她身上落了下来。\n\n她看着你，又看向棺材。\n\n"原来我一直等的，不是新郎。"她说。"是有人记得我是谁。"\n\n天亮时，老宅门口只剩一张黄纸。纸上写着：债已清。莫再回头。\n\n你最后看了一眼那张黄纸。落款处，历代新郎的四指血印旁，一根根第五根手指的轮廓亮起又熄灭——这一回，终于有人替他们把名字念全了。',

        vibration: [30, 60, 30],

        signal: 0, battery: 1,

        isEnding: true,

        endingCode: 'H',
        endingCG: 'img/ending/ending_h_perfect.jpg',

        endingName: '回魂',

        fearScore: 96

    },

    // ===== 场景探索节点 =====

    node_explore_cave: {

        chapter: '第六章：地下室的秘密', chapterTitle: '血池', time: '03:15', signal: 0, battery: 7,

        exploreScene: true,

        sceneImage: 'img/bg/ch04_basement.jpg',

        sceneTitle: '地下血池',

        showStatusBar: true,

        hotspots: [

            { x: 15, y: 20, w: 25, h: 40, icon: '💀', item: 'bone_amulet', itemName: '骨符', nextNode: 'node_after_cave' },

            { x: 60, y: 50, w: 20, h: 30, icon: '🔴', deathNode: 'node_dead_cave', closeupImage: 'img/bg/ch04_basement.jpg', closeupText: '你触碰了血池中央的珠子...它睁开了眼。' },

            { x: 80, y: 10, w: 15, h: 15, icon: '🕸️', nextNode: 'node_after_cave', closeup: true, closeupImage: 'img/item/item_note.jpg', closeupText: '蛛网上挂着一张泛黄的纸条，上面写着："三长两短"' }

        ],

        vibration: [100, 50, 100]

    },



    node_after_cave: {

        chapter: '第六章：地下室的秘密', chapterTitle: '血池', time: '03:16', signal: 0, battery: 6,

        text: '洞窟深处阴风阵阵。你注意到岩壁上有一扇石门，门心嵌着一圈能转动的石盘，盘面密密麻麻刻满了符号和数目。\n\n纸条上的提示是："三长两短"',

        choices: [

            { text: '尝试破解密码', next: 'node_puzzle_door' },

            { text: '原路返回', next: 'node19' }

        ]

    },



    node_dead_cave: {

        chapter: '第六章：地下室的秘密', chapterTitle: '血池', time: '03:15', signal: 0, battery: 6,

        isDeath: true, deathName: '血池吞噬', deathDesc: '你触碰了不该触碰的东西。',

        text: '血池翻涌，一只苍白的手将你拖入深渊...',

    },






    // ===== 密码锁节点 =====

    node_puzzle_door: {

        puzzleLock: true,

        puzzleType: 'keypad',

        puzzleTarget: '322',

        puzzleHint: '三长两短 = 3个长音 + 2个短音',

        puzzleSuccessNode: 'node_puzzle_success',

        puzzleFailNode: 'node_puzzle_fail'

    },



    node_puzzle_success: {

        chapter: '第六章：地下室的秘密', chapterTitle: '血池', time: '03:18', signal: 0, battery: 5,

        text: '石门轰然开启。里面是一间密室，供桌上放着一本泛黄的族谱，和一把沉甸甸的生锈钥匙。\n\n你伸手把钥匙摸出来，冰凉的铁锈贴着掌心。',

        choices: [

            { text: '查看族谱', next: 'node_genealogy' },

            { text: '离开密室', next: 'node21' }

        ]

    },



    node_puzzle_fail: {

        chapter: '第六章：地下室的秘密', chapterTitle: '血池', time: '03:17', signal: 0, battery: 5,

        text: '石盘转错了位。石门上的朱砂符文突然亮起红光——是陷阱。这一刻你才明白，古人留这扇门，根本不是给活人开的。\n\n毒针从门缝激射而出，扎进你的颈侧。四肢一点点变冷，视线却还清醒，眼睁睁看着自己不听使唤地往下倒...',

        choices: [

            { text: '挣扎', next: 'node_puzzle_fail2' }

        ]

    },



    node_puzzle_fail2: {

        isDeath: true, deathName: '机关毒针', deathDesc: '你低估了古人的智慧。',

        text: '毒入血脉，你的舌头一点点发黑，嘴里泛起铁锈混着腐烂草药的味道。\n\n眼前的一切慢慢蚀成红色，像整间屋子都在烧。最后看清的，是那枚毒针在你掌心，反着一点冷光...',

    },



    node_genealogy: {

        closeupItem: true,

        setFlags: { knows_bride_name: true },

        closeupImage: 'img/bg/paper_bride.jpg',

        closeupText: '族谱最后一页被人用血写着："莫氏女，庚辰年七月十四日生，卒于戊戌年三月初三。\n\n她的生辰八字：庚辰 甲申 丁卯 丙午"',

        closeupNextNode: 'node_after_genealogy'

    },



    node_after_genealogy: {

        chapter: '第六章：地下室的秘密', chapterTitle: '血池', time: '03:20', signal: 0, battery: 4,

        text: '你记下了生辰八字。族谱上的女子，正是纸新娘。\n\n突然，身后传来纸页翻动的声音...',

        choices: [

            { text: '猛然回头', next: 'node_paper_bride_jump' },

            { text: '保持不动', next: 'node_still' }

        ]

    },



    node_paper_bride_jump: {

        sceneImage: 'img/bg/paper_bride.jpg', sceneImageNext: 'node_dead_bride',

        text: ''

    },



    node_dead_bride: {

        isDeath: true, deathName: '回头杀', deathDesc: '母亲纸条上的警告，迟了一秒。',

        text: '纸新娘的脸离你只有一寸。她的嘴角裂到了耳根...',

    },



    node_still: {

        chapter: '第六章：地下室的秘密', chapterTitle: '血池', time: '03:22', signal: 0, battery: 4,

        text: '纸页翻动的声音停了。你屏住呼吸，等待了漫长的十秒。\n\n再回头时，房间里空无一人。只有族谱上多了一行新写的血字："谢谢你记得我。"',

        choices: [

            { text: '拿走钥匙离开', next: 'node21' }

        ]

    },




    'node5x_wait': {
        chapter: '第五章：终焉的倒计时',
        time: '03:36',
        text: '你没有回头,也没有看棺材。\n\n你强迫自己盯着供桌——长明灯的火苗只剩绿豆大,一缩一缩,像随时会咽气。母亲写的第一条规矩在脑子里发烫:长明灯不能灭。\n\n香炉里最后一炷香快烧到根了,灰白的香灰一节一节往下掉。屋外起了风,门板缝里钻进来一丝穿堂的凉气,正吹着那点火苗。\n\n你算了算:守完这炷香,大概还能撑四分钟。撑过去,天就快亮了。',
        vibration: [40, 40, 40],
        signal: 0, battery: 1,
        choices: [
            { text: '稳住长明灯,守完这炷香', next: 'node5x_vigil' },
            { text: '不管了,现在就冲门', next: 'node19' }
        ]
    },

    'node5x_vigil': {
        chapter: '第五章：终焉的倒计时',
        time: '03:37',
        text: '你跪坐回蒲团前,借着那点将灭的灯光,把供桌一样一样守过去。\n\n灯要续,香要添,水碗别看,门外喊名别应。守住这炷香的工夫,你才有命等到天亮。',
        bgImage: 'img/bg/ch02_hall_explore_v2.jpg',
        exploreScene: true,
        sceneId: 'vigil_offering',
        returnNode: 'node18',
        closeText: '坐回蒲团等天亮',
        sceneImage: 'img/bg/ch02_hall_explore_v2.jpg',
        sceneTitle: '守灵·添香',
        sceneHint: '先去神龛供桌摆好供、取到香,再给长明灯添上稳住火苗。门外要是喊你全名,别应。',
        signal: 0, battery: 1,
        hotspots: [
            {
                id: 'shrine_offering',
                x: 40, y: 16, w: 22, h: 24,
                label: '神龛供桌',
                item: 'incense',
                itemName: '香',
                setFlags: { offering_set: true },
                once: true,
                toast: '你重新摆好供,抽出三炷新香收进背包。',
                closeup: true,
                closeupTitle: '神龛供桌',
                closeupHint: '三炷香两短一长,水碗里的倒影别多看。先取香,稳灯要紧。',
                closeupImage: 'img/closeup/closeup_shrine_offering.png',
                closeupText: '供桌上插着三炷香,两短一长,长的那炷一直没烧。\n\n香脚边的水碗满得几乎溢出来,碗面平得像镜子。你余光瞥见碗里映出的不是你的脸——是一张惨白的、贴着你肩膀往前探的脸。\n\n你猛地移开视线,抽出三炷新香。'
            },
            {
                id: 'spirit_lamp_feed',
                x: 63, y: 34, w: 13, h: 14,
                label: '长明灯',
                requireItem: 'incense',
                consumeItem: 'incense',
                visibleWhenFlag: 'offering_set',
                once: true,
                lockedText: '火苗只剩一点,你得先从背包里选中香,引着火给灯续上,别空着手去够它。',
                setFlags: { lamp_steady: true },
                toast: '你用香引着火苗,长明灯忽地直起来,火头稳了。屋子重新亮了一圈。',
                closeup: true,
                closeupTitle: '续稳的长明灯',
                closeupHint: '灯稳住了。记住第一条:它不能灭,也不值得你拿命去够。',
                closeupImage: 'img/closeup/closeup_spirit_lamp_dim.jpg',
                closeupText: '你拿香小心地引过火,挑了挑灯芯。火苗忽地一直,屋子重新亮了一圈。\n\n供桌后的牌位齐齐响了一声,像有人同时松了口气。'
            },
            {
                id: 'censer_grab_flame',
                x: 43, y: 40, w: 16, h: 11,
                label: '香炉边将灭的火',
                hiddenWhenFlag: 'lamp_steady',
                deathNode: 'node5x_dead_burn'
            },
            {
                id: 'door_name_call',
                x: 77, y: 22, w: 20, h: 36,
                label: '门外的喊声',
                visibleWhenFlag: 'lamp_steady',
                nextNode: 'node5x_call'
            },
            {
                id: 'water_bowl_dont_look',
                x: 56, y: 60, w: 18, h: 9,
                label: '供桌水碗',
                visibleWhenFlag: 'lamp_steady',
                closeup: true,
                closeupTitle: '别往水里看',
                closeupHint: '第三条规矩:镜面、水面、铜器倒影都算。看一眼就够了,别盯着。',
                closeupImage: 'img/item/item_note.jpg',
                closeupText: '你只敢用余光扫过水碗。碗里的水纹自己晃了一下,像有人从碗底往上呼了口气。\n\n你立刻别开脸。第三条规矩还压着:别往水里看。'
            },
            {
                id: 'vigil_done_exit',
                x: 30, y: 66, w: 24, h: 14,
                label: '坐回蒲团',
                visibleWhenFlags: ['offering_set', 'lamp_steady'],
                setFlags: { vigil_kept: true },
                toast: '灯稳了,供摆好了,香也快守到根。你坐回蒲团,屏住呼吸——可棺材里,那声轻响还是来了。',
                nextNode: 'node18'
            }
        ],
        vibration: [20, 40, 20]
    },

    'node5x_call': {
        chapter: '第五章：终焉的倒计时',
        time: '03:38',
        text: '门外有人在喊你。\n\n一个字一个字,把你的全名喊得又清又慢,像怕你听不见,又像在点名。声音是你妈的,可你妈早就不在了。\n\n第二条规矩在耳边炸开:喊你全名时,绝不能答应。\n\n喊声越来越急,几乎是贴着门缝在求你:答应一声,就一声。',
        vibration: [100, 50, 100, 50, 100],
        signal: 0, battery: 1,
        choices: [
            { text: '捂住耳朵,一声都不应', next: 'node5x_vigil', statEffect: { sanity: 6, fear: -5 } },
            { text: '忍不住应了一声', next: 'node_dead8', vibration: [500] }
        ]
    },

    'node5x_dead_burn': {
        chapter: '第五章：终焉的倒计时',
        time: '03:37',
        text: '火苗就要灭了。你顾不上规矩,空着手伸过去想拢住它。\n\n衣袖先擦过香炉,半截没烧尽的香火倒进了袖口。火没有大,却顺着布料一路往上爬,安安静静,像早就认得你。\n\n你拍,你打,火却越拍越旺。最后你撞翻了长明灯,满桌的灯油泼下来——整张供桌轰地烧成一团。\n\n你这才想起第一条规矩:长明灯不能灭。你拿命去够它,它就拿你的命来续。',
        vibration: [500],
        signal: 0, battery: 0,
        deathCG: 'img/death/death_08_burn.jpg',
        isDeath: true,
        deathName: '续灯',
        deathDesc: '长明灯不能灭——可它要的从来不是灯油,是替它烧的人。'
    },

    'node7x_funeral_explore': {
        chapter: '第七章：纸人村',
        time: '03:27',
        text: '打谷场边搭着一座临时灵棚。白幡垂得笔直，没有一丝风。\n\n棚里也站着人，背对着你，跟场上那些一样一动不动。可这里多了一具棺木、一张遗照、一本摊开的族谱。\n\n你知道纸人没有影子。借着长明灯的余光，先一个一个看清——哪个是纸糊的，哪个还在喘气。别出声，别应名，别去看棺木边那盆供水。',
        bgImage: 'img/bg/ch07_funeral.jpg',
        exploreScene: true,
        sceneId: 'paper_village_funeral',
        returnNode: 'node24',
        closeText: '退回打谷场',
        sceneImage: 'img/bg/ch07_funeral.jpg',
        sceneTitle: '村中灵棚',
        sceneHint: '先看遗照和族谱，分清活人与纸人。要走时混进纸人群往老宅去。',
        signal: 0, battery: 1,
        hotspots: [
            {
                id: 'white_banner',
                x: 8, y: 10, w: 16, h: 30,
                label: '白幡',
                closeup: true,
                closeupTitle: '不动的白幡',
                closeupHint: '幡上写的不是你认识的名字。这一棚，办的是别人的丧。',
                closeupImage: 'img/bg/ch07_funeral.jpg',
                closeupText: '白幡笔直垂着，棚外明明有夜风，幡却一丝不动。\n\n幡上一行墨字，写的是你的姓，名字那两个字被人用红笔圈了起来——还空着，像在等谁来填。'
            },
            {
                id: 'old_photo',
                x: 40, y: 8, w: 20, h: 22,
                label: '遗照',
                item: 'old_photo',
                itemName: '爷爷的旧遗照',
                once: true,
                setFlags: { saw_extra_man: true },
                toast: '你把遗照取了下来，相框背面还粘着半张黄纸。',
                closeup: true,
                closeupTitle: '多出一个人的遗照',
                closeupHint: '上次看这张照片，爷爷是哭丧着脸的。',
                closeupImage: 'img/item/item_old_photo.jpg',
                closeupText: '黑白遗照里是爷爷。可你记得他出殡那天照片上只有他一个人。\n\n现在他身后多站了一个穿红嫁衣的女人，半张脸被香灰糊住。\n\n而爷爷，在笑。你从没见他这样笑过。'
            },
            {
                id: 'turning_puppet',
                x: 66, y: 40, w: 12, h: 20,
                label: '供桌纸偶',
                item: 'puppet',
                itemName: '会转头的纸偶',
                once: true,
                toast: '你抓起纸偶塞进背包。隔着布，它还在你掌心里轻轻拧动。',
                closeup: true,
                closeupTitle: '会转头的纸偶',
                closeupHint: '你盯着它时它不动。你一移开眼，它就朝你转过来。',
                closeupImage: 'img/item/item_puppet.jpg',
                closeupText: '巴掌大的纸偶，画着五官，脖子上缠着一圈红线。\n\n你正着看它，它脸朝供桌。你把视线挪开半寸，再回头——它的脸已经转过来，正对着你。\n\n红线那头，连着族谱。'
            },
            {
                id: 'genealogy_missing_page',
                x: 24, y: 52, w: 24, h: 16,
                label: '摊开的族谱',
                setFlags: { knows_bride_name: true },
                once: true,
                toast: '你认下了缺页上那个名字。门外若喊它，喊的是她，不是你。',
                closeup: true,
                closeupTitle: '族谱的缺页',
                closeupHint: '被撕走的那一页，血正从纸里渗出来，把字一点点补全。',
                closeupImage: 'img/closeup/closeup_genealogy_missing_page.png',
                closeupText: '族谱在莫氏女这一辈断了，整页被人撕走。撕口处洇着暗红，血顺着纸纹慢慢爬，把缺掉的字一个一个填回来。\n\n生于庚辰年七月十四，卒于戊戌年三月初三。名字最后浮出来，是个你从没在这家叫过的字。\n\n你记住了它。这是她活着时的名字，不是新娘。'
            },
            {
                id: 'funeral_coffin',
                x: 50, y: 60, w: 30, h: 16,
                label: '灵棚棺木',
                lockedText: '棺盖虚掩，里面有极轻的呼吸声——纸人不喘气。先别急着掀，看清了再说。',
                nextNode: 'node7x_coffin_alive'
            },
            {
                id: 'blend_into_paper',
                x: 82, y: 70, w: 16, h: 22,
                label: '混进纸人群',
                requireFlag: 'knows_bride_name',
                missingText: '现在出去只是又一个低头走路的纸人。族谱那页还没看清，你连她叫什么都不知道。',
                nextNode: 'node7x_blend_back'
            }
        ],
        vibration: [20, 40, 20]
    },

    'node7x_coffin_alive': {
        chapter: '第七章：纸人村',
        time: '03:29',
        text: '你掀开棺盖。\n\n里面不是纸人。是个活人，胸口还在起伏，脸盖着黄纸。指甲缝里全是新泥，像刚从土里被人拖出来。\n\n黄纸忽然鼓起，底下有人在喊——喊的是你的全名，一个字一个字，又清楚又恳切。\n\n第二条规矩在你耳边响：喊你全名时，绝不能答应。可棺里那是个还活着的人。',
        character: 'img/char/bride_paper.jpg',
        characterEmotion: 'ghost',
        characterPosition: 'center',
        characterFlicker: true,
        vibration: [200, 150, 200, 150],
        signal: 0, battery: 1,
        choices: [
            { text: '心软，应了一声把人拉出来', next: 'node7x_answer_dead', vibration: [400, 200, 400] },
            { text: '咬住牙，一个字都不应，盖回棺盖', next: 'node7x_funeral_explore' }
        ]
    },

    'node7x_answer_dead': {
        chapter: '第七章：纸人村',
        time: '03:30',
        text: '你应了。\n\n那一声刚出口，黄纸下的脸就不喘了。棺里的活人塌成一张人皮，瘪下去，像被抽走了骨头。\n\n而你忽然觉得胸口被抽空——你应的是你的名字，名字一旦递出去，就换不回来了。\n\n灵棚里所有纸人同时转过头，朝你伸出手。它们终于等到一个肯答话的。',
        deathCG: 'img/death/death_07_paper_replace.jpg',
        vibration: [400, 200, 400, 200],
        signal: 0, battery: 0,
        isDeath: true,
        deathName: '应名',
        deathDesc: '喊你全名的，从来不是要救你的人。'
    },

    'node7x_blend_back': {
        chapter: '第七章：纸人村',
        time: '03:31',
        text: '你把遗照贴在胸口，记着族谱缺页上那个名字，低头走出灵棚。\n\n打谷场上的纸人开始挪动，朝老宅的方向走。你混进队伍，学它们的步子，不快不慢。\n\n背包里那只纸偶又在拧动。它转头的方向，和所有纸人低头的方向，一致。',
        vibration: [50, 100, 50],
        signal: 0, battery: 1,
        choices: [
            { text: '跟着纸人队伍往前走', next: 'node25' }
        ]
    },

    'node8x_hall': { chapter: '第八章：冥婚大典', time: '03:38', text: '你没往回跑成。\n\n一只手从背后按住你的肩，凉得像浸过井水。你被推着往祠堂深处走，脚下的青砖一块块亮起红光，像有人提前铺好了喜路。\n\n祠堂正中摆着两把太师椅，左边那把空着，右边坐着新娘——红嫁衣，红盖头，纹丝不动。\n\n供桌后站着一个人。是你母亲。\n\n"你回来了。"她笑着朝你招手，"快，时辰到了。先去后院打盆喜水，再盖盖头。规矩不能乱。"', character: 'img/char/mother.jpg', characterEmotion: 'normal', characterPosition: 'center', vibration: [80, 160, 80], signal: 0, battery: 1, choices: [ { text: '去后院打喜水', next: 'node8x_well_explore' }, { text: '直接走到喜位前接盖头', next: 'node8x_veil' }, { text: '盯着母亲，问她你爹埋在哪', next: 'node8x_mother' } ] },

    'node8x_well_explore': { chapter: '第八章：冥婚大典', time: '03:40', text: '后院只有一口老井。\n\n月亮不在天上，却泡在井里，被水面晃成一张惨白的脸。井台边搁着一只空木桶，井绳松松地垂进黑里。\n\n母亲在堂屋喊：打满一桶就回来，别往井里看。', bgImage: 'img/bg/ch08_well.jpg', exploreScene: true, sceneId: 'ch08_backyard_well', returnNode: 'node8x_hall', closeText: '回祠堂', sceneImage: 'img/bg/ch08_well.jpg', sceneTitle: '后院老井', sceneHint: '先理井绳、挂上水桶，再摇辘轳打水。记住第三条规矩：别往水里看。', signal: 0, battery: 1, hotspots: [ { id: 'well_rope', x: 60, y: 30, w: 14, h: 28, label: '井绳', once: true, setFlags: { well_rope_ready: true }, toast: '你把缠死的井绳一圈圈理顺。绳子很沉，像下面吊着的不只是空气。', closeup: true, closeupTitle: '理顺的井绳', closeupHint: '绳子理好了，可以挂桶了。别低头往井里看。', closeupImage: 'img/item/item_red_string.jpg', closeupText: '井绳被水泡得发胀，每隔一段就打着一个死结。你数到第七个结时，绳子忽然自己抖了一下，像下面有人攥住了它。' }, { id: 'wood_bucket', x: 20, y: 55, w: 18, h: 20, label: '木桶', requireFlag: 'well_rope_ready', lockedText: '井绳还乱成一团，先把绳子理顺再挂桶。', once: true, setFlags: { bucket_hung: true }, toast: '你把木桶挂上井绳，桶底有一圈干掉的暗红，怎么洗都洗不净。', closeup: true, closeupTitle: '挂好的木桶', closeupHint: '桶挂好了。摇辘轳打水，全程别低头。', closeupImage: 'img/item/item_incense.jpg', closeupText: '木桶内壁结着一圈干涸的暗红，像很多年前装过别的东西。你把它挂上井绳，桶在井口轻轻打转，发出新娘环佩似的响。' }, { id: 'windlass_draw', x: 42, y: 40, w: 18, h: 22, label: '辘轳', visibleWhenFlag: 'bucket_hung', hiddenWhenFlag: 'water_drawn', setFlags: { water_drawn: true }, once: true, item: 'veil', itemName: '红盖头', toast: '你低着头死命摇辘轳。桶升上来时沉得反常，里面除了水，还泡着一块叠好的红绸——红盖头。', closeup: true, closeupTitle: '打上来的喜水', closeupHint: '水打满了。桶里多了一块红盖头。可以回祠堂了。', closeupImage: 'img/item/item_veil.jpg', closeupText: '你死盯着自己的鞋尖摇辘轳，没敢抬眼。桶沉甸甸地升上来，水面上浮着一块叠得整整齐齐的红绸。\n\n你把它拎出来——是一方红盖头，边角还在滴水，针脚是母亲的手法。' }, { id: 'well_bottom_danger', x: 38, y: 62, w: 26, h: 16, label: '井口', closeupNextNode: 'node8x_dead_well', closeup: true, closeupTitle: '井底', closeupHint: '第三条规矩：别往水里看。', closeupImage: 'img/closeup/closeup_well_bottom.png', closeupText: '你忍不住探头往井里望了一眼。\n\n水面下不是石壁，是一张脸——肿胀发白，泡得没了五官，却分明在朝你笑。它穿着红嫁衣，正缓缓往上浮。\n\n你想后退，脖子却不听使唤。' }, { id: 'well_exit', x: 78, y: 22, w: 18, h: 30, label: '回祠堂', visibleWhenFlag: 'water_drawn', toast: '你拎着喜水和红盖头，转身回祠堂。井里的水，又恢复了平静。', nextNode: 'node8x_hall' } ], vibration: [30, 60, 30] },

    'node8x_veil': { chapter: '第八章：冥婚大典', time: '03:42', text: '母亲把你按坐进左边那把太师椅。\n\n"乖。"她抖开红盖头，一股井水的腥气扑下来。盖头落下的瞬间，世界只剩一片红。红绸薄得能透光，你看见母亲的影子在外面晃，还有右边新娘的影子——正一寸寸朝你这边歪过来。\n\n供桌上不知何时立着一面老镜子，镜面裂成蛛网。盖头底下，你眼角正好瞟到镜子。\n\n规矩第三条在脑子里炸开：别往水里看，镜面也算。', character: 'img/char/mother.jpg', characterEmotion: 'ghost', characterPosition: 'center', characterFlicker: true, vibration: [100, 200, 100], signal: 0, battery: 1, choices: [ { text: '偷偷掀起盖头一角，看那面破镜子', next: 'node8x_mirror' }, { text: '闭眼顺从，让她盖好盖头', next: 'node_endB' }, { text: '一把扯下盖头，质问母亲', next: 'node8x_mother' } ] },

    'node8x_mirror': { chapter: '第八章：冥婚大典', time: '03:43', text: '你掀起盖头一角，眼睛瞟向那面裂镜。\n\n镜子裂成蛛网，每一块碎片里都映着不同的东西。\n\n正中那块映出你自己——可你背后，紧贴着一个本不该存在的人。红嫁衣，红盖头，下巴抵在你肩窝里，盖头底下没有脸，只有湿漉漉的黑。她的手，正从背后绕过来，替你理嫁衣的领口。\n\n你猛地回头。身后空无一人。\n\n再看镜子，她还在。\n\n一块碎镜无声地脱出镜框，划过你的脸颊，扎进掌心，尖得发烫。', bgImage: 'img/bg/ch08_well.jpg', item: { code: 'broken_mirror', name: '破碎镜子', desc: '从冥婚镜上掉下的碎片，照出的东西总比眼前多一个。' }, vibration: [150, 300, 150, 300], signal: 0, battery: 1, choices: [ { text: '盯着碎镜，看清贴在你背后那张脸', next: 'node8x_mother' }, { text: '尖叫着把镜子砸向新娘', next: 'node8x_dead_mirror' } ] },

    'node8x_mother': { chapter: '第八章：冥婚大典', time: '03:45', text: '"娘——"\n\n母亲停下手。她沉默了很久，然后抬手，掀开了自己头顶不知何时也戴上的红盖头。\n\n盖头底下不是脸，是一层湿透的纸浆，一道道指甲抠出的沟，眼睛的位置只剩两个洞。\n\n"对不起。"她的声音从纸浆里渗出来，"娘早就不在了。三年前那场冥婚，躺进喜位的是我。我替了你外婆，本想着……能换你和你爹平安。\n\n"那张带血的纸条，是我趁她不备写的。我想救你……可这祠堂里，要么你替我站进去，要么……你自己写张纸人，写上别人的名字，替了你这条命……\n\n"快、快选。她快醒了。"', character: 'img/char/mother.jpg', characterEmotion: 'ghost', characterPosition: 'center', characterFlicker: true, vibration: [200, 100, 200, 100], signal: 0, battery: 0, choices: [ { text: '替她躺进喜位，放她走', next: 'node_endB' }, { text: '接过纸人，把债替给别人', next: 'node_endG' } ] },

    'node8x_dead_well': { chapter: '第八章：冥婚大典', time: '03:41', text: '你到底还是往井里看了。\n\n水底那张泡白的脸越浮越快，红嫁衣在黑水里散开，像血。她伸出手，从井里抓住了你探下来的脸。\n\n手很轻，却把你整个人往下拽。井口很小，你却一寸寸滑了进去，骨头咔咔地折叠。\n\n最后入水的，是你睁着的眼睛。井面合上，又泡着一轮惨白的月亮。', deathCG: 'img/closeup/closeup_well_bottom.png', vibration: [300, 200, 300, 200], signal: 0, battery: 0, isDeath: true, deathName: '沉井', deathDesc: '第三条规矩：别往水里看。井底有人等了很久，等你低头。' },

    'node8x_dead_mirror': { chapter: '第八章：冥婚大典', time: '03:44', text: '你尖叫着把镜子砸向新娘。\n\n镜子在半空碎成一阵冷光雨，每一片碎镜里都有一个红嫁衣的她。一百个她同时转头，看向一个砸镜子的你。\n\n镜子照过的东西，就被请了出来。\n\n她们从碎片里一齐迈出，红袖把你裹住。你最后看见的，是无数面碎镜里，自己已经穿上了嫁衣，正朝镜外的你温柔地笑。', deathCG: 'img/death/death_11_lock.jpg', vibration: [400, 200, 400], signal: 0, battery: 0, isDeath: true, deathName: '碎镜', deathDesc: '镜面也算水。照出来的，砸不碎，只会被放出来。' },

    'node9x_yinyang_road': {
        chapter: '第九章：阴阳路',
        time: '03:38',
        bgImage: 'img/bg/ch09_graveyard.jpg',
        text: '你没往老宅跑，顺着那段唢呐声拐上了岔路。\n\n路两旁的野草齐到腰高，草尖上挂着一串串黄裱纸。天上那轮月亮是红的，像泡在水里太久的蛋黄，把整条路照成了暗红色。\n\n远处来了一支送亲的队伍。打头的两个纸扎童男童女，抬着一顶红轿，后面跟着一长串低着头的人。\n\n唢呐越吹越近。你数了数抬轿的人——八个，可只有七双脚沾着地。',
        vibration: [60, 120, 60],
        signal: 0, battery: 1,
        characterFlicker: true,
        choices: [
            { text: '别回头，贴着草丛让队伍先过去', next: 'node9x_grave_explore' },
            { text: '低头混进送亲的队伍里', next: 'node9x_join_procession' }
        ]
    },

    'node9x_grave_explore': {
        chapter: '第九章：阴阳路',
        time: '03:39',
        bgImage: 'img/bg/ch09_graveyard.jpg',
        text: '送亲队伍从你面前淌过去，谁也没看你。\n\n队伍走远后，你发现自己站在一片乱葬岗里。最近的一座是新坟，土还是湿的，坟头插着白幡，烧了一半的纸钱在血月下泛着暗红。\n\n坟前立着一块小小的名牌。你不想看，可你的脚自己往那边挪。',
        exploreScene: true,
        sceneId: 'yinyang_graveyard',
        returnNode: 'node9x_yinyang_road',
        closeText: '退回岔路',
        sceneImage: 'img/bg/ch09_graveyard.jpg',
        sceneTitle: '乱葬岗·新坟',
        sceneHint: '坟头有名牌、纸扎童子，远处还有一团灯光。看清名牌前，别去碰水里的倒影。',
        signal: 0, battery: 1,
        hotspots: [
            {
                id: 'grave_name_tag',
                x: 40, y: 55, w: 22, h: 18,
                label: '坟头名牌',
                once: true,
                setFlags: { saw_own_grave: true },
                toast: '名牌上的名字是你的全名。墨迹还没干。',
                closeup: true,
                closeupTitle: '坟头的名牌',
                closeupHint: '这座新坟是给你留的。它在等你自己躺进去。',
                closeupImage: 'img/closeup/closeup_grave_paper_money.png',
                closeupText: '名牌上是你的全名，最后一个字被指甲刮得很深，和那块旧孝牌一模一样。\n\n纸钱堆里压着半碗供水，水面映出你背后站着的红轿。你赶紧别开眼——第三条规矩，别往水里看。',
                closeupNextNode: 'node28'
            },
            {
                id: 'paper_children',
                x: 8, y: 48, w: 18, h: 26,
                label: '纸扎童子',
                closeup: true,
                closeupTitle: '纸扎童男童女',
                closeupHint: '它们脸上的笑是画上去的，眼珠却跟着你转。',
                closeupImage: 'img/closeup/closeup_grave_paper_money.png',
                closeupText: '两个纸扎童子守在坟边，金童的牌子写着\"引魂\"，玉女的牌子写着\"送嫁\"。\n\n你一靠近，它们画着笑的脸齐齐转过来，纸做的嘴里漏出一句：\"新人快上轿。\"'
            },
            {
                id: 'far_bus_light',
                x: 74, y: 20, w: 18, h: 16,
                label: '远处的灯光',
                closeup: true,
                closeupTitle: '岔路尽头的灯',
                closeupHint: '那像是回城的末班车。可你明明记得，末班车早就开走了。',
                closeupImage: 'img/bg/ch09_graveyard.jpg',
                closeupText: '乱葬岗的另一头停着一辆亮着灯的大巴，车门开着，司机低着头一动不动。\n\n车牌和你来时坐的那班一模一样。它不该还在这里。',
                closeupNextNode: 'node9x_bus_trap'
            }
        ],
        vibration: [40, 80, 40]
    },

    'node9x_join_procession': {
        chapter: '第九章：阴阳路',
        time: '03:40',
        bgImage: 'img/bg/ch09_graveyard.jpg',
        text: '你学着旁人的样子低下头，混进了送亲的队伍。\n\n没人抬头看你。可你越走越觉得不对——前后的人都没有影子，脚步声却整齐得像一个人在走。\n\n红轿的帘子被风掀开一条缝。轿里没有新娘，只有一件空荡荡的红嫁衣，正缓缓抬起袖子，朝你招手。\n\n抬轿的纸人忽然停下，齐声开口：\"新郎到了。换班吧。\"它们把轿杠往你肩上压。',
        vibration: [120, 200, 120],
        signal: 0, battery: 1,
        character: 'img/char/grandpa_normal.jpg', characterEmotion: 'ghost', characterPosition: 'center', characterFlicker: true,
        choices: [
            { text: '接过轿杠，替这支队伍抬下去', next: 'node_endB' },
            { text: '甩开轿杠，往乱葬岗的灯光跑', next: 'node9x_bus_trap' }
        ]
    },

    'node9x_bus_trap': {
        chapter: '第九章：阴阳路',
        time: '03:41',
        bgImage: 'img/bg/ch09_graveyard.jpg',
        text: '你跌跌撞撞冲向那辆亮着灯的末班车。\n\n车门是开的。台阶上落了一层湿纸钱。司机低着头，帽檐压得很低，看不见脸。\n\n你刚踏上一只脚，司机仍低着头，喉咙里却爬出一个女人的声音——又软又慢，一个字一个字，念出了你的全名。\n\n\"……到站了。上车吧。\"\n\n它在等你应一声。',
        vibration: [150, 300, 150],
        signal: 0, battery: 1,
        choices: [
            { text: '答应一声\"我在\"，上车回城', next: 'node9x_dead_bus' },
            { text: '咬住舌头不出声，转身硬闯进黑夜', next: 'node_endF' }
        ]
    },

    'node9x_dead_bus': {
        chapter: '第九章：阴阳路',
        time: '03:42',
        bgImage: 'img/bg/ch09_graveyard.jpg',
        deathCG: 'img/death/death_06_bus.jpg',
        text: '\"我在。\"你脱口答应。\n\n车门\"砰\"地合上。司机终于抬起头——帽檐下是一张没有五官的白纸脸。\n\n车窗外的乱葬岗飞快倒退，红月亮变成了一盏长明灯。你想下车，可每一站的站牌上写的都是你的名字。\n\n天亮后，村里人说末班车上少了一个乘客。座位上只留着一双还带着体温的鞋。',
        vibration: [200, 400, 200, 400, 200],
        signal: 0, battery: 0,
        isDeath: true,
        deathName: '失踪',
        deathDesc: '喊你全名时，连\"我在\"都不能答。答了，这趟车就再也不到站。'
    },

    'node10x_ritual_prep': {
        chapter: '第十章：回魂',
        time: '03:46',
        text: '你没有急着开口。\n\n念真名前，得先把回魂的法坛布好。骨符要压住写你名字的小棺，香要点上三炷，族谱缺的那一页得对准她。\n\n长明灯的光只照到法坛中央一小圈。圈外，红嫁衣在黑里轻轻晃。你低着头，按规矩一样一样摆，谁也没看谁。',
        bgImage: 'img/bg/ch07_funeral.jpg',
        exploreScene: true,
        sceneId: 'soul_return_altar',
        returnNode: 'node29',
        closeText: '退回女鬼面前',
        sceneImage: 'img/bg/ch07_funeral.jpg',
        sceneTitle: '回魂法坛',
        sceneHint: '先压骨符、点香、对照族谱。三样齐了，才敢念她的名字。背包里选中道具后可直接点场景使用。',
        signal: 0, battery: 1,
        hotspots: [
            {
                id: 'place_bone_charm',
                x: 40, y: 48, w: 22, h: 18,
                label: '骨符与小棺',
                requireItem: 'bone_amulet',
                lockedText: '写着你名字的小棺摆在坛心，里面有东西在轻轻撞。空手按下去只会被它含住，得先在背包里选中骨符。',
                missingText: '没有骨符，压不住这口写着你名字的小棺。',
                setFlags: { charm_placed: true },
                once: true,
                toast: '骨符压上小棺，棺里的撞动停了一下，又慢慢轻下去。',
                closeup: true,
                closeupTitle: '骨符压棺',
                closeupHint: '符纹一压上去就泛了暗红。坛稳了一半，但骨符不能挪——挪开，棺就醒。',
                closeupImage: 'img/closeup/closeup_ritual_bone_charm.png',
                closeupText: '骨符压在写着你名字的小棺上，褪色符纹一点点吃进暗红。\n\n纸棺里的撞动慢下来，像被哄睡。你听见极轻的一声：那是有人在棺里，跟着你的呼吸数数。'
            },
            {
                id: 'light_incense',
                x: 18, y: 40, w: 16, h: 18,
                label: '三炷香',
                visibleWhenFlag: 'charm_placed',
                setFlags: { incense_lit: true },
                once: true,
                toast: '三炷香点起，烟笔直往上，到半空忽然朝你身后斜过去。',
                closeup: true,
                closeupTitle: '点起的三炷香',
                closeupHint: '烟在替你指方向。它斜向哪里，哪里就站着人。但你不能回头去看。',
                closeupImage: 'img/item/item_incense.jpg',
                closeupText: '三炷香齐了，烟笔直地升，到你头顶忽然整齐地朝身后斜过去，像被一口气吸住。\n\n你想起规矩——别回头。烟指的地方，正贴着你的后背。'
            },
            {
                id: 'match_genealogy',
                x: 62, y: 40, w: 18, h: 20,
                label: '族谱缺页',
                visibleWhenFlag: 'incense_lit',
                setFlags: { name_matched: true, knows_bride_name: true },
                once: true,
                toast: '族谱缺页上的血字自己接了上来——你认下了她的真名。',
                closeup: true,
                closeupTitle: '对上的缺页',
                closeupHint: '名字快回来了。等三样都齐，你才念得动它。',
                closeupImage: 'img/bg/paper_bride.jpg',
                closeupText: '你把庚辰年的生辰八字对准缺页，血字一笔一笔自己接上来。\n\n那是个女人的名字。她被这家人从族谱里抠掉，抠了很多年。现在，墨在等你念出第一个音。'
            },
            {
                id: 'pick_blood_jade',
                x: 8, y: 60, w: 14, h: 14,
                label: '坛角血玉',
                item: 'blood_jade',
                itemName: '血玉',
                setFlags: { jade_taken: true },
                once: true,
                toast: '你拾起坛角那块血玉，它在你掌心里忽明忽暗，像跟着谁的心跳。',
                closeup: true,
                closeupTitle: '忽明忽暗的血玉',
                closeupHint: '它亮，就是她近了；它暗，就是她退了。别对着玉面看自己的影子。',
                closeupImage: 'img/item/item_blood_jade.jpg',
                closeupText: '血玉冰凉，里面的红一下一下地涨，像有人在玉里呼吸。\n\n它越亮，背后的红影就越近。玉面光滑得能照出人——你想避开视线，却已经来不及，玉里映出了你背后那张正贴过来的脸。'
            },
            {
                id: 'pick_bell',
                x: 84, y: 56, w: 13, h: 16,
                label: '供桌铜铃',
                item: 'bell',
                itemName: '铜铃',
                setFlags: { bell_taken: true },
                once: true,
                toast: '你拿起供桌边那只旧铜铃。它没动，却自己响了一声。',
                closeup: true,
                closeupTitle: '自己响的铜铃',
                closeupHint: '守门人才握这铃。摇响它，是替这家人接班，不是破局。想清楚再摇。',
                closeupImage: 'img/item/item_bell.jpg',
                closeupText: '铜铃旧得发黑，铃舌上缠着一圈头发。你没摇，它自己轻轻响了一声。\n\n铃声落处，黑暗里很多张纸脸同时转过来，像在等一个新的、握铃的人。'
            },
            {
                id: 'altar_ready',
                x: 40, y: 74, w: 24, h: 14,
                label: '在坛前跪定',
                visibleWhenFlags: ['charm_placed', 'incense_lit', 'name_matched'],
                setFlags: { altar_ready: true },
                toast: '骨符压住了，香点上了，名字对上了。你跪定在坛前，抬起头。',
                nextNode: 'node10x_altar'
            },
            {
                id: 'altar_water_bowl',
                x: 30, y: 30, w: 12, h: 10,
                label: '坛前水碗',
                closeup: true,
                closeupTitle: '坛前那碗水',
                closeupHint: '水面太静了。第三条规矩还在：别往水里看。',
                closeupImage: 'img/bg/ch08_well.jpg',
                closeupText: '坛前供着一碗清水，照理该映出你低头的脸。\n\n可水面只映出红嫁衣的下摆，和一双没有脚的鞋。你赶紧移开眼——往里多看一秒，水就会涨上来。'
            }
        ],
        vibration: [40, 80, 40]
    },

    'node10x_altar': {
        chapter: '第十章：回魂',
        time: '03:48',
        character: 'img/char/bride_paper.jpg', characterEmotion: 'ghost', characterPosition: 'center', characterFlicker: true,
        text: '法坛布齐了。骨符压着小棺，三炷香的烟齐齐斜向你背后，族谱缺页上那个名字快要满了。\n\n红嫁衣在坛对面坐下，红盖头底下没有声音。\n\n她无声地等着你先开口。你心里清楚，这一声出口，就再也改不了口了。坛前那块血玉在你手心一下一下地亮。',
        vibration: [60, 120, 60],
        signal: 0, battery: 1,
        choices: [
            { text: '深吸一口气，准备念出族谱上的真名', next: 'node10x_recite', requireFlag: 'knows_bride_name' },
            { text: '把骨符从小棺上拿起，改写自己的名字祭名', next: 'node_endD', requireItem: 'bone_amulet' },
            { text: '握紧那只铜铃，迟疑要不要摇响', next: 'node10x_bell', requireItem: 'bell' },
            { text: '不敢念，退回女鬼面前', next: 'node29' }
        ]
    },

    'node10x_recite': {
        chapter: '第十章：回魂',
        time: '03:50',
        text: '你张开嘴。\n\n第一个音刚出来，红烛就矮了一截。香烟不再斜向你背后，而是齐齐转向她——像很多年没人叫过她的名字，它们急着把名字送过去。\n\n红盖头底下，传来一声很轻的抽气。她抬起头，却没有脸，只有一片等着被填上的空白。\n\n血玉在你掌心烫得发亮。再念下去，就收不回了。',
        vibration: [50, 100, 50],
        signal: 0, battery: 1,
        choices: [
            { text: '把骨符按在缺页上，连名字一起念到底', next: 'node_endH', requireItem: 'bone_amulet', requireFlag: 'knows_bride_name' },
            { text: '只把真名念完，让她自己想起自己', next: 'node_endE', requireFlag: 'knows_bride_name' },
            { text: '念到一半，忍不住低头去看掌心的血玉', next: 'node10x_jade' }
        ]
    },

    'node10x_jade': {
        chapter: '第十章：回魂',
        time: '03:52',
        text: '你低头看血玉。\n\n玉里的红涨到最满，整块玉亮得像一颗心。亮光里，红嫁衣已经无声地贴到了你面前，盖头下那片空白离你只剩一寸。\n\n血玉太亮了，亮得能照出人——它光滑的玉面上，正映出你低着头的脸，和你脸后面，慢慢凑近的另一张。\n\n规矩说，铜器倒影也算水。别往里看。可你已经看了。',
        vibration: [120, 200, 120],
        signal: 0, battery: 1,
        choices: [
            { text: '猛地移开眼，趁血玉最亮把真名和骨符一起送出去', next: 'node_endH', requireItem: 'bone_amulet', requireFlag: 'knows_bride_name' },
            { text: '血玉黯下去前，硬把最后一个音念完', next: 'node_endE', requireFlag: 'knows_bride_name' },
            { text: '盯着玉面里那张越来越近的脸', next: 'node_dead5' }
        ]
    },

    'node10x_bell': {
        chapter: '第十章：回魂',
        time: '03:51',
        text: '铜铃在你手里发凉。铃舌上缠着的头发蹭着你的指缝。\n\n你忽然懂了它的用处——握铃的人不破局，他接班。摇响铜铃，门就归你守；这家人三代欠的债，从此由你替他们看着门，谁也别想再走。\n\n黑暗里那些纸脸都转了过来，安静地等。红嫁衣也停了，像在让你自己选。',
        vibration: [80, 160, 80],
        signal: 0, battery: 1,
        choices: [
            { text: '摇响铜铃，接过这扇门，做新的守门人', next: 'node_endG', requireItem: 'bell' },
            { text: '把铜铃轻轻放回供桌，回到法坛念真名', next: 'node10x_altar' }
        ]
    },

};



// 物品定义

const ITEMS = {
    'incense': { name: '香', desc: '从神龛香筒里抽出的三炷香,两短一长,可以引火给长明灯续灯。', useNode: null, image: 'img/item/item_incense.jpg' },
    'old_photo': { name: '爷爷的旧遗照', desc: '灵棚里取下的黑白遗照。出殡那天照片上只有爷爷一个人，如今他身后多站了个穿红嫁衣的女人，而爷爷在笑。', useNode: null, image: 'img/item/item_old_photo.jpg', inspectImage: 'img/item/item_old_photo.jpg', inspectTitle: '多出一个人的遗照', inspectText: '黑白遗照里爷爷在笑，身后多了个红嫁衣的女人，半张脸被香灰糊住。你越看越觉得，照片里在笑的那个，正一点点变成你自己的脸。' },
    'puppet': { name: '会转头的纸偶', desc: '巴掌大的纸偶，脖子上缠着红线。你盯着它它不动，一移开眼它就朝你转过头来。红线那头连着族谱。', useNode: null, image: 'img/item/item_puppet.jpg', inspectImage: 'img/item/item_puppet.jpg', inspectTitle: '会转头的纸偶', inspectText: '画着五官的纸偶，脖子缠一圈红线。正着看它脸朝外，视线一挪，它的脸已经转过来对着你。别盯太久——它转头时，你也想跟着回头。' },
    'veil': { name: '红盖头', desc: '从喜水里捞起的红盖头，针脚是母亲的手法，边角还在滴水。', useNode: null, image: 'img/item/item_veil.jpg' },
    'broken_mirror': { name: '破碎镜子', desc: '从冥婚镜上掉下的碎片，照出的东西总比眼前多一个——别再往里看。', useNode: null, image: 'img/item/item_broken_mirror.jpg' },
    'blood_jade': { name: '血玉', desc: '坛角拾到的血玉，里面的红随她的远近一下一下地亮，越亮她越近。玉面能照人，别往里看。', useNode: null, image: 'img/item/item_blood_jade.jpg' },
    'bell': { name: '铜铃', desc: '供桌上的旧铜铃，铃舌缠着头发。守门人握的就是它，摇响便是接班。', useNode: null, image: 'img/item/item_bell.jpg' },


    'note': {
        name: '带血的纸条',
        desc: '母亲写的守灵规矩，第二条被香灰盖住了半句。',
        useNode: null,
        image: 'img/item/item_note.jpg',
        inspectImage: 'img/closeup/closeup_blood_note.jpg',
        inspectTitle: '黄裱纸条',
        inspectText: '第一条说长明灯不能灭，第二条被香灰盖住半句，只剩"喊你……不能……"，第三条写着别往水里看。背面的血字很新：别信写纸的人。纸角有两个针孔，像是曾被红绳穿过。',
        combine: { with: ['red_string'], result: 'paper_talisman', message: '你用红绳把纸条绕成镇棺符。' }
    },

    'lamp_oil': { name: '半盏灯油', desc: '抽屉里找到的旧灯油，油面曾浮着一根黑发。', useNode: null, image: 'img/item/item_incense.jpg', inspectImage: 'img/closeup/closeup_spirit_lamp_dim.jpg' },

    'map': { name: '地下室的地图', desc: '画着通往地下室密道的路线。', useNode: 'node15b', image: 'img/item/item_genealogy.jpg' },

    'bone_amulet': { name: '骨符', desc: '从血池洞窟里摸到的旧护符，表面刻着褪色符纹。', useNode: null, image: 'img/item/item_peach_talisman.jpg' },

    'match': { name: '洋火', desc: '一盒受潮的火柴，还能用。', useNode: 'node10', image: 'img/item/item_match.jpg' },

    'amulet': { name: '爷爷的护身符', desc: '据说能辟邪。但爷爷自己也死了。', useNode: null, image: 'img/item/item_peach_talisman.jpg' },

    'photo': { name: '结婚照碎片', desc: '新娘的脸被撕掉了。', useNode: null, image: 'img/item/item_photo.jpg' },

    'key': { name: '铜钥匙', desc: '从黑漆棺底滚出来的旧钥匙。', useNode: null, image: 'img/item/item_key.jpg' },

    'name_tag': { name: '旧孝牌', desc: '棺底滑出的旧孝牌，背面刻着你的全名。', useNode: null, image: 'img/item/item_key.jpg', inspectImage: 'img/closeup/closeup_coffin_sealed_name_tag.jpg' },

    'red_string': { name: '红绳', desc: '从香灰里拈出的红绳，绳结处粘着黄纸屑。', useNode: null, image: 'img/item/item_red_string.jpg', inspectImage: 'img/closeup/closeup_altar_ash_red_string.jpg' },

    'paper_talisman': { name: '镇棺符', desc: '用带血纸条和红绳临时做成的符，能压住棺缝。', useNode: null, image: 'img/item/item_peach_talisman.jpg' },

    'mini_coffin': { name: '纸棺材', desc: '写着你名字的小棺材，纸糊的，里面似乎有东西在动。', useNode: null, image: 'img/item/item_paper_doll.jpg' }

};



// 节点BPM映射（心跳）

const BPM_MAP = {

    'node01': 60, 'node02': 65, 'node03': 70, 'node04': 75, 'node05': 80,

    'node06': 70, 'node07': 75, 'node08': 85, 'node09': 90, 'node10': 95,

    'node11': 85, 'node12': 90, 'node13': 100, 'node14': 110, 'node15': 120,

    'node16': 130, 'node17': 140, 'node18': 150, 'node19': 160, 'node20': 180,

    'node21': 200, 'node22': 210, 'node23': 220, 'node24': 230, 'node25': 240,

    'node26': 250, 'node27': 260, 'node28': 270, 'node29': 280,

    // —— 补全心跳: 支线/探索/对峙/死亡/新增章节(死亡前拔高、探索中段、仪式高潮最高)——
    'node01_return': 80, 'node01_explore': 78, 'node02b': 88, 'node03b': 95, 'node05b': 90,
    'node06_explore': 90, 'node08b': 98, 'node08c': 100, 'node09b': 112,
    'node11b': 175, 'node13b': 145, 'node15b': 140, 'node15_mirror': 150, 'node19b': 165,
    'node22b': 212, 'node22c': 215, 'node23b': 225,
    'node_explore_cave': 120, 'node_after_cave': 130, 'node_puzzle_door': 200, 'node_puzzle_success': 190, 'node_puzzle_fail': 235,
    'node_genealogy': 110, 'node_after_genealogy': 200, 'node_paper_bride_jump': 250, 'node_still': 195,
    'node25b': 245, 'node26b': 160,
    'node5x_wait': 150, 'node5x_vigil': 110, 'node5x_call': 165, 'node5x_dead_burn': 235,
    'node7x_funeral_explore': 140, 'node7x_coffin_alive': 165, 'node7x_blend_back': 230, 'node7x_answer_dead': 230,
    'node8x_hall': 150, 'node8x_well_explore': 120, 'node8x_veil': 200, 'node8x_mirror': 175, 'node8x_mother': 160, 'node8x_dead_well': 230,
    'node9x_yinyang_road': 150, 'node9x_grave_explore': 115, 'node9x_join_procession': 230, 'node9x_bus_trap': 200, 'node9x_dead_bus': 230,
    'node10x_ritual_prep': 110, 'node10x_altar': 160, 'node10x_recite': 160, 'node10x_jade': 180, 'node10x_bell': 160,
    'node29b': 175,
    'node_dead_shadow': 230, 'node_dead_mirror': 225, 'node_dead_cave': 210

};



// 节点音效映射(查表触发, 取代 app.js 里硬编码的 node08/09/18)
const SFX_MAP = {
    'node08': 'knock', 'node09': 'knock', 'node18': 'knock', 'node8x_hall': 'knock',
    'node21': 'tinnitus', 'node10x_recite': 'tinnitus', 'node8x_mirror': 'tinnitus', 'node15_mirror': 'tinnitus',
    'node02b': 'whisper', 'node26': 'whisper', 'node5x_call': 'whisper', 'node7x_coffin_alive': 'whisper',
    'node9x_bus_trap': 'whisper', 'node13b': 'whisper', 'node11b': 'whisper', 'node29b': 'whisper'
};



// 短信映射

const MESSAGES = {

    'node06': { from_sender: '未知号码', content: '进门后，堂屋桌上有张纸条。记住上面的规矩，千万别回头。' },

    'node09': { from_sender: '妈妈', content: '别答应门外的任何人。包括我。' },

    'node13': { from_sender: '爷爷', content: '棺材里躺着的不是我。是那个女鬼！快跑！' },

    'node16': { from_sender: '未知号码', content: '你逃不掉的。回头看看我。' },

    'node17': { from_sender: '爷爷', content: '快跑！棺材里躺着的不是我！是那个女鬼！' },

    'node20': { from_sender: '无服务', content: '你跑不掉的，你回头看看我。' },

    'node22': { from_sender: '妈妈', content: '你在哪里？我怎么找不到你了？' },

    'node25': { from_sender: '未知号码', content: '你已经是这里的人了。别挣扎了。' },

    'node28': { from_sender: '无服务', content: '她不会放过你的。除非，你替她。' }

};



// ===== 开发期引用完整性自检 (纯函数, 不改 NODES/ITEMS 结构) =====
function validateNodes(nodes, items) {
    const problems = [];
    const jumpFields = ['next', 'nextNode', 'deathNode', 'holdSuccess', 'holdFail',
        'camNext', 'alertNext', 'closeupNextNode', 'sceneImageNext',
        'puzzleSuccessNode', 'puzzleFailNode', 'returnNode'];
    const combineResults = new Set();
    Object.values(items).forEach(it => {
        if (it && it.combine && it.combine.result) combineResults.add(it.combine.result);
    });
    const itemExists = (key) => !!items[key] || combineResults.has(key);
    const itemKeyOf = (v) => (typeof v === 'string' ? v : (v && (v.code || v.id)));

    Object.keys(nodes).forEach(id => {
        const node = nodes[id];
        if (Array.isArray(node.choices)) {
            node.choices.forEach((c, i) => {
                if (c && c.next && !nodes[c.next]) {
                    problems.push(`节点 ${id}: choices[${i}].next -> '${c.next}' 不存在`);
                }
            });
        }
        jumpFields.forEach(f => {
            const target = node[f];
            if (target && typeof target === 'string' && !nodes[target]) {
                problems.push(`节点 ${id}: ${f} -> '${target}' 不存在`);
            }
        });
        if (Array.isArray(node.hotspots)) {
            node.hotspots.forEach((h, i) => {
                if (!h) return;
                ['deathNode', 'nextNode'].forEach(f => {
                    if (h[f] && !nodes[h[f]]) {
                        problems.push(`节点 ${id}: hotspots[${i}].${f} -> '${h[f]}' 不存在`);
                    }
                });
                const hItem = itemKeyOf(h.item);
                if (hItem && !itemExists(hItem)) {
                    problems.push(`节点 ${id}: hotspots[${i}].item -> '${hItem}' 不在 ITEMS`);
                }
                if (h.requireItem && !itemExists(h.requireItem)) {
                    problems.push(`节点 ${id}: hotspots[${i}].requireItem -> '${h.requireItem}' 不在 ITEMS`);
                }
            });
        }
        const nodeItem = itemKeyOf(node.item);
        if (nodeItem && !itemExists(nodeItem)) {
            problems.push(`节点 ${id}: item -> '${nodeItem}' 不在 ITEMS`);
        }
        if (node.requireItem && !itemExists(node.requireItem)) {
            problems.push(`节点 ${id}: requireItem -> '${node.requireItem}' 不在 ITEMS`);
        }
        if (node.isDeath && (!node.deathName || !node.deathDesc)) {
            problems.push(`死亡节点 ${id}: 缺 deathName 或 deathDesc`);
        }
        if (node.isEnding && (!node.endingCode || !node.endingName)) {
            problems.push(`结局节点 ${id}: 缺 endingCode 或 endingName`);
        }
    });
    return problems;
}

export { NODES, ITEMS, BPM_MAP, SFX_MAP, MESSAGES, EPITAPHS, validateNodes };

// 仅本地开发时自动跑一次自检, 生产环境不执行
if (typeof window !== 'undefined' &&
    (location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    const __issues = validateNodes(NODES, ITEMS);
    if (__issues.length) {
        console.warn('[nodes.js] 引用完整性发现 ' + __issues.length + ' 个问题:\n' + __issues.join('\n'));
    } else {
        console.log('[nodes.js] 引用完整性自检通过 ✓ (' + Object.keys(NODES).length + ' 个节点)');
    }
}

