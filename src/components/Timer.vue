<template>
  <div class="mt-6">
    <div class="w-full h-2 bg-[#D6D6D6] rounded-full overflow-hidden">
      <div
        :style="progressBarStyle"
        class="h-2 bg-[#FC8E29] rounded-full transition"
      ></div>
    </div>
    <p class="text-white text-center text-2xl mt-2">
      {{ formatTime(timeLeft) }}
    </p>
    <button @click="pauseTimer" class="text-white">Pause</button>
    <div
      v-if="current_turn?.id !== user?.id"
      class="fixed top-1/3 left-1/2 transform -translate-x-1/2 w-full px-4 h-52 flex flex-col items-center"
    >
      <div class="relative w-32 h-32 mx-auto rounded-full overflow-hidden p-1">
        <div
          class="absolute top-0 left-0 w-full h-full border-[3px] border-dotted border-orange-400 spin-custom"
        ></div>
        <!-- <div
          class="absolute top-0 left-0 w-full h-full border-[3px] border-dotted border-white animate-pulse"
        ></div> -->
        <img
          v-if="current_turn?.photo_path"
          :src="`https://words-api.g-home.site/${current_turn?.photo_path}`"
          class="w-full h-full object-cover rounded-full"
          alt=""
        />
      </div>
      <p class="text-white mt-2 text-xl">{{ current_turn?.name }} е на ред</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import store from "../store/index";
import axios from "axios";

export default {
  setup(_, { emit }) {
    const timeLeft = ref(0);
    const totalDuration = ref(0); // Store the total duration
    let timer = null;
    const duration = computed(() => store.state.time);

    window.Echo.channel("timer-start").listen("TimerStart", (e) => {
      totalDuration.value = duration.value;
      const startTime = Date.now();
      localStorage.setItem("timerStart", startTime);
      localStorage.setItem("timerDuration", duration.value);
      updateTimeLeft();
      timer = setInterval(updateTimeLeft, 1000);
    });

    window.Echo.channel("pause-timer").listen("TimerPause", (e) => {
      // pause timer and save the time left
      clearInterval(timer);
      localStorage.setItem("timerStart", Date.now());
      localStorage.setItem("timerDuration", timeLeft.value);
    });

    const progressBarWidth = computed(() => {
      return (timeLeft.value / totalDuration.value) * 100;
    });

    const progressBarStyle = computed(() => {
      const width = Math.max(0, (timeLeft.value / totalDuration.value) * 100);
      return {
        width: `${width}%`,
        transition: "width 1s ease", // Add the transition style here
      };
    });

    const updateTimeLeft = () => {
      const startTime = parseInt(localStorage.getItem("timerStart"), 10);
      const duration = parseInt(localStorage.getItem("timerDuration"), 10);

      // Check for NaN values
      if (isNaN(startTime) || isNaN(duration)) {
        clearInterval(timer);
        timeLeft.value = 0;
        return;
      }

      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      timeLeft.value = Math.max(0, duration - elapsed);

      if (timeLeft.value <= 0) {
        clearInterval(timer);
        endRound();
      }
    };

    const startTimer = () => {
      axios.post("https://words-api.g-home.site/api/start-timer");
    };

    const pauseTimer = () => {
      axios.post("https://words-api.g-home.site/api/pause-timer");
    };

    const user = computed(() => store.state.user);
    const current_turn = computed(() => store.state.current_turn);

    // watch([user, current_turn], ([newUser, newCurrentTurn]) => {
    //   if (
    //     newUser?.id !== undefined &&
    //     newCurrentTurn?.id !== undefined &&
    //     newUser.id === newCurrentTurn.id
    //   ) {
    //     // console.log("Your turn");
    //   } else {
    //     // console.log(current_turn.value);
    //   }
    // });

    const endRound = () => {
      // Make API call to server to end the round
      localStorage.removeItem("timerStart");
      localStorage.removeItem("timerDuration");
      emit("reset");
      console.log("try to emit");
      if (user.value.id === current_turn.value.id) {
        store.dispatch("endRound");
      }
    };

    onMounted(() => {
      const storedStartTime = localStorage.getItem("timerStart");
      const storedDuration = localStorage.getItem("timerDuration");

      if (storedStartTime && storedDuration) {
        totalDuration.value = parseInt(storedDuration);
        updateTimeLeft();
        timer = setInterval(updateTimeLeft, 1000);
      }
    });

    onUnmounted(() => {
      if (timer) {
        clearInterval(timer);
      }
    });

    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return {
      progressBarWidth,
      progressBarStyle,
      startTimer,
      timeLeft,
      formatTime,
      current_turn,
      user,
      pauseTimer,
    };
  },
};
</script>

<style>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.spin-custom {
  animation: spin 3s linear infinite;
}
</style>
