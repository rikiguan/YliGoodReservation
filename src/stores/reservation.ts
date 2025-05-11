import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface AvailableSlot {
  place: string
  timeSlot: string
  element?: Element
}

export const useReservationStore = defineStore('reservation', () => {
  // 状态
  const availableSlots = ref<Set<string>>(new Set())
  const preferredTimeSlots = ref<string[]>([])
  const scanIntervalSeconds = ref(5)
  const autoScanActive = ref(false)
  const autoClickActive = ref(true)
  const visitedTables = ref<Set<string>>(new Set())
  const foundPreferredSlot = ref(false)
  const availableSlotElements = ref<Element[]>([])
  
  // 方法
  function resetScanState() {
    visitedTables.value.clear()
    availableSlots.value.clear()
    foundPreferredSlot.value = false
    availableSlotElements.value = []
  }
  
  function addAvailableSlots(slots: string[]) {
    slots.forEach(slot => availableSlots.value.add(slot))
  }
  
  function setPreferredTimeSlots(slots: string[]) {
    preferredTimeSlots.value = slots
  }
  
  function isPreferredTimeSlot(timeSlot: string): boolean {
    return preferredTimeSlots.value.some(preferred => timeSlot.includes(preferred))
  }
  
  function setScanInterval(seconds: number) {
    scanIntervalSeconds.value = seconds
  }
  
  function setAutoScanActive(active: boolean) {
    autoScanActive.value = active
  }
  
  function setAutoClickActive(active: boolean) {
    autoClickActive.value = active
  }
  
  function setFoundPreferredSlot(found: boolean) {
    foundPreferredSlot.value = found
  }

  // 计算属性
  const availableSlotsArray = computed(() => {
    return Array.from(availableSlots.value).sort()
  })
  
  const availableSlotsCount = computed(() => {
    return availableSlots.value.size
  })

  return {
    // 状态
    availableSlots,
    preferredTimeSlots,
    scanIntervalSeconds,
    autoScanActive,
    autoClickActive,
    visitedTables,
    foundPreferredSlot,
    availableSlotElements,
    
    // 计算属性
    availableSlotsArray,
    availableSlotsCount,
    
    // 方法
    resetScanState,
    addAvailableSlots,
    setPreferredTimeSlots,
    isPreferredTimeSlot,
    setScanInterval,
    setAutoScanActive,
    setAutoClickActive,
    setFoundPreferredSlot
  }
})
