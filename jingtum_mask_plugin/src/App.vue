<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import Lockr from "lockr";
import { JingchangWallet } from "jcc_wallet";
import { getUserBalances } from "./js/user";
export default {
  name: "App",
  created() {
    this.init();
  },
  components: {},
  methods: {
    init() {
      // 处理钱包
      let jcWallet = JingchangWallet.get();
      this.$store.dispatch("updateJCWallet", jcWallet);
      if (jcWallet && Array.isArray(jcWallet.wallets) && jcWallet.wallets.length > 0) {
        let address = "";
        let wallets = jcWallet.wallets;
        for (let wallet of wallets) {
          if (wallet.type === "swt" && wallet.default) {
            address = wallet.address;
            break;
          }
        }
        this.$store.dispatch("updateSwtAddress", address);
        setTimeout(() => {
          getUserBalances();
        }, 50);
      }
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
