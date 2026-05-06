<script setup lang="ts"></script>
<template>
  <div class="w-full h-full flex flex-col">
    <h1 class="text-4xl text-white text-center">
      <slot name="title"></slot>
    </h1>
    <main class="flex-1 flex justify-center">
      <aside class="column flex-1">
        <slot name="left-column"> </slot>
      </aside>
      <div class="content">
        <slot name="main-content"></slot>
      </div>
      <aside class="column flex-1">
        <slot name="right-column"> </slot>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.content {
  width: 60vw;
}

@media (max-width: 1280px) {
  .content {
    width: 70vw;
  }
}

@media (max-width: 768px) {
  .content {
    width: 95vw;
  }
}

@media (max-width: 320px) {
  .content {
    width: 100vw;
  }
}
</style>
