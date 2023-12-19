<template>
  <div>
    <h1 class="text-[1.5rem] font-bold mb-6" v-text="title" />
    <div class="grid grid-cols-3 gap-x-2">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="flex items-center justify-center h-11 rounded-xl text-sm"
        :class="index <= currentStep ? 'bg-green-light' : 'bg-red-light'"
        @click="goToStep(index)"
      >
        {{ step.icon }} {{ step.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import store from "../store/index";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  currentStep: {
    type: Number,
    default: 0,
  },
});

const steps = ref([
  {
    title: "Отбори",
    icon: "👬",
  },
  {
    title: "Думи",
    icon: "✍️",
  },
  {
    title: "Време",
    icon: "⏰",
  },
]);

const goToStep = (index) => {
  store.commit("SET_CURRENT_STEP", index);
};
</script>
