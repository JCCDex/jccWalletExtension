<template>
  <div id="myWallet">
    <div class="title_class">
      <img :src="titleLeft" @click="goAssets" style="width:26px;height:26px; cursor: pointer;" />
      <div class="middle">
        <div class="name">{{$t("message.home.walletName")}}</div>
        <div class="address">{{getAddressStr(swtAddress)}}</div>
      </div>
      <img :src="titleRight" style="width:26px;height:18px;" @click="showMenu=!showMenu" />
    </div>
    <div class="mainMenus" :class="{'transitionShowMenu':showMenu}">
      <mainmenu></mainmenu>
    </div>
    <div class="image_div">
      <div>
        <img :src="jingChang" style="width:70px;" />
      </div>
    </div>
    <div class="assets_div">
         <span class="num_class" >{{currentAsset}}</span>
         <span class="type_class">{{currentCoin}}</span>
      </div>
  </div>
</template>
<script>
import titleLeft from "../images/titleLeft.png";
import titleRight from "../images/titleRight.png";
import jingChang from "../images/jingChang.png";
import mainmenu from "@/components/mainMenu";
import Lockr from "lockr";
export default {
  name: "myWallet",
  data() {
    return {
      titleLeft,
      titleRight,
      jingChang,
      showMenu: false
    };
  },
  components: {
    mainmenu
  },
  computed: {
    swtAddress() {
      let jcWallet = this.$store.getters.jcWallet;
      let wallets = jcWallet.wallets;
      let address = "";
      for (let wallet of wallets) {
        if (wallet.type === "swt") {
          address = wallet.address;
          break;
        }
      }
      return address;
    },
    currentCoin() {
      let coin = Lockr.get("assetName") || "SWTC";
      return coin;
    },
    balance() {
      return this.$store.getters.balance;
    },
    currentAsset() {
      let coin = this.currentCoin;
      let balance = this.balance;
      let asset = balance[`${coin}`];
      let total = 0;
      if (asset) {
        total = asset.total;
      }
      return total;
    }
  },
  methods: {
    getAddressStr(address) {
      let startStr = address.substring(0, 4);
      let endStr = address.substring(address.length - 6, address.length);
      return startStr + "******" + endStr;
    },
    goAssets() {
      this.$router.push({
        name: "assets"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#myWallet {
  box-sizing: border-box;
  padding-top: 80px;
  width: 100%;
  height: 100%;
  position: relative;
}
.title_class {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #eaf0fd;
  height: 80px;
  .middle {
    text-align: center;
    .name {
      height: 40px;
      line-height: 50px;
      color: #343436;
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
    }
    .address {
      height: 40px;
      line-height: 30px;
      color: #56575d;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
  }
}
.image_div {
  margin-top: 30px;
  text-align: center;
}
.assets_div {
  .num_class {
    color: #0e0e0e;
    font-size: 20px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    height: 28px;
    line-height: 28px;
  }
  .type_class {
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    border-radius: 2px;
    padding-left: 5px;
    padding-right: 5px;
    background-color: #366bf2;
  }
}
.mainMenus {
  box-sizing: border-box;
  position: absolute;
  top: -1000px;
  width: 100%;
  height: 100%;
  padding: 80px 20px 15px;
  transition: 500ms;
  opacity: 0.9;
}
.transitionShowMenu {
  top: 0px;
}
</style>