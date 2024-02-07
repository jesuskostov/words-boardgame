<template>
    <div>
        <h1 class="text-white text-3xl text-center mt-6">Scoreboard</h1>
        <div class="mt-10">
            <div v-for="(score, i) in scores" :key="i" class="text-white flex justify-between p-5 items-center gap-x-6 " :class="i % 2 ? 'bg-custom-gray' : 'bg-custom-gray/70'">
                <div>
                    <p class="text-5xl">{{ i + 1 }}</p>
                </div>
                <div class="flex items-center gap-x-4">
                    <p class="text-white text-2xl font-bold">{{ score.score }}т.</p>
                    <div class="flex">
                        <img class="border border-white w-12 h-12 rounded-full" :src="`https://words-api.g-home.site/${score.player_1.photo}`" alt="">
                        <img class="border border-white relative -ml-6 w-12 h-12 rounded-full" :src="`https://words-api.g-home.site/${score.player_2.photo}`" alt="">
                    </div>
                    <div>
                        <p>{{score.player_1.name}}</p>
                        <p>{{score.player_2.name}}</p>
                    </div>
                </div>
            </div>
        </div>
        <button @click="nextRound" class="bg-white w-full h-[70px] rounded-2xl mt-8">Към следващ рунд</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import router from "../router";

const scores = ref([]);

onMounted(() => {
    axios.get("https://words-api.g-home.site/api/get-scoreboard").then((res) => {
        scores.value = res.data;
    });
});

const nextRound = () => {
    // push to playground
    router.push("/playground");
}

</script>