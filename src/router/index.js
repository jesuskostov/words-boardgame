import { createRouter, createWebHistory } from "vue-router";
import Home from "../screens/Home.vue";
import Overview from "../screens/Overview.vue";
import Playground from "../screens/Playground.vue";
import Login from "../screens/Login.vue";
import Selfie from "../screens/Selfie.vue";
import WaitingPlayers from "../screens/WaitingPlayers.vue";
import WordsCreation from "../screens/WordsCreation.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/selfie",
    name: "selfie",
    component: Selfie,
  },
  {
    path: "/playground",
    name: "playground",
    component: Playground,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/overview",
    name: "Overview",
    component: Overview,
  },
  {
    path: "/waiting-players",
    name: "WaitingPlayers",
    component: WaitingPlayers,
  },
  {
    path: "/words-creation",
    name: "WordsCreation",
    component: WordsCreation,
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

// console.log("from router", store.state.isGameActive);

// router.beforeEach(async (to, from, next) => {
//   console.log(store.state.isGameActive);
//   // if (to.path == "/" && store.state.isGameActive) {
//   //   //   // next({ name: "home" });
//   //   //   console.log("ima aktivna igra");
//   // } else {
//   //   //   console.log("nqma aktivna igra");
//   //   //   // next();
//   // }
// });

export default router;
