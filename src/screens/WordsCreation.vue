<template>
  <div class="mt-6">
    <div
      class="relative border border-black rounded-full mx-auto p-1"
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
    <div v-if="wordsToInsertLeft !== 0">
      <div :class="`grid grid-cols-${words} gap-x-2 mb-6`">
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
        class="h-14 rounded-2xl w-full bg-custom-gray px-4 py-1 text-sm"
        placeholder="Въведи дума"
      />
      <button
        class="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-[90%] h-16 bg-black-custom text-white rounded-xl"
        @click="sendWord"
      >
        Изпращане
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import store from "../store/index";
import WordAddedSound from "../assets/sounds/word-added.mp3";
import axios from "axios";

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
      class: shouldBeGreen ? "bg-green-light" : "bg-red-light",
    };
  });
});

watch(allInsertedWords, () => {
  const audio = new Audio(WordAddedSound);
  audio.play().catch((e) => console.error("Error playing audio:", e));
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

onMounted(() => {
  circleWidth.value = window.innerWidth / 1.7;
});
</script>
