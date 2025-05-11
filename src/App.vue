<template>
  <div class="yli-good-app" v-if="initialized">
    <control-panel v-if="uiStore.controlPanelVisible" />
    <success-notification v-if="uiStore.successNotificationVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import ControlPanel from '@/components/ControlPanel.vue';
import SuccessNotification from '@/components/SuccessNotification.vue';
// import { initCaptchaSolver } from '@/utils/captcha';
import {initCaptchaSolver} from '@/captcha/index';
import {initPayOrder}  from '@/payer/payOrder';
const uiStore = useUIStore();
const initialized = ref(false);

onMounted(() => {
  // 初始化CAPTCHA解决器
  initCaptchaSolver();
  initPayOrder();
  initialized.value = true;
  
  // 每60秒更新一次论语
  setInterval(() => {
    uiStore.updateLunyuQuote();
  }, 60000);
});
</script>

<style>
.yli-good-app {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
</style>
