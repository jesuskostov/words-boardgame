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
    <div v-if="current_turn?.id === user?.id">
      <button v-if="!isTimePaused" @click="pauseTimer" class="text-white">
        Pause
      </button>
      <button v-else @click="resumeTimer" class="text-white">Resume</button>
    </div>
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import store from "../store/index";
import axios from "axios";

export default {
  setup(_, { emit }) {
    const timeLeft = ref(0);
    const totalDuration = ref(store.state.time);
    const timer = ref(null);
    const isTimePaused = ref(false);

    const clearTimer = () => {
      if (timer.value) {
        clearInterval(timer.value);
        timer.value = null;
      }
    };

    window.Echo.channel("game-timer").listen("TimerStart", async (e) => {
      // Check if a timer is already running with the same duration to prevent reinitialization
      if (timer.value && timeLeft.value === e.duration && !isTimePaused.value) {
        console.log("Timer is already running with the same duration. Skipping reinitialization.");
        return;
      }
      clearTimer();
      timeLeft.value = await e.duration;
      const startTime = Date.now();
      timer.value = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timeLeft.value = Math.max(0, e.duration - elapsed);

        if (timeLeft.value <= 0) {
          clearTimer();
          endRound();
        }
      }, 1000);
      isTimePaused.value = false;
    });

    window.Echo.channel("game-timer").listen("TimerPause", (e) => {
      clearTimer();
      isTimePaused.value = true;
    });

    window.Echo.channel("game-timer").listen("TimerResume", async (e) => {
      const duration = await e.duration;
      resume(duration);
      isTimePaused.value = false;
    });

    const resume = (remainingTime) => {
      clearTimer();
      timeLeft.value = remainingTime;
      const resumeTime = Date.now();
      timer.value = setInterval(() => {
        const elapsedSinceResume = Math.floor((Date.now() - resumeTime) / 1000);
        timeLeft.value = Math.max(0, remainingTime - elapsedSinceResume);

        if (timeLeft.value <= 0) {
          clearTimer();
          endRound();
          console.log(2222);
        }
      }, 1000);
    };

    const progressBarStyle = computed(() => {
      totalDuration.value = store.state.time;
      const width = Math.max(0, (timeLeft.value / totalDuration.value) * 100);
      return {
        width: `${width}%`,
        transition: "width 1s ease", // Add the transition style here
      };
    });

    const startTimer = async () => {
      await axios.post("https://words-api.g-home.site/api/start-timer");
    };

    const pauseTimer = async () => {
      await axios.post("https://words-api.g-home.site/api/pause-timer");
      emit("paused");
    };

    const resumeTimer = async () => {
      emit(
        "skipped",
        localStorage.getItem("is_skipped_used")
          ? localStorage.getItem("is_skipped_used")
          : false
      );
      await axios.post("https://words-api.g-home.site/api/resume-timer");
      emit("resumed");
    };

    const user = computed(() => store.state.user);
    const current_turn = computed(() => store.state.current_turn);

    const endRound = () => {
      clearTimer();
      axios.post("https://words-api.g-home.site/api/stop-timer");
      emit("reset");
      if (user.value.id === current_turn.value.id) {
        store.dispatch("endRound");
      }
    };

    onMounted(async () => {
      try {
        const tokne = localStorage.getItem("token");
        if (!tokne) {
          return;
        }
        const response = await axios.get(
          "https://words-api.g-home.site/api/get-current-time"
        );
        const data = response.data;
        if (data.timerState === "running" || data.timerState === "paused") {
          timeLeft.value = data.remainingTime;
          totalDuration.value = data.totalDuration;
          if (data.timerState === "running") {
            startTimerWithRemainingTime(data.remainingTime);
          }
        }
        if (data.timerState === "paused") {
          isTimePaused.value = true;
          emit("paused");
        }
        if (data.timerState === "running") {
          isTimePaused.value = false;
          emit("resumed");
        }
      } catch (error) {
        console.error("Error fetching timer state:", error);
      }
    });

    const startTimerWithRemainingTime = (remainingTime) => {
      clearTimer();
      const startTime = Date.now();
      timer.value = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timeLeft.value = Math.max(0, remainingTime - elapsed);
        if (timeLeft.value <= 0) {
          clearTimer();
          endRound();
          console.log(33333);
        }
      }, 1000);
    };

    onUnmounted(() => {
      if (timer.value) {
        clearInterval(timer.value);
      }
    });

    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return {
      progressBarStyle,
      startTimer,
      timeLeft,
      formatTime,
      current_turn,
      user,
      pauseTimer,
      resumeTimer,
      isTimePaused,
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
