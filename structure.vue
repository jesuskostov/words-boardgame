<template>
  <div>
    <h1 v-if="gameCreated">Game created, now insert your names step ;]</h1>
    <input type="text" v-model="name" />
    <button @click="register" class="text-red-500">Register</button>
    <pre>{{ user }}</pre>
    <Teams v-for="(team, i) in teams" :key="i" :team="team" />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from "vue";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import axios from "axios";
import Teams from "./components/Teams.vue";

const gameCreated = ref(false);
const name = ref("");
const user = reactive({});
const teams = ref(null);

const register = async () => {
  axios.defaults.withCredentials = true;

  const res = await axios.post(
    "https://words-api.g-home.site/api/create-user",
    {
      name: name.value,
    }
  );
  // save barrier token to local storage
  localStorage.setItem("token", res.data.token);
};

const joinTeam = async (teamId) => {
  const res = await axios.post("https://words-api.g-home.site/api/join-team", {
    teamId,
  });
  console.log(res.data);
};

watch(user, async () => {
  if (!user) return;
  const res = await axios.get("https://words-api.g-home.site/api/teams");
  teams.value = res.data;
});

onMounted(async () => {
  // retrieve barrier token from local storage if exists
  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  // retrieve user with barrier token
  const res = await axios.get(
    "https://words-api.g-home.site/api/get-current-user"
  );
  user.value = res.data;

  // Echo and WebSocket logic goes here
  window.Echo = new Echo({
    broadcaster: "pusher",
    key: "f0e294f177947b628395",
    cluster: "eu",
    encrypted: true,
    wsHost: "words-api.g-home.site",
    wsPort: 6001,
    disableStats: true,
    forceTLS: true,
  });

  window.Echo.channel(`game-created`).listen("GameCreated", (e) => {
    gameCreated.value = true;
  });
});
</script>
