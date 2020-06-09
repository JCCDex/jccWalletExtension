<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import { getConfigs } from "./js/config";
export default {
  name: "App",
  created() {
    getConfigs(); // 初始化相关数据
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
