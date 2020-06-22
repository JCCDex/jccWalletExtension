<template>
  <div id="assetID">
    <div style="width:100%;position:absolute;top:0;left:0;">
      <commonHead :titleText="$t('message.home.checkAsset')"></commonHead>
    </div>
    <div v-if="!noData" class="body_class">
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
    <div v-else class="noDataClass">
      <img :src="noAsset" />
      <div>{{$t("message.history.noAsset")}}</div>
    </div>
  </div>
</template>
<script>
import commonHead from "../components/commonHead";
import defaultImg from "../images/defaultImg.png";
import defaultImg2 from "../images/defaultImg2.png";
import noAsset from "../images/noAsset.png";
import { isEmptyObject } from "../js/utils";
import { getUserBalances } from "@/js/user";
import Lockr from "lockr";
export default {
  data() {
    return {
      defaultImg,
      defaultImg2,
      noAsset,
      currentName: "SWTC",
      show: true,
      myTime: ""
    };
  },
  components: {
    commonHead
  },
  computed: {
    balance() {
      let balance = this.$store.getters.balance;
      return balance;
    },
    noData() {
      return isEmptyObject(this.balance);
    }
  },
  created() {
    let assetName = Lockr.get("assetName") || this.currentName;
    this.currentName = assetName;
    this.myTime = setInterval(() => {
      getUserBalances();
    }, 1000 * 10); // 十秒更新一次资产
  },
  beforeDestroy() {
    clearInterval(this.myTime);
  },
  methods: {
    checkAsset(assetName) {
      this.currentName = assetName;
      Lockr.set("assetName", this.currentName);
      this.$store.dispatch("updateAssetName", assetName);
      this.$router.push({ name: "myWallet" });
    }
  }
};
</script>
<style lang="scss" scoped>
#assetID::-webkit-scrollbar {
  display: none; /*隐藏滚动条*/
}
#assetID {
  box-sizing: border-box;
  padding-top: 60px;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
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
.noDataClass {
  text-align: center;
  color: #8a98b6;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  position: absolute;
  height: 88%;
  width: 96%;
  margin: 2%;
  background-color: #eff3fc;
  img {
    width: 160px;
    margin-top: 50%;
  }
}
</style>