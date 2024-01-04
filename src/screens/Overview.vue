<template>
  <div class="py-4 h-[85vh]">
    <h1 class="text-2xl font-bold text-white mb-6">Всичко точно ли е?</h1>
    <div class="flex flex-col h-full">
      <div
        class="rounded-2xl bg-custom-gray text-white p-3 flex justify-between items-start gap-x-24 mb-2"
        @click="goToStep(0)"
      >
        <div>
          <p class="text-xl mb-3">👬 Отбори</p>
          <p v-if="store.state.randomPickOfPlayers" class="text-sm">
            Подбор на играчи - случаен принцип
          </p>
        </div>
        <p class="font-bold text-2xl">{{ store.state.teams }}</p>
      </div>
      <div
        class="rounded-2xl bg-custom-gray text-white p-3 flex justify-between items-start mb-2"
        @click="goToStep(1)"
      >
        <div>
          <p class="text-xl">✍️ Думи на играч</p>
        </div>
        <p class="font-bold text-2xl">{{ store.state.words }}</p>
      </div>
      <div
        class="rounded-2xl bg-custom-gray text-white p-3 flex justify-between items-center mb-2"
        @click="goToStep(2)"
      >
        <div>
          <p class="text-xl">⏰ Време за рунд</p>
        </div>
        <div class="text-right relative top-1">
          <p class="font-bold text-2xl">{{ store.state.time }}</p>
          <span class="text-xs relative -top-2">Секунди</span>
        </div>
      </div>
      <div
        v-if="categories"
        class="rounded-2xl bg-custom-gray text-white p-3 flex justify-between items-start gap-x-24 mb-2"
        @click="goToStep(1)"
      >
        <div>
          <p class="text-xl mb-3">Категориите са</p>
          <p class="text-sm">{{ categories }}</p>
        </div>
      </div>
      <div class="grow flex flex-col justify-between py-6">
        <div>
          <label for="name" class="text-sm mb-1 inline-block">Твоето име</label>
          <input
            id="name"
            type="text"
            v-model="name"
            class="h-16 bg-custom-gray text-white w-full rounded-2xl px-4 py-1 text-sm"
            placeholder="Въведи име"
          />
        </div>
        <button
          class="h-16 w-full bg-white text-black rounded-xl"
          @click="createGame"
        >
          Започни играта
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import store from "../store/index";
import router from "../router";

const name = ref("");

const goToStep = (step) => {
  store.commit("SET_CURRENT_STEP", step);
  router.push("/");
};

const categories = computed(() => store.state.categories);

const createGame = async () => {
  store.dispatch("createGame", name.value);
};
</script>
