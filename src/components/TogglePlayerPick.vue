<template>
  <div>
    <label class="flex justify-between items-center cursor-pointer">
      <span class="text-sm inline-block text-white"
        >Подбор на играчи - случаен принцип</span
      >
      <div class="relative">
        <input
          type="checkbox"
          v-model="value"
          class="sr-only peer"
          :checked="value"
        />
        <div
          class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-light"
        ></div>
      </div>
    </label>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import store from "../store/index";

export default {
  setup() {
    const value = ref(false);

    onMounted(() => {
      value.value = store.state.randomPickOfPlayers;
    });

    watch(value, (value) => {
      store.commit("SET_PLAYER_PICK", value);
    });

    return {
      value,
    };
  },
};
</script>
