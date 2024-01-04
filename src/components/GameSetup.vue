<template>
  <div class="flex flex-col justify-between py-4 h-[90vh]">
    <steps
      :title="store.state.steps[currentStep].title"
      :current-step="currentStep"
    />
    <circle-number ref="circleSetting" :type="step.name" />
    <!-- <toggle-player-pick v-if="currentStep === 0" /> -->
    <!-- <toggle-categories v-if="currentStep === 1" ref="categoriesComponent" /> -->
    <button class="h-16 w-full bg-white text-black rounded-xl" @click="save">
      Напред
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Steps from "./Steps.vue";
import CircleNumber from "./CircleNumber.vue";
// import TogglePlayerPick from "./TogglePlayerPick.vue";
// import ToggleCategories from "./ToggleCategories.vue";
import store from "../store/index";
import router from "../router";

const circleSetting = ref(null);
const categoriesComponent = ref(null);
const currentStep = computed(() => store.state.currentStep);
const step = computed(() => store.state.steps[currentStep.value]);
const isStepFinished = computed(() => store.state.isStepFinished);

watch(isStepFinished, (value) => {
  if (value) {
    router.push("/overview");
  }
});

const save = () => {
  circleSetting.value.save(step);
  // if (currentStep.value === 2 && isStepFinished.value === false) {
  //   categoriesComponent.value.save();
  // }
};
</script>

<style>
html {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
}
</style>
