<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="flex">
    <h1 class="mx-auto text-6xl font-serif animating-text">Awesome Website</h1>
  </header>
  <div class="flex">
    <RouterView />
  </div>
</template>
