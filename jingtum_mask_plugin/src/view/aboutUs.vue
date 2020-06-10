<template>
  <div>
   <commonHead :showLeft="true" :titleText="$t('message.setting.aboutUs')" ></commonHead>
   <div class="bodyClass">
     <div class="image">
       <img :src="logo" style="width:70px" />
     </div>
     <div class="title">
        <span style="padding-right:20px;">{{"JingtumMask"}}</span>
        <span>{{$t("message.setting.version")}}</span>
     </div>
     <div class="versionClass">{{version}}</div>
     <div class="linkClass">{{$t("message.setting.linkText")}}</div>
     <div v-for="(data,index) in linkList" :key="index" class="itemsClass"><span @click.stop="goTo(data.url)">{{data.name}}</span></div>
   </div>
  </div>
</template>
<script>
import commonHead from "../components/commonHead";
import logo from "../assets/logo.png";
export default {
  data() {
    return {
      logo,
      version: "1.0.0",
      linkList: []
    }
  },
  components: {
    commonHead
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.linkList = [
        {
          name: this.$t("message.setting.policy"),
          url: ""
        },
        {
          name: this.$t("message.setting.terms"),
          url: ""
        },
        {
          name: this.$t("message.setting.contactUs"),
          url: ""
        }
      ]
    },
    goTo(url) {

    }
  }
}
</script>
<style lang="scss" scoped>
.bodyClass {
  padding: 20px;
  .image {
    padding-top: 10px;
    text-align: center;
  }
  .title {
    color: #090909;
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    text-align: center;
  }
  .versionClass {
    text-align: center;
    color: #7e7e82;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    padding-top: 10px;
  }
  .linkClass {
    color: #090909;
    text-align: left;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    padding-top: 10px;
    padding-bottom: 15px;
  }
  .itemsClass {
    text-align: left;
    padding-bottom: 10px;
    color: #366bf2;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    cursor: pointer;
  }
}
</style>