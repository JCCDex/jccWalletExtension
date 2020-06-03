
<template>
  <div id="menu">
    <div class="body_class">
      <div class="walletText">{{$t("message.home.walletText")}}</div>
      <div class="walletList" >
        <div v-for="wallet in wallets" class="content" :style="getWalletStyle(wallet)" :key="wallet.memoName">
          <div class="select">
            <img :src="selectedWallet" style="width:20px;" />
          </div>
          <div class="wallet">
            <div class="name">{{wallet.memoName}}</div>
            <div class="asset">{{getAsset()}}</div>
          </div>
          <div class="lookWallet">
             <img :src="lookWalletImg" @click="goTo('lookWallet')" style="width:18px;cursor: pointer;" />
          </div>
          <div class="lookWallet">
             <img :src="deleteWalletImg" style="width:18px;cursor: pointer;" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import selectedWallet from "../images/selectedWallet.png";
import lookWalletImg from "../images/lookWalletImg.png";
import deleteWalletImg from "../images/deleteWalletImg.png";
import Lockr from "lockr";
export default {
  data() {
    return {
      selectedWallet,
      lookWalletImg,
      deleteWalletImg
    }
  },
  computed: {
    wallets() {
      let jcWallet = this.$store.getters.jcWallet;
      let wallets = jcWallet.wallets;
      let list = [];
      for (let wallet of wallets) {
        if (wallet.type === "swt") {
          list.push(wallet);
        }
      }
      return list;
    },
    balance() {
      return this.$store.getters.balance;
    },
    assetName() {
      let coin = Lockr.get("assetName");
      return coin;
    }
  },
  methods: {
    getAsset() {
      let str = this.assetName;
      let total = this.balance[str];
      let count = 0;
      if (total) {
        count = total.total;
      }
      str = count + " " + str;
      return str;
    },
    getWalletStyle(wallet) {
      let str = ""
      if (wallet.default) {
        str = str + "background-color:#6E6E75";
      }
      return str;
    },
    goTo(name) {
      this.$router.push({
        name
      })
    }
  }
};
</script>
<style lang="scss" scoped>
#menu {
  background: #151618;
  color: #ffffff;
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
.body_class {
  .walletText {
    padding: 20px 20px 0;
    color: #ffffff;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    text-align: left;
    padding-bottom: 20px;
  }
  .walletList {
    .content {
      display: flex;
      padding: 20px 20px;
      .select {
        text-align: left;
        width: 10%;
      }
      .wallet {
        width: 70%;
        .name {
          text-align: left;
          //   padding-left: 10px;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
        }
        .asset {
          color: #d0d4dd;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          text-align: left;
        }
      }
      .lookWallet {
        width: 10%;
        margin-top: 10px;
      }
    }
  }
}
</style>