<template>
  <div class="container">
    <div id="app" class="bg-gray-900 h-screen w-screen overflow-scroll">
      <section class="flex h-screen justify-center" v-if="loading">
        <img src="@/assets/loader.svg" width="32" alt="" />
      </section>
      <section v-else>
        <div class="max-w-lg mx-auto" v-if="step == 'login'">
          <div class="p-5 flex h-screen justify-center flex-col">
            <h1 class="text-3xl text-center block dark:text-white my-5">Welcome</h1>
            <p class="mb-4 text-center dark:text-slate-600">Enter your <a href="https://thesession.org">thesession.org</a> User ID (in the address bar)</p>
            <t-alert v-if="error" class="my-3" variant="danger" show>
              {{ error }}
            </t-alert>
            <t-input v-model="user.id" placeholder="eg. johndoe"></t-input>
            <t-button variant="primary" @click="importTunebook()" class="w-full mt-3"
              >Continue
              <unicon class="ml-2" name="arrow-right" fill="white"></unicon>
            </t-button>
            <t-button @click="step = 'tunebook'" variant="secondary" class="w-full mt-3">Skip</t-button>
          </div>
        </div>
        <div class="grid grid-rows auto-rows-min h-screen" v-if="step == 'tunebook'">
          <div class="h-16 bg-slate-800 grid grid-cols-12 px-4">
            <div class="col-span-3"></div>
            <div class="flex items-center justify-center col-span-6">
              <!-- Create a set -->
            </div>
            <div class="flex items-center justify-end col-span-3">
              <t-button @click="step = 'login'" class="bg-slate-600 relative p-2 px-3">
                <unicon name="sign-out-alt" class="mb-px" fill="white"></unicon>
              </t-button>
              <t-button @click="step = 'settings'" class="bg-slate-600 relative p-2 px-3 mx-2">
                <unicon name="music-note" class="mb-px" fill="white"></unicon>
                <span v-if="selectedTunes.length > 0" class="flex items-center justify-center rounded-full h-6 w-6 text-xs bg-orange-500 absolute -right-2 -top-2">{{ selectedTunes.length }}</span>
              </t-button>
            </div>
          </div>
          <div class="p-5 h-full overflow-auto">
            <h3>
              <unicon class="mr-3 dark:fill-slate-400" name="search-alt"></unicon>
              Search a tune
            </h3>
            <div class="flex items-center">
              <t-input v-model="search" placeholder="eg. Morrison's"></t-input>
              <unicon @click="search = null" v-show="search && search.length" class="ml-3 dark:fill-slate-400" name="times"></unicon>
            </div>
            <div v-if="searching || searchResults.length" class="mt-10">
              <section v-if="searching" class="flex h-full justify-center items-center">
                <img src="@/assets/loader.svg" width="24" alt="" />
              </section>

              <div v-else>
                <div v-for="tune in searchResults" :key="tune.id" @click="selectTune(tune.id)" class="flex justify-between items-center my-2 p-3 rounded cursor-pointer bg-slate-800">
                  <p>
                    {{ tune.name }} <span class="dark:text-slate-500" v-if="tune.alias">({{ tune.alias }})</span>
                  </p>
                  <p class="ml-3 dark:bg-slate-800 rounded dark:text-slate-400 text-xs uppercase font-semibold">
                    {{ tune.type | capitalize }}
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-8" v-else-if="tunebook.tunes.length > 0">
              <h3>
                <unicon class="mr-3 dark:fill-slate-400" name="diary"></unicon>
                Pick in my tunebook ({{ tunebook.total }})
              </h3>
              <div v-for="tune in tunebook.tunes" :key="tune.id" @click="selectTune(tune.id)" class="flex justify-between items-center my-2 p-3 rounded cursor-pointer bg-slate-800">
                <p>{{ tune.name }}</p>
                <p class="ml-3 dark:bg-slate-800 rounded dark:text-slate-400 text-xs uppercase font-semibold">
                  {{ tune.type | capitalize }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="step == 'settings'">
          <div class="p-5">
            <div class="text-right my-5">
              <unicon @click="step = 'tunebook'" class="dark:fill-white" name="multiply"></unicon>
            </div>
            <h3 class="mt-8">Tunes</h3>
            <p class="text-center my-5 dark:text-slate-700" v-if="selectedTunes.length == 0">You have no tune selected</p>
            <t-button @click="autoAddTune(0)" class="bg-slate-800 w-full py-1 text-slate-400 text-xs">Magic Add</t-button>
            <draggable
              v-model="selectedTunes"
              handle=".drag"
              @start="drag = true"
              @end="drag = false"
              v-bind="{
                animation: 200,
                group: 'description',
                disabled: false,
                ghostClass: 'border-slate-300',
              }"
            >
              <div v-for="(tune, index) in selectedTunes" :key="tune.uuid">
                <div class="border-slate-500 border-2 border-solid bg-slate-800 my-4 p-3 rounded">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="flex items-center">
                        <div class="drag bg-slate-500 h-8 w-8 flex items-center justify-center rounded-full mr-4">
                          <unicon class="fill-white" :width="16" :height="16" name="arrows-v"></unicon>
                        </div>
                        <div>
                          <p class="mb-1">{{ tune.name }}</p>
                          <p class="dark:bg-slate-800 rounded dark:text-slate-400 text-xs font-semibold">
                            <span class="uppercase">{{ tune.type | capitalize }}</span>
                            • {{ tune.settings[0].key.slice(0, 1) }} ({{ tune.settings[0].key.slice(1, tune.settings[0].key.length) | capitalize }})
                          </p>
                          <div class="flex items-center mt-3">
                            <!-- <p class="mr-3 text-sm dark:text-slate-500">Repeat</p> -->
                            <div class="buttongroup grid grid-cols-4 p-2 rounded-lg rounded bg-gray-950">
                              <t-button class="h-8 w-12 text-sm flex items-center justify-center" @click="tune.repeat = 1" :class="{ 'bg-blue-500': tune.repeat == 1 }">1x</t-button>
                              <t-button class="h-8 w-12 text-sm flex items-center justify-center" @click="tune.repeat = 2" :class="{ 'bg-blue-500': tune.repeat == 2 }">2x</t-button>
                              <t-button class="h-8 w-12 text-sm flex items-center justify-center" @click="tune.repeat = 3" :class="{ 'bg-blue-500': tune.repeat == 3 || tune.repeat == null }">3x</t-button>
                              <t-button class="h-8 w-12 text-sm flex items-center justify-center" @click="tune.repeat = 4" :class="{ 'bg-blue-500': tune.repeat == 4 }">4x</t-button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <div class="bg-red-500 h-8 w-8 flex items-center justify-center rounded-full">
                        <unicon :width="16" :height="16" @click="selectedTunes = selectedTunes.filter((e, i) => i != index)" class="dark:fill-white" name="trash"></unicon>
                      </div>
                    </div>
                  </div>
                </div>

                <t-button @click="autoAddTune(index + 1)" class="bg-slate-800 w-full py-1 text-slate-400 text-xs">Magic Add</t-button>
              </div>
            </draggable>

            <h3 class="mt-8">Settings</h3>
            <p class="mb-4 dark:text-slate-600">Tempo</p>
            <div class="bg-gray-950 rounded-lg grid grid-cols-4 p-2">
              <t-button @click="tempo = 'slow'" :class="{ 'bg-blue-500': tempo == 'slow' }" class="py-1">Slow</t-button>
              <t-button @click="tempo = 'medium'" :class="{ 'bg-blue-500': tempo == 'medium' }" class="py-1">Medium</t-button>
              <t-button @click="tempo = 'normal'" :class="{ 'bg-blue-500': tempo == 'normal' }" class="py-1">Normal</t-button>
              <t-button @click="tempo = 'fast'" :class="{ 'bg-blue-500': tempo == 'fast' }" class="py-1">Fast</t-button>
            </div>
            <section class="my-5 flex justify-between items-center">
              <p class="dark:text-slate-600">Bodhran</p>
              <t-toggle v-model="sounds.bodhran"></t-toggle>
            </section>
            <section class="my-5 flex justify-between items-center">
              <p class="dark:text-slate-600">Drone</p>
              <t-toggle v-model="sounds.drone"></t-toggle>
            </section>
            <section class="mt-5">
              <t-button v-if="!playing" @click="start()" variant="primary" class="w-full mt-9">Start</t-button>
              <t-button v-else @click="stop()" variant="primary" class="w-full mt-9">{{ stopButtonCaption }}</t-button>
            </section>
          </div>
        </div>
        <div v-if="confirmAdded" class="fixed w-full top-24 shadow shadow-lg px-5">
          <div class="p-2 bg-green-500 text-center w-full text-white rounded opacity-90">Added to your set</div>
        </div>
      </section>
    </div>
    <audio :key="key" v-for="key in ['c', 'csharp', 'd', 'dsharp', 'e', 'f', 'fsharp', 'g', 'gsharp', 'a', 'asharp', 'b']" :ref="'drone_' + key" class="hidden audio" :src="require('@/assets/audio/' + key + '.mp3')"></audio>
    <audio class="hidden audio" ref="bodhran_jig_80" :src="require('@/assets/audio/bodhran_jig_80_med.mp3')"></audio>
    <audio class="hidden audio" ref="bodhran_jig_100" :src="require('@/assets/audio/bodhran_jig_100_med.mp3')"></audio>
    <audio class="hidden audio" ref="bodhran_jig_120" :src="require('@/assets/audio/bodhran_jig_120_med.mp3')"></audio>
    <audio class="hidden audio" ref="bodhran_reel_100" :src="require('@/assets/audio/bodhran_reel_100_med.mp3')"></audio>
    <audio class="hidden audio" ref="bodhran_reel_80" :src="require('@/assets/audio/bodhran_reel_80_med.mp3')"></audio>
    <audio ref="precount" class="hidden" src="@/assets/audio/click.mp3"></audio>

    <t-modal :hideCloseButton="true" v-model="showMagicTuneModal" header="">
      <template v-slot:header></template>
      <div class="text-center p-8" v-if="magicTune">
        <div class="mb-6">
          <h1 class="text-2xl">{{ magicTune.name }}</h1>
          <p class="dark:text-slate-500">{{ magicTune.type | capitalize }}</p>
        </div>
        <t-button variant="primary" @click="selectTune(magicTune.id)" class="w-full my-2">Select this tune</t-button>
        <t-button variant="secondary" @click="autoAddTune()" class="w-full my-2 bg-slate-700">Pick another one</t-button>
      </div>
      <div class="text-center flex items-center justify-center p-5" v-else>
        <img src="@/assets/loader.svg" width="24" alt="" />
      </div>
      <!-- <template v-slot:footer>
        <div class="flex justify-between">
          <t-button type="button"> Cancel </t-button>
          <t-button type="button"> Ok </t-button>
        </div>
      </template> -->
    </t-modal>
  </div>
</template>

<script>
import { get } from "axios";
const dJSON = require("dirty-json");
import { initializeApp } from "firebase/app";
import { parse, findTune, TEMPO_NORMAL, TEMPO_FAST, TEMPO_MEDIUM, TEMPO_SLOW } from "@/parse-abc";
import { sleep } from "@/sleep";
import draggable from "vuedraggable";
import { v4 as uuid } from "uuid";

let cacheAutoAddTuneIndex;

window.TEMPO_NORMAL = TEMPO_NORMAL;
window.TEMPO_FAST = TEMPO_FAST;
window.TEMPO_MEDIUM = TEMPO_MEDIUM;
window.TEMPO_SLOW = TEMPO_SLOW;
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQLfQPX-pI6XEB-MvlMgHzZT64vdzDWbg",
  authDomain: "magitune-7bee0.firebaseapp.com",
  projectId: "magitune-7bee0",
  storageBucket: "magitune-7bee0.appspot.com",
  messagingSenderId: "681568862081",
  appId: "1:681568862081:web:b2340dcdf10447d7c2f280",
};

let timer, throttle;

// Initialize Firebase
/* eslint-disable */
const app = initializeApp(firebaseConfig);
/* eslint-enable */

export default {
  name: "App",
  data() {
    return {
      tunebook: [],
      step: "login",
      user: this.$store.state.user ?? null,
      search: null,
      searching: false,
      searchResults: [],
      name: null,
      error: null,
      loading: false,
      magicTune: null,
      showMagicTuneModal: false,
      stopButtonCaption: "Stop",
      playing: false,
      drag: false,
      confirmAdded: false,
      selectedTuneIds: [],
      tempo: this.$store.state.tempo,
      sounds: {
        bodhran: true,
        drone: true,
      },
      currentDronePlayerIndex: 1,
      selectedTunes: this.$store.state.selectedTunes ?? [],
      nonDraggableList: [],
      hideDraggableList: false,
    };
  },
  created() {
    let meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#1e293b";
    document.getElementsByTagName("head")[0].appendChild(meta);
    document.documentElement.classList.add("dark");
    if (this.$store.state.user.id) {
      this.importTunebook();
    }
  },
  watch: {
    tempo(newValue) {
      this.$store.commit("tempo", newValue);
    },
    selectedTunes: {
      deep: true,
      handler(newValue) {
        this.$store.commit("selectedTunes", newValue);
      },
    },
    search(newValue) {
      this.searching = newValue && newValue.length > 0;
      if (!newValue || newValue.length == 0) {
        this.searchResults = [];
      } else {
        clearTimeout(throttle);
        throttle = setTimeout(() => {
          get("https://thesession.org/tunes/search?q=" + encodeURI(newValue) + "&format=json").then((ret) => {
            this.searchResults = ret.data.tunes;
            this.searching = false;
          });
        }, 400);
      }
    },
  },
  components: {
    draggable,
  },
  methods: {
    async autoAddTune(index) {
      if (index == null) {
        index = cacheAutoAddTuneIndex;
      }
      cacheAutoAddTuneIndex = index;
      this.magicTune = null;
      this.showMagicTuneModal = true;
      this.magicTune = await findTune(index, this.selectedTunes, this.tunebook);
    },
    async stop() {
      this.playing = false;
      document.querySelectorAll(".audio").forEach(async (e) => {
        for (let i = 10; i >= 0; i--) {
          let offset = e.volume / 10;
          e.volume = e.volume - offset;
          if (i == 0) {
            e.pause();
            e.currentTime = 0;
            e.volume = 1;
          }
          await sleep(50);
        }
      });
      clearInterval(timer);
    },
    async start() {
      this.stopButtonCaption = "Get ready...";
      this.playing = true;
      let events = parse(this.selectedTunes, this.tempo);

      // Start precount
      let precount = 0;
      let time = 0;

      let tempo = window["TEMPO_" + this.tempo.toUpperCase()];

      let interval = (60 / tempo) * 1000;
      setTimeout(() => {
        timer = setInterval(async () => {
          document.querySelector("#app").classList.add("bg-gray-800");
          document.querySelector("#app").classList.remove("bg-gray-900");
          setTimeout(() => {
            document.querySelector("#app").classList.remove("bg-gray-800");
            document.querySelector("#app").classList.add("bg-gray-900");
          }, 50);
          if (precount < 8 || !this.sounds.bodhran) {
            this.$refs.precount.play();
          }
          if (precount < 8) {
            if (this.stopButtonCaption == "Get ready...") {
              this.stopButtonCaption = 8;
            } else {
              this.stopButtonCaption--;
            }
            precount++;
          } else {
            this.stopButtonCaption = "Stop";
            let currentTime = time / 1000;
            let event = events.slice(0, 1)[0];
            // console.log(currentTime, event.time);
            if (event) {
              if (currentTime >= event.time) {
                events = events.slice(1, events.length);
                if (event.action == "play") {
                  // this.$refs["drone_" + event.key.toLowerCase()][0].classList.remove("stop");
                  // this.$refs["bodhran_" + event.type + "_" + tempo].classList.remove("stop");
                  if (this.sounds.drone) {
                    this.$refs["drone_" + event.key.toLowerCase()][0].volume = 0.2;
                    this.$refs["drone_" + event.key.toLowerCase()][0].play();
                  }
                  if (this.sounds.bodhran) {
                    this.$refs["bodhran_" + event.type + "_" + tempo].play();
                    this.$refs["bodhran_" + event.type + "_" + tempo].loop = true;
                  } else {
                    this.$refs.precount.play();
                  }
                }
                if (event.action == "stop") {
                  this.stop();
                }
                event = null;
              }

              if (event && currentTime + (interval * 4) / 1000 >= event.time) {
                if (event.action == "play") {
                  document.querySelectorAll(".audio").forEach((e) => {
                    if (!e.paused) {
                      e.classList.add("stop");
                    }
                  });
                  document.querySelectorAll(".stop").forEach(async (e) => {
                    let offset = e.volume / 10;
                    for (let i = 10; i >= 0; i--) {
                      e.volume = e.volume - offset > 0 ? e.volume - offset : 0;
                      if (i == 0) {
                        e.pause();
                        e.currentTime = 0;
                        e.volume = 1;
                      }
                      await sleep(50);
                    }
                  });
                }
              }
            }
            time += interval;
          }
        }, interval);
      }, 1000);
    },
    selectTune(id) {
      this.showMagicTuneModal = false;
      this.loading = true;

      get("https://thesession.org/tunes/" + id + "?format=json")
        .then((ret) => {
          let tune = ret.data;
          tune.repeat = 3;
          tune.uuid = uuid();
          if (typeof tune !== "object") tune = dJSON.parse(ret.data);
          this.selectedTunes.push(tune);
          this.loading = false;
          this.confirmAdded = true;
          setTimeout(() => {
            this.confirmAdded = false;
          }, 2000);
        })
        .catch((e) => {
          console.log(e);
          if (e.response) {
            this.error = e.response;
          }
        });

      // selectedTuneIds.push(tune.id)
    },
    importTunebook() {
      this.loading = true;
      get("https://thesession.org/members/" + this.user.id + "?format=json")
        .then((ret) => {
          // this.$store.commit("user", this.userId);
          let data = ret.data;
          if (typeof data !== "object") data = dJSON.parse(ret.data);
          this.user.name = data.name;
          this.$store.commit("user", this.user);

          get("https://thesession.org/members/" + this.user.id + "/tunebook?format=json")
            .then((ret) => {
              let tunebook = ret.data;
              if (typeof tunebook !== "object") tunebook = dJSON.parse(ret.data);
              this.tunebook = tunebook;
              this.loading = false;
              this.step = "tunebook";
              // this.step = "settings";
            })
            .catch((e) => {
              console.log(e);
              if (e.response) {
                this.error = e.response;
              }
            });
        })
        .catch((e) => {
          this.loading = false;
          console.log(e);
          if (e.response && e.response.status == 404) {
            this.error = "Unable to find this user. Please make sure you are entering your User ID on thesession.org";
          }
        });
      // https://thesession.org/members/98392?format=json
    },
  },
};
</script>

<style>
.flip-list-move {
  transition: transform 0.5s;
}
</style>
