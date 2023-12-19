<template>
  <div>
    <label class="flex justify-between items-center cursor-pointer mb-4">
      <span class="text-sm inline-block text-blac">Ще играем с категории</span>
      <div class="relative">
        <input
          type="checkbox"
          v-model="toggle"
          class="sr-only peer"
          :checked="toggle"
        />
        <div
          class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-light"
        ></div>
      </div>
    </label>
    <div class="h-16 mb-6">
      <div v-if="toggle">
        <input
          type="text"
          v-model="value"
          class="h-14 rounded-2xl w-full bg-custom-gray px-4 py-1 text-sm"
          placeholder="Въведи категории"
        />
        <p class="text-xs text-red-500 mt-1">
          Разделяй категориите със запетайка.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import store from "../store/index";

export default {
  setup() {
    const toggle = ref(false);
    const value = ref("");

    const save = () => {
      if (value.value) {
        store.commit("SET_CATEGORIES", value.value);
      }
    };

    watch(toggle, (val) => {
      if (!val) {
        value.value = "";
        store.commit("SET_CATEGORIES", value.value);
      }
    });

    onMounted(() => {
      value.value = store.state.categories;
      if (value.value) {
        toggle.value = true;
      }
    });

    return {
      value,
      toggle,
      save,
    };
  },
};
</script>
