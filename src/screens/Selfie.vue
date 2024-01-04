<template>
  <div class="text-white">
    <div class="my-10">
      <h1 class="text-[1.5rem] font-bold text-center mb-4">Фън да има</h1>
      <p class="text-center">
        Снимам автоматично и ще използвам снимката ти в играта.
      </p>
    </div>
    <div
      class="relative w-10/12 mx-auto bg-custom-gray h-[300px] rounded-xl overflow-hidden"
    >
      <SimpleVueCamera
        ref="camera"
        @started="started"
        :resolution="{ width: 350, height: 350 }"
        :facing-mode="'user'"
      />
      <img
        class="absolute w-2/3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        src="../assets/camera.svg"
        alt=""
      />
      <div
        v-if="countDown > 0"
        class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-[100]"
      >
        <span class="text-7xl font-bold">{{ countDown }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import SimpleVueCamera from "simple-vue-camera";
import store from "../store/index";
import axios from "axios";
import router from "../router/index";

const camera = ref(null);
const countDown = ref(0);
let countdownInterval = null;

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (token) {
    await store.dispatch("getCurrentUser");
  }
});

const started = () => {
  startCountdown();
};

const startCountdown = () => {
  countDown.value = 3;
  setTimeout(() => {
    countdownInterval = setInterval(() => {
      countDown.value--;
      if (countDown.value <= 0) {
        clearInterval(countdownInterval);
        captureAndSavePhoto();
      }
    }, 1000);
  }, 1000);
};

const captureAndSavePhoto = async () => {
  try {
    const photo = await camera.value.snapshot();
    await savePhoto(photo);
  } catch (error) {
    console.error("Error capturing photo:", error);
  }
};

const savePhoto = async (photo) => {
  const formData = new FormData();
  formData.append("user_id", store.state.user.id);
  formData.append("photo", photo);
  try {
    const res = await axios.post(
      "https://words-api.g-home.site/api/save-photo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (res.status === 200) {
      router.push("/waiting-players");
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<style>
#camera-container {
  z-index: 50;
}
</style>
