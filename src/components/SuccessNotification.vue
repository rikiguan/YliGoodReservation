<template>
  <el-card class="success-notification">
    <el-watermark :content="['YliGood预约助手', '点个Satr吧~']" :gap="[100, 0]">
      <template #header>
        <div class="notification-header">预约成功</div>
      </template>

      <div class="order-details">
        <div class="detail-row">
          <span class="label">订单号:</span>
          <span class="value">{{ uiStore.orderDetails.orderNumber }}</span>
        </div>

        <div class="detail-row">
          <span class="label">订场信息:</span>
          <span class="value">{{ uiStore.orderDetails.orderPlace }}</span>
        </div>

        <div class="detail-row">
          <span class="label">场地使用者:</span>
          <span class="value">{{ uiStore.orderDetails.orderUser }}</span>
        </div>

        <div class="detail-row">
          <span class="label">同伴信息:</span>
          <span class="value">{{ uiStore.orderDetails.orderPartner }}</span>
        </div>
      </div>

      <div class="notification-note">预约已成功提交，请按时到场使用</div>

      <el-button type="primary" @click="hideNotification" class="close-btn">
        关闭提示
      </el-button>
    </el-watermark>
  </el-card>
</template>

<script setup lang="ts">
import { useUIStore } from '@/stores/ui';

const uiStore = useUIStore();

function hideNotification() {
  uiStore.hideSuccessNotification();
}
</script>

<style scoped>
.success-notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  z-index: 10000;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.notification-header {
  font-weight: bold;
  color: #409EFF;
}

.order-details {
  padding: 10px 0;
}

.detail-row {
  display: flex;
  margin-bottom: 10px;
}

.label {
  font-weight: bold;
  width: 100px;
  flex-shrink: 0;
}

.value {
  flex-grow: 1;
  word-break: break-all;
}

.notification-note {
  font-size: 14px;
  color: #67C23A;
  text-align: center;
  margin: 15px 0;
}

.close-btn {
  width: 100%;
}
</style>
