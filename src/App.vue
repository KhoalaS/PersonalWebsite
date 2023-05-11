<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <h1 class="text-6xl font-serif animating-text">Awesome Website</h1>
  </header>
  <div class="flex">
    <RouterView />
  </div>
</template>
