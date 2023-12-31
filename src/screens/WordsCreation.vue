<template>
  <div class="text-white mt-6">
    <div
      class="relative border border-white rounded-full mx-auto p-1"
      :style="`width: ${circleWidth}px; height: ${circleWidth}px;`"
    >
      <div
        class="w-full h-full rounded-full border-4 border-black flex flex-col items-center justify-center text-5xl"
      >
        {{ allInsertedWords }}/{{ allExpectedWords }}
      </div>
    </div>
    <h1
      class="text-[1.5rem] font-bold text-center mt-5 mb-12"
      v-text="'Събиране на думи'"
    />
    <div v-if="wordsToInsertLeft > 0">
      <div :class="`grid grid-flow-col auto-cols-auto gap-x-2 mb-6`">
        <div
          v-for="word in indexedWords"
          :key="word.index"
          class="flex items-center justify-center h-11 rounded-xl text-xl"
          :class="word.class"
          v-text="word.index"
        />
      </div>
      <input
        type="text"
        v-model="wordToBeSent"
        class="h-14 rounded-2xl w-full bg-custom-gray text-white px-4 py-1 text-sm"
        placeholder="Въведи дума"
      />
      <button
        class="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-[90%] h-16 bg-custom-gray text-white rounded-xl"
        @click="sendWord"
      >
        Изпращане
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, watchEffect } from "vue";
import store from "../store/index";
import WordAddedSound from "../assets/sounds/word-added.mp3";
import axios from "axios";
import router from "../router/index";

const circleWidth = ref(0);
const wordToBeSent = ref("");

store.dispatch("getWords");
store.dispatch("getHowManyWordsLeftToInsert");
const allInsertedWords = computed(() => store.state.allInsertedWords.length);
const expectedPlayers = computed(() => store.state.teams * 2);
const allExpectedWords = computed(
  () => expectedPlayers.value * store.state.words
);
const words = computed(() => store.state.words);
const wordsToInsertLeft = computed(() => store.state.expectedWordsToInsert);

const indexedWords = computed(() => {
  const rangeArray = Array.from({ length: words.value }, (_, i) => i + 1); // Create an array [1, 2, ..., words.value]

  return rangeArray.map((index) => {
    const shouldBeGreen = index <= words.value - wordsToInsertLeft.value;
    return {
      index,
      class: shouldBeGreen
        ? "bg-white text-black"
        : "bg-custom-gray text-white",
    };
  });
});

watch(allInsertedWords, () => {
  const audio = new Audio(WordAddedSound);
  audio.play().catch((e) => console.error("Error playing audio:", e));
});

const loggedPlayers = computed(() => store.state.loggedPlayers);

onMounted(async () => {
  await store.dispatch("getLoggedPlayers");
  if (expectedPlayers.value !== loggedPlayers.value) {
    router.push("/waiting-players");
    return;
  }
  circleWidth.value = window.innerWidth / 1.7;
});

const sendWord = async () => {
  const res = await axios.post(
    "https://words-api.g-home.site/api/create-word",
    {
      word: wordToBeSent.value,
    }
  );
  if (res.status === 201) {
    wordToBeSent.value = "";
    store.dispatch("getHowManyWordsLeftToInsert");
  }
};

const mixTeams = async () => {
  const res = await axios.post("https://words-api.g-home.site/api/mix-teams");
  const result = await axios.get(
    "https://words-api.g-home.site/api/is-game-running"
  );
  if (res.status === 201) {
    router.push("/team-selection");
  }
  if (res.status === 200 && result.data.isGameRunning === 1) {
    router.push("/playground");
  } else {
    router.push("/team-selection");
  }
};

watch(allInsertedWords, (val) => {
  if (val === allExpectedWords.value) {
    mixTeams();
  }
});
</script>
