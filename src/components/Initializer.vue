<template>
  <div
    v-if="loading"
    class="fixed inset-0 bg-[#010010] flex flex-col items-center justify-center z-50"
  >
    <img class="w-24 h-24 animate-pulse" src="../assets/logo.png" alt="logo" />
    <span
      class="mt-6 text-center text-2xl text-white font-bold animate-pulse px-8"
      >Зареждане</span
    >
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watchEffect } from "vue";
import axios from "axios";
import store from "../store/index";
import router from "../router/index";

const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  const res = await axios.get(
    "https://words-api.g-home.site/api/is-game-active"
  );
  if (res.data.game !== null) {
    const payload = {
      teams: res.data.game.number_of_teams,
      words: res.data.game.number_of_words,
      time: res.data.game.round_time,
      categories: res.data.game.categories,
      current_turn: res.data.game.current_turn,
      randomPickOfPlayers: res.data.game.random_pick_of_players,
      isGameActive: res.data.game.is_active,
    };
    store.commit("SET_GAME", payload);
    // get token from local storage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await axios.get(
          "https://words-api.g-home.site/api/get-current-user"
        );
        store.commit("SET_USER", res.data);
        loading.value = false;
        if (res.data.user.photo_path === null) {
          router.push("/selfie");
        } else {
          router.push("/playground");
        }
      } catch (error) {
        console.error(error);
        router.push("/login");
        loading.value = false;
      }
    } else {
      router.push("/login");
      loading.value = false;
    }
  } else {
    router.push("/");
    loading.value = false;
  }
});

// isGameActive
const isGameActive = computed(() => store.state.isGameActive);
const user = computed(() => store.state.user);

// if user is not null and isGameActive is true router push to playground
watchEffect(() => {
  if (user.value !== null && isGameActive.value) {
    // router.push("/playground");
  }
});
</script>
