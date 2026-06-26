// 手机短信 / 开机过场 子系统 (从 app.js 抽出的方法 mixin)。
// 相关状态 (smsVisible/phoneBootStep/smsHistory 等) 仍在主组件 data(); Vue 合并后 this 指向同一实例。
import { playKnock } from './audio.js?v=20260601-hotfix21';

export const smsMixin = {
    methods: {
        closeSms() {
            this.smsVisible = false;
            this.smsTyping = false;
            this.phoneBooting = false;
            this.phoneBootStep = 0;
            if (this.smsNextNode) {
                const next = this.smsNextNode;
                this.smsNextNode = null;
                setTimeout(() => this.enterNode(next), 300);
            }
        },

        // ===== 展示手机短信对话框（手动开机过程）=====
        showSmsDialog(sender, content, nodeId) {
            this.smsSender = sender;
            this.smsHistory = [];
            this.smsCreepy = false;
            this.smsNextNode = null;
            this.smsContent = content;
            this.smsNodeId = nodeId;

            // 步骤1：手机从黑暗中滑入（黑屏状态），等待玩家点击
            this.phoneBooting = true;
            this.phoneBootStep = 1;
            this.smsVisible = true;

            if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
        },

        // ===== 玩家点击手机屏幕推进开机（带灵异化）=====
        handlePhoneClick() {
            if (!this.phoneBooting) return;

            const creepySenders = ['未知号码', '无服务', '爷爷'];
            const isCreepy = creepySenders.includes(this.smsSender);
            const isFinal = ['node16', 'node17', 'node20', 'node25', 'node28'].includes(this.smsNodeId);

            if (this.phoneBootStep === 1) {
                // 黑屏 → 锁屏
                this.phoneBootStep = 2;
                // 灵异化：时间错乱
                if (isCreepy) {
                    const evilTimes = ['04:44', '03:33', '23:59', '00:00'];
                    this.gameTime = evilTimes[Math.floor(Math.random() * evilTimes.length)];
                    this.smsDate = '1997年9月22日 星期一';
                } else {
                    this.smsDate = new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });
                }
                if (navigator.vibrate) navigator.vibrate([40]);
            }
            else if (this.phoneBootStep === 2) {
                // 锁屏 → 通知弹出
                this.phoneBootStep = 3;
                // 灵异化：发件人变异
                if (isCreepy && Math.random() > 0.3) {
                    const corruptedNames = {
                        '未知号码': ['你背后', '镜子里', '床底下'],
                        '爷爷': ['不是我', '棺材里', '纸人'],
                        '无服务': ['逃不掉', '留下来', '看着你']
                    };
                    const names = corruptedNames[this.smsSender] || ['???'];
                    this.smsSender = names[Math.floor(Math.random() * names.length)];
                }
                if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
                playKnock();
            }
            else if (this.phoneBootStep === 3) {
                // 通知 → 解锁进入短信
                this.phoneBootStep = 4;
                this.smsTyping = true;
                if (navigator.vibrate) navigator.vibrate([30]);

                const typingDelay = isCreepy ? 2500 : 1800;

                setTimeout(() => {
                    this.smsTyping = false;
                    this.phoneBootStep = 5;

                    // 添加收到的消息（带灵异化）
                    const msgTime = isCreepy
                        ? ['04:44', '03:33', '23:59', '00:00'][Math.floor(Math.random() * 4)]
                        : new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

                    this.smsHistory.push({
                        type: 'received',
                        text: this.smsContent,
                        time: msgTime,
                        blood: isFinal,
                        glitch: isCreepy && Math.random() > 0.5
                    });

                    if (isCreepy) this.smsCreepy = true;

                    this.$nextTick(() => {
                        const chat = this.$refs.smsChat;
                        if (chat) chat.scrollTop = chat.scrollHeight;
                    });

                    if (navigator.vibrate) {
                        navigator.vibrate(isFinal ? [100, 100, 100, 100] : [50, 50, 50]);
                    }

                    // 自动回复（更灵异）
                    if (isCreepy && !isFinal) {
                        setTimeout(() => {
                            this.smsTyping = true;
                            setTimeout(() => {
                                this.smsTyping = false;
                                const replies = {
                                    '未知号码': ['你知道我在看着你吗？', '别回头。', '我一直在。'],
                                    '爷爷': ['快逃。', '别相信任何人。', '棺材里不是我。'],
                                    '无服务': ['你跑不掉的。', '信号越来越弱了...', '就像你的生命一样。']
                                };
                                const replyList = replies[this.smsSender] || ['...'];
                                const replyText = replyList[Math.floor(Math.random() * replyList.length)];
                                this.smsHistory.push({
                                    type: 'received',
                                    text: replyText,
                                    time: isCreepy ? '04:44' : new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
                                    blood: false,
                                    glitch: true
                                });
                                this.$nextTick(() => {
                                    const chat = this.$refs.smsChat;
                                    if (chat) chat.scrollTop = chat.scrollHeight;
                                });
                                if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
                            }, 2000);
                        }, 3000);
                    }
                }, typingDelay);
            }
        },
    }
};
