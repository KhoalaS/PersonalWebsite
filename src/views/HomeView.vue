<script setup lang="ts">
import Shell from '@/components/Shell.vue'
import ie from '@/assets/gifs/ie.gif'
import ns from '@/assets/gifs/ns.gif'
import css from '@/assets/css.gif'
import html from '@/assets/w3c.png'
import { inject, onMounted, ref } from 'vue'
import { parentKey } from '@/Keys'

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

onMounted(() => {
  container?.value?.addEventListener('touchstart', dragStart, false)
  container?.value?.addEventListener('touchend', dragEnd, false)
  container?.value?.addEventListener('touchmove', drag, false)

  container?.value?.addEventListener('mousedown', dragStart, false)
  container?.value?.addEventListener('mouseup', dragEnd, false)
  container?.value?.addEventListener('mousemove', drag, false)
})

function dragStart(e) {
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
  <main class="mx-auto flex gap-4">
    <div class="w-[40vw] flex flex-col gap-2">
      <div id="profile" class="window">
        <div class="title-bar h-[20px]">
          <div class="flex gap-1 title-bar-text">
            <div class="flex items-center">
              <img height="16" src="/msn3.ico" />
            </div>
            Profile
          </div>
          <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
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
      <div ref="dragItem" class="window">
        <div ref="dragTitleBar" class="title-bar h-[20px] touch-none select-none">
          <div class="flex gap-1 title-bar-text">
            <div class="flex items-center">
              <img height="16" src="/console_prompt.ico" />
            </div>
            fish
          </div>
          <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <Shell username="khoa" host="brave"></Shell>
      </div>
      <div class="flex flex-col items-center gap-3">
        <div class="font-serif">Page best viewed with:</div>
        <div class="flex">
          <a href="https://www.microsoft.com/en-us/download/404Error.aspx" target="_blank">
            <img :src="ie" />
          </a>
          <a href="http://archive.netscape.com/" target="_blank">
            <img :src="ns" />
          </a>
        </div>
        <div class="flex gap-1 items-center">
          <img class="h-8" :src="css" />
          <img class="h-8" :src="html" />
        </div>
      </div>
    </div>
    <div class="w-[180px]">
      <iframe
        width="180"
        height="180"
        style="border: none"
        src="https://dimden.neocities.org/navlink/"
        name="neolink"
      ></iframe>
      <ul>
        <li>Hello</li>
      </ul>
    </div>
  </main>
</template>
