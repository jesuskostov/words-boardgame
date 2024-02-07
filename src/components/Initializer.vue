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
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import store from "../store/index";
import router from "../router/index";

const loading = ref(true);

const fetchGameStatus = async () => {
  const res = await axios.get(
    "https://words-api.g-home.site/api/is-game-active"
  );
  return res.data.game;
};

const updateUserState = async () => {
  try {
    const userRes = await axios.get(
      "https://words-api.g-home.site/api/get-current-user"
    );
    store.commit("SET_USER", userRes.data);
  } catch (error) {
    console.error(error);
    router.push("/login");
  }
};

const handleRoutingBasedOnGameStatus = async (game) => {
  if (!game) {
    router.push("/");
    return;
  }

  const payload = {
    teams: game.number_of_teams,
    words: game.number_of_words,
    time: game.round_time,
    categories: game.categories,
    current_turn: game.current_turn,
    randomPickOfPlayers: game.random_pick_of_players,
    isGameActive: game.is_active,
  };
  store.commit("SET_GAME", payload);

  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  await updateUserState();
  const result = await axios.get(
    "https://words-api.g-home.site/api/is-game-running"
  );
  routeToNextScreen(result.data.isGameRunning);
};

const loggedPlayers = computed(() => store.state.loggedPlayers);
const teams = computed(() => store.state.teams);
const expectedWords = computed(() => store.state.words_test);
const allInsertedWords = computed(() => store.state.allInsertedWords.length);

const routeToNextScreen = (isGameRunning) => {
  if (store.state.user?.photo_path === null) {
    router.push("/selfie");
    return;
  }

  // waiting players -> words creation -> team selection -> playground
  if (teams.value * 2 !== loggedPlayers.value) {
    router.push("/waiting-players");
    return;
  }

  if (isGameRunning === 0) {
    if (expectedWords.value !== allInsertedWords.value) {
      router.push("/words-creation");
      return;
    } else {
      router.push("/team-selection");
      return;
    }
  }

  if (isGameRunning === 1) {
    router.push("/playground");
    return;
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    const game = await fetchGameStatus();
    await store.dispatch("getExpectedWordsForAGame");
    await handleRoutingBasedOnGameStatus(game);
  } catch (error) {
    console.error(error);
    router.push("/");
  } finally {
    loading.value = false;
  }
});
</script>
