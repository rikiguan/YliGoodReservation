<template>
  <el-card class="control-panel" :style="panelStyle">
    <template #header>
      <div class="panel-header" ref="panelRef" @mousedown="startDrag">
        YliGood预约助手
      </div>
    </template>
    <div style="text-align: center; ">
      <el-segmented v-model="valueBtn" :options="optionsBtn" size="large" />

    </div>

    <div v-if="openAutoScanTab">
      <!-- 扫描间隔设置 -->
      <div class="setting-item">
        <span>扫描间隔: {{ reservationStore.scanIntervalSeconds }}秒</span>
        <el-slider v-model="scanInterval" :min="1" :max="30" @change="handleIntervalChange" style="margin-top: 10px;" />
      </div>

      <!-- 首选时间段 -->
      <div class="setting-item">
        <span>设置首选时间段:</span>
        <el-input v-model="preferredTimes" placeholder="例如: 9:00-10:30,18:00-19:30" @change="handlePreferredTimesChange"
          style="margin-top: 5px;" />
        <div class="note">注: 找到首选时间会自动停止并点击</div>
      </div>

      <!-- 当前首选时间段 -->
      <div class="setting-item">
        <span>当前首选时间段:</span>
        <div style="margin-top: 5px;">
          <div v-if="reservationStore.preferredTimeSlots.length > 0">
            <el-tag v-for="(time, index) in reservationStore.preferredTimeSlots" :key="index" class="tag"
              style="margin-right: 5px;">
              {{ time }}
            </el-tag>
          </div>
          <div v-else>
            <el-tag>空</el-tag>
          </div>
        </div>
      </div>

      <!-- 单个按钮 -->
      <div class="setting-item" style="text-align: center; margin-top: 15px;">
        <el-button style="width: 90%;" :type="reservationStore.autoScanActive ? 'danger' : 'primary'"
          @click="() => { reservationStore.autoScanActive = !reservationStore.autoScanActive; handleAutoScan() }">
          {{ reservationStore.autoScanActive ? '停止扫描' : '开始扫描' }}
        </el-button>
      </div>
    </div>

    <!-- 论语显示区 -->
    <div class="lunyu-quote" style="margin-top: 5px;">
      <p style="text-align: center;">{{ uiStore.currentLunyuQuote.quote }}</p>
      <div class="lunyu-source">—— {{ uiStore.currentLunyuQuote.source }}</div>
    </div>
  </el-card>


</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useReservationStore } from '@/stores/reservation';
import { useUIStore } from '@/stores/ui';
import { handleReservationBlockClick, scanAllPages, startAutoScan, stopAutoScan } from '@/utils/scanner';
import * as analytics from '@/utils/analytics';
const valueBtn = ref('自动点击')
const optionsBtn = ['关闭', '自动点击', '自动扫描']


const openAutoScanTab = ref(false);

function handleAutoScan() {
  if (reservationStore.autoScanActive) {
    startAutoScan(scanInterval.value)
    analytics.track_auto_scan(scanInterval.value); 
  } else {
    stopAutoScan()
  }
}


function handleAutoClick() {
  if (reservationStore.autoClickActive) {
    document.addEventListener('click', handleReservationBlockClick);
  } else {
    document.removeEventListener('click', handleReservationBlockClick);
  }
}

function handleTask() {
  handleAutoClick();
  handleAutoScan();
}

watch(valueBtn, (newValue) => {
  if (newValue === '自动点击') {
    reservationStore.setAutoClickActive(true);
    reservationStore.setAutoScanActive(false);
    openAutoScanTab.value = false;
  } else if (newValue === '自动扫描') {
    reservationStore.setAutoClickActive(false);
    reservationStore.setAutoScanActive(false);
    openAutoScanTab.value = true;
  } else {
    reservationStore.setAutoClickActive(false);
    reservationStore.setAutoScanActive(false);
    openAutoScanTab.value = false;
  }
  handleTask();
});

const reservationStore = useReservationStore();
const uiStore = useUIStore();

// 面板拖动相关
const panelRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const position = ref({ x: 20, y: 100 });
const dragOffset = ref({ x: 0, y: 0 });

const panelStyle = computed(() => {
  return {
    position: 'fixed',
    zIndex: 9999,
    left: `${position.value.x}px`,
    top: `${position.value.y}px`,
  };
});


function startDrag(event: MouseEvent) {
  if (!panelRef.value) return;

  isDragging.value = true;
  const rect = panelRef.value.getBoundingClientRect();
  dragOffset.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };

  // 阻止文本选择
  event.preventDefault();
}

function onDrag(event: MouseEvent) {
  if (!isDragging.value) return;

  position.value = {
    x: event.clientX - dragOffset.value.x,
    y: event.clientY - dragOffset.value.y
  };
}

function stopDrag() {
  isDragging.value = false;
}

// 表单数据绑定
const scanInterval = ref(reservationStore.scanIntervalSeconds);
const preferredTimes = ref(reservationStore.preferredTimeSlots.join(','));



function handleIntervalChange(value: number) {
  reservationStore.setScanInterval(value);
}

function handlePreferredTimesChange(value: string) {
  const slots = value.split(',').map(t => t.trim()).filter(t => t);
  reservationStore.setPreferredTimeSlots(slots);
}

// 生命周期钩子
onMounted(() => {
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  handleTask();
});

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
});
</script>

<style scoped>
.control-panel {
  width: 280px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.panel-header {
  cursor: move;
  font-weight: bold;
  user-select: none;
  width: 100%;
}

.setting-item {
  margin-top: 15px;
}

.note {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.lunyu-quote {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #eee;
  font-style: italic;
}

.lunyu-source {
  font-size: 12px;
  text-align: right;
  color: #666;
}

.el-button {
  margin-bottom: 10px;
}
</style>
