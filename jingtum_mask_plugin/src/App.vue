<template>
  <div id="app" @click="closeDialog()">
    <router-view/>
  </div>
</template>
<script>
import { getConfigs } from "./js/config";
import bus from "./js/bus";
export default {
  name: "App",
  data() {
    return {
      password: ""
    }
  },
  created() {
    getConfigs(); // 初始化相关数据
    bus.$on("savePassword", this.updatePassword);
    bus.$on("obtainPassword", this.obtainPassword);
  },
  beforeDestroy() {
    bus.$off("savePassword", this.updatePassword);
    bus.$off("obtainPassword", this.obtainPassword);
  },
  methods: {
    // 保存密码
    updatePassword(passwrod) {
      this.passwrod = passwrod;
    },
    // 获取密码
    obtainPassword() {
      let password = this.passwrod;
      bus.$emit("setPassword", password);
    },
    closeDialog() {
      bus.$emit("closeDialog");
    }
  }
};
</script>
<style lang="scss">
@import "src/style/override-vant.scss";
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
