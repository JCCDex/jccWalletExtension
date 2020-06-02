<template>
  <div id="app">
    <router-view/>
    <!-- <div class="alert_div">
      <vueAlert></vueAlert>
    </div> -->
  </div>
</template>
<script>
import Lockr from "lockr";
import { JingchangWallet } from "jcc_wallet";
// import vueAlert from "./components/vueAlert"
export default {
  name: 'App',
  created() {
    this.init();
  },
  components: {
    // vueAlert
  },
  methods: {
    init() {
      let jcWallet = JingchangWallet.get();
      this.$store.dispatch("updateJCWallet", jcWallet);
    }
  }
}
</script>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 84px; */
}
.alert_div {
  position: fixed;
  width: 50%;
  height: 30%;
  top: 50%;
  left: 25%;
}
</style>
