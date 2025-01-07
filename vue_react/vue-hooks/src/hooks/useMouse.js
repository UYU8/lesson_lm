import { ref, onMounted, onUnmounted } from 'vue'
export function  useMouse() {
  let x = ref(0),
  y = ref(0);
  // console.log('use Mouse');
  const mousePosHandler = (e) => {
    x.value = e.pageX
    y.value = e.pageY
    console.log('还在')
  }
  onMounted(() => {
    window.addEventListener('mousemove', mousePosHandler) 
  })
  onUnmounted(() => {
    window.removeEventListener('mousemove', mousePosHandler)
  })
  return {
    x,
    y
  }
}

export function useMemo() {
  console.log('userMemo')
}

export default {
  name: 'useMouse'
}