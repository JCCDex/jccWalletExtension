<template>
    <div id="loading">
      <div class="mask"></div>
      <div class="content">
        <ul class="loadingIcon">
          <li class="load"></li>
        </ul>
        <!-- <p class="loadingText">{{title}}</p> -->
      </div>
    </div>
</template>
<script>
export default {
  name: "loading",
  props: {
    // title: { type: String, default: "抢购中，请勿刷新或关闭页面" }, // 传入标题文字
    // textColor: { type: String, default: "#00ccea" }, // 传入标题字体颜色
    // bgColor: { type: String, default: "#00ccea" } // 传入标题框背景颜色
  }
};
</script>
<style lang="scss" scoped>
// @import "src/styles/base.scss";
// @import "src/styles/variables.scss";
#loading {
  position: fixed;
  z-index: 5000;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  color: #00ccea;
  //   @include font-dpr($base-mini-font-size);
  font-size: 24px;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: black;
    opacity: 0.8;
  }
  .content {
    width: 100%;
    position: absolute;
    top: 50%;
    margin-top: -150px;
    .loadingIcon {
      box-sizing: border-box;
      margin: 0 auto;
      height: 32px;
      .load:before,
      .load:after,
      .load {
        margin: 0 auto;
        padding: 0;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        animation-fill-mode: both;
        animation: load 1.8s infinite ease-in-out;
      }
      .load {
        position: relative;
        top: 50px;
        animation-delay: -0.15s;
      }
      .load:before,
      .load:after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
      }
      .load:before {
        left: 150%;
      }
      .load:after {
        right: 150%;
        animation-delay: -0.3s;
      }
    }
    // .loadingText {
    //   text-align: center;
    //   font-size: 0.26rem;
    // }
  }
}
@keyframes load {
  0%,
  80%,
  100% {
    box-shadow: 0 35px 0 -20px;
  }
  40% {
    box-shadow: 0 35px 0 1px;
  }
}
</style>

