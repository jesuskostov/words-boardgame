import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
  state: {
    game_id: null,
    steps: [
      { name: "teams", title: "Колко отбора сте?" },
      { name: "words", title: "Думи от 1 играч?" },
      { name: "time", title: "Време за рунд?" },
    ],
    currentStep: 0,
    teams: 2,
    words: 3,
    time: 60,
    isStepFinished: false,
    randomPickOfPlayers: false,
    categories: "",
    isGameActive: false,
    current_turn: null,
    user: null,
    usersPerTeam: [],
    loggedPlayers: 0,
    players: [],
    allInsertedWords: [],
    expectedWordsToInsert: 3,
    errors: "",
    current_turn: null,
    teammates: null,
    current_word: null,
    words_test: 0,
    // score: 0,
  },
  mutations: {
    SET_CONFIG(state, { step, value }) {
      state[step.name] = value;
      if (state.currentStep === 2) {
        state.isStepFinished = true;
        return;
      }
      state.currentStep++;
    },
    SET_CURRENT_STEP(state, step) {
      state.currentStep = step;
      if (step !== 2) {
        state.isStepFinished = false;
      } else {
        state.isStepFinished = true;
      }
    },
    SET_PLAYER_PICK: (state, value) => {
      state.randomPickOfPlayers = value;
    },
    SET_CATEGORIES: (state, value) => {
      state.categories = value;
    },
    SET_GAME_STATUS: (state, value) => {
      state.isGameActive = value;
    },
    SET_GAME: (state, payload) => {
      state.teams = payload.teams;
      state.words = payload.words;
      state.time = payload.time;
      state.randomPickOfPlayers = payload.randomPickOfPlayers;
      state.categories = payload.categories;
      state.isGameActive = payload.isGameActive;
      state.current_turn = payload.current_turn;
    },
    SET_USER: (state, payload) => {
      state.user = payload.user;
    },
    SET_GAME_ID: (state, payload) => {
      state.game_id = Number(payload.game_id);
    },
    SET_LOGGED_PLAYERS: (state, payload) => {
      state.loggedPlayers = payload.length;
      state.players = payload;
    },
    SET_WORDS: (state, payload) => {
      state.allInsertedWords = payload;
    },
    SET_EXPECTED_WORDS: (state, payload) => {
      state.expectedWordsToInsert = payload;
    },
    SET_ERRORS: (state, payload) => {
      state.errors = payload;
      setTimeout(() => {
        state.errors = "";
      }, 3000);
    },
    SET_CURRENT_TURN: (state, payload) => {
      state.current_turn = payload[0];
      state.teammates = payload[1];
    },
    SET_CURRENT_WORD: (state, payload) => {
      state.current_word = payload;
    },
    SET_EXPECTED_WORDS_TEST: (state, payload) => {
      state.words_test = payload;
    },
    // SET_SCORE: (state, payload) => {
    //   state.score = payload;
    // },
  },
  actions: {
    async createGame({ commit, state }, name) {
      const payload = {
        is_active: true,
        number_of_teams: state.teams,
        number_of_words: state.words,
        round_time: state.time,
        current_turn: null,
        random_pick_of_players: state.randomPickOfPlayers,
        categories: state.categories,
        name,
      };
      try {
        const response = await axios.post(
          "https://words-api.g-home.site/api/create-game",
          payload
        );
        const token = response.data.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        localStorage.setItem("token", token);
        localStorage.setItem("game_id", response.data.game_id);
        commit("SET_GAME_ID", { game_id: response.data.game_id });
        commit("SET_USER", { user: response.data.user });
      } catch (error) {
        console.log(error);
      }
    },
    async registerUser({ commit }, name) {
      const res = await axios.post(
        "https://words-api.g-home.site/api/create-user",
        {
          name,
        }
      );
      if (res.data.message === "game full") {
        commit("SET_ERRORS", "Играта е пълна");
      }
      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;
      commit("SET_USER", { user: res.data.user });
    },
    async loginUser({ commit }, name) {
      const res = await axios.post("https://words-api.g-home.site/api/login", {
        name,
      });
      // save barrier token to local storage
      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;
      commit("SET_USER", { user: res.data.user });
    },
    async fetchTeams({ commit, state }) {
      // get token from local storage
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await axios.get(
        `https://words-api.g-home.site/api/get-teams-for-game/${state.game_id}`
      );
      return res.data;
    },
    async fetchUsersPerTeam({ commit, state }, teamId) {
      const res = await axios.get(
        `https://words-api.g-home.site/api/get-users-for-team/${teamId.teamId}`
      );
      return res.data;
    },
    async joinTeam({ commit, state }, team_id) {
      console.log(team_id);
      const res = await axios.post(
        `https://words-api.g-home.site/api/join-team`,
        {
          teamId: team_id,
        }
      );
      console.log(res);
    },
    async getLoggedPlayers({ commit }) {
      const res = await axios.get(
        `https://words-api.g-home.site/api/get-users`
      );
      const players = res.data.users;
      commit("SET_LOGGED_PLAYERS", players);
    },
    async getCurrentUser({ commit }) {
      const res = await axios.get(
        "https://words-api.g-home.site/api/get-current-user"
      );
      commit("SET_USER", res.data);
    },
    async getWords({ commit, state }) {
      const res = await axios.get(
        `https://words-api.g-home.site/api/get-words-for-game`
      );
      const words = res.data.words;
      commit("SET_WORDS", words);
    },
    async getExpectedWordsForAGame({ commit }) {
      const res = await axios.get(
        `https://words-api.g-home.site/api/get-expected-words-for-game`
      );
      const words = res.data.words_to_insert;
      commit("SET_EXPECTED_WORDS_TEST", words);
    },
    async getHowManyWordsLeftToInsert({ commit, state }) {
      const res = await axios.get(
        `https://words-api.g-home.site/api/check-user-words`
      );
      const words = res.data.words_to_insert;
      commit("SET_EXPECTED_WORDS", words);
    },
    async getCurrentTurn({ commit }) {
      const res = await axios.get(
        `https://words-api.g-home.site/api/get-current-turn`
      );
      const payload = res.data;
      commit("SET_CURRENT_TURN", payload);
    },
    async endRound({ commit }) {
      await axios.post(`https://words-api.g-home.site/api/end-round`);
    },
    async getWord({ commit }) {
      const res = await axios.get(`https://words-api.g-home.site/api/get-word`);
      commit("SET_CURRENT_WORD", res.data[0]);
    },
    async nextWord({ commit }, { word }) {
      console.log(word);
      await axios.post(`https://words-api.g-home.site/api/point`, {
        word,
      });
      this.dispatch("getWord");
    },
    // async getScore({ commit }) {
    //   const res = await axios.get(
    //     `https://words-api.g-home.site/api/get-score-for-team`
    //   );
    //   const payload = res.data.scores;
    //   commit("SET_SCORE", payload);
    // },
  },
});

export default store;
