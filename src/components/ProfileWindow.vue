<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { parentKey } from '@/Keys'
import Shell from './Shell.vue'

var container = inject(parentKey)
var active = false
var currentX: number
var currentY: number
var initialX: number
var initialY: number
var xOffset = 0
var yOffset = 0

const dragItem = ref<HTMLElement|null>(null)
const dragTitleBar = ref<HTMLElement|null>(null) 

const open = ref(true)

function minimize(){
  open.value = !open.value
  if(open.value){
    dragItem.value!.style.display = ""
  } else {
    dragItem.value!.style.display = "none"
  }
}

defineExpose({
  minimize
})

onMounted(() => {
  container?.value?.addEventListener('touchstart', dragStart, false)
  container?.value?.addEventListener('touchend', dragEnd, false)
  container?.value?.addEventListener('touchmove', drag, false)

  container?.value?.addEventListener('mousedown', dragStart, false)
  container?.value?.addEventListener('mouseup', dragEnd, false)
  container?.value?.addEventListener('mousemove', drag, false)
})

function dragStart(e) {
  console.log(e)
  if (e.type === 'touchstart') {
    initialX = e.touches[0].clientX - xOffset
    initialY = e.touches[0].clientY - yOffset
  } else {
    initialX = e.clientX - xOffset
    initialY = e.clientY - yOffset
  }

  if (e.target === dragTitleBar.value) {
    active = true
    console.log(e.target)
  }
  console.log("dragstart")
}

function dragEnd(e) {
  console.log(e)

  initialX = currentX
  initialY = currentY

  active = false
}

function drag(e) {
  if (active) {
    e.preventDefault()

    if (e.type === 'touchmove') {
      currentX = e.touches[0].clientX - initialX
      currentY = e.touches[0].clientY - initialY
    } else {
      currentX = e.clientX - initialX
      currentY = e.clientY - initialY
    }

    xOffset = currentX
    yOffset = currentY

    setTranslate(currentX, currentY, dragItem.value)
  }
}

function setTranslate(xPos:number, yPos: number ,el: HTMLElement|null) {
  if(el == null){
    return
  }
  el.style.transform = 'translate3d(' + xPos + 'px, ' + yPos + 'px, 0)'
}
</script>
<template>
 <div ref="dragItem" class="window z-10">
        <div ref="dragTitleBar" class="title-bar h-[20px]">
          <div class="flex gap-1 title-bar-text">
            <div class="flex items-center">
              <img height="16" src="/msn3.ico" />
            </div>
            Profile
          </div>
          <div class="title-bar-controls">
            <button @click="minimize" aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div class="window-body flex gap-2">
          <img class="w-[120px] h-[120px] rounded" src="/pfp_edit.jpg" />
          <div>
            <p>
              o Hello my name is Khoa. I like programming, gaming, reverse engineering (still nub
              tho).
            </p>
            <label class="">My programming interests:</label>
            <ul>
              <li>Vue</li>
              <li>Flutter</li>
              <li>Java</li>
              <li>Python</li>
              <li>Android RE</li>
            </ul>
          </div>
        </div>
      </div>
</template>
