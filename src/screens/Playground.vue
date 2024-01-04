<template>
  <div class="text-white flex flex-col justify-between h-[87vh]">
    <div>
      <Informer v-if="current_turn" />
      <Timer ref="timer" />
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
import { ref, watch, watchEffect, computed, onMounted } from "vue";
import TurnNotifier from "../components/TurnNotifier.vue";
import Timer from "../components/Timer.vue";
import Informer from "../components/Informer.vue";
import store from "../store/index";
import router from "../router/index";

const hidden = ref(false);
const notifier = ref(false);
const timer = ref(null);

store.dispatch("getLoggedPlayers");
const expectedPlayers = computed(() => store.state.teams * 2);
const loggedPlayers = computed(() => store.state.loggedPlayers);

watch(loggedPlayers, (newValue) => {
  if (newValue !== expectedPlayers.value) {
    router.push("/waiting-players");
  }
});

onMounted(() => {
  store.dispatch("getWords");
});

const expectedWords = computed(() => expectedPlayers.value * store.state.words);
const words = computed(() => store.state.allInsertedWords.length);

const user = computed(() => store.state.user);
const current_turn = computed(() => store.state.current_turn);
const current_word = computed(() => store.state.current_word);

const nextWord = async () => {
  await store.dispatch("nextWord", { word: current_word.value });
};

watch(current_turn, (val) => {
  if (val?.id === user.value?.id) {
    notifier.value = true;
  }
});

watchEffect(() => {
  if (loggedPlayers.value !== expectedPlayers.value) {
    router.push("/waiting-players");
    return;
  } else {
    store.dispatch("getCurrentTurn");
  }
  if (words.value !== expectedWords.value) {
    router.push("/words-creation");
  } else {
    store.dispatch("getCurrentTurn");
  }
});

const start = () => {
  timer.value.startTimer(10);
  notifier.value = false;
};
</script>
