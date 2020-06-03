<template>
    <div class="head_class">
      <div v-if="showLeft" class="left">11</div>
      <div class="center" :style="getStyle()">{{titleText}}</div>
      <div class="right">
          <img :src="closeImg" @click="goBack" style="width:16px;" />
      </div>
    </div>
</template>
<script>
import closeImg from "../images/closeImg.png";
export default {
  data() {
    return {
      closeImg
    };
  },
  props: {
    showLeft: { type: Boolean, default: false }, //是否显示返回箭头
    titleText: { type: String, require: true } //标题文字
  },
  methods: {
    getStyle() {
      let str = "text-align:";
      if (this.showLeft) {
        str = str + "center;width:70%;";
      } else {
        str = str + "left;padding-left:20px;width:80%;";
      }
      return str;
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.head_class {
  display: flex;
  background-color: #eaf0fd;
  height: 60px;
  line-height: 60px;
  .left {
    width: 15%;
  }
  .center {
    color: #343436;
    font-size: 16px;
    font-weight: 400;
  }
  .right {
    width: 15%;
    text-align: right;
    padding-right: 15px;
  }
}
</style>