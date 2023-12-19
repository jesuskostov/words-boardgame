<template>
  <div>expected words:{{ expectedWords }} words:{{ words }}</div>
</template>

<script setup>
import { watch, watchEffect, computed } from "vue";
import store from "../store/index";
import router from "../router/index";

store.dispatch("getLoggedPlayers");
const expectedPlayers = computed(() => store.state.teams * 2);
const loggedPlayers = computed(() => store.state.loggedPlayers);

watch(loggedPlayers, (newValue) => {
  if (newValue !== expectedPlayers.value) {
    router.push("/waiting-players");
  }
});

store.dispatch("getWords");
const expectedWords = computed(() => expectedPlayers.value * store.state.words);
const words = computed(() => store.state.allInsertedWords.length);

watchEffect(() => {
  if (loggedPlayers.value !== expectedPlayers.value) {
    console.log(loggedPlayers.value);
    router.push("/waiting-players");
  }
  if (words.value !== expectedWords.value) {
    router.push("/words-creation");
  }
});
</script>
