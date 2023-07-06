<script setup lang="ts">
const blogEntries = [1, 2, 3]
</script>
<template>
  <main class="flex flex-col items-center w-full mx-4 bg-red-500">
    <p class="text-2xl font-serif">Even more awesome Blog</p>
    <div class="h-[1px] bg-black w-full"></div>
    <div v-for="item in blogEntries">
      {{ item }}
    </div>
  </main>
</template>
