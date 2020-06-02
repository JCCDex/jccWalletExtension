<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import Lockr from "lockr";
import { JingchangWallet } from "jcc_wallet";
export default {
  name: "App",
  created() {
    this.init();
  },
  components: {},
  methods: {
    init() {
      let jcWallet = JingchangWallet.get();
      this.$store.dispatch("updateJCWallet", jcWallet);
    }
  }
};
</script>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
