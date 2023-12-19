<template>
  <div>
    <button
      :style="`width: 300px; margin: 10px; background-color: ${team.color}`"
      @click="joinTeam(team.id)"
    >
      {{ team.name }}
      <pre>{{ users }}</pre>
    </button>
    <button @click="leaveTeam" style="background-color: red">X</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const { team } = defineProps(["team"]);
import axios from "axios";

const users = ref([]);

// get team users by team id
// const getTeamUsers = async (teamId) => {
//   const res = await axios.get(
//     `https://words-api.g-home.site/api/get-users-for-team/${teamId}`
//   );
//   users.value = res.data;
// };

const leaveTeam = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  const res = await axios.post("https://words-api.g-home.site/api/leave-team", {
    teamId: team.id,
  });
  console.log(res.data);
};

onMounted(() => {
  getTeamUsers(team.id);
});
</script>
