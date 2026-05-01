<script setup lang="ts">
defineProps<{
  tag: string
}>()
</script>
<template>
  <span class="bg-fuchsia-400 px-2 select-none">#{{ tag }}</span>
</template>
