<template>
  <div class="py-4 h-[85vh]">
    <h1 class="text-2xl font-bold mb-6">
      <span class="capitalize">{{ adminName }}</span> създаде игра
    </h1>
    <div class="flex flex-col h-full">
      <div
        class="rounded-2xl bg-custom-gray p-3 flex justify-between items-start gap-x-24 mb-2"
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
        class="rounded-2xl bg-custom-gray p-3 flex justify-between items-start mb-2"
      >
        <div>
          <p class="text-xl">✍️ Думи на играч</p>
        </div>
        <p class="font-bold text-2xl">{{ store.state.words }}</p>
      </div>
      <div
        class="rounded-2xl bg-custom-gray p-3 flex justify-between items-center mb-2"
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
        class="rounded-2xl bg-custom-gray p-3 flex justify-between items-start gap-x-24 mb-2"
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
            class="h-16 bg-custom-gray w-full rounded-2xl px-4 py-1 text-sm"
            placeholder="Въведи име"
          />
        </div>
        <button
          class="h-16 w-full bg-black-custom text-white rounded-xl"
          @click="login"
        >
          Играй
        </button>
      </div>
    </div>
    <div
      v-if="confirmModal"
      class="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 p-8"
    >
      <button
        class="absolute top-10 right-10 font-thin text-5xl"
        @click="confirmModal = false"
      >
        X
      </button>
      <p class="text-2xl font-bold">Намерен е играч {{ name }}</p>
      <button
        class="absolute bottom-10 h-16 w-[90%] bg-black-custom text-white rounded-xl"
        @click="forwardLogin"
      >
        Продължи
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import store from "../store/index";
import router from "../router";
import axios from "axios";
import createdSound from "../assets/sounds/created.mp3";

const adminName = ref("");
const name = ref("");
const confirmModal = ref(false);

// get user
const user = computed(() => store.state.user);

watch(user, async () => {
  if (!user.value) return;
  router.push("/selfie");
});

onMounted(async () => {
  const audio = new Audio(createdSound);
  audio.play().catch((e) => console.error("Error playing audio:", e));

  const token = localStorage.getItem("token");
  const res = await axios.get("https://words-api.g-home.site/api/get-admin");
  adminName.value = res.data.user.name;
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const res = await axios.get(
      "https://words-api.g-home.site/api/get-current-user"
    );
    store.commit("SET_USER", res.data);
  }
});

const categories = computed(() => store.state.categories);

const login = async () => {
  const res = await axios.post("https://words-api.g-home.site/api/check-user", {
    name: name.value,
  });
  if (res.data.user === null) {
    store.dispatch("registerUser", name.value);
  } else {
    confirmModal.value = true;
  }
};

const forwardLogin = () => {
  store.dispatch("loginUser", name.value);
};
</script>
