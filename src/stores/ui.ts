import { defineStore } from 'pinia'
import { ref } from 'vue'
import lunyuData from '@/data/lunyu.json'

export interface LunyuQuote {
  quote: string
  source: string
}

export const useUIStore = defineStore('ui', () => {
  // 状态
  const controlPanelVisible = ref(true)
  const successNotificationVisible = ref(false)
  const orderDetails = ref({
    orderNumber: '',
    orderPlace: '',
    orderUser: '',
    orderPartner: ''
  })
  const currentLunyuQuote = ref<LunyuQuote>({
    quote: '',
    source: ''
  })
  const captchaStatus = ref('')
  
  // 方法
  function generateRandomLunyuQuote(): LunyuQuote {
    const lunyuChapters = lunyuData as any[];
    let quote = '';
    let chapter = null;
    
    while (quote === '' || quote.length > 50) {
      // 随机选择章节
      const randomChapterIndex = Math.floor(Math.random() * lunyuChapters.length);
      chapter = lunyuChapters[randomChapterIndex];
      // 随机选择段落
      const randomParagraphIndex = Math.floor(Math.random() * chapter.paragraphs.length);
      quote = chapter.paragraphs[randomParagraphIndex];
    }
    
    return {
      quote,
      source: `《论语·${chapter.chapter}》`
    };
  }
  
  function updateLunyuQuote() {
    currentLunyuQuote.value = generateRandomLunyuQuote();
  }
  
  function showSuccessNotification(details: {
    orderNumber: string;
    orderPlace: string;
    orderUser: string;
    orderPartner: string;
  }) {
    orderDetails.value = details;
    successNotificationVisible.value = true;
  }
  
  function hideSuccessNotification() {
    successNotificationVisible.value = false;
  }
  
  function updateCaptchaStatus(status: string) {
    captchaStatus.value = status;
  }
  
  // 初始化论语
  updateLunyuQuote();
  
  return {
    // 状态
    controlPanelVisible,
    successNotificationVisible,
    orderDetails,
    currentLunyuQuote,
    captchaStatus,
    
    // 方法
    updateLunyuQuote,
    showSuccessNotification,
    hideSuccessNotification,
    updateCaptchaStatus
  }
})
