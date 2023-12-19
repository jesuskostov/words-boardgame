<template>
  <div>
    <div class="my-10">
      <h1 class="text-[1.5rem] font-bold text-center mb-4">Фън да има</h1>
      <p class="text-center">
        Снимам автоматично и ще използвам снимката ти в играта.
      </p>
    </div>
    <div
      class="relative w-10/12 h-[350px] rounded-2xl bg-black-custom mx-auto overflow-hidden p-2"
    >
      <span
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-7xl font-bold text-white"
        >{{ countDown }}</span
      >
      <!-- Camera Stream -->
      <video
        ref="video"
        id="video"
        class="w-full h-full object-cover rounded-2xl pointer-events-none"
        autoplay
        :controls="false"
      ></video>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import store from "../store/index";
import axios from "axios";
import router from "../router/index";

const video = ref(null);
const selfie = ref(null);
const stream = ref(null);
const countDown = ref(5);

onMounted(async () => {
  store.dispatch("getCurrentUser");
});

const setupCamera = async () => {
  try {
    const constraints = {
      video: {
        facingMode: "user",
        aspectRatio: 1.7777778,
        width: { min: 640, ideal: 1280, max: 1920 },
      },
    };
    // ask for permission to access the camera
    stream.value = await navigator.mediaDevices.getUserMedia(constraints);
    if (video.value !== null) {
      video.value.srcObject = stream.value;
    }
  } catch (error) {
    console.error("Error accessing the camera:", error);
  }
};

const capturePhoto = async () => {
  const canvas = document.createElement("canvas");
  const videoFrame = video.value;
  canvas.width = videoFrame.videoWidth;
  canvas.height = videoFrame.videoHeight;
  canvas
    .getContext("2d")
    .drawImage(videoFrame, 0, 0, canvas.width, canvas.height);
  selfie.value = canvas.toDataURL("image/png");
};

const user = computed(() => store.state.user);

watch(user, async (newUser) => {
  if (newUser.photo_path === null) {
    await setupCamera();
    if (stream.value) {
      const a = setInterval(() => {
        countDown.value--;
      }, 1000);
      setTimeout(() => {
        clearInterval(a);
      }, 5000);
      setTimeout(async () => {
        await capturePhoto();
        savePhoto();
      }, 5000);
    }
  } else {
    router.push("/waiting-players");
  }
});

const savePhoto = async () => {
  const response = await fetch(selfie.value);
  const blob = await response.blob();
  const formData = new FormData();
  formData.append("user_id", user.value.id);
  formData.append("photo", blob); // Name the file as "selfie.png"
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
    await stream.value.getTracks().forEach((track) => track.stop());
    router.push("/waiting-players");
  }
};
</script>
