
<template>
  <div id="mainMenu">
    <div>
    <div ref="warp" @scroll="scrolled" class="warp" style="height:100%;width:100%;overflow-y:scroll;">
      <!-- Title -->
      <div class="title">{{$t("message.menu.wallet")}}</div>
      <!-- swtc wallet List -->
      <div v-for="(wallet,index) in wallets" :key="index" @click="setDefaultWallet(wallet)" class="payWallets" :class="{'selectedWallet':wallet.default,'unselectedWallet':!wallet.default}">
        <div class="showAccount">
          <img v-show="wallet.default" :src="selectedIcon" class="selectedIcon">
          <span>{{wallet.memoName}}</span>
          <img :src="importWallet" style="width:14px;padding-left:10px;" v-if="showOther(wallet.address)" />
          <!-- <p style="color:#D0D4DD;fontSize:14px">{{`${getbalance(wallet.address)} ${assetName}`}}</p> -->
        </div>
        <div class="operateWallet">
          <img :src="eyesIcon" @click.stop="lookWallet('lookWallet',wallet.address)" >
          <img :src="delIcon" @click.stop="toDelWallet(wallet)" style="marginLeft:15px;">
        </div>
      </div>
      <!-- Menu List -->
      <ul class="menuList">
        <li v-for="(item1,idx) in menuList" :key="idx" @click="JumpTo(item1.url)">
          <span>{{item1.name}}</span>
          <img :src="rightArrowIcon" style="width:10px;height:16px;">
        </li>
      </ul>
    </div>
    <div v-if="showDialog" class="showDialog">
      <passDialog @deleteWallet="deleteWallet" :titleText="titleText" :deleteAllWallets="deleteAllWallets" @closeDialog="closeDialog"></passDialog>
    </div>
    <img v-show="isScroll" :src="rightArrowIcon" class="tipHidden">
   </div>
  </div>
</template>

<script>
import selectedIcon from "@/images/selectedIcon.png";
import eyesIcon from "@/images/eyes.png";
import importWallet from "@/images/importWallet.png";
import delIcon from "@/images/delIcon.png";
import rightArrowIcon from "@/images/rightArrow.png";
import Lockr from "lockr";
import { JingchangWallet } from "jcc_wallet";
import { delPathByAddress } from "../js/utils";
import passDialog from "./passDialog";
import { Toast } from "vant";
export default {
  name: "mainMenu",
  data() {
    return {
      selectedIcon,
      eyesIcon,
      delIcon,
      rightArrowIcon,
      importWallet,
      isScroll: false,
      showDialog: false,
      titleText: "",
      deleteAddress: "",
      deleteAllWallets: false,
      menuList: [
        { name: this.$t("message.menu.createdWallet"), url: "createdWallet" },
        { name: this.$t("message.menu.importWallet"), url: "importBySecret" },
        { name: this.$t("message.menu.clearWallet"), url: "clearAllWallet" },
        { name: this.$t("message.menu.setting"), url: "setting" },
        { name: this.$t("message.menu.quit"), url: "home" }
      ]
    };
  },
  components: { passDialog },
  mounted() {
    this.checkScroll();
  },
  computed: {
    wallets() {
      let jcWallet = this.jcWallet;
      let wallets = jcWallet.wallets || [];
      let list = [];
      if (Array.isArray(wallets) && wallets.length > 0) {
        for (let i = 0; i < wallets.length; i++) {
          if (wallets[i].type === "swt") {
            if (!wallets[i].memoName) {
              wallets[i].memoName = `Account${i + 1}`;
            }
            list.push(wallets[i]);
          }
        }
        jcWallet.wallets = list;
        JingchangWallet.save(jcWallet);
        this.$store.dispatch("updateJCWallet", jcWallet);
      }
      return list;
    },
    jcWallet() {
      return this.$store.getters.jcWallet;
    },
    assetName() {
      let coin = this.$store.getters.assetName;
      return coin;
    }
  },
  methods: {
    setShowMenu() {
      this.$emit("setShowMenu");
    },
    showOther(address) {
      let mnemonicData = Lockr.get("mnemonicData") || {};
      let dataList = mnemonicData.pathList || [];
      let flag = true;
      for (let key of Object.keys(dataList)) {
        if (key === address) {
          flag = false;
          break;
        }
      }
      return flag;
    },
    checkScroll() {
      this.isScroll =
        this.$refs.warp.scrollHeight - this.$refs.warp.offsetHeight > 40;
    },
    scrolled() {
      let scroll = this.$refs.warp.scrollTop;
      this.isScroll =
        this.$refs.warp.scrollHeight - this.$refs.warp.offsetHeight - scroll >
        40;
    },
    getbalance() {
      return 1123123.123123;
    },
    toDelWallet(wallet) {
      this.deleteAllWallets = false;
      this.deleteAddress = wallet.address;
      this.titleText = this.$t("message.home.deleteWalletText") + wallet.memoName;
      this.showDialog = true;
    },
    closeDialog() {
      this.deleteAllWallets = false;
      this.showDialog = false;
      this.deleteAddress = "";
      this.titleText = "";
    },
    deleteWallet() {
      let jcWallet = this.jcWallet;
      let wallets = jcWallet.wallets;
      let address = this.deleteAddress;
      let wallet = "";
      if (this.deleteAllWallets) {
        jcWallet = "";
        delPathByAddress();
        Lockr.set("mnemonicData", {}); // 清除助记词信息
      } else {
        wallet = wallets.find(w => w.address === address);
        const index = wallets.findIndex(w => w.address === address);
        const isDefault = wallet.default;
        wallets.splice(index, 1);
        if (wallets.length <= 0) {
          jcWallet = "";
        } else if (isDefault && wallets.length > 0) {
          wallets[0].default = true;
          this.$store.dispatch("updateDefAddress", wallets[0].address);
        }
        delPathByAddress(address); // 删除对应的派生路径
      }
      if (!jcWallet) {
        JingchangWallet.save(jcWallet);
        this.$store.dispatch("updateJCWallet", jcWallet);
        Lockr.set("mnemonicData", {}); // 清除助记词信息
        this.$router.push({ name: "home" });
      } else {
        JingchangWallet.save(jcWallet);
        this.$store.dispatch("updateJCWallet", jcWallet);
        this.closeDialog();
      }
    },
    setDefaultWallet(wallet) {
      if (wallet.default) {
        return;
      }
      let jcWallet = this.jcWallet;
      let inst = new JingchangWallet(jcWallet);
      inst.setDefaultWallet(wallet.address).then(jcWallet => {
        JingchangWallet.save(jcWallet);
        this.$store.dispatch("updateDefAddress", wallet.address); // 更新默认钱包
        this.$store.dispatch("updateJCWallet", jcWallet); // 更新钱包信息
        Lockr.set("assetName", "SWTC"); // 存储默认币种
        this.$store.dispatch("updateAssetName", "SWTC"); // 更新默认币种
        this.setShowMenu(); // 返回主页面
      });
    },
    lookWallet(name, address) {
      this.$router.push({
        name,
        query: {
          address
        }
      });
    },
    JumpTo(url) {
      if (url === "clearAllWallet") {
        this.deleteAllWallets = url;
        this.titleText = this.$t("message.home.deleteAllText");
        this.showDialog = true;
      } else {
        this.$router.push({ name: url });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#mainMenu {
  position: relative;
  background: #151618;
  color: #ffffff;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  text-align: left;
  font-size: 16px;
  overflow-y: scroll;
}
#mainMenu::-webkit-scrollbar {
  display: none; /*隐藏滚动条*/
}
.warp::-webkit-scrollbar {
  display: none; /*隐藏滚动条*/
}
.title {
  padding: 15px 20px;
  border-bottom: 1px solid #60636a;
}
.payWallets {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
  cursor: pointer;
}
.selectedWallet {
  background: #6e6e75;
}
.unselectedWallet {
  &:hover {
    background: #6e6e7570;
  }
}
.showAccount {
  position: relative;
  width: 60%;
  padding: 0 10px 0 36px;
  p {
    margin: 0;
    padding: 2px;
  }
  .selectedIcon {
    width: 18px;
    height: 12px;
    position: absolute;
    top: 23px;
    left: 0;
    border: 1px dashed #888888;
  }
}

.operateWallet {
  box-sizing: border-box;
  width: 40%;
  padding-left: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  img {
    width: 18px;
    height: 18px;
    cursor: pointer;
    transition: 200ms;
    &:hover {
      transform: scale(1.1);
    }
  }
}

.menuList {
  box-sizing: border-box;
  width: 100%;
  list-style: none;
  border-top: 1px solid #60636a;
  padding: 0;
  margin: 0;
  li {
    display: flex;
    padding: 20px;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    &:hover {
      background: #6e6e7570;
    }
  }
}

.tipHidden {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: rotate(90deg);
  opacity: 0.8;
  animation: 800ms hiddenTip linear forwards alternate infinite;
}
@keyframes hiddenTip {
  from {
    opacity: 0.8;
  }
  to {
    opacity: 0.3;
  }
}
</style>