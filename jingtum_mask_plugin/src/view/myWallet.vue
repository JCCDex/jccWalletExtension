<template>
  <div id="myWallet">
    <div class="title_class">
      <img :src="titleLeft" @click="goAssets" style="width:26px;height:26px; cursor: pointer;" />
      <div class="middle">
        <div class="name">{{$t("message.home.walletName")}}</div>
        <div class="address">{{getAddressStr(address)}}</div>
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
    <div class="button_div">
      <div class="left">
        <button class="button_left" @click="goTo('lookWallet')" >{{$t("message.home.buttonText")}}</button>
      </div>
      <div class="right">
        <button class="button_right" @click="goTo('transfer')" >{{$t("message.home.tranferText")}}</button>
      </div>
    </div>
    <div class="history">
      <div class="title">{{$t("message.history.title")}}</div>
      <div v-for="(data,index) in dataList" :key="index" class="content">
        <div class="bodyOne" @click="seeMore(index)">
          <div class="timeClass">
              <div>{{getTime(data.time,3)}}</div>
              <div>
                <img :src="arrowDown" v-if="currentIndex===index"  style="width:13px;" />
                <img :src="arrowUp" v-if="currentIndex!==index"  style="width:13px;" />
             </div>
          </div>
          <div class="typeOne">
            <div class="name">{{getDataName(data.type)}}</div>
            <div class="value">
              <span v-if="data.type==='OfferCancel' || data.type==='OfferCreate'">
                  <span :style="getStyle(data.type)">{{data.takerPays.value}}</span>
                  <span>{{getCoinName(data.takerPays.currency)}}</span>
                  <img :src="takerTo" style="width:14px;padding-bottom:3px;" />
                  <span :style="getStyle(data.type)">{{data.takerGets.value}}</span>
                  <span>{{getCoinName(data.takerGets.currency)}}</span>
              </span>
              <span v-if="data.type==='Receive' || data.type==='Send'">
                  <span v-if="data.type==='Send'" :style="getStyle(data.type)">{{"-"}}</span>
                  <span v-if="data.type==='Receive'" :style="getStyle(data.type)">{{"+"}}</span>
                  <span :style="getStyle(data.type)">{{data.amount.value}}</span>
                  <span>{{getCoinName(data.amount.currency)}}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import titleLeft from "../images/titleLeft.png";
import titleRight from "../images/titleRight.png";
import jingChang from "../images/jingChang.png";
import arrowUp from "../images/arrowUp.png";
import arrowDown from "../images/arrowDown.png";
import takerTo from "../images/takerTo.png";
import mainmenu from "@/components/mainMenu";
import Lockr from "lockr";
import { getUserBalances } from "../js/user";
import { JcExplorer } from "jcc_rpc";
import { getExplorerHost } from "../js/api";
import { getUUID, formatTime } from "../js/utils";
export default {
  name: "myWallet",
  data() {
    return {
      titleLeft,
      titleRight,
      jingChang,
      arrowDown,
      arrowUp,
      takerTo,
      showMenu: false,
      dataList: [],
      currentIndex: -1
    };
  },
  components: {
    mainmenu
  },
  created() {
    getUserBalances();
    this.getTransHistory(0);
  },
  computed: {
    address() {
      let address = this.$store.getters.defAddress;
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
    },
    coins() {
      return this.$store.getters.coins;
    }
  },
  methods: {
    seeMore(index) {
      if (this.currentIndex === index) {
        this.currentIndex = -1;
      } else {
        this.currentIndex = index;
      }
    },
    getCoinName(value) {
      if (value === "SWTC") {
        return value;
      }
      let name = value;
      let coins = this.coins;
      for (let coin of coins) {
        if (coin.value === value) {
          name = coin.name;
          break;
        }
      }
      return name;
    },
    getStyle(type) {
      let str = "color:";
      if (type === "OfferCreate") {
        str = str + "#07C5F2;";
      }
      if (type === "OfferCancel") {
        str = str + "#FF8213;";
      }
      if (type === "Send") {
        str = str + "#F24746;";
      }
      if (type === "Receive") {
        str = str + "#05C2C2;";
      }
      return str;
    },
    getTime(time, status) {
      time = (time + 946684800) * 1000;
      return formatTime(time, status);
    },
    getDataName(type) {
      let name = this.$t("message.history.nameFive");
      if (type === "OfferCreate") {
        name = this.$t("message.history.nameOne");
      }
      if (type === "OfferCancel") {
        name = this.$t("message.history.nameTwo");
      }
      if (type === "Send") {
        name = this.$t("message.history.nameThree");
      }
      if (type === "Receive") {
        name = this.$t("message.history.nameFour");
      }
      return name;
    },
    getAddressStr(address) {
      let startStr = address.substring(0, 4);
      let endStr = address.substring(address.length - 6, address.length);
      return startStr + "******" + endStr;
    },
    goAssets() {
      this.$router.push({
        name: "assets"
      });
    },
    goTo(type) {
      let name = `${type}`;
      this.$router.push({
        name: name
      })
    },
    async  getTransHistory(page = 0) {
      const inst = new JcExplorer(getExplorerHost());
      //   let wallet = this.address;
      let wallet = "jpid2UCZuTQbWPzGy67wzFet6p5hkFuXb6";
      let size = 20;
      let optionParams = {};
      let res = await inst.getHistory(getUUID(), wallet, page, size, optionParams);
      if (res.result) {
        console.log(res.data.list);
        this.dataList = res.data.list;
      }
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
  position: fixed;
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
.button_div {
  display: flex;
  margin-top: 30px;
  .left {
    width: 50%;
    padding-left: 20px;
    text-align: left;
    .button_left {
      height: 48px;
      line-height: 48px;
      color: #ffffff;
      background-color: #05c2c2;
      border-radius: 6px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      outline: none;
      border: none;
      border-inline: none;
      width: 80%;
    }
  }
  .right {
    width: 50%;
    padding-right: 20px;
    text-align: right;
    .button_right {
      height: 48px;
      line-height: 48px;
      color: #ffffff;
      background-color: #4484fe;
      border-radius: 6px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      outline: none;
      border: none;
      border-inline: none;
      width: 80%;
    }
  }
}
.history {
  padding-top: 20px;
  height: 500px;
  .title {
    padding-left: 20px;
    text-align: left;
  }
  .content {
    // padding: 0 20px;
    border-bottom: 1px solid #dae0ed;
    .bodyOne {
      padding: 0 20px;
      background-color: #f6f7f9;
      .timeClass {
        display: flex;
        justify-content: space-between;
        padding-top: 5px;
        color: #3e4045;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
      .typeOne {
        display: flex;
        color: #3e4045;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        text-align: left;
        .name {
          width: 20%;
        }
        .value {
          width: 80%;
          height: 30px;
          line-height: 30px;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>