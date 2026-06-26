// 屏息 / 陀螺仪抖动检测子系统 (从 app.js 抽出的方法 mixin)。
// 相关状态字段仍在主组件 data() 中; Vue 合并 mixin 后 this 指向同一实例, 跨方法调用不受影响。
import { t } from './i18n.js?v=20260601-hotfix21';
import { playScream } from './audio.js?v=20260601-hotfix21';

export const holdMixin = {
    methods: {
        startHold(e) {
            if (e) e.preventDefault();
            if (this.holdFailed) return;
            this.holdActive = true;
            this.holdText = '屏住呼吸...';
            if (navigator.vibrate) navigator.vibrate([20]);
            this.holdStartTime = Date.now();
            // 恐惧过高时屏息更难(要憋更久才算成功)
            const holdMs = (this.playerStats && this.playerStats.fear > 70) ? 6500 : 5000;

            // 启动陀螺仪监听
            this.gyroData = null;
            this.gyroShakeCount = 0;
            this.gyroWarning = false;
            this._gyroHandler = (event) => this.checkGyroShake(event);
            window.addEventListener('deviceorientation', this._gyroHandler);

            const update = () => {
                if (!this.holdActive) return;
                const elapsed = Date.now() - this.holdStartTime;
                this.holdProgress = Math.min(elapsed / holdMs, 1);

                // 如果已经触发陀螺仪死亡，不继续
                if (this.gyroWarning) return;

                if (this.holdProgress >= 1) {
                    this.stopGyro();
                    this.holdActive = false;
                    this.holdText = '成功了！';
                    this.holdProgress = 0;
                    if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
                    setTimeout(() => {
                        this.holdText = t('holdHint');
                        this.enterNode(this.currentNode.holdSuccess);
                    }, 300);
                    return;
                }
                this.holdRaf = requestAnimationFrame(update);
            };
            this.holdRaf = requestAnimationFrame(update);
        },

        endHold(e) {
            if (e) e.preventDefault();
            if (!this.holdActive) return;
            this.holdActive = false;
            this.stopGyro();
            if (this.holdRaf) cancelAnimationFrame(this.holdRaf);
            if (this.holdProgress < 1 && !this.gyroWarning) {
                this.holdProgress = 0;
                this.holdFailed = true;
                this.holdText = '失败了！';
                if (navigator.vibrate) navigator.vibrate([200]);
                setTimeout(() => {
                    this.holdFailed = false;
                    this.holdText = t('holdHint');
                    this.enterNode(this.currentNode.holdFail);
                }, 300);
            }
        },

        // ===== 陀螺仪抖动检测 =====
        checkGyroShake(event) {
            // 首帧只建立基准, 不参与判定 (避免与零基准的差值导致玩家未晃动即误判死)
            if (!this.gyroData) {
                this.gyroData = { alpha: event.alpha, beta: event.beta, gamma: event.gamma };
                return;
            }
            const threshold = 15; // 晃动阈值
            let shake = 0;
            if (Math.abs(event.alpha - this.gyroData.alpha) > threshold) shake++;
            if (Math.abs(event.beta - this.gyroData.beta) > threshold) shake++;
            if (Math.abs(event.gamma - this.gyroData.gamma) > threshold) shake++;

            this.gyroData = { alpha: event.alpha, beta: event.beta, gamma: event.gamma };

            if (shake >= 2) {
                this.gyroShakeCount++;
                if (this.gyroShakeCount >= 3 && !this.gyroWarning) {
                    this.gyroWarning = true;
                    this.triggerGyroDeath();
                }
            }
        },

        // ===== 陀螺仪死亡 =====
        triggerGyroDeath() {
            this.holdActive = false;
            this.stopGyro();
            if (this.holdRaf) cancelAnimationFrame(this.holdRaf);

            // 显示警告
            const warn = document.createElement('div');
            warn.className = 'gyro-warning';
            warn.innerText = '你发抖了，它察觉到了你的心跳。';
            document.body.appendChild(warn);

            if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 300]);
            playScream();

            setTimeout(() => {
                warn.remove();
                this.holdProgress = 0;
                this.holdText = t('holdHint');
                this.enterNode(this.currentNode.holdFail);
            }, 2000);
        },

        stopGyro() {
            if (this._gyroHandler) {
                window.removeEventListener('deviceorientation', this._gyroHandler);
                this._gyroHandler = null;
            }
        },
    }
};
