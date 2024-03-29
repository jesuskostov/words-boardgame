<template>
  <div class="pb-20">
    <h1
      class="text-[1.5rem] font-bold text-white text-center my-6"
      v-text="'Отбори и разпределение'"
    />
    <div class="flex justify-center items-center my-20">
      <div class="relative w-64 h-64 border border-white rounded-full">
        <div v-for="(player, index) in players" :key="index">
          <div
            class="absolute rounded-full border-2 border-white overflow-hidden"
            :style="positionOnCircle(index, players.length)"
            :class="{
              'w-20 h-20': players.length === 4,
              'w-14 h-14': players.length > 4,
            }"
          >
            <img
              v-if="player.photo_path"
              :src="`https://words-api.g-home.site/${player.photo_path}`"
              class="w-full h-full rounded-full object-cover"
              alt=""
            />
          </div>
        </div>
        <button
          v-if="orderID === userID"
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl outline-none"
          @click="startGame"
        >
          СТАРТ
        </button>
      </div>
    </div>
    <div v-for="(team, i) in teams" :key="i">
      <PlayersAsTeam :team-id="team.id" :team-color="team.color" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import PlayersAsTeam from "../components/PlayersAsTeam.vue";
import axios from "axios";
import router from "../router";
import store from "../store";

const teams = ref([]);
const players = ref([]);
const orderID = ref(null);


const positionOnCircle = (index, total) => {
  const angle = index * (360 / total) * (Math.PI / 180);
  const radius = 124; // Radius of the circle
  let dotSize = 30; // Size of the dot (w-12/h-12 in TailwindCSS is 3rem or 48px)
  if (players.value.length <= 4) {
    dotSize = 30;
  }
  if (players.value.length >= 6) {
    dotSize = 5;
  }
  const x = Math.cos(angle) * radius - dotSize / 2;
  const y = Math.sin(angle) * radius - dotSize / 2;
  return {
    top: "50%",
    left: "50%",
    transform: `translate(${x}px, ${y}px)`,
    "margin-top": "-24px", // Half of the height of the dot
    "margin-left": "-24px", // Half of the width of the dot
  };
};

const mixTeams = async () => {
  try {
    const res = await axios.post("https://words-api.g-home.site/api/mix-teams");
    teams.value = res.data.teams;

    const teamLeaders = [];
    const teamMembers = [];

    for (const team of teams.value) {
      const res_teams = await axios.get(
        `https://words-api.g-home.site/api/get-user-by-team-id/${team.id}`
      );
      if (res_teams.data.users && res_teams.data.users.length > 0) {
        teamLeaders.push({
          ...res_teams.data.users[0],
          team_color: team.color,
        });
      }
      if (res_teams.data.users && res_teams.data.users.length > 1) {
        teamMembers.push({
          ...res_teams.data.users[1],
          team_color: team.color,
        });
      }
    }    
    console.log(res);
    players.value = [...teamLeaders, ...teamMembers];
    orderID.value = res.data.order[0]?.user_id

  } catch (error) {
    console.error("Error fetching teams:", error);
  }
};

const startGame = async () => {
  await axios.post("https://words-api.g-home.site/api/start-game");
};

const loggedPlayers = computed(() => store.state.loggedPlayers);
const expectedPlayers = computed(() => store.state.teams);
const expectedWords = computed(() => store.state.words_test);
const allInsertedWords = computed(() => store.state.allInsertedWords.length);
const userID = computed(() => store.state.user?.id);
console.log("userID", userID.value);

onMounted(async () => {
  await store.dispatch("getLoggedPlayers");
  await store.dispatch("getExpectedWordsForAGame");
  await store.dispatch("getCurrentUser");
  if (
    loggedPlayers.value === expectedPlayers.value * 2 &&
    expectedWords.value === allInsertedWords.value
  ) {
    mixTeams();
  } else {
    router.push("/waiting-players");
  }
});
</script>
