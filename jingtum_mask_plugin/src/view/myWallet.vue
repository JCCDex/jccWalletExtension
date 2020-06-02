<template>
  <div>
    <div class="title_class">
      <div class="left">
        <img :src="titleLeft" style="width:26px;" />
      </div>
      <div class="middle">
        <div class="name">{{$t("message.home.walletName")}}</div>
        <div class="address">{{getAddressStr(swtAddress)}}</div>
      </div>
      <div class="right">
        <img :src="titleRight" style="width:26px;" />
      </div>
    </div>
    <div class="image_div">
      <div>
        <img :src="jingChang" style="width:70px;" />
      </div>
    </div>
    <div class="assets_div">
         <span class="num_class" >123456.78</span>
         <span class="type_class">SWTC</span>
      </div>
  </div>
</template>
<script>
import titleLeft from "../images/titleLeft.png";
import titleRight from "../images/titleRight.png";
import jingChang from "../images/jingChang.png";
export default {
  data() {
    return {
      titleLeft,
      titleRight,
      jingChang
    }
  },
  computed: {
    swtAddress() {
      let jcWallet = this.$store.getters.jcWallet;
      let wallets = jcWallet.wallets;
      let address = ""
      for (let wallet of wallets) {
        if (wallet.type === "swt") {
          address = wallet.address;
          break;
        }
      }
      return address;
    }
  },
  methods: {
    getAddressStr(address) {
      let startStr = address.substring(0, 4);
      let endStr = address.substring(address.length - 6, address.length);
      return startStr + "******" + endStr;
    }
  }
}
</script>
<style lang="scss" scoped>
.title_class {
  display: flex;
  background-color: #eaf0fd;
  height: 80px;
  .left {
    margin-top: 27px;
    padding-left: 20px;
    text-align: left;
    width: 10%;
  }
  .middle {
    width: 80%;
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
  .right {
    margin-top: 27px;
    padding-right: 20px;
    text-align: right;
    width: 10%;
  }
}
.image_div {
  margin: 30px 0 10px;
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
    // display: inline;
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    background-color: #366bf2;
  }
}
</style>