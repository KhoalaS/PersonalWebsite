<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterView } from 'vue-router'
import TaskbarDivider from "@/components/TaskbarDivider.vue"
import Thingy from "@/components/Thingy.vue"

const height = ref(window.innerHeight)

const taskbarClass = ref(`taskbar flex gap-1 fixed p-1 top-[${height.value - 36}px] z-10 w-full h-[36px] bg-[silver] border-2 border-red-500 self-end`)

onMounted(()=>{
  height.value = window.innerHeight
})

onresize = (e)=>{
  height.value = window.innerHeight
}
</script>

<template>
  <header class="flex">
    <h1 class="mx-auto text-6xl animating-text">Awesome Website</h1>
  </header>
  <div class="flex">
    <RouterView />
  </div>
  <div :class="taskbarClass">
    <button class="h-full w-[50px]">
      <img class="" src="/start.png">
    </button>
    <TaskbarDivider></TaskbarDivider>
    <Thingy></Thingy>
    <div class="w-[136px]"></div>
    <TaskbarDivider></TaskbarDivider>
    <Thingy></Thingy>
    <button class="w-[160px] text-left">fish</button>
  </div>

</template>

<style scoped>
.taskbar{
  box-shadow:inset 0px 1px #fff, inset 0px 2px #dfdfdf;
}
</style>
