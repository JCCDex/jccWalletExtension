
<template>
  <div id="menu">
    <div class="body_class">
      <div class="walletText">{{$t("message.home.walletText")}}</div>
      <!-- 钱包列表 -->
      <div class="walletList" >
        <div v-for="wallet in wallets" class="content" @click="setDefaultWallet(wallet.address)" :style="getWalletStyle(wallet)" :key="wallet.memoName">
          <div class="select">
            <img v-if="wallet.default" :src="selectedWallet" style="width:20px;" />
          </div>
          <div class="wallet">
            <div class="name">{{wallet.memoName || "SWTC"}}</div>
            <div class="asset">{{getAsset()}}</div>
          </div>
          <div class="lookWallet">
             <img :src="lookWalletImg" @click.stop="goTo('lookWallet',wallet.address)" style="width:18px;cursor: pointer;" />
          </div>
          <div class="lookWallet">
             <img :src="deleteWalletImg" @click.stop="showPassDialog(wallet)" style="width:18px;cursor: pointer;" />
          </div>
        </div>
      </div>
      <!-- 菜单列表 -->
      <div class="menuList">
        <div v-for="(menu ,index) in menuList" :key="index" @click="goTo(menu.url)" class="menuClass">
           <div>{{menu.name}}</div>
           <div>
             <img :src="arrowRight" style="height:16px;" />
           </div>
        </div>
      </div>
    </div>
    <div v-if="showDialog" class="showDialog">
      <passDialog @deleteWallet="deleteWallet" :titleText="titleText" @closeDialog="closeDialog"></passDialog>
    </div>
  </div>
</template>

<script>
import selectedWallet from "../images/selectedWallet.png";
import lookWalletImg from "../images/lookWalletImg.png";
import deleteWalletImg from "../images/deleteWalletImg.png";
import arrowRight from "../images/arrowRight.png";
import Lockr from "lockr";
import { JingchangWallet } from "jcc_wallet";
import passDialog from "./passDialog";
import { Toast } from "vant";
export default {
  data() {
    return {
      selectedWallet,
      lookWalletImg,
      deleteWalletImg,
      arrowRight,
      menuList: [],
      showDialog: false,
      titleText: "",
      deleteAddress: "",
      removeAll: false
    }
  },
  created() {
    this.init();
  },
  components: {
    passDialog
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
    jcWallet() {
      return this.$store.getters.jcWallet;
    },
    balance() {
      return this.$store.getters.balance;
    },
    assetName() {
      let coin = Lockr.get("assetName") || "SWTC";
      return coin;
    }
  },
  methods: {
    init() {
      this.menuList = [
        {
          name: this.$t("message.home.createdText"),
          url: "createdWallet"
        },
        {
          name: this.$t("message.home.importText"),
          url: "importBySecret"
        },
        {
          name: this.$t("message.home.removeAll"),
          url: "removeAll"
        },
        {
          name: this.$t("message.home.setUp"),
          url: ""
        },
        {
          name: this.$t("message.home.exit"),
          url: ""
        }
      ]
    },
    showPassDialog(wallet) {
      let memoName = wallet.memoName;
      this.deleteAddress = wallet.address;
      let text = this.$t("message.home.deleteWalletText") + memoName;
      this.titleText = text;
      this.showDialog = true;
    },
    closeDialog() {
      this.showDialog = false;
    },
    deleteWallet() {
      let jcWallet = this.jcWallet;
      let inst = new JingchangWallet(jcWallet);
      if (this.removeAll) {
        // 删除所有钱包
        jcWallet = {};
        JingchangWallet.save(jcWallet);
        this.$store.dispatch("updateJCWallet", jcWallet);
        Toast.success(this.$t("message.home.deleteSuccess"))
        setTimeout(() => {
          this.$router.push({
            name: "home"
          })
        }, 0)
      } else {
        // 删除指定钱包
        let address = this.deleteAddress;
        inst.removeWalletWithAddress(address).then((jcWallet) => {
          JingchangWallet.save(jcWallet);
          this.$store.dispatch("updateJCWallet", jcWallet);
          Toast.success(this.$t("message.home.deleteSuccess"))
          this.showDialog = false;
        })
      }
    },
    setDefaultWallet(address) {
      let jcWallet = this.jcWallet;
      let inst = new JingchangWallet(jcWallet);
      inst.setDefaultWallet(address).then((jcWallet) => {
        JingchangWallet.save(jcWallet);
        this.$store.dispatch("updateJCWallet", jcWallet);
        this.$store.dispatch("updateSwtAddress", address);
      })
    },
    goTo(name, address) {
      if (name === "removeAll") {
        this.showDialog = true;
        this.titleText = this.$t("message.home.deleteAllText");
        this.removeAll = true;
        return;
      }
      this.$router.push({
        name,
        query: {
          address
        }
      })
    },
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
      padding: 10px 20px 10px;
      border-bottom: 1px solid #60636a;
      border-top: 1px solid #60636a;
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
  .menuList {
    padding: 0 20px;
    .menuClass {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      color: #ffffff;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
  }
}
</style>