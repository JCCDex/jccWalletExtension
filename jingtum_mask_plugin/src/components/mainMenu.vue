
<template>
  <div id="mainMenu">
    <div ref="warp" @scroll="scrolled" style="height:100%;width:100%;overflowY:scroll;">
      <!-- Title -->
      <div class="title">{{$t("message.menu.wallet")}}</div>
      <!-- swtc wallet List -->
      <div v-for="(item,index) in jwallets" :key="index" @click="selectWallet(index)" class="payWallets" :class="{'selectedWallet':item.name === selectedAccount,'unselectedWallet':item.name!== selectedAccount}">
        <div class="showAccount">
          <img v-show="item.name === selectedAccount" :src="selectedIcon" class="selectedIcon">
          <p>{{item.name}}</p>
          <p style="color:#D0D4DD;fontSize:14px">{{`${item.balance}:${item.currency}`}}</p>
        </div>
        <div class="operateWallet">
          <img :src="eyesIcon">
          <img :src="delIcon" style="marginLeft:15px;">
        </div>
      </div>
      <!-- Menu List -->
      <ul class="menuList">
        <li v-for="(item1,idx) in menuList" :key="idx" @click="JumpTo()">
          <span>{{item1.name}}</span>
          <img :src="rightArrowIcon" style="width:10px;height:16px;">
        </li>
      </ul>
    </div>
    <img v-show="isScroll" :src="rightArrowIcon" class="tipHidden">
  </div>
</template>

<script>
import selectedIcon from "@/images/selectedIcon.png";
import eyesIcon from "@/images/eyes.png";
import delIcon from "@/images/delIcon.png";
import rightArrowIcon from "@/images/rightArrow.png";
export default {
  name: "mainMenu",
  data() {
    return {
      selectedIcon,
      eyesIcon,
      delIcon,
      rightArrowIcon,
      isScroll: false,
      selectedAccount: "Account1",
      jwallets: {
        swtc1: {
          name: "Account1",
          currency: "SWTC",
          balance: "123123.1231"
        },
        swtc2: {
          name: "Account2",
          currency: "SWTC",
          balance: "123123.1231"
        },
        swtc3: {
          name: "Account3",
          currency: "SWTC",
          balance: "123123.1231"
        }
      },
      menuList: [
        { name: this.$t("message.menu.createdWallet"), link: "" },
        { name: this.$t("message.menu.importWallet"), link: "" },
        { name: this.$t("message.menu.clearWallet"), link: "" },
        { name: this.$t("message.menu.setting"), link: "" },
        { name: this.$t("message.menu.quit"), link: "" }
      ]
    };
  },
  mounted() {
    this.checkScroll();
  },
  computed: {},
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
    JumpTo(url) {
      this.$router.push(url);
    },
    selectWallet(idx) {
      this.selectedAccount = this.jwallets[idx].name;
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