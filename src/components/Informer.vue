<template>
  <div class="flex justify-between items-center mt-4">
    <div class="flex gap-x-2">
      <div
        class="w-11 h-11 bg-white rounded-full text-black flex items-center justify-center overflow-hidden border border-orange-400"
      >
        <img
          :src="`https://words-api.g-home.site/${current_turn?.photo_path}`"
          class="w-full h-full rounded-full object-cover"
        />
      </div>
      <div class="text-left">
        <p class="text-lg font-bold">{{ current_turn?.name }}</p>
        <p class="relative -top-1 text-sm">{{ teammates?.name }}</p>
      </div>
    </div>
    <div
      class="relative flex justify-between items-center h-8 px-6 bg-white text-black -mr-7 rounded-tl-full rounded-bl-full"
    >
      <span
        class="absolute left-1 w-7 h-7 bg-black rounded-full flex items-center justify-center"
        >🗣️</span
      >
      <span class="text-sm pl-4">Кръг 1</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import store from "../store/index";

const current_turn = computed(() => store.state.current_turn);
const teammates = computed(() => store.state.teammates);
const score = computed(() => store.state.score);
</script>
