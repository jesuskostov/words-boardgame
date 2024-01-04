<template>
  <div class="fixed inset-0 bg-black flex flex-col items-center justify-center">
    <img
      v-if="current_turn?.photo_path"
      :src="`https://words-api.g-home.site/${current_turn?.photo_path}`"
      class="w-24 h-24 rounded-full object-cover border-4 border-white"
      alt=""
    />
    <h1 class="text-white text-4xl mt-4">{{ current_turn?.name }}</h1>
    <button
      class="bg-white text-black mt-10 h-14 px-4 rounded-xl animate-pulse"
      @click="start"
    >
      Натисни за да започнеш
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import store from "../store/index";

const emit = defineEmits(["start"]);

const current_turn = computed(() => store.state.current_turn);

onMounted(() => {
  store.dispatch("getCurrentTurn");
});

const start = () => {
  emit("start");
};
</script>
