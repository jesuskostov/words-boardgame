<template>
  <div class="relative w-full rounded-xl bg-custom-gray h-36 mb-4 pt-9 px-4">
    <pre v-for="(user, i) in users" :key="i">{{ user.user.name }}</pre>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import store from "../store/index";

export default {
  name: "Team",
  props: {
    team: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const users = ref([]);

    onMounted(async () => {
      const res = await store.dispatch("fetchUsersPerTeam", {
        teamId: props.team.id,
      });
      users.value = res;
    });

    return { users };
  },
};
</script>
