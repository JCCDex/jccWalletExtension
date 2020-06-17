<template>
  <div>
    <commonHead :titleText="$t('message.home.checkAsset')"></commonHead>
    <div class="body_class">
       <div v-for="assetName in Object.keys(balance)" :key="assetName" class="content" @click="checkAsset(assetName)">
         <div style="text-align:left;">
           <span class="coinTitle">{{assetName}}</span>
         </div>
         <div class="assetWrap">
           <div class="total">{{balance[assetName].total}}</div>
           <div class="freeze">
               <span>{{$t("message.home.assetFrozen")}}:</span>
               <span>{{balance[assetName].frozen}}</span>
           </div>
           <div class="selectIcon">
              <img v-if="currentName!==assetName" :src="defaultImg" style="width:18px;" />
              <img v-if="currentName===assetName" :src="defaultImg2" style="width:18px;" />
           </div>
         </div>
       </div>
    </div>
  </div>
</template>
<script>
import commonHead from "../components/commonHead";
import defaultImg from "../images/defaultImg.png";
import defaultImg2 from "../images/defaultImg2.png";
import Lockr from "lockr";
export default {
  data() {
    return {
      defaultImg,
      defaultImg2,
      currentName: "SWTC",
      show: true
    };
  },
  components: {
    commonHead
  },
  computed: {
    balance() {
      let balance = this.$store.getters.balance;
      return balance;
    }
  },
  created() {
    let assetName = Lockr.get("assetName") || this.currentName;
    this.currentName = assetName;
  },
  methods: {
    checkAsset(assetName) {
      this.currentName = assetName;
      Lockr.set("assetName", this.currentName);
    }
  }
};
</script>
<style lang="scss" scoped>
.body_class {
  padding: 0 20px 20px;
  .content {
    margin-top: 20px;
    padding-top: 10px;
    background-color: #eff3fc;
    border-radius: 6px;
    .coinTitle {
      width: 70px;
      height: 20px;
      line-height: 20px;
      padding: 0 10px;
      border-radius: 0 16px 16px 0;
      background-color: #366bf2;
      color: #fff;
    }
    .assetWrap {
      display: flex;
      padding: 10px 10px;
      color: #222325;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      .total {
        width: 55%;
        text-align: left;
      }
      .freeze {
        width: 35%;
        text-align: left;
      }
      .selectIcon {
        width: 10%;
        text-align: right;
      }
    }
  }
}
</style>