<script setup lang="ts">
import { RouterView } from 'vue-router'

</script>

<template>
  
  <div ref="parent" class="flex flex-col h-full">
    <header class="flex">
    <h1 class="mx-auto text-6xl animating-text">Awesome Website</h1>
  </header>
    <RouterView />
  </div>
</template>


