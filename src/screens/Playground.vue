<template>
  <div class="text-white flex flex-col justify-between h-[87vh]">
    <div>
      <Informer v-if="current_turn" />
      <Timer ref="timer" @reset="reset" />
      <TurnNotifier v-if="notifier" @start="start" />
    </div>
    <h1
      v-if="user?.id === current_turn?.id"
      class="text-white text-center text-[42px] transition-all"
      :class="{ 'blur-md': hidden }"
      @click="hidden = !hidden"
    >
      {{ current_word }}
    </h1>
    <div
      v-if="user?.id === current_turn?.id"
      class="grid grid-cols-7 gap-x-4 -mx-5"
    >
      <button
        class="col-span-5 h-16 bg-white text-black font-bold uppercase rounded-tr-lg rounded-br-lg"
        @click="nextWord"
      >
        следваща дума
      </button>
      <button
        class="col-span-2 h-16 rounded-tl-lg rounded-bl-lg bg-orange-400 font-bold uppercase"
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

const hidden = ref(false);
const notifier = ref(false);
const hasNotifierBeenShown = ref(
  localStorage.getItem("hasNotifierBeenShown") === "true"
);
const timer = ref(null);

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
    await store.dispatch("getWord");
    await store.dispatch("getCurrentTurn");
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

const reset = () => {
  notifier.value = false;
  hasNotifierBeenShown.value = false;
  localStorage.removeItem("hasNotifierBeenShown");
  console.log(213);
};

const start = () => {
  if (current_word.value) {
    timer.value.startTimer();
    notifier.value = false;
    hasNotifierBeenShown.value = true; // Set flag to true after showing notifier
    localStorage.setItem("hasNotifierBeenShown", "true");
  }
};
</script>
