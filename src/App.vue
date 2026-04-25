<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div ref="parent" class="flex flex-col h-full">
    <header class="flex justify-center">
      <h1 class="text-6xl animating-text">Awesome Website</h1>
    </header>
    <RouterView />
  </div>
</template>
