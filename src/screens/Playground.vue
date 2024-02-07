<template>
  <div class="text-white flex flex-col justify-between h-[87vh]">
    <div>
      <Informer v-if="current_turn" />
      <Timer
        ref="timer"
        @reset="reset"
        @skipped="skippedCheck"
        @paused="isPaused = true"
        @resumed="isPaused = false"
      />
      <TurnNotifier v-if="notifier && !isLoading" @start="start" />
    </div>
    <h1
      v-if="user?.id === current_turn?.id && !isPaused && !isLoading"
      class="text-white text-center text-[42px] transition-all"
      :class="{ 'blur-md': hidden }"
      @click="hidden = !hidden"
    >
      {{ current_word }}
    </h1>
    <div
      v-if="user?.id === current_turn?.id && !isPaused && !isLoading"
      class="grid grid-cols-7 gap-x-4 -mx-5"
    >
      <button
        class="col-span-5 h-16 bg-white text-black font-bold uppercase rounded-tr-lg rounded-br-lg"
        @click="nextWord"
      >
        следваща дума
      </button>
      <button
        @click="skipWord"
        class="col-span-2 h-16 rounded-tl-lg rounded-bl-lg bg-orange-400 font-bold uppercase"
        :disabled="isSkippedUsed"
        :class="{ 'opacity-50': isSkippedUsed }"
      >
        ПАС
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import TurnNotifier from "../components/TurnNotifier.vue";
import Timer from "../components/Timer.vue";
import Informer from "../components/Informer.vue";
import store from "../store/index";
import router from "../router/index";
import axios from "axios";

const isPaused = ref(false);
const hidden = ref(false);
const notifier = ref(false);
const hasNotifierBeenShown = ref(
  localStorage.getItem("hasNotifierBeenShown") === "true"
);
const timer = ref(null);
const isSkippedUsed = ref(
  localStorage.getItem("is_skipped_used")
    ? localStorage.getItem("is_skipped_used")
    : false
);
const isLoading = ref(false);

store.dispatch("getLoggedPlayers");
const expectedPlayers = computed(() => store.state.teams * 2);
const loggedPlayers = computed(() => store.state.loggedPlayers);

watch(loggedPlayers, (newValue) => {
  if (newValue !== expectedPlayers.value) {
    router.push("/waiting-players");
  }
});

onMounted(async () => {
  const result = await axios.get(
    "https://words-api.g-home.site/api/is-game-running"
  );  
  
  if (result.data.isGameRunning === 1) {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    isLoading.value = true;
    await store.dispatch("getWord");
    await store.dispatch("getCurrentTurn");
    isLoading.value = false;
  }
  
  if (router.currentRoute.value.query.fromGameStarted) {
    start()
  }

});

const user = computed(() => store.state.user);
const current_turn = computed(() => store.state.current_turn);
const current_word = computed(() => store.state.current_word);

watch([user, current_turn], ([newUser, newCurrentTurn]) => {
  if (
    newUser?.id !== undefined &&
    newCurrentTurn?.id !== undefined &&
    newUser.id === newCurrentTurn.id &&
    !hasNotifierBeenShown.value // Check if notifier has not been shown before
  ) {
    notifier.value = true;
  }
});

const nextWord = async () => {
  await store.dispatch("nextWord", { word: current_word.value });
};

const skipWord = async () => {
  await store.dispatch("skipWord", { word: current_word.value });
  isSkippedUsed.value = true;
  localStorage.setItem("is_skipped_used", true);
};

const skippedCheck = (val) => {
  isSkippedUsed.value = val;
};

const reset = () => {
  notifier.value = false;
  hasNotifierBeenShown.value = false;
  localStorage.removeItem("hasNotifierBeenShown");
  localStorage.removeItem("is_skipped_used");
};

const start = () => {
  if (current_word.value) {
    console.log("start game---");
    timer.value.startTimer();
    notifier.value = false;
    hasNotifierBeenShown.value = true;
    localStorage.setItem("hasNotifierBeenShown", "true");
  }
};
</script>
