<template>
  <div class="text-white py-6">
    <div class="flex flex-col items-center justify-center mt-5">
      <span class="text-5xl animate-bounce">{{ expectedPlayers }}</span>
      <span class="text-center text-2xl font-bold px-8"
        >Играчи в очакване
      </span>
    </div>
    <div class="grid grid-cols-2 gap-4 mt-6">
      <div
        v-for="(player, i) in players"
        :key="i"
        class="relative bg-custom-gray text-white rounded-xl h-48 overflow-hidden"
      >
        <img
          v-if="player.photo_path"
          class="w-full h-full object-cover"
          :src="`https://words-api.g-home.site/${player.photo_path}`"
          alt=""
        />
        <div
          class="absolute text-white text-sm p-2 bottom-0 left-0 w-full bg-custom-gray rounded-bl-xl rounded-br-xl overflow-hidden"
        >
          {{ player.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, watchEffect } from "vue";
import store from "../store/index";
import router from "../router/index";

const teams = ref([]);
const expectedPlayers = ref(4);

onMounted(async () => {
  if (expectedPlayers.value === 0) {
    // router.push("/words-creation");
    return;
  }
  teams.value = await store.dispatch("fetchTeams");
  // get token from local storage
  const token = localStorage.getItem("token");
  if (token) {
    await store.dispatch("getLoggedPlayers");
  }
  store.dispatch("getCurrentUser");
});

const loggedPlayers = computed(() => store.state.loggedPlayers);
const players = computed(() => store.state.players);

watch(loggedPlayers, (newValue) => {
  expectedPlayers.value = store.state.teams * 2 - newValue;
});

watchEffect(() => {
  if (expectedPlayers.value === 0) {
    router.push("/playground");
  }
});

const user = computed(() => store.state.user);

watch(user, (val) => {
  if (val.photo_path === null) {
    router.push("/selfie");
  }
});

const joinTeam = (teamId) => {
  store.dispatch("joinTeam", teamId);
};
</script>
