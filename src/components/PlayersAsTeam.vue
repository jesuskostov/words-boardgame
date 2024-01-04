<template>
  <div>
    <div class="relative grid grid-cols-2 gap-4 mt-6">
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
      <div
        class="flex items-center justify-center text-3xl w-16 h-16 rounded-full bg-white border-[10px] border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <span class="relative top-[0.5px]">🤝</span>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import axios from "axios";

export default {
  name: "PlayersAsTeam",
  props: {
    teamId: {
      type: Number,
      required: true,
    },
    teamColor: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const players = ref([]);

    onMounted(async () => {
      const res = await axios.get(
        `https://words-api.g-home.site/api/get-user-by-team-id/${props.teamId}`
      );
      players.value = res.data.users;
    });

    return {
      players,
    };
  },
};
</script>
