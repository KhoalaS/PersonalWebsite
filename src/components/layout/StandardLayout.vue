<script setup lang="ts"></script>
<template>
  <div class="w-full h-full flex flex-col">
    <h1 class="text-4xl text-white text-center">
      <slot name="title"></slot>
    </h1>
    <main class="flex-1 flex">
      <aside class="column w-36">
        <slot name="left-column"> </slot>
      </aside>
      <div class="flex-1">
        <slot name="main-content"></slot>
      </div>
      <aside class="column w-36">
        <slot name="right-column"> </slot>
      </aside>
    </main>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .column {
    width: 3rem;
  }
}

@media (max-width: 320px) {
  .column {
    width: 0.5rem;
  }
}
</style>
