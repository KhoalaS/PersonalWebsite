<script setup lang="ts">
import { TitlebarIcon, WindowBody, WindowComponent } from 'vue-98'
</script>

<template>
  <WindowComponent title="Personal" class="active" :with-controller="false">
    <template #title-icon>
      <TitlebarIcon icon="document"></TitlebarIcon>
    </template>
    <template #body>
      <WindowBody>
        <div class="flex gap-2 p-1">
          <img class="w-[120px] h-[120px] rounded" src="/pfp_edit.jpg" />
          <div>
            <p>Hello my name is Khoa. I like programming, gaming, reverse engineering.</p>
            <label class="">My programming interests:</label>
            <ul style="list-style: circle; padding-inline-start: 16px">
              <li>Vue</li>
              <li>TypeScript</li>
              <li>Go</li>
              <li>Android RE</li>
            </ul>
          </div>
        </div>
      </WindowBody>
    </template>
  </WindowComponent>
</template>
