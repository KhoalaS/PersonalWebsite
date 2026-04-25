<script setup lang="ts">
import ShellComponent from './ShellComponent.vue'
import { WindowBody, WindowComponent } from 'vue-98'
import { TitlebarIcon } from 'vue-98'
</script>

<template>
  <WindowComponent
    :with-controller="false"
    class="active"
    ref="dragItem"
    title="Fish"
    :controls="['Minimize', 'Maximize', 'Close']"
  >
    <template #title-icon>
      <TitlebarIcon icon="document"></TitlebarIcon>
    </template>
    <template #body>
      <WindowBody>
        <ShellComponent username="khoa" host="brave"></ShellComponent>
      </WindowBody>
    </template>
  </WindowComponent>
</template>
