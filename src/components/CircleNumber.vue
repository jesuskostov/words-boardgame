<template>
  <div
    class="relative border border-white rounded-full mx-auto flex flex-col items-center justify-center"
    :style="`width: ${circleWidth}px; height: ${circleWidth}px;`"
  >
    <p class="text-[80px] text-white" v-text="count" />
    <p v-if="type === 'teams'" class="text-white">Отбора</p>
    <p v-if="type === 'words'" class="text-white">Думи</p>
    <p v-if="type === 'time'" class="text-white">Секунди</p>
    <button
      class="absolute bottom-0 left-0 bg-custom-gray rounded-full text-white flex items-center justify-center text-5xl"
      :style="`width: ${circleWidth / 4}px; height: ${circleWidth / 4}px;`"
      :disabled="
        (type === 'teams' && count === 2) ||
        (type === 'words' && count === 3) ||
        (type === 'time' && count === 25)
      "
      @click="down"
    >
      -
    </button>
    <button
      class="absolute bottom-0 right-0 bg-custom-gray rounded-full text-white flex items-center justify-center text-5xl"
      :style="`width: ${circleWidth / 4}px; height: ${circleWidth / 4}px;`"
      @click="up"
    >
      +
    </button>
  </div>
</template>

<script>
import { ref, watch, computed, onMounted } from "vue";
import store from "../store/index";

export default {
  props: {
    type: {
      type: String,
      default: "teams",
    },
  },
  setup(props) {
    const count = ref(2);
    const circleWidth = ref(0);
    const currentStep = computed(() => store.state.currentStep);
    const step = computed(() => store.state.steps[currentStep.value].name);

    watch(currentStep, () => {
      count.value = store.state[step.value];
    });

    watch(count, (value) => {
      if (value < 0) {
        count.value = 0;
      }
    });

    onMounted(() => {
      count.value = store.state[step.value];
      circleWidth.value = window.innerWidth / 1.7;
    });

    const save = (step) => {
      const payload = {
        step: step.value,
        value: count.value,
      };
      store.commit("SET_CONFIG", payload);
    };

    const down = () => {
      if (props.type === "time") {
        count.value -= 5;
        return;
      }
      count.value--;
    };

    const up = () => {
      if (props.type === "time") {
        count.value += 5;
        return;
      }
      count.value++;
    };

    return {
      count,
      save,
      circleWidth,
      down,
      up,
    };
  },
};
</script>
