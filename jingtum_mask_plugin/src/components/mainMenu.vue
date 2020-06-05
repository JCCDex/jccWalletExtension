
<template>
  <div id="mainMenu">
    <div ref="warp" @scroll="scrolled" style="height:100%;width:100%;overflowY:scroll;">
      <!-- Title -->
      <div class="title">{{$t("message.menu.wallet")}}</div>
      <!-- swtc wallet List -->
      <div v-for="(wallet,index) in wallets" :key="index" @click="selectWallet(index)" class="payWallets" :class="{'selectedWallet':wallet.default,'unselectedWallet':!wallet.default}">
        <div class="showAccount">
          <img v-show="wallet.default" :src="selectedIcon" class="selectedIcon">
          <p>{{wallet.memoName}}</p>
          <p style="color:#D0D4DD;fontSize:14px">{{`${getbalance(wallet.address)} ${assetName}`}}</p>
        </div>
        <div class="operateWallet">
          <img :src="eyesIcon" @click.stop="lookWallet('lookWallet',wallet.address)" >
          <img :src="delIcon" @click.stop="showPassDialog(wallet)" style="marginLeft:15px;">
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
      <passDialog @deleteWallet="deleteWallet" :titleText="titleText" @closeDialog="closeDialog"></passDialog>
    </div>
    <img v-show="isScroll" :src="rightArrowIcon" class="tipHidden">
  </div>
</template>

<script>
import selectedIcon from "@/images/selectedIcon.png";
import eyesIcon from "@/images/eyes.png";
import delIcon from "@/images/delIcon.png";
import rightArrowIcon from "@/images/rightArrow.png";
import Lockr from "lockr";
import { JingchangWallet } from "jcc_wallet";
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
      isScroll: false,
      showDialog: false,
      titleText: "",
      deleteAddress: "",
      menuList: [
        { name: this.$t("message.menu.createdWallet"), url: "createdWallet" },
        { name: this.$t("message.menu.importWallet"), url: "importBySecret" },
        { name: this.$t("message.menu.clearWallet"), url: "" },
        { name: this.$t("message.menu.setting"), url: "" },
        { name: this.$t("message.menu.quit"), url: "" }
      ],
      selectedAccount: "Account1"
    };
  },
  components: { passDialog },
  mounted() {
    this.checkScroll();
    console.log(this.wallets);
  },
  computed: {
    wallets() {
      let jcWallet = this.jcWallet;
      let wallets = jcWallet.wallets;
      let list = [];
      for (let i = 0; i < wallets.length; i++) {
        if (wallets[i].type === "swt") {
          if (!wallets[i].memoName) {
            wallets[i].memoName = `Account${i + 1}`;
          }
          if (wallets[i].default) {
            this.selectedAccount = wallets[i].memoName;
          }
          list.push(wallets[i]);
        }
      }
      jcWallet.wallets = list;
      JingchangWallet.save(jcWallet);
      this.$store.dispatch("updateJCWallet", jcWallet);
      return list;
    },
    jcWallet() {
      return this.$store.getters.jcWallet;
    },
    assetName() {
      let coin = Lockr.get("assetName") || "SWTC";
      return coin;
    }
  },
  methods: {
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
    showPassDialog(wallet) {
      this.deleteAddress = wallet.address;
      this.titleText = this.$t("message.home.deleteWalletText") + wallet.name;
      this.showDialog = true;
    },
    closeDialog() {
      this.showDialog = false;
      this.this.deleteAddress = "";
      this.titleText = "";
    },
    deleteWallet() {
      let jcWallet = this.jcWallet;
      let inst = new JingchangWallet(jcWallet);
      let address = this.deleteAddress;
      inst.removeWalletWithAddress(address).then(jcWallet => {
        JingchangWallet.save(jcWallet);
        this.$store.dispatch("updateJCWallet", jcWallet);
        Toast.success(this.$t("message.home.deleteSuccess"));
        this.closeDialog();
      });
    },
    setDefaultWallet(address) {
      let jcWallet = this.jcWallet;
      let inst = new JingchangWallet(jcWallet);
      inst.setDefaultWallet(address).then(jcWallet => {
        JingchangWallet.save(jcWallet);
        this.$store.dispatch("updateJCWallet", jcWallet);
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
      this.$router.push({ name: url });
    },
    selectWallet(idx) {}
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
}
.title {
  padding: 15px 20px;
  border-bottom: 1px solid #60636a;
}
.payWallets {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  padding: 10px 20px;
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
    top: 5px;
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