<template>
  <div class="font-mont px-4">
    <Initializer />
    <router-view></router-view>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import Initializer from "./components/Initializer.vue";
import Echo from "laravel-echo";
import "pusher-js";
import router from "./router/index";
import store from "./store/index";
import axios from "axios";
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

window.Echo.channel("game-created").listen("GameCreated", (e) => {
  router.push("/login");
});

window.Echo.channel("user-created").listen("UserCreated", (e) => {
  console.log("user created");
  store.dispatch("getLoggedPlayers");
});

window.Echo.channel("word-created").listen("WordCreated", (e) => {
  console.log("word created");
  store.dispatch("getWords");
});

window.Echo.channel("turn-update").listen("TurnUpdate", (e) => {
  console.log("get current turn");
  store.dispatch("getCurrentTurn");
});

window.Echo.channel("game-started").listen("GameStarted", (e) => {
  console.log("game started");
  router.push("/playground");
});

onMounted(() => {
  const game_id = localStorage.getItem("game_id");
  if (game_id) {
    store.commit("SET_GAME_ID", { game_id: game_id });
  }
  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
});
</script>

<style>
html,
body {
  background-color: #000;
}
#app {
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
    env(safe-area-inset-bottom) env(safe-area-inset-left);
}
</style>
