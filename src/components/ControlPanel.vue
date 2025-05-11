<template>
  <el-card class="control-panel" :style="panelStyle">
    <template #header>
      <div class="panel-header" ref="panelRef"  @mousedown="startDrag">YliGood预约助手</div>
    </template>

    <div>
    <!-- 控制按钮 -->
    <el-button type="primary" @click="handleScan" :disabled="reservationStore.autoScanActive">
      扫描空闲场地
    </el-button>

    <el-button :type="reservationStore.autoScanActive ? 'danger' : 'info'" @click="handleAutoScan">
      {{ reservationStore.autoScanActive ? '停止定时扫描' : '开始定时扫描' }}
    </el-button>

    <el-button :type="reservationStore.autoClickActive ? 'success' : 'info'" @click="handleAutoClick">
      {{ reservationStore.autoClickActive ? '关闭自动点击' : '开启自动点击' }}
    </el-button>
  </div>
    <!-- 扫描间隔设置 -->
    <div class="setting-item">
      <span>扫描间隔: {{ reservationStore.scanIntervalSeconds }}秒</span>
      <el-slider v-model="scanInterval" :min="1" :max="30" @change="handleIntervalChange" />
    </div>

    <!-- 首选时间段 -->
    <div class="setting-item">
      <span>设置首选时间段:</span>
      <el-input v-model="preferredTimes" placeholder="例如: 9:00-10:30,18:00-19:30"
        @change="handlePreferredTimesChange" />
      <div class="note">注: 找到首选时间会自动停止并点击</div>
    </div>

    <!-- 论语显示区 -->
    <div class="lunyu-quote">
      <p>{{ uiStore.currentLunyuQuote.quote }}</p>
      <div class="lunyu-source">—— {{ uiStore.currentLunyuQuote.source }}</div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useReservationStore } from '@/stores/reservation';
import { useUIStore } from '@/stores/ui';
import { handleReservationBlockClick,scanAllPages, startAutoScan, stopAutoScan } from '@/utils/scanner';

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

// 按钮事件处理
function handleScan() {
  scanAllPages();
}

function handleAutoScan() {
  if (!reservationStore.autoScanActive) {
    if (startAutoScan(scanInterval.value)) {
      reservationStore.setAutoScanActive(true);
    }
  } else {
    if (stopAutoScan()) {
      reservationStore.setAutoScanActive(false);
    }
  }
}


function handleAutoClick() {
  reservationStore.setAutoClickActive(!reservationStore.autoClickActive);
  if (reservationStore.autoClickActive) {
    document.addEventListener('click', handleReservationBlockClick);
  } else {
    document.removeEventListener('click', handleReservationBlockClick);
  }
}

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
  handleAutoClick();
});

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
});
</script>

<style scoped>
.control-panel {
  width: 320px;
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
